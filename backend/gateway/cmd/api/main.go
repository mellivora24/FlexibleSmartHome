package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/mellivora24/flexiblesmarthome/gateway/internal/auth"
	"github.com/mellivora24/flexiblesmarthome/gateway/internal/middleware"
	"github.com/mellivora24/flexiblesmarthome/gateway/internal/proxy"
	"github.com/mellivora24/flexiblesmarthome/gateway/internal/shared"
)

func main() {
	cfg, err := shared.LoadConfig()
	if err != nil {
		panic(err)
	}

	authToken := auth.NewService(cfg.AuthService.VerifyPath)
	authProxy := proxy.NewAuthProxy(cfg.AuthService.BasePath)
	coreProxy := proxy.NewCoreProxy(cfg.CoreService.URL, cfg.CoreService.WS_URL)

	gin.SetMode(gin.ReleaseMode)
	r := gin.New()

	// Middleware
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(middleware.CORSMiddleware(
		cfg.CORS.AllowedOrigins,
		cfg.CORS.AllowedMethods,
		cfg.CORS.AllowedHeaders,
	))

	api := r.Group(cfg.Server.BasePath)
	{
		api.GET("/", func(c *gin.Context) {
			c.JSON(200, gin.H{"server": "Running"})
		})

		authGroup := api.Group("/auth")
		{
			authGroup.Any("/*path", authProxy.ProxyRequest)
		}
	}
	api.Use(middleware.AuthMiddleware(authToken))
	{
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"status":  "healthy",
				"service": "gateway",
			})
		})

		api.GET("/ws", coreProxy.ProxyWebSocket)

		coreGroup := api.Group("/core")
		{
			coreGroup.Any("/*path", coreProxy.ProxyRequest)
		}
	}

	serverAddr := fmt.Sprintf("%s:%s", cfg.Server.Host, cfg.Server.Port)
	log.Printf("Gateway server starting on %s", serverAddr)

	if err := r.Run(serverAddr); err != nil {
		panic(fmt.Sprintf("Failed to start server: %v", err))
	}
}
