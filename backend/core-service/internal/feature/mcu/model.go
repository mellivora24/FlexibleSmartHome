package mcu

import (
	"time"

	"github.com/lib/pq"
)

type McuDB struct {
	ID              int64         `gorm:"column:id;primaryKey;autoIncrement"`
	UID             int64         `gorm:"column:uid;not null"`
	AvailablePort   pq.Int64Array `gorm:"column:available_port;type:int[]"`
	FirmwareVersion string        `gorm:"column:firmware_version;type:varchar(255)"`
	CreatedAt       time.Time     `gorm:"column:create_at;default:CURRENT_TIMESTAMP"`
}

func (McuDB) TableName() string {
	return "tbl_mcu"
}

type PortInfo struct {
	Port int `json:"port"`
}

type CreateMCURequest struct {
	FirmwareVersion string `json:"firmware_version"`
}

type FirmwareUpdateRequest struct {
	ID              int    `json:"id"`
	FirmwareVersion string `json:"firmware_version"`
}
