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
	{
		sensorDataGroup.GET("", h.ListSensorData)
		sensorDataGroup.GET("/:id", h.GetOneSensorData)
	}
}

func (h *Handler) ListSensorData(c *gin.Context) {
	uid := c.GetHeader("X-UID")
	if uid == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   "missing X-UID header",
		})
		return
	}
	intUid, _ := strconv.ParseInt(uid, 10, 64)

	var req GetListRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	resp, err := h.service.GetList(intUid, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    resp,
	})
}

func (h *Handler) GetOneSensorData(c *gin.Context) {
	uid := c.GetHeader("X-UID")
	if uid == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   "missing X-UID header",
		})
		return
	}
	intUid, _ := strconv.ParseInt(uid, 10, 64)

	var req GetOneRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	data, err := h.service.GetOne(intUid, &req)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    data,
	})
}
