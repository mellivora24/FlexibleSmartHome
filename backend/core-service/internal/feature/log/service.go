package log

import "time"

type Service interface {
	Create(cond *CreateRequest) error
	GetList(cond *GetListRequest) (*GetListResponse, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s service) Create(cond *CreateRequest) error {
	log := &LogDB{
		UID:       cond.UID,
		Level:     cond.Level,
		Message:   cond.Message,
		Metadata:  cond.Metadata,
		CreatedAt: time.Now(),
	}

	return s.repo.CreateEvent(log)
}

func (s service) GetList(cond *GetListRequest) (*GetListResponse, error) {
	logs, total, err := s.repo.GetList(cond.UID, cond.Page, cond.Limit)
	if err != nil {
		return nil, err
	}

	result := &GetListResponse{
		Total: total,
		List:  logs,
	}
	return result, nil
}
