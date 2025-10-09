package sensorData

import "gorm.io/gorm"

type Repository interface {
	CreateRecord(record *SensorDataDB) error
	GetList(uid int64, req *GetListRequest) ([]SensorDataItem, int64, error)
	GetOne(uid int64, req *GetOneRequest) (*SensorDataItem, error)
	GetListByDID(did int64, limit int) ([]SensorDataDB, error)
}

type repository struct {
	DB *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{DB: db}
}

func (r *repository) CreateRecord(record *SensorDataDB) error {
	var deviceType string

	err := r.DB.Table("tbl_device").
		Select("type").
		Where("id = ?", record.DID).
		Scan(&deviceType).Error

	if err != nil {
		return err
	}

	if deviceType == "" {
		return nil
	}

	if deviceType != "analogSensor" && deviceType != "digitalSensor" && deviceType != "temperatureSensor" && deviceType != "humiditySensor" {
		return nil
	}

	return r.DB.Create(record).Error
}

func (r *repository) GetList(uid int64, req *GetListRequest) ([]SensorDataItem, int64, error) {
	var data []SensorDataItem
	var total int64

	if req.Limit <= 0 {
		req.Limit = 10
	}
	if req.Page <= 0 {
		req.Page = 1
	}
	offset := (req.Page - 1) * req.Limit

	query := r.DB.Table("tbl_sensor_data AS sd").
		Select("sd.id, sd.did, d.name AS sensor_name, sd.value, sd.unit, sd.created_at").
		Joins("JOIN tbl_device d ON sd.did = d.id").
		Where("sd.uid = ?", uid)

	if req.DID > 0 {
		query = query.Where("sd.did = ?", req.DID)
	}

	if req.Name != "" {
		query = query.Where("d.name LIKE ?", "%"+req.Name+"%")
	}

	if req.Value != 0 {
		query = query.Where("sd.value = ?", req.Value)
	}

	if !req.Time.IsZero() {
		query = query.Where("sd.created_at = ?", req.Time)
	}

	if !req.StartTime.IsZero() {
		query = query.Where("sd.created_at >= ?", req.StartTime)
	}
	if !req.EndTime.IsZero() {
		query = query.Where("sd.created_at <= ?", req.EndTime)
	}

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

	if err := query.
		Order(sortBy + " " + sortType).
		Limit(req.Limit).
		Offset(offset).
		Scan(&data).Error; err != nil {
		return nil, 0, err
	}

	return data, total, nil
}

func (r *repository) GetOne(uid int64, req *GetOneRequest) (*SensorDataItem, error) {
	var item SensorDataItem
	query := r.DB.Table("tbl_sensor_data AS sd").
		Select("sd.id, sd.did AS did, d.name AS sensor_name, sd.value, sd.unit, sd.created_at").
		Joins("JOIN tbl_device d ON sd.did = d.id").
		Where("sd.uid = ?", uid)

	if req.ID > 0 {
		query = query.Where("sd.id = ?", req.ID)
	}
	if req.DID > 0 {
		query = query.Where("sd.did = ?", req.DID)
	}
	if req.Value != 0 {
		query = query.Where("sd.value = ?", req.Value)
	}
	if !req.AtTime.IsZero() {
		query = query.Where("sd.created_at = ?", req.AtTime)
	}

	if err := query.First(&item).Error; err != nil {
		return nil, err
	}
	return &item, nil
}

func (r *repository) GetListByDID(did int64, limit int) ([]SensorDataDB, error) {
	var records []SensorDataDB

	query := r.DB.Table("tbl_sensor_data").
		Where("did = ?", did).
		Order("created_at ASC").
		Limit(limit)

	if err := query.Find(&records).Error; err != nil {
		return nil, err
	}

	return records, nil
}
