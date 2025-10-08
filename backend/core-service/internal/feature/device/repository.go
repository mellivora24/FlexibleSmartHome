package device

import (
	"encoding/json"

	"gorm.io/gorm"
)

type Repository interface {
	GetList(uid int64) ([]DeviceDB, error)
	Create(db *DeviceDB) (*DeviceDB, error)
	Update(db *DeviceDB) (*DeviceDB, error)
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

func (r *repository) Create(db *DeviceDB) (*DeviceDB, error) {
	if err := r.DB.Create(db).Error; err != nil {
		return nil, err
	}
	return db, nil
}

func (r *repository) Update(db *DeviceDB) (*DeviceDB, error) {
	updates := map[string]interface{}{}

	updates["rid"] = db.RID
	updates["mid"] = db.MID
	updates["port"] = db.Port
	updates["status"] = db.Status
	updates["running_time"] = db.RunningTime

	if db.Name != "" {
		updates["name"] = db.Name
	}

	if db.Type != "" {
		updates["type"] = db.Type
	}

	if len(db.Data) > 0 {
		updates["data"] = db.Data
	}

	if err := r.DB.Model(&DeviceDB{}).
		Where("id = ?", db.ID).
		Omit("created_at").
		Updates(updates).Error; err != nil {
		return nil, err
	}

	var updated DeviceDB
	if err := r.DB.First(&updated, db.ID).Error; err != nil {
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
