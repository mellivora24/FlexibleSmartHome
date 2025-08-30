package user

import (
	"github.com/mellivora24/flexiblesmarthome/auth-service/internal/shared"
	"github.com/mellivora24/flexiblesmarthome/auth-service/internal/user/model"
	"gorm.io/gorm/utils"
)

type Service interface {
	GetAllUsers() ([]model.GetResponse, error)
	GetUserByID(id string) (*model.GetResponse, error)
	CreateUser(req *model.CreateRequest) (*model.CreateResponse, error)
	UpdateUser(req *model.UpdateRequest) (*model.UpdateResponse, error)
	DeleteUser(req *model.DeleteRequest) (*model.DeleteResponse, error)

	Login(req *model.LoginRequest) (*model.LoginResponse, error)

	CreateAction(req *model.ActionCreate) (*model.ActionCreateResponse, error)
	ListActions(req string) ([]model.ListActionsResponse, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetAllUsers() ([]model.GetResponse, error) {
	users, err := s.repo.FindAll()
	if err != nil {
		return nil, err
	}

	res := make([]model.GetResponse, len(users))
	for i, user := range users {
		res[i] = model.GetResponse{
			ID:        user.ID,
			Name:      user.Name,
			Email:     user.Email,
			CreatedAt: user.CreatedAt,
		}
	}

	return res, nil
}

func (s *service) GetUserByID(id string) (*model.GetResponse, error) {
	uid, err := shared.StringToInt64(id)
	user, err := s.repo.FindByID(uid)
	if err != nil {
		return nil, err
	}

	res := &model.GetResponse{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
	}

	return res, nil
}

func (s *service) CreateUser(req *model.CreateRequest) (*model.CreateResponse, error) {
	if req == nil {
		return nil, shared.ErrInvalidInput
	}
	if req.Name == "" || req.Email == "" || req.Password == "" {
		return nil, shared.ErrInvalidInput
	}

	hashedPwd, err := shared.HashPassword(req.Password)
	if err != nil {
		return nil, shared.ErrInternalServer
	}

	userDB := model.UserDB{
		Name:         req.Name,
		Email:        req.Email,
		HashPassword: hashedPwd,
	}

	created, err := s.repo.Create(&userDB)
	if err != nil {
		return nil, err
	}

	res := &model.CreateResponse{
		ID:        created.ID,
		Name:      created.Name,
		Email:     created.Email,
		CreatedAt: created.CreatedAt,
	}

	return res, nil
}

func (s *service) UpdateUser(req *model.UpdateRequest) (*model.UpdateResponse, error) {
	if req == nil {
		return nil, shared.ErrInvalidInput
	}
	if req.ID == 0 {
		return nil, shared.ErrInvalidInput
	}

	userDB := model.UserDB{
		ID:    req.ID,
		Name:  req.Name,
		Email: req.Email,
	}

	updated, err := s.repo.Update(&userDB)
	if err != nil {
		return nil, err
	}

	res := &model.UpdateResponse{
		ID:    updated.ID,
		Name:  updated.Name,
		Email: updated.Email,
	}

	return res, nil
}

func (s *service) DeleteUser(req *model.DeleteRequest) (*model.DeleteResponse, error) {
	email := req.Email
	err := s.repo.Delete(email)

	if err != nil {
		return nil, err
	}

	res := &model.DeleteResponse{
		MSG: utils.ToString(err),
	}

	return res, nil
}

func (s *service) Login(req *model.LoginRequest) (*model.LoginResponse, error) {
	if req == nil || req.Email == "" || req.Password == "" {
		return nil, shared.ErrInvalidInput
	}

	user, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		return nil, err
	}

	if !shared.CheckPasswordHash(req.Password, user.HashPassword) {
		return nil, shared.ErrUnauthorized
	}

	// TODO: add gen token function
	token := "null"
	res := &model.LoginResponse{
		ID:    user.ID,
		Name:  user.Name,
		Email: user.Email,
		Token: token,
	}

	return res, nil
}

func (s *service) CreateAction(req *model.ActionCreate) (*model.ActionCreateResponse, error) {
	if req == nil {
		return nil, shared.ErrInvalidInput
	}

	action := model.ActionDB{
		UID:  req.UID,
		Type: req.Type,
		Data: req.Data,
	}

	ac, err := s.repo.CreateAction(&action)
	if err != nil {
		return nil, err
	}

	res := &model.ActionCreateResponse{
		ID:       ac.ID,
		CreateAt: ac.CreatedAt,
	}

	return res, nil
}

func (s *service) ListActions(req string) ([]model.ListActionsResponse, error) {
	uid, err := shared.StringToInt64(req)
	if err != nil {
		return nil, shared.ErrInvalidInput
	}

	actions, err := s.repo.FindActionsByUID(uid)

	if err != nil {
		return nil, err
	}

	res := make([]model.ListActionsResponse, len(actions))
	for i, action := range actions {
		res[i] = model.ListActionsResponse{
			ID:        action.ID,
			UID:       action.UID,
			Type:      action.Type,
			Data:      action.Data,
			CreatedAt: action.CreatedAt,
		}
	}

	return res, nil
}
