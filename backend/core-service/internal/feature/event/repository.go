package event

import "gorm.io/gorm"

type Repository interface {
	GetList(uid int64, req *GetListRequest) ([]*EventResponse, int64, error)
	GetOne(uid int64, req *GetOneRequest) (*EventResponse, error)
	CreateEvent(event *EventDB) error
}

type repository struct {
	DB *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{DB: db}
}

func (r *repository) GetList(uid int64, req *GetListRequest) ([]*EventResponse, int64, error) {
	var events []*EventResponse
	var total int64

	if req.Limit <= 0 {
		req.Limit = 10
	}
	if req.Page <= 0 {
		req.Page = 1
	}
	offset := (req.Page - 1) * req.Limit

	query := r.DB.Table("tbl_events AS e").
		Select("e.id, e.uid, d.name AS device_name, e.action, e.payload, e.created_at").
		Joins("JOIN tbl_device d ON e.did = d.id").
		Where("e.uid = ?", uid)

	if req.DID > 0 {
		query = query.Where("e.did = ?", req.DID)
	}
	if req.DeviceName != "" {
		query = query.Where("d.name LIKE ?", "%"+req.DeviceName+"%")
	}
	if req.Action != "" {
		query = query.Where("e.action = ?", req.Action)
	}
	if !req.StartTime.IsZero() {
		query = query.Where("e.created_at >= ?", req.StartTime)
	}
	if !req.EndTime.IsZero() {
		query = query.Where("e.created_at <= ?", req.EndTime)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	sortBy := "e.created_at"
	if req.SortBy != "" {
		sortBy = req.SortBy
	}
	sortType := "DESC"
	if req.SortType == "asc" {
		sortType = "ASC"
	}

	if err := query.
		Order(sortBy + " " + sortType).
		Limit(req.Limit).
		Offset(offset).
		Scan(&events).Error; err != nil {
		return nil, 0, err
	}

	return events, total, nil
}

func (r *repository) GetOne(uid int64, req *GetOneRequest) (*EventResponse, error) {
	var event EventResponse

	query := r.DB.Table("tbl_events AS e").
		Select("e.id, e.uid, d.name AS device_name, e.action, e.payload, e.created_at").
		Joins("JOIN tbl_device d ON e.did = d.id").
		Where("e.uid = ?", uid)

	if req.ID > 0 {
		query = query.Where("e.id = ?", req.ID)
	}
	if req.DID > 0 {
		query = query.Where("e.did = ?", req.DID)
	}
	if req.Action != "" {
		query = query.Where("e.action = ?", req.Action)
	}
	if !req.AtTime.IsZero() {
		query = query.Where("e.created_at = ?", req.AtTime)
	}

	if err := query.First(&event).Error; err != nil {
		return nil, err
	}
	return &event, nil
}

func (r *repository) CreateEvent(event *EventDB) error {
	var deviceType string

	err := r.DB.Table("tbl_device").
		Select("type").
		Where("id = ?", event.DID).
		Scan(&deviceType).Error

	if err != nil {
		return err
	}
	if deviceType == "" {
		return nil
	}

	if deviceType != "analogDevice" && deviceType != "digitalDevice" {
		return nil
	}

	return r.DB.Create(event).Error
}
