package mcu

import (
	"fmt"

	"github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/device"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/pendingActions"
	"gorm.io/gorm"
)

type Repository interface {
	Create(mcu *McuDB) (*McuDB, error)
	Delete(mcuCode int) error
	FindByUID(uid string) (int64, error)

	UpdateFirmware(mcuCode int, firmwareVersion string) (*McuDB, error)
	AvailablePort(mcuCode int) ([]int, error)
}

type repository struct {
	DB *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{DB: db}
}

func (r *repository) Create(mcu *McuDB) (*McuDB, error) {
	if err := r.DB.Create(mcu).Error; err != nil {
		return nil, err
	}
	return mcu, nil
}

func (r *repository) UpdateFirmware(mcuCode int, firmwareVersion string) (*McuDB, error) {
	mcu := &McuDB{}
	if err := r.DB.Model(mcu).
		Where("mcu_code = ?", mcuCode).
		Update("firmware_version", firmwareVersion).Error; err != nil {
		return nil, err
	}

	if err := r.DB.Where("mcu_code = ?", mcuCode).First(mcu).Error; err != nil {
		return nil, err
	}

	return mcu, nil
}

func (r *repository) Delete(mcuCode int) error {
	mcu := &McuDB{}
	if err := r.DB.Where("mcu_code = ?", mcuCode).First(mcu).Error; err != nil {
		return fmt.Errorf("MCU code %d not found", mcuCode)
	}

	r.DB.Where("mid = ?", mcu.ID).Delete(&device.DeviceDB{})
	r.DB.Where("mid = ?", mcu.ID).Delete(&pendingActions.PendingAction{})

	if err := r.DB.Delete(mcu).Error; err != nil {
		return err
	}
	return nil
}

func (r *repository) AvailablePort(mcuCode int) ([]int, error) {
	var ports []int
	if err := r.DB.
		Raw("SELECT * FROM get_available_ports(?)", mcuCode).
		Scan(&ports).Error; err != nil {
		return nil, err
	}
	return ports, nil
}

func (r *repository) FindByUID(uid string) (int64, error) {
	mcu := &McuDB{}
	if err := r.DB.Where("uid = ?", uid).First(mcu).Error; err != nil {
		return -1, err
	}
	return mcu.UID, nil
}
