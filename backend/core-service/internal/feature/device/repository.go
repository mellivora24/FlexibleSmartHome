package device

import (
	"encoding/json"

	"gorm.io/gorm"
)

type Repository interface {
	GetList(uid int64) ([]DeviceDB, error)
	Create(record *DeviceDB) (*DeviceDB, error)
	Update(record *DeviceDB) (*DeviceDB, error)
	UpdateStatusAndData(id int64, status bool, data json.RawMessage) error
	Delete(id int64) error
}

type repository struct {
	DB *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{DB: db}
}

func (r *repository) GetList(uid int64) ([]DeviceDB, error) {
	var devices []DeviceDB
	if err := r.DB.Where("uid = ?", uid).Find(&devices).Error; err != nil {
		return nil, err
	}
	return devices, nil
}

func (r *repository) Create(record *DeviceDB) (*DeviceDB, error) {
	if err := r.DB.Create(record).Error; err != nil {
		return nil, err
	}
	return record, nil
}

func (r *repository) Update(record *DeviceDB) (*DeviceDB, error) {
	updates := map[string]interface{}{}

	updates["rid"] = record.RID
	updates["mid"] = record.MID
	updates["port"] = record.Port
	updates["status"] = record.Status
	updates["running_time"] = record.RunningTime

	if record.Name != "" {
		updates["name"] = record.Name
	}

	if record.Type != "" {
		updates["type"] = record.Type
	}

	if len(record.Data) > 0 {
		updates["data"] = record.Data
	}

	if err := r.DB.Model(&DeviceDB{}).
		Where("id = ?", record.ID).
		Omit("created_at").
		Updates(updates).Error; err != nil {
		return nil, err
	}

	var updated DeviceDB
	if err := r.DB.First(&updated, record.ID).Error; err != nil {
		return nil, err
	}
	return &updated, nil
}

func (r *repository) Delete(id int64) error {
	if err := r.DB.Where("id = ?", id).Delete(&DeviceDB{}).Error; err != nil {
		return err
	}
	return nil
}

func (r *repository) UpdateStatusAndData(id int64, status bool, data json.RawMessage) error {
	if err := r.DB.Model(&DeviceDB{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status": status,
			"data":   data,
		}).Error; err != nil {
		return err
	}
	return nil
}
