package event

import (
	"encoding/json"
	"time"
)

type Service interface {
	Create(uid int64, did int64, action string, payload json.RawMessage) error
	GetList(uid int64, req *GetListRequest) (*GetListResponse, error)
	GetOne(uid int64, req *GetOneRequest) (*EventResponse, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

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

func (s service) GetList(uid int64, req *GetListRequest) (*GetListResponse, error) {
	events, total, err := s.repo.GetList(uid, req)
	if err != nil {
		return nil, err
	}
	return &GetListResponse{Total: total, List: events}, nil
}

func (s service) GetOne(uid int64, req *GetOneRequest) (*EventResponse, error) {
	return s.repo.GetOne(uid, req)
}
