package room

import "gorm.io/gorm"

type Repository interface {
	GetByID(id int64, uid int64) (*RoomDB, error)
	Create(room *RoomDB) (*RoomDB, error)
	GetList(uid int64) ([]RoomDB, error)
}

type repository struct {
	DB *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{DB: db}
}

func (r *repository) GetByID(id int64, uid int64) (*RoomDB, error) {
	var room RoomDB
	if err := r.DB.First(&room, "id = ? AND uid = ?", id, uid).Error; err != nil {
		return nil, err
	}
	return &room, nil
}

func (r *repository) Create(room *RoomDB) (*RoomDB, error) {
	if err := r.DB.Create(room).Error; err != nil {
		return nil, err
	}
	return room, nil
}

func (r *repository) GetList(uid int64) ([]RoomDB, error) {
	var rooms []RoomDB
	if err := r.DB.Where("uid = ?", uid).Find(&rooms).Error; err != nil {
		return nil, err
	}
	return rooms, nil
}
