package mcu

import "gorm.io/gorm"

type Repository interface {
	Create(mcu *McuDB) (*McuDB, error)
	Delete(id int64) error
	FindByUID(uid string) (int64, error)

	UpdateFirmware(id int64, firmwareVersion string) (*McuDB, error)
	AvailablePort(mid int64) ([]int, error)
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

func (r *repository) UpdateFirmware(id int64, firmwareVersion string) (*McuDB, error) {
	mcu := &McuDB{}
	if err := r.DB.Model(mcu).
		Where("id = ?", id).
		Update("firmware_version", firmwareVersion).Error; err != nil {
		return nil, err
	}

	if err := r.DB.First(mcu, id).Error; err != nil {
		return nil, err
	}

	return mcu, nil
}

func (r *repository) Delete(id int64) error {
	if err := r.DB.Delete(&McuDB{}, id).Error; err != nil {
		return err
	}
	return nil
}

func (r *repository) AvailablePort(mid int64) ([]int, error) {
	var ports []int
	if err := r.DB.
		Raw("SELECT * FROM get_available_ports(?)", mid).
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
