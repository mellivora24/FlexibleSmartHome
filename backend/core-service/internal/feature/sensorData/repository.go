package sensorData

import "gorm.io/gorm"

type Repository interface {
	CreateRecord(db *SensorDataDB) error
	GetListByUID(uid int64) ([]GetListResponse, error)
	GetListBySID(sid int64) ([]GetListResponse, error)
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
