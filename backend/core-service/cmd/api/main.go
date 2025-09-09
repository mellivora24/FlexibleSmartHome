package main

import (
	"log"
	"net/http"

	"github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/sensorData"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/infra/database"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/infra/mosquitto"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/realtime"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/realtime/handler"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/realtime/service"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/shared"
)

func main() {
	log.Print("Loading configuration...")
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

	sensorRepo := sensorData.NewRepository(dbClient)

	manager := realtime.NewManager()
	mqttService := service.NewMQTTService(mqttClient)
	wsService := service.NewWebSocketService(manager)
	sensorDataService := sensorData.NewService(sensorRepo)

	mqttHandler := handler.NewMQTTHandler(mqttService, sensorDataService, wsService)
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		handler.WSHandler(manager, mqttService, wsService, w, r)
	})

	mqttHandler.Init()
	log.Fatal(http.ListenAndServe(":8082", nil))
}
