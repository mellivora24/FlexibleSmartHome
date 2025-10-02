package room

import (
	"net/http"
	"strconv"

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
	uid := c.GetHeader("X-UID")
	if uid == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing X-UID header"})
		return
	}
	intUid, _ := strconv.ParseInt(uid, 10, 64)

	room, err := h.service.GetRoom(intUid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}

	c.JSON(http.StatusOK, gin.H{"data": room})
}

func (h *Handler) CreateRoom(c *gin.Context) {
	var room CreateRequest
	if err := c.ShouldBindJSON(&room); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	uid := c.GetHeader("X-UID")
	if uid == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing X-UID header"})
		return
	}
	intUid, _ := strconv.ParseInt(uid, 10, 64)

	r, err := h.service.CreateRoom(intUid, &room)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusOK, gin.H{"data": r})
}
