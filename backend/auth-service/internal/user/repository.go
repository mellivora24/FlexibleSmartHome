package user

import (
	"gorm.io/gorm"
)

type Repository interface {
	// TODO: Add method here (define)
}

type repository struct {
	DB *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{DB: db}
}

// TODO: implement method here
