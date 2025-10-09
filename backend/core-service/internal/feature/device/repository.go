package device

import (
	"encoding/json"
	"fmt"
	"time"

	"gorm.io/gorm"
)

type Repository interface {
	GetList(uid int64, mcuCode int64) ([]DeviceDB, error)
	Create(record *DeviceDB) (*DeviceDB, error)
	Update(record *DeviceDB) (*DeviceDB, error)
	UpdateStatusAndData(id int64, status bool, data json.RawMessage) error
	Delete(id int64) error
	GetMCUByCode(mcuCode int64) (int64, error)
}

type repository struct {
	DB *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{DB: db}
}

func (r *repository) GetList(uid int64, mcuCode int64) ([]DeviceDB, error) {
	var devices []DeviceDB

	err := r.DB.
		Table("tbl_device AS d").
		Select("d.*").
		Joins("JOIN tbl_mcu AS m ON d.mid = m.id").
		Where("d.uid = ? AND m.mcu_code = ?", uid, mcuCode).
		Find(&devices).Error

	if err != nil {
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
	updates["port"] = record.Port
	updates["updated_at"] = time.Now()

	if record.Name != "" {
		updates["name"] = record.Name
	}

	if record.Type != "" {
		updates["type"] = record.Type
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
	result := r.DB.Where("id = ?", id).Delete(&DeviceDB{})

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return fmt.Errorf("device with id %d not found", id)
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

func (r *repository) GetMCUByCode(mcuCode int64) (int64, error) {
	var mcuId int64
	err := r.DB.
		Raw("SELECT id FROM tbl_mcu WHERE mcu_code = ? LIMIT 1", mcuCode).
		Scan(&mcuId).Error

	if err != nil {
		return 0, err
	}

	if mcuId == 0 {
		return 0, fmt.Errorf("MCU with code %d not found", mcuCode)
	}

	return mcuId, nil
}
