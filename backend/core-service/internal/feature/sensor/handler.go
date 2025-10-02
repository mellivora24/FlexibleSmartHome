package sensor

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
	sensors := rg.Group("/sensors")
	{
		sensors.GET("/all", h.ListSensors)
		sensors.POST("/create", h.CreateSensor)
		sensors.PUT("/update", h.UpdateSensor)
		sensors.DELETE("/:id", h.DeleteSensor)
	}
}

func (h *Handler) ListSensors(c *gin.Context) {
	uid := c.GetHeader("X-UID")
	if uid == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing X-UID header"})
		return
	}
	intUid, _ := strconv.ParseInt(uid, 10, 64)

	res, err := h.service.ListSensors(intUid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusOK, gin.H{"data": res})
}

func (h *Handler) CreateSensor(c *gin.Context) {
	var req CreateSensorRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	uid := c.GetHeader("X-UID")
	if uid == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing X-UID header"})
		return
	}
	intUid, _ := strconv.ParseInt(uid, 10, 64)

	res, err := h.service.CreateSensor(intUid, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}

	c.JSON(http.StatusOK, gin.H{"data": res})
}

func (h *Handler) UpdateSensor(c *gin.Context) {
	var req UpdateSensorRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	uid := c.GetHeader("X-UID")
	if uid == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing X-UID header"})
		return
	}
	intUid, _ := strconv.ParseInt(uid, 10, 64)

	res, err := h.service.UpdateSensor(intUid, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	
	c.JSON(http.StatusOK, gin.H{"data": res})
}

func (h *Handler) DeleteSensor(c *gin.Context) {
	var req SensorDB
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	err := h.service.DeleteSensor(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusOK, gin.H{"data": true})
}
