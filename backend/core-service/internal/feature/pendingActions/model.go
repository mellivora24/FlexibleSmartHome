package pendingActions

import "time"

type PendingAction struct {
	ID        int64     `gorm:"primaryKey"`
	UID       int64     `gorm:"column:uid"`
	MID       int64     `gorm:"column:mid"`
	Action    string    `gorm:"column:action"`
	Status    string    `gorm:"column:status"`
	CreatedAt time.Time `gorm:"column:created_at"`
	UpdatedAt time.Time `gorm:"column:updated_at"`
}

func (PendingAction) TableName() string {
	return "pending_actions"
}
