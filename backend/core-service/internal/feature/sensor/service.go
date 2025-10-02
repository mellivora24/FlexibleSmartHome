package sensor

import (
	"errors"
)

type Service interface {
	ListSensors(uid int64) ([]SensorDB, error)
	CreateSensor(uid int64, device *CreateSensorRequest) (*SensorDB, error)
	UpdateSensor(uid int64, device *UpdateSensorRequest) (*SensorDB, error)
	DeleteSensor(device *SensorDB) error
	RealtimeGetListSensors(uid int64) ([]MQTTGetListSensor, error)
}

type service struct {
	repo Repository
}

func NewService(repository Repository) Service {
	return &service{repo: repository}
}

func (s *service) ListSensors(uid int64) ([]SensorDB, error) {
	sensors, err := s.repo.GetList(uid)
	if err != nil {
		return nil, err
	}
	return sensors, nil
}

func (s *service) CreateSensor(uid int64, sensor *CreateSensorRequest) (*SensorDB, error) {
	x := &SensorDB{
		UID:         uid,
		MID:         sensor.MID,
		RID:         sensor.RID,
		Name:        sensor.Name,
		Type:        sensor.Type,
		Port:        sensor.Port,
		Status:      true,
		RunningTime: 0,
	}

	return s.repo.Create(x)
}

func (s *service) UpdateSensor(uid int64, sensor *UpdateSensorRequest) (*SensorDB, error) {
	if sensor.ID == 0 {
		return nil, errors.New("missing device ID")
	}

	x := &SensorDB{
		ID:          sensor.ID,
		UID:         uid,
		MID:         sensor.MID,
		RID:         sensor.RID,
		Name:        sensor.Name,
		Type:        sensor.Type,
		Port:        sensor.Port,
		Status:      sensor.Status,
		RunningTime: sensor.RunningTime,
	}

	return s.repo.Update(x)
}

func (s *service) DeleteSensor(sensor *SensorDB) error {
	if err := s.repo.Delete(sensor.ID); err != nil {
		return err
	}
	return nil
}

func (s *service) RealtimeGetListSensors(uid int64) ([]MQTTGetListSensor, error) {
	sensors, err := s.repo.GetList(uid)
	if err != nil {
		return nil, err
	}

	var result []MQTTGetListSensor
	for _, sensor := range sensors {
		result = append(result, MQTTGetListSensor{
			ID:   sensor.ID,
			Name: sensor.Name,
			Type: sensor.Type,
			Port: sensor.Port,
		})
	}
	return result, nil
}
