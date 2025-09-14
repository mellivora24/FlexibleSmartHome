package proxy

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type CoreProxy struct {
	coreServiceURL string
	httpClient     *http.Client
}

func NewCoreProxy(coreServiceURL string) *CoreProxy {
	return &CoreProxy{
		coreServiceURL: coreServiceURL,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// ProxyRequest forwards the request to core service
func (p *CoreProxy) ProxyRequest(c *gin.Context) {
	// Get the path after /api/v1/gateway/core
	path := strings.TrimPrefix(c.Request.URL.Path, "/api/v1/gateway/core")
	if path == "" {
		path = "/"
	}

	// Build the target URL
	targetURL := p.coreServiceURL + path
	if c.Request.URL.RawQuery != "" {
		targetURL += "?" + c.Request.URL.RawQuery
	}

	// Create the request
	req, err := http.NewRequest(c.Request.Method, targetURL, c.Request.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
		return
	}

	// Copy headers
	for key, values := range c.Request.Header {
		for _, value := range values {
			req.Header.Add(key, value)
		}
	}

	// Add user information from context to headers for core service
	if userID, exists := c.Get("user_id"); exists {
		req.Header.Set("X-User-ID", fmt.Sprintf("%v", userID))
	}
	if mid, exists := c.Get("mid"); exists {
		req.Header.Set("X-MID", fmt.Sprintf("%v", mid))
	}

	// Make the request
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

	// Copy response headers
	for key, values := range resp.Header {
		for _, value := range values {
			c.Header(key, value)
		}
	}

	// Set status code
	c.Status(resp.StatusCode)

	// Copy response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read response"})
		return
	}

	c.Data(resp.StatusCode, resp.Header.Get("Content-Type"), body)
}

// ProxyWebSocket handles WebSocket connections to core service
func (p *CoreProxy) ProxyWebSocket(c *gin.Context) {
	// For WebSocket connections, we need to handle the upgrade differently
	// This is a simplified implementation - in production, you might want to use
	// a proper WebSocket proxy library

	// Get the path after /api/v1/gateway/ws
	path := strings.TrimPrefix(c.Request.URL.Path, "/api/v1/gateway/ws")
	if path == "" {
		path = "/"
	}

	// Build the target URL for core service WebSocket
	targetURL := p.coreServiceURL + "/realtime" + path
	if c.Request.URL.RawQuery != "" {
		targetURL += "?" + c.Request.URL.RawQuery
	}

	// Create the request
	req, err := http.NewRequest(c.Request.Method, targetURL, c.Request.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
		return
	}

	// Copy headers
	for key, values := range c.Request.Header {
		for _, value := range values {
			req.Header.Add(key, value)
		}
	}

	// Add user information from context to headers for core service
	if userID, exists := c.Get("user_id"); exists {
		req.Header.Set("X-User-ID", fmt.Sprintf("%v", userID))
	}
	if mid, exists := c.Get("mid"); exists {
		req.Header.Set("X-MID", fmt.Sprintf("%v", mid))
	}

	// Make the request
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

	// Copy response headers
	for key, values := range resp.Header {
		for _, value := range values {
			c.Header(key, value)
		}
	}

	// Set status code
	c.Status(resp.StatusCode)

	// Copy response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read response"})
		return
	}

	c.Data(resp.StatusCode, resp.Header.Get("Content-Type"), body)
}
