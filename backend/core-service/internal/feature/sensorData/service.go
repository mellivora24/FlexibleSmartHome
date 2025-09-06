package sensorData

type Service interface {
	CreateData(uid int64, sid int64, value float64, unit string) error

	GetDataByUID(uid int) ([]GetListResponse, error)
	GetDataBySID(uid int) ([]GetListResponse, error)
}

type service struct {
	repo Repository
}

func NewService(repository Repository) Service {
	return &service{repo: repository}
}

func (s *service) CreateData(uid int64, sid int64, value float64, unit string) error {
	record := SensorDataDB{
		UID:   uid,
		SID:   sid,
		Value: value,
		Unit:  unit,
	}

	return s.repo.CreateRecord(&record)
}

func (s *service) GetDataByUID(uid int) ([]GetListResponse, error) {
	return s.repo.GetListByUID(int64(uid))
}

func (s *service) GetDataBySID(sid int) ([]GetListResponse, error) {
	return s.repo.GetListBySID(int64(sid))
}
