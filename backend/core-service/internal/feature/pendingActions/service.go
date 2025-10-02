package pendingActions

import "time"

type Service interface {
	CreatePendingAction(uid int64, mid int64, action string) error
	UpdatePendingAction(uid int64, mid int64, time time.Time) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) CreatePendingAction(uid int64, mid int64, action string) error {
	pendingAction := &PendingAction{
		UID:       uid,
		MID:       mid,
		Action:    action,
		Status:    "pending",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	return s.repo.Create(pendingAction)
}

func (s *service) UpdatePendingAction(uid int64, mid int64, timestamp time.Time) error {
	actions, err := s.repo.Update(uid, mid, timestamp)
	if err != nil {
		return err
	}
	if len(actions) == 0 {
		return nil
	}
	return nil
}
