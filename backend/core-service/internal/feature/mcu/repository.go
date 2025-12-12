package mcu

import (
	"fmt"

	"github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/device"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/pendingActions"
	"gorm.io/gorm"
)

type Repository interface {
	Create(mcu *McuDB) (*McuDB, error)
	Update(req *UpdateMCURequest) (*McuDB, error)
	Delete(mcuCode int) error
	FindByUID(uid string) (int64, error)
	FindByID(id int64) (*McuDB, error)
	FindByMCUCode(mcuCode int) (*McuDB, error)

	UpdateFirmware(mcuCode int, firmwareVersion string) (*McuDB, error)
	AvailablePort(mcuCode int) ([]int, error)
	GetUIDByMCUCode(mcuCode int64) (int64, error)
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

func (r *repository) Update(req *UpdateMCURequest) (*McuDB, error) {
	mcu := &McuDB{}

	if req.ID != nil {
		// Find by ID (original behavior)
		if err := r.DB.First(mcu, *req.ID).Error; err != nil {
			return nil, fmt.Errorf("MCU not found")
		}
	} else if req.CurrentMcuCode != nil {
		// Find by current mcu_code (new feature)
		if err := r.DB.Where("mcu_code = ?", *req.CurrentMcuCode).First(mcu).Error; err != nil {
			return nil, fmt.Errorf("MCU not found")
		}
	} else {
		return nil, fmt.Errorf("either ID or CurrentMcuCode is required")
	}

	// Build update map
	updates := make(map[string]interface{})

	if req.McuCode != nil {
		// Check if new mcu_code already exists (excluding current MCU)
		var existingMCU McuDB
		if err := r.DB.Where("mcu_code = ? AND id != ?", *req.McuCode, mcu.ID).First(&existingMCU).Error; err == nil {
			return nil, fmt.Errorf("MCU code already exists")
		}
		updates["mcu_code"] = *req.McuCode
	}

	if req.FirmwareVersion != nil {
		updates["firmware_version"] = *req.FirmwareVersion
	}

	// Perform update
	if len(updates) > 0 {
		if err := r.DB.Model(mcu).Updates(updates).Error; err != nil {
			return nil, err
		}
	}

	// Reload the updated MCU
	if err := r.DB.First(mcu, mcu.ID).Error; err != nil {
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

func (r *repository) FindByID(id int64) (*McuDB, error) {
	mcu := &McuDB{}
	if err := r.DB.First(mcu, id).Error; err != nil {
		return nil, fmt.Errorf("MCU not found")
	}
	return mcu, nil
}

func (r *repository) FindByMCUCode(mcuCode int) (*McuDB, error) {
	mcu := &McuDB{}
	if err := r.DB.Where("mcu_code = ?", mcuCode).First(mcu).Error; err != nil {
		return nil, fmt.Errorf("MCU not found")
	}
	return mcu, nil
}

func (r *repository) GetUIDByMCUCode(mcuCode int64) (int64, error) {
	mcu := &McuDB{}
	if err := r.DB.Where("mcu_code = ?", mcuCode).First(mcu).Error; err != nil {
		return 0, err
	}
	return mcu.UID, nil
}
