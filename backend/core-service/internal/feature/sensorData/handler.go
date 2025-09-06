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
	rg.GET("/list", h.ListSensorData)
}

func (h *Handler) ListSensorData(c *gin.Context) {
	uidPr, sidPr := c.Query("uid"), c.Query("sid")

	if uidPr == "" && sidPr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "uid or sid must be provided"})
		return
	}

	if uidPr != "" {
		uid, err := strconv.ParseInt(uidPr, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": "invalid uid"})
			return
		}

		res, err := h.service.GetDataByUID(int(uid))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": res})
		return
	}

	sid, err := strconv.ParseInt(sidPr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "invalid sid"})
		return
	}

	res, err := h.service.GetDataBySID(int(sid))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": res})
}
