#ifndef MQTT_MANAGER_H
#define MQTT_MANAGER_H

#include <WiFiClient.h>
#include <PubSubClient.h>
#include <Arduino.h>
#include <functional>
#include <vector>
#include <algorithm>

enum class MQTTState {
    DISCONNECTED,
    CONNECTING,
    CONNECTED,
    FAILED
};

struct MQTTMessage {
    String topic;
    String payload;
    bool retained;
    uint8_t qos;
};

struct TopicHandler {
    String topic;
    std::function<void(String, String)> callback;
};

class MQTTManager {
private:
    static MQTTManager* instance;
    WiFiClient wifiClient;
    mutable PubSubClient mqttClient;
    
    MQTTState currentState;
    String brokerHost;
    int brokerPort;
    String clientId;
    String username;
    String password;
    
    unsigned long lastConnectionAttempt;
    unsigned long lastKeepAlive;
    int connectionAttempts;
    
    std::vector<TopicHandler> subscribers;
    std::vector<MQTTMessage> messageQueue;
    
    // Constants
    static constexpr unsigned long CONNECTION_TIMEOUT = 10000;  // 10 seconds
    static constexpr unsigned long RETRY_DELAY = 5000;          // 5 seconds
    static constexpr unsigned long KEEP_ALIVE_INTERVAL = 30000; // 30 seconds
    static constexpr int MAX_RETRY_ATTEMPTS = 3;
    static constexpr int MAX_QUEUE_SIZE = 50;

    // Private constructor for Singleton
    MQTTManager() : mqttClient(wifiClient),
                   currentState(MQTTState::DISCONNECTED),
                   brokerPort(1883),
                   lastConnectionAttempt(0),
                   lastKeepAlive(0),
                   connectionAttempts(0) {
        
        // Set MQTT callback
        mqttClient.setCallback([this](char* topic, byte* payload, unsigned int length) {
            this->onMessageReceived(topic, payload, length);
        });
        
        // Generate unique client ID
        clientId = "ESP32_SmartHome_" + String(random(0xffff), HEX);
    }

public:
    // Singleton access
    static MQTTManager& getInstance() {
        if (instance == nullptr) {
            instance = new MQTTManager();
        }
        return *instance;
    }

    // Delete copy constructor and assignment operator
    MQTTManager(const MQTTManager&) = delete;
    MQTTManager& operator=(const MQTTManager&) = delete;

    void begin() {
        mqttClient.setKeepAlive(60);
        mqttClient.setSocketTimeout(30);
        Serial.println("MQTTManager: Initialized");
    }

    void configure(const String& host, int port = 1883, 
                  const String& user = "", const String& pass = "") {
        brokerHost = host;
        brokerPort = port;
        username = user;
        password = pass;
        
        mqttClient.setServer(brokerHost.c_str(), brokerPort);
        
        Serial.printf("MQTTManager: Configured - Host: %s, Port: %d\n", 
                     brokerHost.c_str(), brokerPort);
    }

    bool connect() {
        if (currentState == MQTTState::CONNECTING) {
            Serial.println("MQTTManager: Already connecting...");
            return false;
        }
        
        Serial.printf("MQTTManager: Connecting to %s:%d\n", brokerHost.c_str(), brokerPort);
        
        currentState = MQTTState::CONNECTING;
        connectionAttempts = 0;
        lastConnectionAttempt = millis();
        
        return attemptConnection();
    }

    void disconnect() {
        if (mqttClient.connected()) {
            mqttClient.disconnect();
        }
        currentState = MQTTState::DISCONNECTED;
        Serial.println("MQTTManager: Disconnected");
    }

    void update() {
        if (!mqttClient.loop()) {
            if (currentState == MQTTState::CONNECTED) {
                currentState = MQTTState::DISCONNECTED;
                onDisconnected();
            }
        }
        
        unsigned long now = millis();
        
        // Handle connection attempts
        if (currentState == MQTTState::CONNECTING) {
            handleConnectionTimeout(now);
        }
        
        // Process queued messages
        if (currentState == MQTTState::CONNECTED) {
            processMessageQueue();
            
            // Keep alive
            if (now - lastKeepAlive > KEEP_ALIVE_INTERVAL) {
                sendKeepAlive();
                lastKeepAlive = now;
            }
        }
    }

    // Publishing
    bool publish(const String& topic, const String& payload, bool retained = false, uint8_t qos = 0) {
        if (currentState == MQTTState::CONNECTED) {
            bool result = mqttClient.publish(topic.c_str(), payload.c_str(), retained);
            if (result) {
                Serial.printf("MQTTManager: Published to %s: %s\n", topic.c_str(), payload.c_str());
            } else {
                Serial.printf("MQTTManager: Failed to publish to %s\n", topic.c_str());
            }
            return result;
        } else {
            // Queue message for later
            return queueMessage(topic, payload, retained, qos);
        }
    }

    bool publishJSON(const String& topic, const String& jsonPayload, bool retained = false) {
        return publish(topic, jsonPayload, retained, 0);
    }

    // Subscribing
    bool subscribe(const String& topic, std::function<void(String, String)> callback) {
        // Add to subscribers list
        subscribers.push_back({topic, callback});
        
        if (currentState == MQTTState::CONNECTED) {
            bool result = mqttClient.subscribe(topic.c_str());
            if (result) {
                Serial.printf("MQTTManager: Subscribed to %s\n", topic.c_str());
            }
            return result;
        }
        
        Serial.printf("MQTTManager: Queued subscription to %s\n", topic.c_str());
        return true; // Will subscribe when connected
    }

    bool unsubscribe(const String& topic) {
        // Remove from subscribers
        subscribers.erase(
            std::remove_if(subscribers.begin(), subscribers.end(),
                [&topic](const TopicHandler& handler) { 
                    return handler.topic == topic; 
                }),
            subscribers.end()
        );
        
        if (currentState == MQTTState::CONNECTED) {
            return mqttClient.unsubscribe(topic.c_str());
        }
        return true;
    }

    // Getters
    MQTTState getState() const { return currentState; }
    
    bool isConnected() const { 
        return currentState == MQTTState::CONNECTED && mqttClient.connected();
    }
    
    bool isConnecting() const { return currentState == MQTTState::CONNECTING; }
    
    String getClientId() const { return clientId; }
    
    String getBrokerHost() const { return brokerHost; }
    
    int getBrokerPort() const { return brokerPort; }
    
    String getStatusString() const {
        switch (currentState) {
            case MQTTState::DISCONNECTED: return "Disconnected";
            case MQTTState::CONNECTING: return "Connecting";
            case MQTTState::CONNECTED: return "Connected";
            case MQTTState::FAILED: return "Failed";
            default: return "Unknown";
        }
    }

    int getQueueSize() const { return messageQueue.size(); }

private:
    bool attemptConnection() {
        bool result;
        
        if (username.length() > 0 && password.length() > 0) {
            result = mqttClient.connect(clientId.c_str(), username.c_str(), password.c_str());
        } else {
            result = mqttClient.connect(clientId.c_str());
        }
        
        if (result) {
            currentState = MQTTState::CONNECTED;
            onConnected();
            return true;
        }
        
        return false;
    }

    void handleConnectionTimeout(unsigned long now) {
        if (now - lastConnectionAttempt > CONNECTION_TIMEOUT) {
            connectionAttempts++;
            
            if (connectionAttempts >= MAX_RETRY_ATTEMPTS) {
                currentState = MQTTState::FAILED;
                onConnectionFailed();
                Serial.printf("MQTTManager: Failed to connect after %d attempts\n", connectionAttempts);
            } else {
                Serial.printf("MQTTManager: Retry attempt %d/%d\n", connectionAttempts, MAX_RETRY_ATTEMPTS);
                delay(RETRY_DELAY);
                lastConnectionAttempt = millis();
                attemptConnection();
            }
        }
    }

    bool queueMessage(const String& topic, const String& payload, bool retained, uint8_t qos) {
        if (messageQueue.size() >= MAX_QUEUE_SIZE) {
            Serial.println("MQTTManager: Message queue full, dropping oldest message");
            messageQueue.erase(messageQueue.begin());
        }
        
        messageQueue.push_back({topic, payload, retained, qos});
        Serial.printf("MQTTManager: Queued message for %s (%d in queue)\n", 
                     topic.c_str(), messageQueue.size());
        return true;
    }

    void processMessageQueue() {
        if (messageQueue.empty()) return;
        
        // Process one message per update cycle
        MQTTMessage msg = messageQueue.front();
        messageQueue.erase(messageQueue.begin());
        
        if (mqttClient.publish(msg.topic.c_str(), msg.payload.c_str(), msg.retained)) {
            Serial.printf("MQTTManager: Sent queued message to %s\n", msg.topic.c_str());
        } else {
            // Re-queue if failed
            messageQueue.insert(messageQueue.begin(), msg);
        }
    }

    void sendKeepAlive() {
        // Send a simple ping/status message
        publish("smarthome/status", "online", true);
    }

    void onMessageReceived(char* topic, byte* payload, unsigned int length) {
        // Convert payload to string
        String payloadStr;
        payloadStr.reserve(length + 1);
        for (unsigned int i = 0; i < length; i++) {
            payloadStr += (char)payload[i];
        }
        
        String topicStr = String(topic);
        
        Serial.printf("MQTTManager: Received message on %s: %s\n", 
                     topicStr.c_str(), payloadStr.c_str());
        
        // Call registered callbacks
        for (const auto& handler : subscribers) {
            if (topicMatches(handler.topic, topicStr)) {
                handler.callback(topicStr, payloadStr);
            }
        }
    }

    bool topicMatches(const String& pattern, const String& topic) {
        // Simple wildcard matching for MQTT topics
        if (pattern == topic) return true;
        
        // Handle + wildcard (single level)
        if (pattern.indexOf('+') >= 0) {
            // Simplified matching - can be enhanced for full MQTT wildcard support
            return true;
        }
        
        // Handle # wildcard (multi level)
        if (pattern.endsWith("#")) {
            String basePattern = pattern.substring(0, pattern.length() - 1);
            return topic.startsWith(basePattern);
        }
        
        return false;
    }

    void onConnected() {
        Serial.printf("MQTTManager: Connected to %s:%d as %s\n", 
                     brokerHost.c_str(), brokerPort, clientId.c_str());
        
        // Subscribe to all registered topics
        for (const auto& handler : subscribers) {
            mqttClient.subscribe(handler.topic.c_str());
            Serial.printf("MQTTManager: Subscribed to %s\n", handler.topic.c_str());
        }
        
        // Send birth message
        publish("smarthome/status", "online", true);
    }

    void onDisconnected() {
        Serial.println("MQTTManager: Connection lost");
    }

    void onConnectionFailed() {
        Serial.printf("MQTTManager: Failed to connect to %s:%d\n", 
                     brokerHost.c_str(), brokerPort);
    }
};

// Static member definition
MQTTManager* MQTTManager::instance = nullptr;

#endif
