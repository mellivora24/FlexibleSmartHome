package notification

import "gorm.io/gorm"

type Repository interface {
	GetList(uid int64, req *GetListRequest) ([]*NotificationDB, int64, error)
	CreateNoti(log *NotificationDB) error
	UpdateNoti(id int64) (*NotificationDB, error)
}

type repository struct {
	DB *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{DB: db}
}

func (r *repository) GetList(uid int64, req *GetListRequest) ([]*NotificationDB, int64, error) {
	var noti []*NotificationDB
	var total int64

	if req.Page <= 0 {
		req.Page = 1
	}
	if req.Limit <= 0 {
		req.Limit = 10
	}

	offset := (req.Page - 1) * req.Limit
	query := r.DB.Model(&NotificationDB{}).Where("uid = ?", uid)

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if req.Order != "asc" {
		req.Order = "desc"
	}

	if err := query.Order("created_at " + req.Order).
		Limit(req.Limit).
		Offset(offset).
		Find(&noti).Error; err != nil {
		return nil, 0, err
	}

	return noti, total, nil
}

func (r *repository) CreateNoti(noti *NotificationDB) error {
	return r.DB.Create(noti).Error
}

func (r *repository) UpdateNoti(id int64) (*NotificationDB, error) {
	var noti NotificationDB
	if err := r.DB.Model(&NotificationDB{}).
		Where("id = ?", id).
		Update("is_read", true).Error; err != nil {
		return nil, err
	}

	if err := r.DB.First(&noti, id).Error; err != nil {
		return nil, err
	}

	return &noti, nil
}
