package room

import "time"

type Service interface {
	GetRoom(uid int64) ([]RoomDB, error)
	CreateRoom(uid int64, room *CreateRequest) (*RoomDB, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetRoom(uid int64) ([]RoomDB, error) {
	rooms, err := s.repo.GetList(uid)
	if err != nil {
		return nil, err
	}
	return rooms, nil
}

func (s *service) CreateRoom(uid int64, room *CreateRequest) (*RoomDB, error) {
	a := &RoomDB{
		UID:         uid,
		Name:        room.Name,
		Description: room.Description,
		CreatedAt:   time.Now(),
	}

	r, err := s.repo.Create(a)
	if err != nil {
		return nil, err
	}
	return r, nil
}
