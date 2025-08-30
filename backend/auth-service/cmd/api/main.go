package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/mellivora24/flexiblesmarthome/auth-service/internal/shared"
	"github.com/mellivora24/flexiblesmarthome/auth-service/internal/user"
	"gorm.io/gorm"
)

func main() {
	cfg, err := shared.LoadConfig()
	if err != nil {
		log.Fatalf("cannot load config: %v", err)
		return
	}

	var db *gorm.DB
	db, err = shared.InitDatabase(cfg.Database)
	if err != nil {
		log.Fatalf("cannot connect database: %v", err)
		return
	}

	userRepo := user.NewRepository(db)
	userService := user.NewService(userRepo, cfg.Server)
	userHandler := user.NewHandler(userService)

	router := gin.Default()

	api := router.Group(cfg.Server.BASE_PATH)
	{
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "Auth service is working"})
		})

		userHandler.RegisterRoutes(api)
	}

	addr := fmt.Sprintf("%s:%d", cfg.Server.HOST, cfg.Server.PORT)
	if err := router.Run(addr); err != nil {
		log.Fatalf("cannot run server: %v", err)
	}
}
