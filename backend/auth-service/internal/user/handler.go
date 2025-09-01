package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mellivora24/flexiblesmarthome/auth-service/internal/user/model"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) RegisterRoutes(rg *gin.RouterGroup) {
	user := rg.Group("/users")
	{
		user.GET("/", h.GetAllUsers)
		user.GET("/:id", h.GetUserByID)
		user.POST("/", h.CreateUser)
		user.PUT("/:id", h.UpdateUser)
		user.DELETE("/:email", h.DeleteUser)
		user.POST("/login", h.Login)
	}

	action := rg.Group("/actions")
	{
		action.POST("/", h.CreateAction)
		action.GET("/list/:uid", h.ListActions)
	}

	verify := rg.Group("/verify")
	{
		verify.POST("/", h.VerifyToken)
	}
}

func (h *Handler) GetAllUsers(c *gin.Context) {
	res, err := h.service.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": res})
}

func (h *Handler) GetUserByID(c *gin.Context) {
	id := c.Param("id")
	res, err := h.service.GetUserByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusOK, gin.H{"data": res})
}

func (h *Handler) CreateUser(c *gin.Context) {
	var userCreate model.CreateRequest
	if err := c.ShouldBindJSON(&userCreate); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	res, err := h.service.CreateUser(&userCreate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusOK, gin.H{"data": res})
}

func (h *Handler) UpdateUser(c *gin.Context) {
	var userUpdate model.UpdateRequest
	if err := c.ShouldBindJSON(&userUpdate); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	res, err := h.service.UpdateUser(&userUpdate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusOK, gin.H{"data": res})
}

func (h *Handler) DeleteUser(c *gin.Context) {
	email := c.Param("email")
	userDelete := model.DeleteRequest{Email: email}
	res, err := h.service.DeleteUser(&userDelete)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusOK, gin.H{"data": res})
}

func (h *Handler) Login(c *gin.Context) {
	var userLogin model.LoginRequest
	if err := c.ShouldBindJSON(&userLogin); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	res, err := h.service.Login(&userLogin)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusOK, gin.H{"data": res})
}

func (h *Handler) CreateAction(c *gin.Context) {
	var action model.ActionCreate
	if err := c.ShouldBindJSON(&action); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	res, err := h.service.CreateAction(&action)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusOK, gin.H{"data": res})
}

func (h *Handler) ListActions(c *gin.Context) {
	res, err := h.service.ListActions(c.Param("uid"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	c.JSON(http.StatusOK, gin.H{"data": res})
}

func (h *Handler) VerifyToken(c *gin.Context) {
	token := c.Query("token")
	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "token required"})
	}

	res, err := h.service.VerifyToken(token)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
	
	c.JSON(http.StatusOK, gin.H{"data": res})
}
