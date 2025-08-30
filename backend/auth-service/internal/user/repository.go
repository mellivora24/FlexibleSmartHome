package user

import (
	"errors"
	"strings"

	"github.com/mellivora24/flexiblesmarthome/auth-service/internal/shared"
	"github.com/mellivora24/flexiblesmarthome/auth-service/internal/user/model"
	"gorm.io/gorm"
)

type Repository interface {
	FindAll() ([]model.User, error)
	FindByID(id int64) (*model.User, error)
	FindByEmail(email string) (*model.User, error)
	Create(user *model.User) (*model.User, error)
	Update(user *model.User) (*model.User, error)
	Delete(id int64) error
	CreateAction(action *model.Action) (*model.Action, error)
	FindActionsByUID(uid int64) ([]model.Action, error)
}

type repository struct {
	DB *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{DB: db}
}

func (r *repository) FindAll() ([]model.User, error) {
	var users []model.User
	if err := r.DB.Find(&users).Error; err != nil {
		return nil, shared.ErrInternalServer
	}
	if len(users) == 0 {
		return nil, shared.ErrNotFound
	}
	return users, nil
}

func (r *repository) FindByID(id int64) (*model.User, error) {
	if id <= 0 {
		return nil, shared.ErrInvalidInput
	}

	var user model.User
	if err := r.DB.First(&user, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, shared.ErrNotFound
		}
		return nil, shared.ErrInternalServer
	}
	return &user, nil
}

func (r *repository) FindByEmail(email string) (*model.User, error) {
	if email == "" || !strings.Contains(email, "@") {
		return nil, shared.ErrInvalidInput
	}

	var user model.User
	if err := r.DB.Where("email = ?", email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, shared.ErrNotFound
		}
		return nil, shared.ErrInternalServer
	}
	return &user, nil
}

func (r *repository) Create(user *model.User) (*model.User, error) {
	if user == nil {
		return nil, shared.ErrInvalidInput
	}
	if user.Email == "" || user.Name == "" {
		return nil, shared.ErrInvalidInput
	}

	var existingUser model.User
	if err := r.DB.Where("email = ?", user.Email).First(&existingUser).Error; err == nil {
		return nil, shared.ErrAlreadyExists
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, shared.ErrInternalServer
	}

	if err := r.DB.Create(user).Error; err != nil {
		return nil, shared.ErrInternalServer
	}
	return user, nil
}

func (r *repository) Update(user *model.User) (*model.User, error) {
	if user == nil || user.ID <= 0 {
		return nil, shared.ErrInvalidInput
	}

	// Check if user exists
	var existingUser model.User
	if err := r.DB.First(&existingUser, user.ID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, shared.ErrNotFound
		}
		return nil, shared.ErrInternalServer
	}

	if user.Email != "" && user.Email != existingUser.Email {
		var emailCheck model.User
		if err := r.DB.Where("email = ? AND id != ?", user.Email, user.ID).First(&emailCheck).Error; err == nil {
			return nil, shared.ErrAlreadyExists
		} else if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, shared.ErrInternalServer
		}
	}

	if err := r.DB.Save(user).Error; err != nil {
		return nil, shared.ErrInternalServer
	}
	return user, nil
}

func (r *repository) Delete(id int64) error {
	if id <= 0 {
		return shared.ErrInvalidInput
	}

	var user model.User
	if err := r.DB.First(&user, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return shared.ErrNotFound
		}
		return shared.ErrInternalServer
	}

	if err := r.DB.Delete(&user).Error; err != nil {
		return shared.ErrInternalServer
	}
	return nil
}

func (r *repository) CreateAction(action *model.Action) (*model.Action, error) {
	if action == nil || action.UID <= 0 || action.Type == "" {
		return nil, shared.ErrInvalidInput
	}

	var user model.User
	if err := r.DB.First(&user, action.UID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, shared.ErrNotFound
		}
		return nil, shared.ErrInternalServer
	}

	if err := r.DB.Create(action).Error; err != nil {
		return nil, shared.ErrInternalServer
	}
	return action, nil
}

func (r *repository) FindActionsByUID(uid int64) ([]model.Action, error) {
	if uid <= 0 {
		return nil, shared.ErrInvalidInput
	}

	var actions []model.Action
	if err := r.DB.Where("uid = ?", uid).Find(&actions).Error; err != nil {
		return nil, shared.ErrInternalServer
	}
	if len(actions) == 0 {
		return nil, shared.ErrNotFound
	}
	return actions, nil
}
