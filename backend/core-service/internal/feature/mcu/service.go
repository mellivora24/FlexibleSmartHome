package mcu

import (
	"time"

	"github.com/lib/pq"
)

type Service interface {
	CreateMCU(uid int64, mcu *MCURequest) (*McuDB, error)
	FirmwareUpdate(mcu *MCURequest) (*McuDB, error)
	DeleteMCU(mcuCode int) error
	GetAvailablePorts(mcuCode int) ([]int, error)
	GetMcuByUID(uid string) (int64, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) CreateMCU(uid int64, mcu *MCURequest) (*McuDB, error) {
	availablePorts := make(pq.Int64Array, 13)
	for i := int64(1); i <= 13; i++ {
		availablePorts[i-1] = i
	}

	newMcu := &McuDB{
		UID:             uid,
		McuCode:         mcu.McuCode,
		AvailablePort:   availablePorts,
		FirmwareVersion: mcu.FirmwareVersion,
		CreatedAt:       time.Now(),
	}

	created, err := s.repo.Create(newMcu)
	if err != nil {
		return nil, err
	}

	return created, nil
}

func (s *service) FirmwareUpdate(mcu *MCURequest) (*McuDB, error) {
	updated, err := s.repo.UpdateFirmware(mcu.McuCode, mcu.FirmwareVersion)
	if err != nil {
		return nil, err
	}
	return updated, nil
}

func (s *service) DeleteMCU(mcuCode int) error {
	return s.repo.Delete(mcuCode)
}

func (s *service) GetAvailablePorts(mcuCode int) ([]int, error) {
	ports, err := s.repo.AvailablePort(mcuCode)
	if err != nil {
		return nil, err
	}
	return ports, nil
}

func (s *service) GetMcuByUID(uid string) (int64, error) {
	mcuId, _ := s.repo.FindByUID(uid)
	return mcuId, nil
}
