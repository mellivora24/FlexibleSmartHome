package log

import "gorm.io/gorm"

type Repository interface {
	GetList(uid int64, req *GetListRequest) ([]*LogDB, int64, error)
	GetOne(uid int64, req *GetOneRequest) (*LogDB, error)
	CreateLog(log *LogDB) error
}

type repository struct {
	DB *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{DB: db}
}

func (r *repository) CreateLog(log *LogDB) error {
	return r.DB.Create(log).Error
}

func (r *repository) GetList(uid int64, req *GetListRequest) ([]*LogDB, int64, error) {
	var logs []*LogDB
	var total int64

	if req.Limit <= 0 {
		req.Limit = 10
	}
	if req.Page <= 0 {
		req.Page = 1
	}

	offset := (req.Page - 1) * req.Limit
	query := r.DB.Model(&LogDB{}).Where("uid = ?", uid)

	if req.Level != "" {
		query = query.Where("level = ?", req.Level)
	}
	if !req.StartTime.IsZero() {
		query = query.Where("created_at >= ?", req.StartTime)
	}
	if !req.EndTime.IsZero() {
		query = query.Where("created_at <= ?", req.EndTime)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	sortBy := "created_at"
	if req.SortBy != "" {
		sortBy = req.SortBy
	}
	sortType := "DESC"
	if req.SortType == "asc" {
		sortType = "ASC"
	}
	query = query.Order(sortBy + " " + sortType)

	if err := query.Limit(req.Limit).Offset(offset).Find(&logs).Error; err != nil {
		return nil, 0, err
	}

	return logs, total, nil
}

func (r *repository) GetOne(uid int64, req *GetOneRequest) (*LogDB, error) {
	var log LogDB
	query := r.DB.Model(&LogDB{})
	query.Where("uid = ?", uid)

	if req.ID > 0 {
		query = query.Where("id = ?", req.ID)
	}
	if req.Level != "" {
		query = query.Where("level = ?", req.Level)
	}
	if !req.AtTime.IsZero() {
		query = query.Where("created_at = ?", req.AtTime)
	}

	if err := query.First(&log).Error; err != nil {
		return nil, err
	}
	return &log, nil
}
