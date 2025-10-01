package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/device"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/event"
	l "github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/log"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/mcu"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/notification"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/room"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/sensor"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/sensorData"

	"github.com/mellivora24/flexiblesmarthome/core-service/internal/infra/database"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/infra/mosquitto"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/realtime"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/realtime/handler"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/realtime/service"
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
	roomRepo := room.NewRepository(dbClient)
	eventRepo := event.NewRepository(dbClient)
	deviceRepo := device.NewRepository(dbClient)
	sensorRepo := sensor.NewSensorRepository(dbClient)
	sensorDataRepo := sensorData.NewRepository(dbClient)
	notificationRepo := notification.NewRepository(dbClient)

	// Init services
	logService := l.NewService(logRepo)
	mcuService := mcu.NewService(mcuRepo)
	roomService := room.NewService(roomRepo)
	eventService := event.NewService(eventRepo)
	sensorService := sensor.NewService(sensorRepo)
	deviceService := device.NewService(deviceRepo)
	sensorDataService := sensorData.NewService(sensorDataRepo)
	notificationService := notification.NewService(notificationRepo)

	manager := realtime.NewManager()
	mqttService := service.NewMQTTService(mqttClient)
	wsService := service.NewWebSocketService(manager)

	// Handlers
	logHandler := l.NewHandler(logService)
	mcuHandler := mcu.NewHandler(mcuService)
	roomHandler := room.NewHandler(roomService)
	eventHandler := event.NewHandler(eventService)
	sensorHandler := sensor.NewHandler(sensorService)
	deviceHandler := device.NewHandler(deviceService)
	sensorDataHandler := sensorData.NewHandler(sensorDataService)
	notificationHandler := notification.NewHandler(notificationService)

	mqttHandler := handler.NewMQTTHandler(mqttService, sensorDataService, wsService)
	mqttHandler.Init()

	// Endpoint
	router := gin.Default()
	api := router.Group(cfg.Server.BASE_PATH)
	{
		logHandler.RegisterRoutes(api)
		mcuHandler.RegisterRoutes(api)
		roomHandler.RegisterRoutes(api)
		eventHandler.RegisterRoutes(api)
		sensorHandler.RegisterRoutes(api)
		deviceHandler.RegisterRoutes(api)
		sensorDataHandler.RegisterRoutes(api)
		notificationHandler.RegisterRoutes(api)

		// WebSocket
		api.GET("/ws", func(c *gin.Context) {
			handler.WSHandler(manager, mqttService, wsService, c.Writer, c.Request)
		})
	}

	addr := fmt.Sprintf("%s:%s", cfg.Server.HOST, cfg.Server.PORT)
	log.Printf("Core-service starting on %s", addr)

	if err := router.Run(addr); err != nil {
		log.Fatalf("cannot run server: %v", err)
	}
}
