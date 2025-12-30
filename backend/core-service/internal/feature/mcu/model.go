package mcu

import (
	"time"

	"github.com/lib/pq"
)

type McuDB struct {
	ID              int64         `gorm:"column:id;primaryKey;autoIncrement"`
	UID             int64         `gorm:"column:uid;not null"`
	McuCode         int           `gorm:"column:mcu_code;unique;not null"`
	AvailablePort   pq.Int64Array `gorm:"column:available_port;type:int[]"`
	FirmwareVersion string        `gorm:"column:firmware_version;type:varchar(255)"`
	CreatedAt       time.Time     `gorm:"column:create_at;default:CURRENT_TIMESTAMP"`
}

func (McuDB) TableName() string {
	return "tbl_mcu"
}

type PortInfo struct {
	Port  int    `json:"port"`
	Label string `json:"label"`
}

func PortToLabel(port int) string {
	if port >= 14 && port <= 19 {
		return "A" + string(rune('0'+(port-14)))
	}

	if port < 10 {
		return string(rune('0' + port))
	}

	return string(rune('0'+port/10)) + string(rune('0'+port%10))
}

func LabelToPort(label string) int {
	if len(label) > 0 && label[0] == 'A' {
		if len(label) == 2 && label[1] >= '0' && label[1] <= '5' {
			return 14 + int(label[1]-'0')
		}
	}

	port := 0
	for _, c := range label {
		if c >= '0' && c <= '9' {
			port = port*10 + int(c-'0')
		}
	}
	return port
}

type MCURequest struct {
	McuCode         int    `json:"mcu_code" binding:"required"`
	FirmwareVersion string `json:"firmware_version"`
}

type UpdateMCURequest struct {
	ID              *int64  `json:"id"`
	CurrentMcuCode  *int    `json:"current_mcu_code"`
	McuCode         *int    `json:"mcu_code"`
	FirmwareVersion *string `json:"firmware_version"`
}

type MCUResponse struct {
	ID              int64     `json:"id"`
	UID             int64     `json:"uid"`
	McuCode         int       `json:"mcu_code"`
	AvailablePort   []int64   `json:"available_port"`
	FirmwareVersion string    `json:"firmware_version"`
	CreatedAt       time.Time `json:"created_at"`
}
