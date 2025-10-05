package user

import (
	"net/http"
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
	user := rg.Group("/users")
	{
		user.POST("/login", h.Login)
		user.POST("/register", h.Register)

		user.PUT("/:id", h.UpdateUser)
		user.DELETE("/:email", h.DeleteUser)
	}

	//action := rg.Group("/actions")
	//{
	//	action.GET("/list/:uid", h.ListActions)
	//}

	verify := rg.Group("/verify")
	{
		verify.POST("/", h.VerifyToken)
	}
}

//func (h *Handler) GetAllUsers(c *gin.Context) {
//	res, err := h.service.GetAllUsers()
//	if err != nil {
//		c.JSON(http.StatusInternalServerError, gin.H{"error": "can't get users"})
//		return
//	}
//	if len(res) == 0 {
//		c.JSON(http.StatusNotFound, gin.H{"error": "no users found"})
//		return
//	}
//	c.JSON(http.StatusOK, gin.H{"data": res})
//}
//
//func (h *Handler) GetUserByID(c *gin.Context) {
//	id := c.Param("id")
//	res, err := h.service.GetUserByID(id)
//	if err != nil {
//		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
//		return
//	}
//	c.JSON(http.StatusOK, gin.H{"data": res})
//}

func (h *Handler) Register(c *gin.Context) {
	var userCreate CreateRequest
	if err := c.ShouldBindJSON(&userCreate); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	res, err := h.service.CreateUser(&userCreate)
	if err != nil {
		if strings.Contains(err.Error(), "record already exists") {
			c.JSON(http.StatusConflict, gin.H{"error": "user already exists"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "can't create user"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": res})
}

func (h *Handler) UpdateUser(c *gin.Context) {
	var userUpdate UpdateRequest
	if err := c.ShouldBindJSON(&userUpdate); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	res, err := h.service.UpdateUser(&userUpdate)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": res})
}

func (h *Handler) DeleteUser(c *gin.Context) {
	email := c.Param("email")
	userDelete := DeleteRequest{Email: email}
	res, err := h.service.DeleteUser(&userDelete)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": res})
}

func (h *Handler) Login(c *gin.Context) {
	var userLogin LoginRequest
	if err := c.ShouldBindJSON(&userLogin); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	res, err := h.service.Login(&userLogin)
	if err != nil {
		if strings.Contains(err.Error(), "unauthorized") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid email or password"})
			return
		}
		if strings.Contains(err.Error(), "record not found") {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": res})
}

//func (h *Handler) ListActions(c *gin.Context) {
//	res, err := h.service.ListActions(c.Param("uid"))
//	if err != nil {
//		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
//		return
//	}
//	if len(res) == 0 {
//		c.JSON(http.StatusNotFound, gin.H{"error": "no actions found"})
//		return
//	}
//	c.JSON(http.StatusOK, gin.H{"data": res})
//}

func (h *Handler) VerifyToken(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Authorization header required"})
		return
	}

	parts := strings.SplitN(authHeader, " ", 2)
	if len(parts) != 2 || parts[0] != "Bearer" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Authorization header format"})
		return
	}
	token := parts[1]

	res, err := h.service.VerifyToken(token)
	if err != nil {
		if strings.Contains(err.Error(), "expired") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "token expired"})
			return
		}
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": res})
}
