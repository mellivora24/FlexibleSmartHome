package main

import (
	"fmt"
	"log"

	"github.com/joho/godotenv"
	"github.com/mellivora24/flexiblesmarthome/auth-service/internal/shared"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, skip...")
	}

	cfg, cfgErr := shared.LoadConfig()

	if cfgErr != nil {
		log.Fatal(cfgErr)
		return
	} else {
		fmt.Println("Using config file:", cfg)
	}
}
