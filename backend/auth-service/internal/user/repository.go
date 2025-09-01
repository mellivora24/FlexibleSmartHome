package user

import (
	"errors"

	"github.com/mellivora24/flexiblesmarthome/auth-service/internal/shared"
	"github.com/mellivora24/flexiblesmarthome/auth-service/internal/user/model"
	"gorm.io/gorm"
)

type Repository interface {
	FindAll() ([]model.UserDB, error)
	FindByID(id int64) (*model.UserDB, error)
	FindByEmail(email string) (*model.UserDB, error)
	Create(user *model.UserDB) (*model.UserDB, error)
	Update(user *model.UserDB) (*model.UserDB, error)
	Delete(email string) error

	CreateAction(action *model.ActionDB) (*model.ActionDB, error)
	FindActionsByUID(uid int64) ([]model.ActionDB, error)
}

type repository struct {
	DB *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{DB: db}
}

func (r *repository) FindAll() ([]model.UserDB, error) {
	var users []model.UserDB
	if err := r.DB.Find(&users).Error; err != nil {
		return nil, shared.ErrInternalServer
	}
	return users, nil
}

func (r *repository) FindByID(id int64) (*model.UserDB, error) {
	var user model.UserDB
	if err := r.DB.First(&user, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, shared.ErrNotFound
		}
		return nil, shared.ErrInternalServer
	}
	return &user, nil
}

func (r *repository) FindByEmail(email string) (*model.UserDB, error) {
	var user model.UserDB
	if err := r.DB.Where("email = ?", email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, shared.ErrNotFound
		}
		return nil, shared.ErrInternalServer
	}
	return &user, nil
}

func (r *repository) Create(user *model.UserDB) (*model.UserDB, error) {
	if user == nil {
		return nil, shared.ErrInvalidInput
	}

	// Check duplicate
	var existing model.UserDB
	if err := r.DB.Where("email = ?", user.Email).First(&existing).Error; err == nil {
		return nil, shared.ErrAlreadyExists
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, shared.ErrInternalServer
	}

	if err := r.DB.Create(user).Error; err != nil {
		return nil, shared.ErrInternalServer
	}
	return user, nil
}

func (r *repository) Update(user *model.UserDB) (*model.UserDB, error) {
	if user == nil {
		return nil, shared.ErrInvalidInput
	}

	err := r.DB.Model(&model.UserDB{}).
		Where("id = ?", user.ID).
		Updates(map[string]interface{}{
			"name":  user.Name,
			"email": user.Email,
		}).Error

	if err != nil {
		return nil, shared.ErrInternalServer
	}

	var updated model.UserDB
	if err := r.DB.First(&updated, user.ID).Error; err != nil {
		return nil, shared.ErrInternalServer
	}

	return &updated, nil
}

func (r *repository) Delete(email string) error {
	if err := r.DB.
		Where("email = ?", email).
		Delete(&model.UserDB{}).Error; err != nil {
		return shared.ErrInternalServer
	}
	return nil
}

func (r *repository) CreateAction(action *model.ActionDB) (*model.ActionDB, error) {
	if err := r.DB.Create(action).Error; err != nil {
		return nil, shared.ErrInternalServer
	}
	return action, nil
}

func (r *repository) FindActionsByUID(uid int64) ([]model.ActionDB, error) {
	var actions []model.ActionDB
	if err := r.DB.Where("uid = ?", uid).Find(&actions).Error; err != nil {
		return nil, shared.ErrInternalServer
	}
	return actions, nil
}
