package mcu

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) RegisterRoutes(rg *gin.RouterGroup) {
	mcus := rg.Group("/mcus")
	{
		mcus.POST("/", h.AssignMCU)
		mcus.DELETE("/:mcu_code", h.DeleteMCU)
		mcus.PUT("/firmware", h.FirmwareUpdate)
		mcus.GET("/:mcu_code/available-ports", h.AvailablePort)
	}
}

func (h *Handler) AssignMCU(c *gin.Context) {
	uid := c.GetHeader("X-UID")
	if uid == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "missing X-UID header",
		})
		return
	}
	intUid, err := strconv.ParseInt(uid, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "invalid X-UID",
		})
		return
	}

	var req MCURequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	res, err := h.service.CreateMCU(intUid, &req)
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

func (h *Handler) FirmwareUpdate(c *gin.Context) {
	var req MCURequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	if req.McuCode == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "mcu_code is required",
		})
		return
	}

	if req.FirmwareVersion == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "firmware_version is required",
		})
		return
	}

	res, err := h.service.FirmwareUpdate(&req)

	if err != nil && strings.Contains(err.Error(), "not found") {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

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

func (h *Handler) DeleteMCU(c *gin.Context) {
	mcuCode, err := strconv.Atoi(c.Param("mcu_code"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "invalid MCU id",
		})
		return
	}

	if mcuCode == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "mcu_code is required",
		})
		return
	}

	err = h.service.DeleteMCU(mcuCode)
	if err != nil && strings.Contains(err.Error(), "not found") {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    true,
	})
}

func (h *Handler) AvailablePort(c *gin.Context) {
	mcuCode, err := strconv.Atoi(c.Param("mcu_code"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "invalid MCU id",
		})
		return
	}

	ports, err := h.service.GetAvailablePorts(mcuCode)

	if err != nil && strings.Contains(err.Error(), "not found") {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    ports,
	})
}
