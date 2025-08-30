package user

import (
	"github.com/gin-gonic/gin"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) RegisterRoutes(rg *gin.RouterGroup) {
	_ = rg.Group("/users")
	{
		// TODO: add api endpoint here, replace = by :=
	}
}

// TODO: mapping endpoint to service here
