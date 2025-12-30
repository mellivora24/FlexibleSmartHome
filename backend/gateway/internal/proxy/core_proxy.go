package proxy

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/mellivora24/flexiblesmarthome/gateway/internal/auth"
)

type CoreProxy struct {
	coreServiceURL   string
	coreServiceWSURL string
	httpClient       *http.Client
	authService      auth.Service
}

func NewCoreProxy(coreServiceURL, coreServiceWSURL string, authService auth.Service) *CoreProxy {
	return &CoreProxy{
		coreServiceURL:   coreServiceURL,
		coreServiceWSURL: coreServiceWSURL,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
		authService: authService,
	}
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // TODO: Implement proper origin checking in production
	},
}

func (p *CoreProxy) ProxyRequest(c *gin.Context) {
	isAuth, exists := c.Get("is_authenticated")
	if !exists || isAuth != true {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	userID, uidExists := c.Get("user_id")
	mcuCode, mcuExists := c.Get("mcu_code")

	if !uidExists || !mcuExists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing authentication context"})
		return
	}

	path := strings.TrimPrefix(c.Request.URL.Path, "/api/v1/core")
	if path == "" {
		path = "/"
	}

	targetURL := p.coreServiceURL + path
	if c.Request.URL.RawQuery != "" {
		targetURL += "?" + c.Request.URL.RawQuery
	}

	req, err := http.NewRequest(c.Request.Method, targetURL, c.Request.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
		return
	}

	for key, values := range c.Request.Header {
		for _, value := range values {
			req.Header.Add(key, value)
		}
	}

	req.Header.Set("X-UID", fmt.Sprintf("%v", userID))
	req.Header.Set("X-MCU", fmt.Sprintf("%v", mcuCode))

	resp, err := p.httpClient.Do(req)
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Core service unavailable"})
		return
	}
	defer func(Body io.ReadCloser) {
		if cerr := Body.Close(); cerr != nil {
			log.Printf("Failed to close response body: %v", cerr)
		}
	}(resp.Body)

	for key, values := range resp.Header {
		for _, value := range values {
			c.Header(key, value)
		}
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read response"})
		return
	}

	c.Data(resp.StatusCode, resp.Header.Get("Content-Type"), body)
}

func (p *CoreProxy) ProxyWebSocket(c *gin.Context) {
	timeout := 5 * time.Second

	clientConn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		http.Error(c.Writer, "Failed to upgrade client connection", http.StatusBadRequest)
		return
	}
	defer clientConn.Close()

	clientConn.SetReadDeadline(time.Now().Add(timeout))

	_, msg, err := clientConn.ReadMessage()
	if err != nil {
		clientConn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.ClosePolicyViolation, "Auth timeout"))
		return
	}

	clientConn.SetReadDeadline(time.Time{})

	var authMsg struct {
		Topic   string `json:"topic"`
		Payload string `json:"payload"`
	}

	if err := json.Unmarshal(msg, &authMsg); err != nil || authMsg.Topic != "auth" || authMsg.Payload == "" {
		clientConn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.ClosePolicyViolation, "Invalid auth format"))
		return
	}

	token := strings.TrimPrefix(authMsg.Payload, "Bearer ")

	authResp, err := p.authService.VerifyToken(token)
	if err != nil {
		clientConn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.ClosePolicyViolation, "Unauthorized"))
		return
	}

	fmt.Println("Authenticated user:", authResp.UID, " MCU:", authResp.MCUCode)

	targetURL := fmt.Sprintf("%s/ws?uid=%v&mcu_code=%v", p.coreServiceWSURL, authResp.UID, authResp.MCUCode)
	coreConn, _, err := websocket.DefaultDialer.Dial(targetURL, nil)
	if err != nil {
		clientConn.WriteMessage(websocket.CloseMessage,
			websocket.FormatCloseMessage(websocket.CloseInternalServerErr, "Failed to connect core service"))
		return
	}
	defer coreConn.Close()

	errc := make(chan error, 2)
	forward := func(src, dst *websocket.Conn) {
		for {
			mt, msg, err := src.ReadMessage()
			if err != nil {
				errc <- err
				return
			}
			if err := dst.WriteMessage(mt, msg); err != nil {
				errc <- err
				return
			}
		}
	}

	go forward(clientConn, coreConn)
	go forward(coreConn, clientConn)

	<-errc
}
