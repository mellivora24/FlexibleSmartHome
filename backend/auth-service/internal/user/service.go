package user

import (
	"fmt"

	"github.com/dgrijalva/jwt-go"
	"github.com/mellivora24/flexiblesmarthome/auth-service/internal/shared"
)

type Service interface {
	GetAllUsers() ([]GetResponse, error)
	GetUserByID(id string) (*GetResponse, error)
	CreateUser(req *CreateRequest) (*CreateResponse, error)
	UpdateUser(req *UpdateRequest) (*UpdateResponse, error)
	DeleteUser(req *DeleteRequest) (*DeleteResponse, error)

	Login(req *LoginRequest) (*LoginResponse, error)

	CreateAction(req *ActionCreate) (*ActionCreateResponse, error)
	ListActions(req string) ([]ListActionsResponse, error)

	VerifyToken(token string) (*VerifyTokenResponse, error)
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

func (s *service) GetAllUsers() ([]GetResponse, error) {
	users, err := s.repo.FindAll()
	if err != nil {
		return nil, err
	}

	res := make([]GetResponse, len(users))
	for i, user := range users {
		res[i] = GetResponse{
			ID:        user.ID,
			Name:      user.Name,
			Email:     user.Email,
			CreatedAt: user.CreatedAt,
		}
	}

	return res, nil
}

func (s *service) GetUserByID(id string) (*GetResponse, error) {
	uid, err := shared.StringToInt64(id)
	user, err := s.repo.FindByID(uid)
	if err != nil {
		return nil, err
	}

	res := &GetResponse{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
	}

	return res, nil
}

func (s *service) CreateUser(req *CreateRequest) (*CreateResponse, error) {
	if req == nil {
		return nil, shared.ErrInvalidInput
	}
	if req.Name == "" || req.Email == "" || req.Password == "" || req.MID == 0 {
		return nil, shared.ErrInvalidInput
	}

	hashedPwd, err := shared.HashPassword(req.Password)
	if err != nil {
		return nil, shared.ErrInternalServer
	}

	userDB := UserDB{
		MID:          req.MID,
		Name:         req.Name,
		Email:        req.Email,
		HashPassword: hashedPwd,
	}

	created, err := s.repo.Create(&userDB)
	if err != nil {
		return nil, err
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": created.ID,
		"mid":     created.MID,
	})

	tokenString, err := token.SignedString([]byte(s.config.JWT_SECRET))
	if err != nil {
		return nil, shared.ErrInternalServer
	}

	res := &CreateResponse{
		ID:        created.ID,
		MID:       created.MID,
		Name:      created.Name,
		Email:     created.Email,
		Token:     tokenString,
		CreatedAt: created.CreatedAt,
	}

	return res, nil
}

func (s *service) UpdateUser(req *UpdateRequest) (*UpdateResponse, error) {
	if req == nil {
		return nil, shared.ErrInvalidInput
	}
	if req.ID == 0 {
		return nil, shared.ErrInvalidInput
	}

	userDB := UserDB{
		ID:    req.ID,
		MID:   req.MID,
		Name:  req.Name,
		Email: req.Email,
	}

	updated, err := s.repo.Update(&userDB)
	if err != nil {
		return nil, err
	}

	res := &UpdateResponse{
		ID:    updated.ID,
		MID:   updated.MID,
		Name:  updated.Name,
		Email: updated.Email,
	}

	return res, nil
}

func (s *service) DeleteUser(req *DeleteRequest) (*DeleteResponse, error) {
	email := req.Email
	err := s.repo.Delete(email)

	if err != nil {
		return nil, err
	}

	res := &DeleteResponse{
		MSG: "deleted successfully",
	}

	return res, nil
}

func (s *service) Login(req *LoginRequest) (*LoginResponse, error) {
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

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"mid":     user.MID,
	})
	tokenString, err := token.SignedString([]byte(s.config.JWT_SECRET))
	if err != nil {
		return nil, shared.ErrInternalServer
	}

	res := &LoginResponse{
		ID:    user.ID,
		MID:   user.MID,
		Name:  user.Name,
		Email: user.Email,
		Token: tokenString,
	}

	return res, nil
}

func (s *service) CreateAction(req *ActionCreate) (*ActionCreateResponse, error) {
	if req == nil {
		return nil, shared.ErrInvalidInput
	}

	action := ActionDB{
		UID:  req.UID,
		Type: req.Type,
		Data: req.Data,
	}

	ac, err := s.repo.CreateAction(&action)
	if err != nil {
		return nil, err
	}

	res := &ActionCreateResponse{
		ID:       ac.ID,
		CreateAt: ac.CreatedAt,
	}

	return res, nil
}

func (s *service) ListActions(req string) ([]ListActionsResponse, error) {
	uid, err := shared.StringToInt64(req)
	if err != nil {
		return nil, shared.ErrInvalidInput
	}

	actions, err := s.repo.FindActionsByUID(uid)

	if err != nil {
		return nil, err
	}

	res := make([]ListActionsResponse, len(actions))
	for i, action := range actions {
		res[i] = ListActionsResponse{
			ID:        action.ID,
			UID:       action.UID,
			Type:      action.Type,
			Data:      action.Data,
			CreatedAt: action.CreatedAt,
		}
	}

	return res, nil
}

func (s *service) VerifyToken(tokenString string) (*VerifyTokenResponse, error) {
	var tokenInvalid VerifyTokenResponse
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

	userID, ok := claims["user_id"].(float64)
	if !ok {
		return &tokenInvalid, nil
	}
	mid, _ := claims["mid"].(float64)

	user, err := s.repo.FindByID(int64(userID))
	if err != nil {
		return &tokenInvalid, nil
	}

	res := &VerifyTokenResponse{
		UID:     user.ID,
		MID:     int64(mid),
		IsValid: true,
	}

	return res, nil
}
