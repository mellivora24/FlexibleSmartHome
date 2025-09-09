package mosquitto

import (
	"fmt"
	"log"
	"time"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/shared"
)

func InitMQTT(mqttCfg shared.MQTT_CONFIG) (mqtt.Client, error) {
	brokerURI := fmt.Sprintf("tcp://%s:%s", mqttCfg.HOST, mqttCfg.PORT)

	opts := mqtt.NewClientOptions()
	opts.AddBroker(brokerURI)
	opts.SetUsername(mqttCfg.USERNAME)
	opts.SetPassword(mqttCfg.PASSWORD)
	opts.SetClientID(mqttCfg.CLIENT_ID)

	// Reconnect
	opts.SetAutoReconnect(true)
	opts.SetConnectRetry(true)
	opts.SetConnectRetryInterval(5 * time.Second)

	opts.OnConnect = func(client mqtt.Client) {
		log.Printf("[MQTT] Connected to broker %s", brokerURI)
	}

	opts.OnConnectionLost = func(client mqtt.Client, err error) {
		log.Printf("[MQTT] Lost connection to broker %s, error: %v", brokerURI, err)
	}

	client := mqtt.NewClient(opts)

	if token := client.Connect(); token.Wait() && token.Error() != nil {
		return nil, token.Error()
	}

	return client, nil
}
