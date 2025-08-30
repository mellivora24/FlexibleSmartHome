package shared

import (
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

type DB_CONFIG struct {
	HOST     string `mapstructure:"host"`
	PORT     int    `mapstructure:"port"`
	DATABASE string `mapstructure:"database"`
	USERNAME string `mapstructure:"username"`
	PASSWORD string `mapstructure:"password"`
}

type SERVER_CONFIG struct {
	HOST       string `mapstructure:"host"`
	PORT       int    `mapstructure:"port"`
	BASE_PATH  string `mapstructure:"base_path"`
	JWT_SECRET string `mapstructure:"jwt_secret"`
}

type APP_CONFIG struct {
	Database DB_CONFIG     `mapstructure:"database"`
	Server   SERVER_CONFIG `mapstructure:"server"`
}

func LoadConfig() (*APP_CONFIG, error) {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, skip...")
		return nil, nil
	}

	viper.SetConfigType("yaml")
	viper.SetConfigName("config")
	viper.AddConfigPath("./internal/config")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		return nil, err
	}

	for _, key := range viper.AllKeys() {
		val := viper.GetString(key)
		if strings.Contains(val, "${") {
			expandedVal := os.ExpandEnv(val)
			viper.Set(key, expandedVal)
		}
	}

	cfg := &APP_CONFIG{}
	if err := viper.Unmarshal(cfg); err != nil {
		return nil, err
	}

	return cfg, nil
}
