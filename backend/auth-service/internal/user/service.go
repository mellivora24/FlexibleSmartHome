package user

type Service interface {
	// TODO: add method define here
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

// TODO: Implement method below
