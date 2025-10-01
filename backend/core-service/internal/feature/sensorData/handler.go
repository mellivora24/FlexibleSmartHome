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
	sensorDataGroup.POST("/:uid", h.CreateSensorData)
	sensorDataGroup.GET("/:uid", h.ListSensorData)
	sensorDataGroup.GET("/:uid/one", h.GetOneSensorData)
}

func (h *Handler) CreateSensorData(c *gin.Context) {
	uidStr := c.Param("uid")
	uid, _ := strconv.ParseInt(uidStr, 10, 64)

	var req struct {
		SID   int64   `json:"sid"`
		Value float64 `json:"value"`
		Unit  string  `json:"unit"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.Create(uid, req.SID, req.Value, req.Unit); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "created"})
}

func (h *Handler) ListSensorData(c *gin.Context) {
	uidStr := c.Param("uid")
	uid, _ := strconv.ParseInt(uidStr, 10, 64)

	var req GetListRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	resp, err := h.service.GetList(uid, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

func (h *Handler) GetOneSensorData(c *gin.Context) {
	uidStr := c.Param("uid")
	uid, _ := strconv.ParseInt(uidStr, 10, 64)

	var req GetOneRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	data, err := h.service.GetOne(uid, &req)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, data)
}
