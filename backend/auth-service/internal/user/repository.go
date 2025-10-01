package user

import (
	"errors"
	"fmt"

	"github.com/mellivora24/flexiblesmarthome/auth-service/internal/shared"
	"gorm.io/gorm"
)

type Repository interface {
	FindAll() ([]UserDB, error)
	FindByID(id int64) (*UserDB, error)
	FindByEmail(email string) (*UserDB, error)
	Create(user *UserDB) (*UserDB, error)
	Update(user *UserDB) (*UserDB, error)
	Delete(email string) error

	CreateAction(action *ActionDB) (*ActionDB, error)
	FindActionsByUID(uid int64) ([]ActionDB, error)
}

type repository struct {
	DB *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{DB: db}
}

func (r *repository) FindAll() ([]UserDB, error) {
	var users []UserDB
	if err := r.DB.Find(&users).Error; err != nil {
		return nil, shared.ErrInternalServer
	}
	return users, nil
}

func (r *repository) FindByID(id int64) (*UserDB, error) {
	var user UserDB
	if err := r.DB.First(&user, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, shared.ErrNotFound
		}
		return nil, shared.ErrInternalServer
	}
	return &user, nil
}

func (r *repository) FindByEmail(email string) (*UserDB, error) {
	var user UserDB
	if err := r.DB.Where("email = ?", email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, shared.ErrNotFound
		}
		return nil, shared.ErrInternalServer
	}
	return &user, nil
}

func (r *repository) Create(user *UserDB) (*UserDB, error) {
	if user == nil {
		fmt.Println("Invalid user input")
		return nil, shared.ErrInvalidInput
	}

	// Check duplicate
	var existing UserDB
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

func (r *repository) Update(user *UserDB) (*UserDB, error) {
	if user == nil {
		return nil, shared.ErrInvalidInput
	}

	err := r.DB.Model(&UserDB{}).
		Where("id = ?", user.ID).
		Updates(map[string]interface{}{
			"mid":   user.MID,
			"name":  user.Name,
			"email": user.Email,
		}).Error

	if err != nil {
		return nil, shared.ErrInternalServer
	}

	var updated UserDB
	if err := r.DB.First(&updated, user.ID).Error; err != nil {
		return nil, shared.ErrInternalServer
	}

	return &updated, nil
}

func (r *repository) Delete(email string) error {
	if err := r.DB.
		Where("email = ?", email).
		Delete(&UserDB{}).Error; err != nil {
		return shared.ErrInternalServer
	}
	return nil
}

func (r *repository) CreateAction(action *ActionDB) (*ActionDB, error) {
	if err := r.DB.Create(action).Error; err != nil {
		return nil, shared.ErrInternalServer
	}
	return action, nil
}

func (r *repository) FindActionsByUID(uid int64) ([]ActionDB, error) {
	var actions []ActionDB
	if err := r.DB.Where("uid = ?", uid).Find(&actions).Error; err != nil {
		return nil, shared.ErrInternalServer
	}
	return actions, nil
}
