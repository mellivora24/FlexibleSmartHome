package room

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) RegisterRoutes(rg *gin.RouterGroup) {
	room := rg.Group("/room")
	{
		room.GET("/infor", h.GetRoom)
		room.POST("/create", h.CreateRoom)
	}
}

func (h *Handler) GetRoom(c *gin.Context) {
	var cond GetRequest
	if err := c.ShouldBindJSON(&cond); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	room, err := h.service.GetRoomInfor(&cond)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusOK, gin.H{"data": room})
}

func (h *Handler) CreateRoom(c *gin.Context) {
	var infor CreateRequest
	if err := c.ShouldBindJSON(&infor); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	room, err := h.service.CreateRoom(&infor)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusOK, gin.H{"data": room})
}
