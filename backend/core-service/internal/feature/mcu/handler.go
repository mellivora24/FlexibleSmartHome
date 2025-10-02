package mcu

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
	mcu := rg.Group("/mcus")
	{
		mcu.POST("/create", h.AssignMCU)
		mcu.DELETE("/delete/:id", h.DeleteMCU)
		mcu.PUT("/firmwareUpdate", h.FirmwareUpdate)
		mcu.GET("/availablePorts/:id", h.AvailablePort)
	}
}

func (h *Handler) AssignMCU(c *gin.Context) {
	uid := c.GetHeader("X-UID")
	if uid == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing X-UID header"})
		return
	}
	intUid, _ := strconv.ParseInt(uid, 10, 64)

	var req CreateMCURequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	res, err := h.service.CreateMCU(intUid, &req)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}

	c.JSON(http.StatusCreated, gin.H{"data": res})
}

func (h *Handler) FirmwareUpdate(c *gin.Context) {
	var req FirmwareUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	res, err := h.service.FirmwareUpdate(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}

	c.JSON(http.StatusCreated, gin.H{"data": res})
}

func (h *Handler) DeleteMCU(c *gin.Context) {
	mid, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	if err := h.service.DeleteMCU(mid); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusNoContent, gin.H{"data": true})
}

func (h *Handler) AvailablePort(c *gin.Context) {
	mid, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	ports, err := h.service.GetAvailablePorts(mid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusOK, gin.H{"data": ports})
}
