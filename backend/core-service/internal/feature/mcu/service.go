package mcu

import (
	"time"

	"github.com/lib/pq"
)

type Service interface {
	CreateMCU(uid int64, mcu *MCURequest) (*MCUResponse, error)
	UpdateMCU(req *UpdateMCURequest) (*MCUResponse, error)
	FirmwareUpdate(mcu *MCURequest) (*MCUResponse, error)
	DeleteMCU(mcuCode int) error
	GetAvailablePorts(mcuCode int) ([]int, error)
	GetMcuByUID(uid string) (int64, error)
	GetUIDByMCUCode(mcuCode int64) (int64, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) CreateMCU(uid int64, mcu *MCURequest) (*MCUResponse, error) {
	availablePorts := make(pq.Int64Array, 18)

	for i := int64(2); i <= 13; i++ {
		availablePorts[i-2] = i
	}

	for i := int64(14); i <= 19; i++ {
		availablePorts[i-2] = i
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

	response := &MCUResponse{
		ID:              created.ID,
		UID:             created.UID,
		McuCode:         created.McuCode,
		AvailablePort:   created.AvailablePort,
		FirmwareVersion: created.FirmwareVersion,
		CreatedAt:       created.CreatedAt,
	}

	return response, nil
}

func (s *service) UpdateMCU(req *UpdateMCURequest) (*MCUResponse, error) {
	updated, err := s.repo.Update(req)
	if err != nil {
		return nil, err
	}

	response := &MCUResponse{
		ID:              updated.ID,
		UID:             updated.UID,
		McuCode:         updated.McuCode,
		AvailablePort:   updated.AvailablePort,
		FirmwareVersion: updated.FirmwareVersion,
		CreatedAt:       updated.CreatedAt,
	}

	return response, nil
}

func (s *service) FirmwareUpdate(mcu *MCURequest) (*MCUResponse, error) {
	updated, err := s.repo.UpdateFirmware(mcu.McuCode, mcu.FirmwareVersion)
	if err != nil {
		return nil, err
	}

	response := &MCUResponse{
		ID:              updated.ID,
		UID:             updated.UID,
		McuCode:         updated.McuCode,
		AvailablePort:   updated.AvailablePort,
		FirmwareVersion: updated.FirmwareVersion,
		CreatedAt:       updated.CreatedAt,
	}

	return response, nil
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

func (s *service) GetUIDByMCUCode(mcuCode int64) (int64, error) {
	uid, err := s.repo.GetUIDByMCUCode(mcuCode)
	if err != nil {
		return 0, err
	}
	return uid, nil
}
