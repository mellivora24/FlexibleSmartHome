package user

import (
	"encoding/json"
	"fmt"
	"time"

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
	if err != nil {
		return nil, shared.ErrInvalidInput
	}

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
	if req.Name == "" || req.Email == "" || req.Password == "" || req.McuCode == 0 {
		return nil, shared.ErrInvalidInput
	}

	hashedPwd, err := shared.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	userDB := UserDB{
		McuCode:      req.McuCode,
		Name:         req.Name,
		Email:        req.Email,
		HashPassword: hashedPwd,
	}

	created, err := s.repo.Create(&userDB)
	if err != nil {
		return nil, err
	}

	// JWT với mcu_code
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":  created.ID,
		"mcu_code": created.McuCode,
	})

	tokenString, err := token.SignedString([]byte(s.config.JWT_SECRET))
	if err != nil {
		return nil, err
	}

	action := ActionDB{
		UID:  created.ID,
		Type: "create_user",
		Data: json.RawMessage([]byte(fmt.Sprintf("User %s created", created.Email))),
	}

	_, _ = s.repo.CreateAction(&action)

	res := &CreateResponse{
		ID:        created.ID,
		McuCode:   created.McuCode,
		Name:      created.Name,
		Email:     created.Email,
		Token:     tokenString,
		CreatedAt: created.CreatedAt,
	}

	return res, nil
}

func (s *service) UpdateUser(req *UpdateRequest) (*UpdateResponse, error) {
	user, err := s.repo.UpdateUser(req)
	if err != nil {
		return nil, err
	}

	res := &UpdateResponse{
		ID:      user.ID,
		McuCode: user.McuCode,
		Name:    user.Name,
		Email:   user.Email,
	}
	return res, nil
}

func (s *service) DeleteUser(req *DeleteRequest) (*DeleteResponse, error) {
	if req == nil || req.Email == "" {
		return nil, shared.ErrInvalidInput
	}

	err := s.repo.Delete(req.Email)
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
		"user_id":  user.ID,
		"mcu_code": user.McuCode,
	})

	tokenString, err := token.SignedString([]byte(s.config.JWT_SECRET))
	if err != nil {
		return nil, shared.ErrInternalServer
	}

	action := ActionDB{
		UID:       user.ID,
		Type:      "login",
		Data:      json.RawMessage(fmt.Sprintf(`"%s"`, fmt.Sprintf("User %s logged in", user.Email))),
		CreatedAt: time.Now(),
	}

	_, _ = s.repo.CreateAction(&action)

	res := &LoginResponse{
		ID:      user.ID,
		McuCode: user.McuCode,
		Name:    user.Name,
		Email:   user.Email,
		Token:   tokenString,
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
	mcuCode, _ := claims["mcu_code"].(float64)

	user, err := s.repo.FindByID(int64(userID))
	if err != nil || user == nil {
		return &tokenInvalid, nil
	}

	if mcuCode <= 0 {
		return &tokenInvalid, nil
	}

	res := &VerifyTokenResponse{
		UID:     user.ID,
		McuCode: int(mcuCode),
		IsValid: true,
	}
	return res, nil
}
