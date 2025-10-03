package proxy

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type CoreProxy struct {
	coreServiceURL   string
	coreServiceWSURL string
	httpClient       *http.Client
}

func NewCoreProxy(coreServiceURL string, coreServiceWSURL string) *CoreProxy {
	return &CoreProxy{
		coreServiceURL:   coreServiceURL,
		coreServiceWSURL: coreServiceWSURL,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // TODO: kiểm soát origin
	},
}

func (p *CoreProxy) ProxyRequest(c *gin.Context) {
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

	if userID, exists := c.Get("user_id"); exists {
		req.Header.Set("X-User-ID", fmt.Sprintf("%v", userID))
	}
	if mid, exists := c.Get("mid"); exists {
		req.Header.Set("X-MID", fmt.Sprintf("%v", mid))
	}

	resp, err := p.httpClient.Do(req)
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Core service unavailable"})
		return
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			log.Print("Failed to close response body")
		}
	}(resp.Body)

	for key, values := range resp.Header {
		for _, value := range values {
			c.Header(key, value)
		}
	}

	c.Status(resp.StatusCode)

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read response"})
		return
	}

	c.Data(resp.StatusCode, resp.Header.Get("Content-Type"), body)
}

func (p *CoreProxy) ProxyWebSocket(c *gin.Context) {
	uid, _ := c.Get("user_id")
	mid, _ := c.Get("mid")

	targetURL := fmt.Sprintf("%s/ws?uid=%v&mid=%v", p.coreServiceWSURL, uid, mid)
	if c.Request.URL.RawQuery != "" {
		targetURL += "&" + c.Request.URL.RawQuery
	}

	fmt.Println("Connecting to core WebSocket at:", targetURL)

	clientConn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		http.Error(c.Writer, "Failed to upgrade client connection", http.StatusBadRequest)
		return
	}
	defer clientConn.Close()

	u, _ := url.Parse(targetURL)
	coreConn, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		_ = clientConn.WriteMessage(websocket.CloseMessage,
			websocket.FormatCloseMessage(websocket.CloseInternalServerErr, "Failed to connect core service"))
		return
	}
	defer coreConn.Close()

	errc := make(chan error, 2)

	go func() {
		for {
			mt, msg, err := clientConn.ReadMessage()
			if err != nil {
				errc <- err
				return
			}
			err = coreConn.WriteMessage(mt, msg)
			if err != nil {
				errc <- err
				return
			}
		}
	}()

	go func() {
		for {
			mt, msg, err := coreConn.ReadMessage()
			if err != nil {
				errc <- err
				return
			}
			err = clientConn.WriteMessage(mt, msg)
			if err != nil {
				errc <- err
				return
			}
		}
	}()

	<-errc
}
