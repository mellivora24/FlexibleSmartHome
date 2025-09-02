package device

import (
	"encoding/json"
	"errors"
)

type Service interface {
	ListDevices(cond *ListDeviceRequest) ([]DeviceDB, error)
	CreateDevice(device *CreateDeviceRequest) (*DeviceDB, error)
	UpdateDevice(device *UpdateDeviceRequest) (*DeviceDB, error)
	DeleteDevice(device *DeviceDB) error
}

type service struct {
	repo Repository
}

func NewService(repository Repository) Service {
	return &service{repo: repository}
}

func (s *service) ListDevices(cond *ListDeviceRequest) ([]DeviceDB, error) {
	uid, rid := int64(cond.UID), int64(cond.RID)
	devices, err := s.repo.GetList(uid, rid)
	if err != nil {
		return nil, err
	}
	return devices, nil
}

func (s *service) CreateDevice(device *CreateDeviceRequest) (*DeviceDB, error) {
	d := &DeviceDB{
		UID:         device.UID,
		MID:         device.MID,
		RID:         device.RID,
		Name:        device.Name,
		Type:        device.Type,
		Port:        device.Port,
		Status:      true,
		Data:        json.RawMessage(`{}`),
		RunningTime: 0,
	}

	return s.repo.Create(d)
}

func (s *service) UpdateDevice(device *UpdateDeviceRequest) (*DeviceDB, error) {
	if device.ID == 0 {
		return nil, errors.New("missing device ID")
	}

	db := &DeviceDB{
		ID:          device.ID,
		UID:         device.UID,
		MID:         device.MID,
		RID:         device.RID,
		Name:        device.Name,
		Type:        device.Type,
		Port:        device.Port,
		Status:      device.Status,
		Data:        device.Data,
		RunningTime: device.RunningTime,
	}

	return s.repo.Update(db)
}

func (s *service) DeleteDevice(device *DeviceDB) error {
	if err := s.repo.Delete(device.ID); err != nil {
		return err
	}
	return nil
}
