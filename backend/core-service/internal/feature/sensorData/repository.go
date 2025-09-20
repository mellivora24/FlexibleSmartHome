package sensorData

import "gorm.io/gorm"

type Repository interface {
	CreateRecord(db *SensorDataDB) error
	GetListByUID(uid int64) ([]GetListResponse, error)
	GetListBySID(sid int64) ([]GetListResponse, error)
	GetList(uid int64, req *GetListRequest) ([]GetListResponse, int64, error)
	GetOne(uid int64, req *GetOneRequest) (*GetListResponse, error)
}

type repository struct {
	DB *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{DB: db}
}

func (r *repository) CreateRecord(db *SensorDataDB) error {
	return r.DB.Create(db).Error
}

func (r *repository) GetListByUID(uid int64) ([]GetListResponse, error) {
	data := make([]GetListResponse, 0)
	err := r.DB.Table("tbl_sensordata AS sd").
		Select("sd.id, s.name AS sensor_name, sd.value, sd.unit, sd.created_at").
		Joins("JOIN tbl_sensor s ON sd.sid = s.id").
		Where("sd.uid = ?", uid).
		Order("sd.created_at DESC").
		Scan(&data).Error
	if err != nil {
		return nil, err
	}
	return data, nil
}

func (r *repository) GetListBySID(sid int64) ([]GetListResponse, error) {
	data := make([]GetListResponse, 0)
	err := r.DB.Table("tbl_sensordata AS sd").
		Select("sd.id, s.name AS sensor_name, sd.value, sd.unit, sd.created_at").
		Joins("JOIN tbl_sensor s ON sd.sid = s.id").
		Where("sd.sid = ?", sid).
		Order("sd.created_at DESC").
		Scan(&data).Error
	if err != nil {
		return nil, err
	}
	return data, nil
}

func (r *repository) GetList(uid int64, req *GetListRequest) ([]GetListResponse, int64, error) {
	var data []GetListResponse
	var total int64

	if req.Limit <= 0 {
		req.Limit = 10
	}
	if req.Page <= 0 {
		req.Page = 1
	}
	offset := (req.Page - 1) * req.Limit

	query := r.DB.Table("tbl_sensordata AS sd").
		Select("sd.id, s.name AS sensor_name, sd.value, sd.unit, sd.created_at").
		Joins("JOIN tbl_sensor s ON sd.sid = s.id").
		Where("sd.uid = ?", uid)

	if req.SID > 0 {
		query = query.Where("sd.sid = ?", req.SID)
	}
	if !req.StartTime.IsZero() {
		query = query.Where("sd.created_at >= ?", req.StartTime)
	}
	if !req.EndTime.IsZero() {
		query = query.Where("sd.created_at <= ?", req.EndTime)
	}

	// count total
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	sortBy := "sd.created_at"
	if req.SortBy != "" {
		sortBy = req.SortBy
	}
	sortType := "DESC"
	if req.SortType == "asc" {
		sortType = "ASC"
	}
	query = query.Order(sortBy + " " + sortType)

	if err := query.Limit(req.Limit).Offset(offset).Scan(&data).Error; err != nil {
		return nil, 0, err
	}

	return data, total, nil
}

func (r *repository) GetOne(uid int64, req *GetOneRequest) (*GetListResponse, error) {
	var data GetListResponse

	query := r.DB.Table("tbl_sensordata AS sd").
		Select("sd.id, s.name AS sensor_name, sd.value, sd.unit, sd.created_at").
		Joins("JOIN tbl_sensor s ON sd.sid = s.id").
		Where("sd.uid = ?", uid)

	if req.ID > 0 {
		query = query.Where("sd.id = ?", req.ID)
	}
	if req.SID > 0 {
		query = query.Where("sd.sid = ?", req.SID)
	}
	if !req.AtTime.IsZero() {
		query = query.Where("sd.created_at = ?", req.AtTime)
	}

	if err := query.First(&data).Error; err != nil {
		return nil, err
	}

	return &data, nil
}
