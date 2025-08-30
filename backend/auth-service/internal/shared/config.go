package shared

import (
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/spf13/viper"
)

type DB_CONFIG struct {
	HOST     string `mapstructure:"host"`
	PORT     string `mapstructure:"port"`
	DATABASE string `mapstructure:"database"`
	USERNAME string `mapstructure:"username"`
	PASSWORD string `mapstructure:"password"`
}

type SERVER_CONFIG struct {
	HOST      string `mapstructure:"host"`
	PORT      int    `mapstructure:"port"`
	BASE_PATH string `mapstructure:"base_path"`
}

type APP_CONFIG struct {
	Database DB_CONFIG     `mapstructure:"database"`
	Server   SERVER_CONFIG `mapstructure:"server"`
}

var AppConfig *APP_CONFIG

func init() {
	fmt.Println("Connecting to database...")

	viper.AddConfigPath(".")
	viper.SetConfigType("yaml")
	viper.SetConfigName("config")
	viper.AddConfigPath("./config")

	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("Error reading config file, %s", err)
	}

	for _, key := range viper.AllKeys() {
		val := viper.GetString(key)
		if strings.Contains(val, "${") {
			viper.Set(key, os.ExpandEnv(val))
		}
	}

	cfg := &APP_CONFIG{}
	if err := viper.Unmarshal(cfg); err != nil {
		log.Fatalf("Error unmarshalling config, %s", err)
	}

	AppConfig = cfg
}
