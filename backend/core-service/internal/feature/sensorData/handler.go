package sensorData

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
	sensorDataGroup := rg.Group("/sensor-data")
	sensorDataGroup.GET("/all", h.ListSensorData)
	sensorDataGroup.GET("/one", h.GetOneSensorData)
}

func (h *Handler) ListSensorData(c *gin.Context) {
	uid := c.GetHeader("X-UID")
	if uid == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing X-UID header"})
		return
	}
	intUid, _ := strconv.ParseInt(uid, 10, 64)

	var req GetListRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	resp, err := h.service.GetList(intUid, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

func (h *Handler) GetOneSensorData(c *gin.Context) {
	uid := c.GetHeader("X-UID")
	if uid == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing X-UID header"})
		return
	}
	intUid, _ := strconv.ParseInt(uid, 10, 64)

	var req GetOneRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	data, err := h.service.GetOne(intUid, &req)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, data)
}
