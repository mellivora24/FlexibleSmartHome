package mcu

import (
	"time"

	"github.com/lib/pq"
)

type Service interface {
	CreateMCU(uid int64, mcu *CreateMCURequest) (*McuDB, error)
	FirmwareUpdate(mcu *FirmwareUpdateRequest) (*McuDB, error)
	DeleteMCU(id int) error
	GetAvailablePorts(mid int) ([]PortInfo, error)
	GetMcuByUID(uid string) (int64, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) CreateMCU(uid int64, mcu *CreateMCURequest) (*McuDB, error) {
	availablePorts := make(pq.Int64Array, 10) // TODO: de xem dung STM32 hay Arduino Nano
	for i := int64(1); i <= 10; i++ {
		availablePorts[i-1] = i
	}

	newMcu := &McuDB{
		UID:             uid,
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

func (s *service) FirmwareUpdate(a *FirmwareUpdateRequest) (*McuDB, error) {
	updated, err := s.repo.UpdateFirmware(int64(a.ID), a.FirmwareVersion)
	if err != nil {
		return nil, err
	}
	return updated, nil
}

func (s *service) DeleteMCU(id int) error {
	return s.repo.Delete(int64(id))
}

func (s *service) GetAvailablePorts(mid int) ([]PortInfo, error) {
	ports, err := s.repo.AvailablePort(int64(mid))
	if err != nil {
		return nil, err
	}
	return ports, nil
}

func (s *service) GetMcuByUID(uid string) (int64, error) {
	mcuId, _ := s.repo.FindByUID(uid)
	return mcuId, nil
}
