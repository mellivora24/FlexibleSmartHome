package notification

import (
	"encoding/json"
	"time"
)

type Service interface {
	Create(uid int64, t string, message string, metadata json.RawMessage) error
	GetList(uid int64, cond *GetListRequest) (*GetListResponse, error)
	Update(id int) (*NotificationDB, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s service) Create(uid int64, t string, message string, metadata json.RawMessage) error {
	noti := &NotificationDB{
		UID:       uid,
		Type:      t,
		Message:   message,
		Metadata:  metadata,
		IsRead:    false,
		CreatedAt: time.Now(),
	}

	return s.repo.CreateNoti(noti)
}

func (s service) GetList(uid int64, cond *GetListRequest) (*GetListResponse, error) {
	notifications, total, err := s.repo.GetList(uid, cond)
	if err != nil {
		return nil, err
	}

	result := &GetListResponse{
		Total: total,
		List:  notifications,
	}
	return result, nil
}

func (s service) Update(id int) (*NotificationDB, error) {
	return s.repo.UpdateNoti(int64(id))
}
