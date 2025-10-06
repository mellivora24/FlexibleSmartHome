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
		sensors.GET("/", h.ListSensors)
		sensors.POST("/", h.CreateSensor)
		sensors.PUT("/:id", h.UpdateSensor)
		sensors.DELETE("/:id", h.DeleteSensor)
	}
}

func (h *Handler) ListSensors(c *gin.Context) {
	uid := c.GetHeader("X-UID")
	if uid == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   "missing X-UID header",
		})
		return
	}

	intUid, _ := strconv.ParseInt(uid, 10, 64)

	res, err := h.service.ListSensors(intUid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    res,
	})
}

func (h *Handler) CreateSensor(c *gin.Context) {
	var req CreateSensorRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	uid := c.GetHeader("X-UID")
	if uid == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   "missing X-UID header",
		})
		return
	}
	intUid, _ := strconv.ParseInt(uid, 10, 64)

	res, err := h.service.CreateSensor(intUid, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data":    res,
	})
}

func (h *Handler) UpdateSensor(c *gin.Context) {
	var req UpdateSensorRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	uid := c.GetHeader("X-UID")
	if uid == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   "missing X-UID header",
		})
		return
	}
	intUid, _ := strconv.ParseInt(uid, 10, 64)

	res, err := h.service.UpdateSensor(intUid, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    res,
	})
}

func (h *Handler) DeleteSensor(c *gin.Context) {
	idParam := c.Param("id")
	if idParam == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "missing sensor id",
		})
		return
	}

	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "invalid sensor id",
		})
		return
	}

	err = h.service.DeleteSensor(&SensorDB{ID: id})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    nil,
	})
}
