package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/mellivora24/flexiblesmarthome/auth-service/internal/shared"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, skip...")
		return
	}

	cfg, err := shared.LoadConfig()
	if err != nil {
		log.Fatalf("cannot load config: %v", err)
		return
	}

	_, err = shared.InitDatabase(cfg.Database)
	if err != nil {
		log.Fatalf("cannot connect database: %v", err)
		return
	}

	router := gin.Default()
	api := router.Group(cfg.Server.BASE_PATH)
	{
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "Auth service is working"})
		})
	}

	addr := fmt.Sprintf("%s:%d", cfg.Server.HOST, cfg.Server.PORT)
	if err := router.Run(addr); err != nil {
		log.Fatalf("cannot run server: %v", err)
	}
}
