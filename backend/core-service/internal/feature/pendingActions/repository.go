package pendingActions

import (
	"time"

	"gorm.io/gorm"
)

type Repository interface {
	Create(action *PendingAction) error
	Update(uid int64, mid int64, timestamp time.Time) ([]*PendingAction, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) Create(action *PendingAction) error {
	return r.db.Create(action).Error
}

func (r *repository) Update(uid int64, mid int64, timestamp time.Time) ([]*PendingAction, error) {
	var actions []*PendingAction
	err := r.db.Where(
		"uid = ? AND mid = ? AND created_at = ? AND status = ?",
		uid, mid, timestamp, "pending",
	).Find(&actions).Error
	if err != nil {
		return nil, err
	}

	for _, action := range actions {
		action.Status = "processed"
		if err := r.db.Save(action).Error; err != nil {
			return nil, err
		}
	}

	return actions, nil
}
