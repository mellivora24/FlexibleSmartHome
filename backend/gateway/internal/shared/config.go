package shared

import (
	"github.com/spf13/viper"
)

type Config struct {
	Server      ServerConfig      `mapstructure:"server"`
	AuthService AuthServiceConfig `mapstructure:"auth_service"`
	CoreService CoreServiceConfig `mapstructure:"core_service"`
	CORS        CORSConfig        `mapstructure:"cors"`
}

type ServerConfig struct {
	Host     string `mapstructure:"host"`
	Port     string `mapstructure:"port"`
	BasePath string `mapstructure:"base_path"`
}

type AuthServiceConfig struct {
	BasePath   string `mapstructure:"url"`
	VerifyPath string `mapstructure:"verify_path"`
}

type CoreServiceConfig struct {
	URL    string `mapstructure:"url"`
	WS_URL string `mapstructure:"ws_url"`
}

type CORSConfig struct {
	AllowedOrigins []string `mapstructure:"allowed_origins"`
	AllowedMethods []string `mapstructure:"allowed_methods"`
	AllowedHeaders []string `mapstructure:"allowed_headers"`
}

func LoadConfig() (*Config, error) {
	viper.SetConfigType("yaml")
	viper.SetConfigName("config")
	viper.AddConfigPath("./internal/config")

	if err := viper.ReadInConfig(); err != nil {
		return nil, err
	}

	cfg := &Config{}
	if err := viper.Unmarshal(cfg); err != nil {
		return nil, err
	}

	return cfg, nil
}
