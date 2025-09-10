package device

import "gorm.io/gorm"

type Repository interface {
	GetList(uid int64, rid int64) ([]DeviceDB, error)
	Create(db *DeviceDB) (*DeviceDB, error)
	Update(db *DeviceDB) (*DeviceDB, error)
	Delete(id int64) error
}

type repository struct {
	DB *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{DB: db}
}

func (r *repository) GetList(uid int64, rid int64) ([]DeviceDB, error) {
	var devices []DeviceDB
	if err := r.DB.Where("uid = ? AND rid = ?", uid, rid).Find(&devices).Error; err != nil {
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
	if err := r.DB.Model(&DeviceDB{}).
		Where("id = ?", db.ID).
		Omit("created_at").
		Updates(db).Error; err != nil {
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
