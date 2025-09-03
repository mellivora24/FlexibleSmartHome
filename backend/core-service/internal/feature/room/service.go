package room

import "time"

type Service interface {
	GetRoomInfor(cond *GetRequest) (*RoomDB, error)
	CreateRoom(infor *CreateRequest) (*RoomDB, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetRoomInfor(cond *GetRequest) (*RoomDB, error) {
	id, uid := int64(cond.ID), int64(cond.UID)
	room, err := s.repo.GetByID(id, uid)
	if err != nil {
		return nil, err
	}
	return room, nil
}

func (s *service) CreateRoom(infor *CreateRequest) (*RoomDB, error) {
	a := &RoomDB{
		UID:         int64(infor.UID),
		Name:        infor.Name,
		Description: infor.Description,
		CreatedAt:   time.Now(),
	}

	room, err := s.repo.Create(a)
	if err != nil {
		return nil, err
	}
	return room, nil
}
