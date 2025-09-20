package log

import (
	"encoding/json"
	"time"
)

type Service interface {
	Create(uid int64, level string, message string, metadata json.RawMessage) error
	GetList(uid int64, req *GetListRequest) (*GetListResponse, error)
	GetOne(uid int64, req *GetOneRequest) (*LogDB, error)
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

func (s service) GetList(uid int64, req *GetListRequest) (*GetListResponse, error) {
	logs, total, err := s.repo.GetList(uid, req)
	if err != nil {
		return nil, err
	}
	return &GetListResponse{Total: total, List: logs}, nil
}

func (s service) GetOne(uid int64, req *GetOneRequest) (*LogDB, error) {
	return s.repo.GetOne(uid, req)
}
