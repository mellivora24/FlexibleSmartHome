package event

import (
	"gorm.io/gorm"
)

type Repository interface {
	GetList(uid int64, req *GetListRequest) ([]*EventDB, int64, error)
	CreateEvent(event *EventDB) error
	GetOne(uid int64, req *GetOneRequest) (*EventDB, error)
}

type repository struct {
	DB *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{DB: db}
}

func (r *repository) GetList(uid int64, req *GetListRequest) ([]*EventDB, int64, error) {
	var events []*EventDB
	var total int64

	if req.Limit <= 0 {
		req.Limit = 10
	}
	if req.Page <= 0 {
		req.Page = 1
	}

	offset := (req.Page - 1) * req.Limit
	query := r.DB.Model(&EventDB{}).Where("uid = ?", uid)

	if req.Action != "" {
		query = query.Where("action = ?", req.Action)
	}
	if req.DID > 0 {
		query = query.Where("did = ?", req.DID)
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

	if err := query.Limit(req.Limit).Offset(offset).Find(&events).Error; err != nil {
		return nil, 0, err
	}

	return events, total, nil
}

func (r *repository) CreateEvent(event *EventDB) error {
	return r.DB.Create(event).Error
}

func (r *repository) GetOne(uid int64, req *GetOneRequest) (*EventDB, error) {
	var event EventDB
	query := r.DB.Model(&EventDB{})
	query = query.Where("uid = ?", uid)

	if req.ID > 0 {
		query = query.Where("id = ?", req.ID)
	}

	if req.DID > 0 {
		query = query.Where("did = ?", req.DID)
	}
	if req.Action != "" {
		query = query.Where("action = ?", req.Action)
	}
	if !req.AtTime.IsZero() {
		query = query.Where("created_at = ?", req.AtTime)
	}

	if err := query.First(&event).Error; err != nil {
		return nil, err
	}
	return &event, nil
}
