package main

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/mellivora24/flexiblesmarthome/auth-service/internal/shared"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, skip...")
	}

	cfg, err := shared.LoadConfig()
	if err != nil {
		log.Fatalf("cannot load config: %v", err)
		return
	}

	_, err = shared.InitDatabase(cfg.Database)
	if err != nil {
		log.Fatalf("cannot connect database: %v", err)
	}
}
