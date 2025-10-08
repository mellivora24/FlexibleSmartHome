package service

import (
	"encoding/json"
	"fmt"
	l "log"
	"strconv"

	"github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/device"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/event"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/log"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/notification"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/pendingActions"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/feature/sensorData"
	"github.com/mellivora24/flexiblesmarthome/core-service/internal/realtime/model"
)

type CoreService interface {
	CreatePendingAction(uid string, mid string, data model.WSMessage) (err error)
	CreateSensorData(uid string, data model.MQTTMessage) (err error)
	CreateEvent(uid string, data model.MQTTMessage) (err error)
	UpdateDeviceStatus(data model.MQTTMessage) (err error)
	GetDeviceList(uid string) (devices []device.MQTTGetDeviceData, err error)
}

type coreService struct {
	log           log.Service
	event         event.Service
	device        device.Service
	sensorData    sensorData.Service
	notification  notification.Service
	pendingAction pendingActions.Service
}

func NewCoreService(
	log log.Service,
	event event.Service,
	device device.Service,
	sensorData sensorData.Service,
	notification notification.Service,
	pendingAction pendingActions.Service,
) CoreService {
	return &coreService{
		log:           log,
		event:         event,
		device:        device,
		sensorData:    sensorData,
		notification:  notification,
		pendingAction: pendingAction,
	}
}

func (s *coreService) CreatePendingAction(uid string, mid string, data model.WSMessage) (err error) {
	intUid, _ := strconv.ParseInt(uid, 10, 64)
	if intUid == 0 {
		l.Printf("[WSService] Invalid UID for pending action: %s", uid)
		return
	}
	intMid, _ := strconv.ParseInt(mid, 10, 64)
	if intMid == 0 {
		l.Printf("[WSService] Invalid MID for pending action: %s", mid)
		return
	}

	payloadMap, ok := data.Payload.(map[string]interface{})
	if !ok {
		l.Println("Payload is not an object")
		return
	}

	command, _ := payloadMap["command"].(string)

	err = s.pendingAction.CreatePendingAction(intUid, intMid, command)
	if err != nil {
		l.Printf("[CoreService] Error creating pending action: %v", err)
		return
	}

	l.Printf("[CoreService] Pending action created for UID=%s MID=%s COMMAND=%s", uid, mid, command)
	return
}

func (s *coreService) CreateSensorData(uid string, data model.MQTTMessage) (err error) {
	intUid, ok := strconv.ParseInt(uid, 10, 64)
	if ok != nil {
		l.Printf("Error converting uid to int64: %v", ok)
		return
	}

	payloadMap := data.Payload.(map[string]interface{})

	var sid int64
	if v, ok := payloadMap["sid"].(float64); ok {
		sid = int64(v)
	}
	unit, _ := payloadMap["unit"].(string)
	value, _ := payloadMap["value"].(float64)

	err = s.sensorData.Create(intUid, sid, value, unit)
	if err != nil {
		l.Printf("[CoreService] Error creating sensor data: %v", err)
		return
	}

	l.Printf("[CoreService] Sensor data created for UID=%d SID=%s VALUE=%f UNIT=%s", intUid, sid, value, unit)
	return nil
}

func (s *coreService) CreateEvent(uid string, data model.MQTTMessage) (err error) {
	intUid, convErr := strconv.ParseInt(uid, 10, 64)
	if convErr != nil {
		l.Printf("Error converting uid to int64: %v", convErr)
		return convErr
	}

	payloadMap, ok := data.Payload.(map[string]interface{})
	if !ok {
		l.Printf("[CoreService] Invalid payload type")
		return fmt.Errorf("invalid payload type")
	}

	var did int64
	if v, ok := payloadMap["did"].(float64); ok {
		did = int64(v)
	}

	value, _ := payloadMap["value"].(float64)
	status, _ := payloadMap["status"].(string)
	command, _ := payloadMap["command"].(string)

	jsonRaw := json.RawMessage(fmt.Sprintf(`{"value":%v,"status":"%s"}`, value, status))

	err = s.event.Create(intUid, did, command, jsonRaw)
	if err != nil {
		l.Printf("[CoreService] Error creating event: %v", err)
		return err
	}

	return nil
}

func (s *coreService) UpdateDeviceStatus(data model.MQTTMessage) (err error) {
	payloadMap := data.Payload.(map[string]interface{})

	var did int64
	if v, ok := payloadMap["did"].(float64); ok {
		did = int64(v)
	}

	value, _ := payloadMap["value"].(float64)
	command, _ := payloadMap["command"].(string)

	err = s.device.UpdateDeviceStatusAndData(did, command == "ON", json.RawMessage("{\"value\":"+strconv.FormatFloat(value, 'f', -1, 64)+"}"))
	if err != nil {
		return err
	}

	return nil
}

func (s *coreService) GetDeviceList(uid string) (devices []device.MQTTGetDeviceData, err error) {
	intUid, convErr := strconv.ParseInt(uid, 10, 64)
	if convErr != nil {
		l.Printf("Error converting uid to int64: %v", convErr)
		return nil, convErr
	}

	devices, err = s.device.RealtimeGetList(intUid)
	if err != nil {
		l.Printf("[CoreService] Error getting device list: %v", err)
		return nil, err
	}

	if len(devices) == 0 {
		l.Printf("[CoreService] No devices found for UID=%s", uid)
		return nil, nil
	}

	return devices, nil
}
