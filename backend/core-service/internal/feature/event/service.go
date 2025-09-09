package event

import (
	"encoding/json"
	"time"
)

type Service interface {
	Create(uid int64, did int64, action string, payload json.RawMessage) error
	GetList(cond *GetListRequest) (*GetListResponse, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

// Create user for: add/remove/update device || control
func (s service) Create(uid int64, did int64, action string, payload json.RawMessage) error {
	event := &EventDB{
		UID:       uid,
		DID:       did,
		Action:    action,
		Payload:   payload,
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
