package sensor

import (
	"errors"
)

type Service interface {
	ListSensors(cond *ListSensorRequest) ([]SensorDB, error)
	CreateSensor(device *CreateSensorRequest) (*SensorDB, error)
	UpdateSensor(device *UpdateSensorRequest) (*SensorDB, error)
	DeleteSensor(device *SensorDB) error
}

type service struct {
	repo Repository
}

func NewService(repository Repository) Service {
	return &service{repo: repository}
}

func (s *service) ListSensors(cond *ListSensorRequest) ([]SensorDB, error) {
	uid, rid := int64(cond.UID), int64(cond.RID)
	sensors, err := s.repo.GetList(uid, rid)
	if err != nil {
		return nil, err
	}
	return sensors, nil
}

func (s *service) CreateSensor(sensor *CreateSensorRequest) (*SensorDB, error) {
	x := &SensorDB{
		UID:         sensor.UID,
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

func (s *service) UpdateSensor(sensor *UpdateSensorRequest) (*SensorDB, error) {
	if sensor.ID == 0 {
		return nil, errors.New("missing device ID")
	}

	x := &SensorDB{
		ID:          sensor.ID,
		UID:         sensor.UID,
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
