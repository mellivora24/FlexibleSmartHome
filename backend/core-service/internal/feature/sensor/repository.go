package sensor

import "gorm.io/gorm"

type Repository interface {
	GetList(uid int64, rid int64) ([]SensorDB, error)
	Create(db *SensorDB) (*SensorDB, error)
	Update(db *SensorDB) (*SensorDB, error)
	Delete(id int64) error
}

type repository struct {
	DB *gorm.DB
}

func NewSensorRepository(db *gorm.DB) Repository {
	return &repository{DB: db}
}

func (r *repository) GetList(uid int64, rid int64) ([]SensorDB, error) {
	var devices []SensorDB
	if err := r.DB.Where("uid = ? AND rid = ?", uid, rid).Find(&devices).Error; err != nil {
		return nil, err
	}
	return devices, nil
}

func (r *repository) Create(db *SensorDB) (*SensorDB, error) {
	if err := r.DB.Create(db).Error; err != nil {
		return nil, err
	}
	return db, nil
}

func (r *repository) Update(db *SensorDB) (*SensorDB, error) {
	if err := r.DB.Model(&SensorDB{}).
		Where("id = ?", db.ID).
		Omit("created_at").
		Updates(db).Error; err != nil {
		return nil, err
	}

	var updated SensorDB
	if err := r.DB.First(&updated, db.ID).Error; err != nil {
		return nil, err
	}
	return &updated, nil
}

func (r *repository) Delete(id int64) error {
	if err := r.DB.Where("id = ?", id).Delete(&SensorDB{}).Error; err != nil {
		return err
	}
	return nil
}
