package sensorData

type Service interface {
	CreateData(uid int64, sid int64, value float64, unit string) error
	GetList(uid int64, req *GetListRequest) ([]GetListResponse, int64, error)
	GetOne(uid int64, req *GetOneRequest) (*GetListResponse, error)
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

func (s *service) GetList(uid int64, req *GetListRequest) ([]GetListResponse, int64, error) {
	return s.repo.GetList(uid, req)
}

func (s *service) GetOne(uid int64, req *GetOneRequest) (*GetListResponse, error) {
	return s.repo.GetOne(uid, req)
}
