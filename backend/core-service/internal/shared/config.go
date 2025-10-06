package shared

import (
	"fmt"
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
	HOST                   string `mapstructure:"host"`
	PORT                   string `mapstructure:"port"`
	USERNAME               string `mapstructure:"username"`
	PASSWORD               string `mapstructure:"password"`
	CLIENT_ID              string `mapstructure:"client_id"`
	CONFIG_TOPIC           string `mapstructure:"config_topic"`
	FIRMWARE_TOPIC         string `mapstructure:"firmware_topic"`
	DATA_TOPIC             string `mapstructure:"data_topic"`
	CONTROL_TOPIC          string `mapstructure:"control_topic"`
	CONTROL_RESPONSE_TOPIC string `mapstructure:"control_response_topic"`
}

type SERVER_CONFIG struct {
	HOST      string `mapstructure:"host"`
	PORT      string `mapstructure:"port"`
	BASE_PATH string `mapstructure:"base_path"`
	WS_PORT   string `mapstructure:"ws_port"`
	WS_PATH   string `mapstructure:"ws_path"`
}
type APP_CONFIG struct {
	Database  DB_CONFIG     `mapstructure:"database"`
	Mosquitto MQTT_CONFIG   `mapstructure:"mosquitto"`
	Server    SERVER_CONFIG `mapstructure:"server"`
}

func LoadConfig() (*APP_CONFIG, error) {
	_ = godotenv.Load()

	viper.AutomaticEnv()
	viper.SetConfigType("yaml")
	viper.SetConfigName("config")
	viper.AddConfigPath("./internal/config/")
	viper.AddConfigPath(".")

	if err := viper.ReadInConfig(); err != nil {
		return nil, fmt.Errorf("failed to read config: %w", err)
	}

	for _, key := range viper.AllKeys() {
		val := viper.GetString(key)
		if strings.Contains(val, "${") {
			viper.Set(key, os.ExpandEnv(val))
		}
	}

	cfg := &APP_CONFIG{}
	if err := viper.Unmarshal(cfg); err != nil {
		return nil, fmt.Errorf("failed to unmarshal config: %w", err)
	}

	return cfg, nil
}
