package device

import (
	"encoding/json"
	"errors"
)

type Service interface {
	ListDevices(uid int64, mcuCode int64) ([]DeviceDB, error)
	CreateDevice(uid int64, mcuCode int64, device *CreateDeviceRequest) (*DeviceDB, error)
	UpdateDevice(device *UpdateDeviceRequest) (*DeviceDB, error)
	UpdateDeviceStatusAndData(id int64, status bool, data json.RawMessage) error
	DeleteDevice(id int64) error
	RealtimeGetList(uid int64, mcuCode int64) ([]MQTTGetDeviceData, error)
}

type service struct {
	repo Repository
}

func NewService(repository Repository) Service {
	return &service{repo: repository}
}

func (s *service) ListDevices(uid int64, mcuCode int64) ([]DeviceDB, error) {
	devices, err := s.repo.GetList(uid, mcuCode)
	if err != nil {
		return nil, err
	}
	return devices, nil
}

func (s *service) CreateDevice(uid int64, mcuCode int64, device *CreateDeviceRequest) (*DeviceDB, error) {
	mid, err := s.repo.GetMCUByCode(mcuCode)
	if err != nil {
		return nil, err
	}

	if device.Type != "analogSensor" && device.Type != "digitalSensor" &&
		device.Type != "temperatureSensor" && device.Type != "humiditySensor" &&
		device.Type != "analogDevice" && device.Type != "digitalDevice" {
		return nil, errors.New("invalid device type")
	}

	d := &DeviceDB{
		UID:         uid,
		MID:         mid,
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
		ID:   device.ID,
		RID:  device.RID,
		Name: device.Name,
		Type: device.Type,
		Port: device.Port,
	}

	return s.repo.Update(db)
}

func (s *service) UpdateDeviceStatusAndData(id int64, status bool, data json.RawMessage) error {
	return s.repo.UpdateStatusAndData(id, status, data)
}

func (s *service) DeleteDevice(id int64) error {
	if err := s.repo.Delete(id); err != nil {
		return err
	}
	return nil
}

func (s *service) RealtimeGetList(uid int64, mcuCode int64) ([]MQTTGetDeviceData, error) {
	devices, err := s.repo.GetList(uid, mcuCode)
	if err != nil {
		return nil, err
	}

	var mqttDevices []MQTTGetDeviceData
	for _, device := range devices {
		mqttDevice := MQTTGetDeviceData{
			ID:     device.ID,
			Name:   device.Name,
			Type:   device.Type,
			Port:   device.Port,
			Status: device.Status,
			Data:   device.Data,
		}
		mqttDevices = append(mqttDevices, mqttDevice)
	}

	return mqttDevices, nil
}
