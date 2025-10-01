#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#include <WiFi.h>
#include <Arduino.h>

enum class WiFiState {
    DISCONNECTED,
    CONNECTING,
    CONNECTED,
    FAILED
};

class WiFiManager {
private:
    static WiFiManager* instance;
    
    WiFiState currentState;
    String ssid;
    String password;
    unsigned long lastConnectionAttempt;
    unsigned long lastStatusCheck;
    int connectionAttempts;
    
    // Constants
    static constexpr unsigned long CONNECTION_TIMEOUT = 10000;  // 10 seconds
    static constexpr unsigned long RETRY_DELAY = 5000;          // 5 seconds
    static constexpr unsigned long STATUS_CHECK_INTERVAL = 1000; // 1 second
    static constexpr int MAX_RETRY_ATTEMPTS = 3;

    // Private constructor for Singleton
    WiFiManager() : currentState(WiFiState::DISCONNECTED), 
                   lastConnectionAttempt(0),
                   lastStatusCheck(0),
                   connectionAttempts(0) {}

public:
    // Singleton access
    static WiFiManager& getInstance() {
        if (instance == nullptr) {
            instance = new WiFiManager();
        }
        return *instance;
    }

    // Delete copy constructor and assignment operator
    WiFiManager(const WiFiManager&) = delete;
    WiFiManager& operator=(const WiFiManager&) = delete;

    void begin() {
        WiFi.mode(WIFI_STA);
        WiFi.setAutoConnect(false);
        WiFi.setAutoReconnect(true);
        
        Serial.println("WiFiManager: Initialized");
    }

    bool connect(const String& networkSSID, const String& networkPassword) {
        ssid = networkSSID;
        password = networkPassword;
        
        if (currentState == WiFiState::CONNECTING) {
            Serial.println("WiFiManager: Already connecting...");
            return false;
        }
        
        Serial.printf("WiFiManager: Connecting to %s\n", ssid.c_str());
        
        currentState = WiFiState::CONNECTING;
        connectionAttempts = 0;
        lastConnectionAttempt = millis();
        
        WiFi.begin(ssid.c_str(), password.c_str());
        
        return true;
    }

    void disconnect() {
        WiFi.disconnect();
        currentState = WiFiState::DISCONNECTED;
        Serial.println("WiFiManager: Disconnected");
    }

    void update() {
        unsigned long now = millis();
        
        // Check status periodically
        if (now - lastStatusCheck > STATUS_CHECK_INTERVAL) {
            updateConnectionStatus();
            lastStatusCheck = now;
        }
        
        // Handle connection timeout and retries
        if (currentState == WiFiState::CONNECTING) {
            handleConnectionTimeout(now);
        }
    }

    // Getters
    WiFiState getState() const { return currentState; }
    
    bool isConnected() const { 
        return currentState == WiFiState::CONNECTED && WiFi.status() == WL_CONNECTED; 
    }
    
    bool isConnecting() const { return currentState == WiFiState::CONNECTING; }
    
    String getSSID() const { return ssid; }
    
    IPAddress getLocalIP() const { 
        return isConnected() ? WiFi.localIP() : IPAddress(0, 0, 0, 0); 
    }
    
    String getMacAddress() const { return WiFi.macAddress(); }
    
    int getRSSI() const { 
        return isConnected() ? WiFi.RSSI() : 0; 
    }
    
    String getStatusString() const {
        switch (currentState) {
            case WiFiState::DISCONNECTED: return "Disconnected";
            case WiFiState::CONNECTING: return "Connecting";
            case WiFiState::CONNECTED: return "Connected";
            case WiFiState::FAILED: return "Failed";
            default: return "Unknown";
        }
    }

    // WiFi signal strength
    int getSignalStrength() const {
        if (!isConnected()) return 0;
        
        int rssi = WiFi.RSSI();
        if (rssi >= -50) return 100;
        if (rssi >= -60) return 75;
        if (rssi >= -70) return 50;
        if (rssi >= -80) return 25;
        return 10;
    }

private:
    void updateConnectionStatus() {
        wl_status_t wifiStatus = WiFi.status();
        
        switch (wifiStatus) {
            case WL_CONNECTED:
                if (currentState != WiFiState::CONNECTED) {
                    currentState = WiFiState::CONNECTED;
                    onConnected();
                }
                break;
                
            case WL_CONNECT_FAILED:
            case WL_CONNECTION_LOST:
            case WL_NO_SSID_AVAIL:
                if (currentState == WiFiState::CONNECTING) {
                    currentState = WiFiState::FAILED;
                    onConnectionFailed();
                }
                break;
                
            case WL_DISCONNECTED:
                if (currentState == WiFiState::CONNECTED) {
                    currentState = WiFiState::DISCONNECTED;
                    onDisconnected();
                }
                break;
        }
    }

    void handleConnectionTimeout(unsigned long now) {
        if (now - lastConnectionAttempt > CONNECTION_TIMEOUT) {
            connectionAttempts++;
            
            if (connectionAttempts >= MAX_RETRY_ATTEMPTS) {
                currentState = WiFiState::FAILED;
                onConnectionFailed();
                Serial.printf("WiFiManager: Failed to connect after %d attempts\n", connectionAttempts);
            } else {
                Serial.printf("WiFiManager: Retry attempt %d/%d\n", connectionAttempts, MAX_RETRY_ATTEMPTS);
                lastConnectionAttempt = now + RETRY_DELAY;
                WiFi.begin(ssid.c_str(), password.c_str());
            }
        }
    }

    // Event handlers
    void onConnected() {
        Serial.printf("WiFiManager: Connected to %s\n", ssid.c_str());
        Serial.printf("WiFiManager: IP address: %s\n", WiFi.localIP().toString().c_str());
        Serial.printf("WiFiManager: RSSI: %d dBm\n", WiFi.RSSI());
    }

    void onDisconnected() {
        Serial.println("WiFiManager: Connection lost");
    }

    void onConnectionFailed() {
        Serial.printf("WiFiManager: Failed to connect to %s\n", ssid.c_str());
    }
};

// Static member definition
WiFiManager* WiFiManager::instance = nullptr;

#endif
