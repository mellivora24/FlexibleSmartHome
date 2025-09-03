package event

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
	event := &EventDB{
		UID:       cond.UID,
		DID:       cond.DID,
		Action:    cond.Action,
		Payload:   cond.Payload,
		CreatedAt: time.Now(),
	}

	return s.repo.CreateEvent(event)
}

func (s service) GetList(cond *GetListRequest) (*GetListResponse, error) {
	events, total, err := s.repo.GetList(cond.UID, cond.Page, cond.Limit)
	if err != nil {
		return nil, err
	}

	result := &GetListResponse{
		Total: total,
		List:  events,
	}
	return result, nil
}
