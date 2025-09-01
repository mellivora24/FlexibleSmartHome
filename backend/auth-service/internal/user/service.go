package user

import (
	"fmt"

	"github.com/dgrijalva/jwt-go"
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

	VerifyToken(token string) (*model.VerifyTokenResponse, error)
}

type service struct {
	repo   Repository
	config shared.SERVER_CONFIG
}

func NewService(repo Repository, config shared.SERVER_CONFIG) Service {
	return &service{
		repo:   repo,
		config: config,
	}
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

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{"user_id": user.ID})
	tokenString, err := token.SignedString([]byte(s.config.JWT_SECRET))
	if err != nil {
		return nil, shared.ErrInternalServer
	}

	res := &model.LoginResponse{
		ID:    user.ID,
		Name:  user.Name,
		Email: user.Email,
		Token: tokenString,
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

func (s *service) VerifyToken(tokenString string) (*model.VerifyTokenResponse, error) {
	tokenInvalid := model.VerifyTokenResponse{
		UID:     -1,
		IsValid: false,
	}

	if tokenString == "" {
		return nil, shared.ErrInvalidInput
	}

	parsed, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return []byte(s.config.JWT_SECRET), nil
	})
	if err != nil {
		return &tokenInvalid, nil
	}

	claims, ok := parsed.Claims.(jwt.MapClaims)
	if !ok || !parsed.Valid {
		return &tokenInvalid, nil
	}

	userID, ok := claims["user_id"].(float64) // JWT numeric => float64
	if !ok {
		return &tokenInvalid, nil
	}

	user, err := s.repo.FindByID(int64(uint(userID)))
	if err != nil {
		return &tokenInvalid, nil
	}

	res := &model.VerifyTokenResponse{
		UID:     user.ID,
		IsValid: true,
	}

	return res, nil
}
