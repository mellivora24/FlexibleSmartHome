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
		sensorDataGroup.GET("/", h.ListSensorData)
		sensorDataGroup.GET("/:id", h.GetOneSensorData)
		sensorDataGroup.GET("/list/:did", h.GetListByDID)
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

func (h *Handler) GetListByDID(c *gin.Context) {
	didStr := c.Param("did")
	limitStr := c.Query("limit")

	did, err := strconv.ParseInt(didStr, 10, 64)
	if err != nil || did <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "invalid device ID",
		})
		return
	}

	limit, err := strconv.ParseInt(limitStr, 10, 64)
	if err != nil || limit <= 0 {
		limit = 10
	}

	records, err := h.service.GetListByDID(did, int(limit))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    records,
	})
}
