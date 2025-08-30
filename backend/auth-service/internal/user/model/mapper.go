package model

func ToUserDTO(u UserDB) User {
	return User{
		ID:        u.ID,
		Name:      u.Name,
		Email:     u.Email,
		CreatedAt: u.CreatedAt,
	}
}

func ToActionDTO(a ActionDB) Action {
	return Action{
		ID:        a.ID,
		UID:       a.UID,
		Type:      a.Type,
		Data:      a.Data,
		CreatedAt: a.CreatedAt,
	}
}
