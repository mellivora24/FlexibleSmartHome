# MÔ TẢ DỰ ÁN: HỆ THỐNG NHÀ THÔNG MINH LINH HOẠT (FLEXIBLE SMART HOME SYSTEM)

## 1. TỔNG QUAN DỰ ÁN

Đây là một hệ thống nhà thông minh IoT với kiến trúc **cấu hình động (Dynamic Configuration)** và **Plug & Play**, cho phép người dùng dễ dàng thêm, sửa, xóa thiết bị thông qua ứng dụng mobile mà không cần thay đổi mã nguồn. Hệ thống được thiết kế với **luồng phản hồi hai chiều hoàn chỉnh (bidirectional communication)**, đảm bảo đồng bộ trạng thái thời gian thực giữa phần cứng, backend và giao diện người dùng.

## 2. KIẾN TRÚC TỔNG QUAN

### 2.1. Kiến trúc Backend (Microservices)

Backend được xây dựng theo mô hình **microservices** với ngôn ngữ **Golang**, bao gồm các service:

#### **Gateway Service**
- Điểm vào duy nhất cho toàn bộ hệ thống
- Xử lý routing, authentication middleware (JWT)
- Proxy requests tới các service tương ứng:
  - `auth_proxy.go`: Chuyển hướng tới Auth Service
  - `core_proxy.go`: Chuyển hướng tới Core Service
- CORS middleware để xử lý cross-origin requests

#### **Auth Service**
- Quản lý xác thực và phân quyền người dùng
- Database: `auth_db` (PostgreSQL)
- Chức năng:
  - Đăng ký, đăng nhập người dùng
  - Tạo và xác thực JWT token
  - Hash password (bcrypt)
  - Quản lý mã MCU của người dùng

**Database Schema (auth_db):**
```sql
CREATE TABLE tbl_user (
    id SERIAL PRIMARY KEY,
    mcu_code INT DEFAULT -1,           -- Mã MCU được gán cho user
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hash_password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **Core Service**
- Service chính xử lý logic nghiệp vụ của hệ thống nhà thông minh
- Database: `core_db` (PostgreSQL)
- Kiến trúc bên trong:
  - **Feature modules:** device, event, log, mcu, notification, pendingActions, sensorData
  - **Infrastructure:** database, mosquitto (MQTT), websocket
  - **Realtime:** Xử lý MQTT và WebSocket cho truyền thông thời gian thực
    - `mqttHandler.go` & `mqttService.go`: Xử lý MQTT messages
    - `wsHandler.go` & `wsService.go`: Xử lý WebSocket connections
    - `coreService.go`: Điều phối giữa MQTT và WebSocket

**Database Schema (core_db):**

```sql
-- Bảng MCU: Quản lý các vi điều khiển
CREATE TABLE tbl_mcu (
    id SERIAL PRIMARY KEY,
    uid INT UNIQUE NOT NULL,              -- User ID sở hữu MCU
    mcu_code INT UNIQUE NOT NULL,         -- Mã định danh MCU
    available_port INT[],                 -- Mảng các cổng khả dụng
    firmware_version VARCHAR(255),
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Device: Quản lý thiết bị IoT
CREATE TABLE tbl_device (
    id SERIAL PRIMARY KEY,
    uid INT NOT NULL,                     -- User ID
    mid INT NOT NULL,                     -- MCU ID
    rid INT,                              -- Room ID (tùy chọn)
    name VARCHAR(255),                    -- Tên thiết bị
    type VARCHAR(255),                    -- Loại: digitalDevice, analogDevice, digitalSensor, temperatureSensor, humiditySensor, analogSensor
    port INT UNIQUE,                      -- Cổng GPIO được sử dụng
    status BOOLEAN,                       -- Trạng thái ON/OFF
    data JSONB,                          -- Dữ liệu mở rộng (level, value, etc.)
    running_time INT DEFAULT 0,           -- Thời gian hoạt động
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mid) REFERENCES tbl_mcu (id) ON DELETE CASCADE
);

-- Bảng Events: Lịch sử sự kiện điều khiển
CREATE TABLE tbl_events (
    id SERIAL PRIMARY KEY,
    uid INT NOT NULL,
    did INT,                              -- Device ID
    action VARCHAR(255),                  -- Hành động: ON, OFF, SET_LEVEL
    payload JSONB,                        -- Chi tiết payload
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (did) REFERENCES tbl_device (id) ON DELETE CASCADE
);

-- Bảng Sensor Data: Lưu trữ dữ liệu cảm biến
CREATE TABLE tbl_sensor_data (
    id SERIAL PRIMARY KEY,
    uid INT NOT NULL,
    did INT,                              -- Device ID (sensor)
    value FLOAT,                          -- Giá trị đo được
    unit VARCHAR(50),                     -- Đơn vị: °C, %, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (did) REFERENCES tbl_device (id) ON DELETE CASCADE
);

-- Bảng Log: Ghi log hệ thống
CREATE TABLE tbl_log (
    id SERIAL PRIMARY KEY,
    uid INT,
    level VARCHAR(100),                   -- INFO, WARNING, ERROR
    message TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Notification: Thông báo cho người dùng
CREATE TABLE tbl_notification (
    id SERIAL PRIMARY KEY,
    uid INT NOT NULL,
    mcu_code INT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Pending Actions: Hành động chờ xử lý khi MCU offline
CREATE TABLE pending_actions (
    id SERIAL PRIMARY KEY,
    uid INT NOT NULL,
    mid INT NOT NULL,
    action VARCHAR(100) NOT NULL,         -- CONTROL, UPDATE_CONFIG, etc.
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES tbl_mcu (uid) ON DELETE CASCADE,
    FOREIGN KEY (mid) REFERENCES tbl_mcu (id) ON DELETE CASCADE
);
```

**Triggers & Functions quan trọng:**
- `fn_device_insert()`: Tự động loại bỏ port khỏi available_port khi thêm device
- `fn_device_delete()`: Tự động trả port về available_port khi xóa device
- `fn_device_update()`: Cập nhật available_port khi đổi port
- `fn_check_port_validity()`: Kiểm tra port có khả dụng trước khi insert
- `get_available_ports(mcuCode)`: Lấy danh sách port khả dụng cho MCU

#### **GenAI Service** (Dự kiến)
- Service tích hợp AI/ML cho các tính năng thông minh
- Chưa được triển khai đầy đủ

### 2.2. Infrastructure

#### **MQTT Broker (Mosquitto)**
- Trung tâm truyền thông giữa Backend và MCU
- Cấu hình tại: `backend/infra/mosquitto/config/`
- Xác thực: username/password (file `passwd`)

**Các MQTT Topics quan trọng:**
- `MQTT_TOPIC_SUB_CONFIG_REQ`: MCU yêu cầu cấu hình
- `MQTT_TOPIC_PUB_CONFIG_RESP`: Backend gửi cấu hình về MCU
- `MQTT_TOPIC_SUB_CONTROL_REQ`: Backend gửi lệnh điều khiển tới MCU
- `MQTT_TOPIC_SUB_CONTROL_RES`: MCU phản hồi sau khi thực thi lệnh
- `MQTT_TOPIC_PUB_DATA`: MCU publish dữ liệu cảm biến

#### **PostgreSQL**
- Hai database riêng biệt: `auth_db` và `core_db`
- Sử dụng migrations để quản lý schema

#### **Docker Compose**
- File: `backend/infra/docker-compose.yml`
- Orchestrate tất cả các service: Gateway, Auth, Core, MQTT, PostgreSQL

### 2.3. Client Side (Mobile App)

#### **Công nghệ:**
- **Framework:** React Native (Expo)
- **Ngôn ngữ:** TypeScript
- **Kiến trúc:** Clean Architecture (Domain - Data - Presentation)
- **Internationalization:** i18n (English, Vietnamese)

#### **Cấu trúc thư mục:**

**Domain Layer (`src/domain/`):**
- `model/`: Định nghĩa entities (Auth, Device, Event, MCU, Notification, SensorData, Weather, Websocket)
- `repo/`: Interfaces cho repositories
- `usecase/`: Business logic cho từng feature
  - `auth/`: loginUsecase, registerUsecase, verifyToken
  - `device/`: createDevice, deleteDevice, getAllDevices, updateDevice
  - `event/`: getEvent, getListEvents, getEventByIDAndValue
  - `mcu/`: createMCU, deleteMCU, getAvailablePorts, updateFirmware, updateMCU
  - `notification/`: getNotifications, markAsReadUsecase
  - `sensorData/`: getByIdAndValue, getListSensorData, getListSensorDataByDID
  - `weather/`: getUsecase

**Infrastructure Layer (`src/infra/`):**
- `api/http/`: REST API clients (authApi, deviceApi, eventApi, mcuApi, notificationApi, sensorDataApi, weatherApi)
- `api/websocket/`: WebSocket client cho real-time communication
- `storage/`: Local storage (authStorage cho JWT token)
- `config/`: API configuration

**Presentation Layer (`src/presentation/`):**
- `hooks/`: Custom hooks cho ViewModel pattern
  - `useAuthViewModel`, `useDashboardViewModel`, `useDevicesViewModel`
  - `useEventViewModel`, `useNotificationViewModel`, `useSensorViewModel`
  - `useDeviceCard`, `useDeviceControl`
  - `NotificationContext`, `useAppContext`
- `screens/`: Các màn hình chính
  - `auth/`: LoginScreen, RegisterScreen
  - `dashboard/`: DashboardScreen với các widgets (Chart, Humidity, Temperature, Room, Weather)
  - `devices/`: DeviceScreen với modal thêm/sửa thiết bị
  - `events/`: EventScreen
  - `sensors/`: SensorScreen
  - `account/`, `notifications/`, `welcome/`
- `shared/components/`: Reusable components
  - AccountWidget, EventTableWidget, SensorDataTableWidget
  - FlexButton, TextField, PasswordTextField, TextWidget
  - NavigationBar, TopBarWidget, SearchTableWidget

**Screens:**
- **Dashboard:** Hiển thị tổng quan hệ thống, thời tiết, nhiệt độ, độ ẩm, điều khiển thiết bị theo phòng
- **Device:** Quản lý thiết bị (thêm, sửa, xóa), hiển thị trạng thái real-time
- **Event:** Xem lịch sử sự kiện điều khiển
- **Sensor:** Xem dữ liệu cảm biến theo thời gian
- **Account:** Thông tin tài khoản
- **Notification:** Thông báo hệ thống

### 2.4. Embedded System

#### **ESP32-CYD (Cheap Yellow Display)**
- **Hardware:** ESP32 với màn hình TFT cảm ứng
- **Framework:** Arduino (PlatformIO)
- **Thư viện chính:**
  - `TFT_eSPI`: Điều khiển màn hình TFT
  - `XPT2046_Touchscreen`: Xử lý cảm ứng
  - `PubSubClient`: MQTT client
  - `ArduinoJson`: Parse/Serialize JSON

**Cấu trúc code (`embedded/ESP32-CYD-UI/V1.0/`):**

**Include Files:**
- `WIFI_CONF.h`: Cấu hình WiFi (SSID, Password)
- `MQTT_CONF.h`: Cấu hình MQTT (Server, Port, Topics, Credentials)
- `TFT_CONF.h`: Cấu hình màn hình TFT (pins, settings)
- `DeviceManager.h`: Quản lý danh sách thiết bị và tương tác

**Models (`src/model/`):**
- `Device.h`: Định nghĩa device structure
- `Sensor.h`: Định nghĩa sensor structure
- `Event.h`, `Notification.h`, `SensorData.h`: Các models khác

**Screen & Widgets (`src/screen/`, `src/widget/`):**
- `Screen.h/.cpp`: Quản lý các màn hình, pagination, navigation
- `TabBar.h`: Tab bar chuyển đổi giữa Home và Devices
- `WidgetCard.h`: Base class cho tất cả widgets
- `DigitalDevice.h`: Widget cho thiết bị digital (ON/OFF button)
- `AnalogDevice.h`: Widget cho thiết bị analog (slider điều chỉnh level)
- `DigitalSensor.h`: Widget hiển thị sensor digital (status indicator)
- `AnalogSensor.h`: Widget hiển thị sensor analog (gauge với giá trị)

**Utils:**
- `JSONUtils.h`: Utility functions cho JSON parsing
- `Logger.h`: Logging utilities

**Main Logic (`src/main.cpp`):**
- Kết nối WiFi và MQTT broker
- Subscribe các topics: CONFIG_RESP, CONTROL_REQ, DATA
- Publish yêu cầu cấu hình khi khởi động
- Nhận JSON config và tự động tạo widgets tương ứng
- Xử lý touch events trên màn hình
- Publish dữ liệu cảm biến định kỳ (mỗi 5 giây)
- Publish phản hồi khi thực hiện lệnh điều khiển
- Logic đặc biệt: Cảnh báo khi cảm biến mưa/gió > 50 (gửi tín hiệu tới Arduino qua Serial)

#### **Arduino UNO**
- Kết nối với ESP32 qua Serial
- Nhận tín hiệu cảnh báo từ ESP32
- Điều khiển LED hoặc buzzer để cảnh báo

## 3. LUỒNG HOẠT ĐỘNG HỆ THỐNG

### 3.1. Luồng Khởi Tạo & Cấu Hình (Plug & Play)

```
1. MCU khởi động
   ↓
2. Kết nối WiFi
   ↓
3. Kết nối MQTT Broker
   ↓
4. Publish message lên MQTT_TOPIC_SUB_CONFIG_REQ (yêu cầu cấu hình)
   ↓
5. Backend (Core Service) subscribe topic này
   ↓
6. Backend query database để lấy danh sách devices của MCU
   ↓
7. Backend publish JSON config lên MQTT_TOPIC_PUB_CONFIG_RESP
   ↓
8. MCU nhận JSON config
   ↓
9. MCU parse JSON và tự động tạo widgets trên màn hình TFT
   ↓
10. Hệ thống sẵn sàng hoạt động
```

**Ví dụ JSON Config:**
```json
{
  "topic": "config",
  "payload": [
    {
      "did": 1,
      "name": "Đèn phòng khách",
      "type": "digitalDevice",
      "pin": 2,
      "status": false
    },
    {
      "did": 2,
      "name": "Quạt phòng ngủ",
      "type": "analogDevice",
      "pin": 4,
      "status": true,
      "level": 2
    },
    {
      "id": 3,
      "name": "Nhiệt độ",
      "type": "temperatureSensor",
      "port": 5,
      "value": 28.5
    }
  ]
}
```

### 3.2. Luồng Điều Khiển (Bidirectional Communication)

**Khi user điều khiển từ Mobile App:**
```
1. User thao tác trên Mobile App (bật/tắt đèn, điều chỉnh quạt)
   ↓
2. App gửi HTTP request tới Gateway
   ↓
3. Gateway xác thực JWT token
   ↓
4. Gateway forward request tới Core Service
   ↓
5. Core Service cập nhật database (tbl_device, tbl_events)
   ↓
6. Core Service publish lệnh điều khiển lên MQTT_TOPIC_SUB_CONTROL_REQ
   Message format: {"did": 1, "command": "ON", "value": 2}
   ↓
7. MCU subscribe topic này và nhận lệnh
   ↓
8. MCU thực thi lệnh (bật GPIO, điều chỉnh PWM)
   ↓
9. MCU cập nhật widget trên màn hình TFT
   ↓
10. MCU publish phản hồi lên MQTT_TOPIC_SUB_CONTROL_RES ✅
    Message: {"did": 1, "status": "success", "current_state": {...}}
   ↓
11. Backend nhận phản hồi và cập nhật database
   ↓
12. Backend broadcast trạng thái mới qua WebSocket
   ↓
13. Mobile App nhận update qua WebSocket và cập nhật UI real-time
```

**Khi user điều khiển trực tiếp trên màn hình MCU:**
```
1. User touch vào widget trên màn hình TFT
   ↓
2. Widget callback được trigger
   ↓
3. DeviceManager cập nhật trạng thái local
   ↓
4. MCU publish state change lên MQTT_TOPIC_SUB_CONTROL_RES
   ↓
5. Backend nhận và cập nhật database
   ↓
6. Backend broadcast qua WebSocket
   ↓
7. Mobile App cập nhật UI real-time
```

### 3.3. Luồng Dữ Liệu Cảm Biến

```
1. MCU đọc dữ liệu từ cảm biến (mỗi 5 giây)
   ↓
2. MCU publish dữ liệu lên MQTT_TOPIC_PUB_DATA
   Message: {"topic": "sensor_data", "payload": {"did": 3, "value": 28.5}}
   ↓
3. Backend subscribe và nhận dữ liệu
   ↓
4. Backend lưu vào tbl_sensor_data
   ↓
5. Backend broadcast qua WebSocket
   ↓
6. Mobile App nhận và cập nhật UI (charts, gauges)
   ↓
7. MCU cũng cập nhật widget cảm biến trên màn hình TFT
```

**Logic đặc biệt:**
- Nếu cảm biến mưa > 50: MCU gửi byte '1' qua Serial → Arduino bật LED1
- Nếu cảm biến gió > 50: MCU gửi byte '2' qua Serial → Arduino bật LED2

### 3.4. Luồng Thêm Thiết Bị Mới (Dynamic Configuration)

```
1. User mở Mobile App → màn hình Devices
   ↓
2. Nhấn nút "+" (FloatButton)
   ↓
3. Modal hiển thị: chọn MCU, chọn type, nhập name
   ↓
4. App gọi API GET /mcu/{mcuCode}/available-ports để lấy ports khả dụng
   ↓
5. User chọn port và submit
   ↓
6. App gọi API POST /devices
   Body: {"uid": 1, "mid": 1, "name": "Đèn mới", "type": "digitalDevice", "port": 7}
   ↓
7. Core Service validate (kiểm tra port có khả dụng?)
   ↓
8. Trigger fn_check_port_validity() kiểm tra trong available_port[]
   ↓
9. Insert vào tbl_device
   ↓
10. Trigger fn_device_insert() tự động xóa port khỏi available_port[]
   ↓
11. Core Service publish cấu hình mới lên MQTT
   ↓
12. MCU nhận config mới và re-render toàn bộ widgets
   ↓
13. Backend broadcast event qua WebSocket
   ↓
14. Mobile App cập nhật danh sách thiết bị
```

### 3.5. Luồng Xóa Thiết Bị

```
1. User nhấn nút xóa trên Device Card
   ↓
2. App gọi API DELETE /devices/{id}
   ↓
3. Core Service xóa bản ghi trong tbl_device
   ↓
4. Trigger fn_device_delete() tự động trả port về available_port[]
   ↓
5. Cascade delete: tbl_events và tbl_sensor_data liên quan cũng bị xóa
   ↓
6. Core Service publish config mới
   ↓
7. MCU nhận và re-render
   ↓
8. Mobile App cập nhật UI
```

## 4. TÍNH NĂNG NỔI BẬT

### 4.1. Plug & Play Hoàn Toàn Tự Động
- Không cần code lại khi thêm thiết bị mới
- MCU tự động tạo UI dựa trên JSON config
- Mobile App tự động render widgets phù hợp với loại thiết bị

### 4.2. Luồng Phản Hồi Hai Chiều (Bidirectional)
- MCU ↔ Backend ↔ Mobile App đều đồng bộ real-time
- Điều khiển từ bất kỳ đâu đều được phản ánh ngay lập tức
- MCU có màn hình TFT độc lập, không phụ thuộc vào mobile

### 4.3. Quản Lý Port Thông Minh
- Database tự động quản lý port khả dụng bằng array
- Triggers đảm bảo không có conflict port
- Function `get_available_ports()` trả về ports thực sự khả dụng

### 4.4. Kiến Trúc Clean & Scalable
- Backend: Microservices, dễ mở rộng
- Frontend: Clean Architecture, dễ maintain
- Embedded: Component-based widgets, dễ thêm loại thiết bị mới

### 4.5. Real-time Communication
- MQTT cho IoT (lightweight, efficient)
- WebSocket cho mobile app (low latency)
- Kết hợp cả hai để tối ưu truyền thông

### 4.6. Pending Actions (Offline Support)
- Khi MCU offline, lệnh điều khiển được lưu vào `pending_actions`
- Khi MCU online lại, backend tự động gửi các lệnh chưa thực hiện
- Status tracking: pending → completed/failed

## 5. CÔNG NGHỆ SỬ DỤNG

### Backend:
- **Language:** Golang
- **Framework:** Gin (HTTP), Gorilla WebSocket
- **Database:** PostgreSQL
- **MQTT:** Eclipse Mosquitto
- **Protocol:** MQTT, WebSocket, HTTP REST
- **Authentication:** JWT
- **Containerization:** Docker, Docker Compose

### Frontend (Mobile):
- **Framework:** React Native (Expo)
- **Language:** TypeScript
- **State Management:** React Hooks, Context API
- **HTTP Client:** Axios
- **WebSocket:** Native WebSocket API
- **UI:** Custom components, React Native Paper (optional)
- **i18n:** react-i18next

### Embedded:
- **Platform:** ESP32 (ESP32-2432S028R - CYD)
- **Framework:** Arduino (PlatformIO)
- **Display:** TFT LCD 320x240 (ILI9341) with Touch (XPT2046)
- **Communication:** WiFi, MQTT, Serial
- **Libraries:** TFT_eSPI, PubSubClient, ArduinoJson

## 6. HƯỚNG PHÁT TRIỂN

- **GenAI Integration:** Trợ lý ảo thông minh, tự động hóa dựa trên AI
- **Voice Control:** Điều khiển bằng giọng nói
- **Scene/Automation:** Tạo kịch bản tự động hóa phức tạp
- **Energy Monitoring:** Giám sát tiêu thụ điện năng chi tiết
- **Multi-MCU Support:** Hỗ trợ nhiều MCU trong một hệ thống
- **Cloud Deployment:** Deploy backend lên AWS/GCP
- **Mobile Notifications:** Push notification khi có sự kiện quan trọng

