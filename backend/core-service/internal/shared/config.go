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
	PORT     string `mapstructure:"port"`
	USERNAME string `mapstructure:"username"`
	PASSWORD string `mapstructure:"password"`
	DATABASE string `mapstructure:"database"`
}

type MQTT_CONFIG struct {
	HOST      string `mapstructure:"host"`
	PORT      string `mapstructure:"port"`
	USERNAME  string `mapstructure:"username"`
	PASSWORD  string `mapstructure:"password"`
	CLIENT_ID string `mapstructure:"client_id"`
}

type SERVER_CONFIG struct {
	HOST      string `mapstructure:"host"`
	PORT      string `mapstructure:"port"`
	BASE_PATH string `mapstructure:"base_path"`
}

type AUTH_CONFIG struct {
	BASE_PATH string `mapstructure:"base_path"`
}

type APP_CONFIG struct {
	Database    DB_CONFIG     `mapstructure:"database"`
	Mosquitto   MQTT_CONFIG   `mapstructure:"mosquitto"`
	Server      SERVER_CONFIG `mapstructure:"server"`
	AuthService AUTH_CONFIG   `mapstructure:"auth_service"`
}

func LoadConfig() (*APP_CONFIG, error) {
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
		return nil, nil
	}

	viper.AutomaticEnv()
	viper.SetConfigType("yaml")
	viper.SetConfigName("config")
	viper.AddConfigPath("./internal/config/")

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
