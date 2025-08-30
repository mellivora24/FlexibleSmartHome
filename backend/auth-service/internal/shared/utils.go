package shared

import (
	"github.com/mellivora24/flexiblesmarthome/auth-service/internal/user/model"
)

func ToUserDTO(u model.UserDB) model.User {
	return model.User{
		ID:        u.ID,
		Name:      u.Name,
		Email:     u.Email,
		CreatedAt: u.CreatedAt,
	}
}

func ToActionDTO(a model.ActionDB) model.Action {
	return model.Action{
		ID:        a.ID,
		UID:       a.UID,
		Type:      a.Type,
		Data:      a.Data,
		CreatedAt: a.CreatedAt,
	}
}
