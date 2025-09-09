package log

import (
	"encoding/json"
	"time"
)

type Service interface {
	Create(uid int64, level string, message string, metadata json.RawMessage) error
	GetList(cond *GetListRequest) (*GetListResponse, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s service) Create(uid int64, level string, message string, metadata json.RawMessage) error {
	log := &LogDB{
		UID:       uid,
		Level:     level,
		Message:   message,
		Metadata:  metadata,
		CreatedAt: time.Now(),
	}

	return s.repo.CreateLog(log)
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
