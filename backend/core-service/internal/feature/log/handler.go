package log

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
	log := rg.Group("/logs")
	{
		log.GET("/list", h.GetListLogs)
		log.GET("/get", h.GetLog)
	}
}

func (h *Handler) GetListLogs(c *gin.Context) {
	var req GetListRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	uid := c.GetHeader("X-UID")
	if uid == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing X-UID header"})
		return
	}
	intUid, _ := strconv.ParseInt(uid, 10, 64)

	res, err := h.service.GetList(intUid, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, res)
}

func (h *Handler) GetLog(c *gin.Context) {
	var req GetOneRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	uid := c.GetHeader("X-UID")
	if uid == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing X-UID header"})
		return
	}
	intUid, _ := strconv.ParseInt(uid, 10, 64)

	log, err := h.service.GetOne(intUid, &req)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": log})
}
