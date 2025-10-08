package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/device"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/event"
	l "github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/log"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/mcu"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/notification"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/pendingActions"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/sensorData"

	"github.com/mellivora24/flexiblesmarthome/core-service/internal/realtime/handler"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/realtime/service"

	"github.com/mellivora24/flexiblesmarthome/core-service/internal/infra/database"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/infra/mosquitto"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/shared"
)

func main() {
	cfg, err := shared.LoadConfig()
	if err != nil {
		log.Fatal(err)
	} else if cfg == nil {
		log.Fatal("config is nil")
	}

	mqttClient, err := mosquitto.InitMQTT(cfg.Mosquitto)
	if err != nil {
		log.Fatal(err)
	}

	dbClient, err := database.InitDatabase(cfg.Database)
	if err != nil {
		log.Fatal(err)
	}

	// Create repo
	logRepo := l.NewRepository(dbClient)
	mcuRepo := mcu.NewRepository(dbClient)
	eventRepo := event.NewRepository(dbClient)
	deviceRepo := device.NewRepository(dbClient)
	sensorDataRepo := sensorData.NewRepository(dbClient)
	notificationRepo := notification.NewRepository(dbClient)
	pendingActionsRepo := pendingActions.NewRepository(dbClient)

	// Init services
	logService := l.NewService(logRepo)
	mcuService := mcu.NewService(mcuRepo)
	eventService := event.NewService(eventRepo)
	deviceService := device.NewService(deviceRepo)
	sensorDataService := sensorData.NewService(sensorDataRepo)
	notificationService := notification.NewService(notificationRepo)
	pendingActionsService := pendingActions.NewService(pendingActionsRepo)

	coreService := service.NewCoreService(
		logService,
		eventService,
		deviceService,
		sensorDataService,
		notificationService,
		pendingActionsService,
	)
	wsService := service.NewWebSocketService()
	mqttService := service.NewMQTTService(mqttClient, cfg.Mosquitto)

	// Handlers
	logHandler := l.NewHandler(logService)
	mcuHandler := mcu.NewHandler(mcuService)
	eventHandler := event.NewHandler(eventService)
	deviceHandler := device.NewHandler(deviceService)
	sensorDataHandler := sensorData.NewHandler(sensorDataService)
	notificationHandler := notification.NewHandler(notificationService)

	wsHandler := handler.WSHandler(wsService, mqttService)
	mqttHandler := handler.NewMQTTHandler(mqttService, wsService, coreService)
	if err := mqttHandler.Init(); err != nil {
		log.Fatalf("cannot init mqtt handler: %v", err)
	}

	// Endpoint
	router := gin.Default()
	api := router.Group(cfg.Server.BASE_PATH)
	{
		logHandler.RegisterRoutes(api)
		mcuHandler.RegisterRoutes(api)
		eventHandler.RegisterRoutes(api)
		deviceHandler.RegisterRoutes(api)
		sensorDataHandler.RegisterRoutes(api)
		notificationHandler.RegisterRoutes(api)

		api.GET("/ws", func(c *gin.Context) {
			wsHandler(c.Writer, c.Request)
		})

		api.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "healthy"})
		})
	}

	addr := fmt.Sprintf("%s:%s", cfg.Server.HOST, cfg.Server.PORT)
	log.Printf("Core-service starting on %s", addr)

	if err := router.Run(addr); err != nil {
		log.Fatalf("cannot run server: %v", err)
	}
}
