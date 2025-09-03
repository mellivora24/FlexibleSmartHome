package notification

import "time"

type Service interface {
	Create(cond *CreateRequest) error
	GetList(cond *GetListRequest) (*GetListResponse, error)
	Update(id int) (*NotificationDB, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s service) Create(cond *CreateRequest) error {
	noti := &NotificationDB{
		UID:       cond.UID,
		Type:      cond.Type,
		Message:   cond.Message,
		Metadata:  cond.Metadata,
		IsRead:    false,
		CreatedAt: time.Now(),
	}

	return s.repo.CreateNoti(noti)
}

func (s service) GetList(cond *GetListRequest) (*GetListResponse, error) {
	notifications, total, err := s.repo.GetList(cond.UID, cond.Page, cond.Limit)
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
