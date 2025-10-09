package sensorData

type Service interface {
	Create(uid, did int64, value float64, unit string) error
	GetList(uid int64, req *GetListRequest) (*GetListResponse, error)
	GetOne(uid int64, req *GetOneRequest) (*SensorDataItem, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s service) Create(uid, did int64, value float64, unit string) error {
	record := &SensorDataDB{
		UID:   uid,
		DID:   did,
		Value: value,
		Unit:  unit,
	}
	return s.repo.CreateRecord(record)
}

func (s service) GetList(uid int64, req *GetListRequest) (*GetListResponse, error) {
	items, total, err := s.repo.GetList(uid, req)
	if err != nil {
		return nil, err
	}
	return &GetListResponse{
		Total: total,
		List:  items,
	}, nil
}

func (s service) GetOne(uid int64, req *GetOneRequest) (*SensorDataItem, error) {
	return s.repo.GetOne(uid, req)
}
