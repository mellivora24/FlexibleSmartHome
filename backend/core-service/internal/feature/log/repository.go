package log

import "gorm.io/gorm"

type Repository interface {
	GetList(uid int64, pageSize int, limit int) ([]*LogDB, int64, error)
	CreateEvent(log *LogDB) error
}

type repository struct {
	DB *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{DB: db}
}

func (r *repository) GetList(uid int64, pageSize int, limit int) ([]*LogDB, int64, error) {
	var logs []*LogDB
	var total int64

	if limit <= 0 {
		limit = 10
	}
	if pageSize <= 0 {
		pageSize = 1
	}

	offset := (pageSize - 1) * limit
	query := r.DB.Model(&LogDB{}).Where("uid = ?", uid)

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := query.Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&logs).Error; err != nil {
		return nil, 0, err
	}

	return logs, total, nil
}

func (r *repository) CreateEvent(log *LogDB) error {
	return r.DB.Create(log).Error
}
