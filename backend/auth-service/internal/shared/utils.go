package shared

import (
	"strconv"
	"strings"

	"github.com/mellivora24/flexiblesmarthome/auth-service/internal/user/model"
)

func ToUserDTO(u model.UserDB) *model.User {
	return &model.User{
		ID:        u.ID,
		Name:      u.Name,
		Email:     u.Email,
		CreatedAt: u.CreatedAt,
	}
}

func ToUserDTOs(users []model.UserDB) []*model.User {
	res := make([]*model.User, len(users))
	for i, u := range users {
		res[i] = ToUserDTO(u)
	}
	return res
}

func ToActionDTO(a model.ActionDB) *model.Action {
	return &model.Action{
		ID:        a.ID,
		UID:       a.UID,
		Type:      a.Type,
		Data:      a.Data,
		CreatedAt: a.CreatedAt,
	}
}

func ToActionDTOs(actions []model.ActionDB) []*model.Action {
	res := make([]*model.Action, len(actions))
	for i, a := range actions {
		res[i] = ToActionDTO(a)
	}
	return res
}

func StringToInt64(str string) (int64, error) {
	if strings.TrimSpace(str) == "" {
		return 0, ErrcanparseidEmpytystring
	}

	num, err := strconv.ParseInt(str, 10, 64)
	if err != nil {
		return 0, err
	}

	return num, nil
}
