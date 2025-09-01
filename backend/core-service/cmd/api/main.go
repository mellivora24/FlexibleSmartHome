package main

import (
	"fmt"

	"github.com/mellivora24/flexiblesmarthome/core-service/internal/infra/mosquitto"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/shared"
)

func main() {
	cfg, err := shared.LoadConfig()
	if err != nil {
		panic(err)
	}

	_, err = mosquitto.InitMQTT(cfg.Mosquitto)

	if err != nil {
		panic(err)
	} else {
		fmt.Println("Database initialized")
	}
}
