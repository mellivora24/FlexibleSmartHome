package database

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/mellivora24/flexiblesmarthome/core-service/internal/shared"
)

func InitDatabase(dbCfg shared.DB_CONFIG) (*gorm.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Ho_Chi_Minh",
		dbCfg.HOST, dbCfg.USERNAME, dbCfg.PASSWORD, dbCfg.DATABASE, dbCfg.PORT,
	)

	DB, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	sqlDB, err := DB.DB()
	if err != nil {
		return nil, err
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)

	return DB, nil
}
