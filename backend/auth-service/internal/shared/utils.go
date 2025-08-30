package shared

import (
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
