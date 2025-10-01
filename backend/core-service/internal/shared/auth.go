package shared

import (
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(authServiceURL string) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		if token == "" {
			token = c.Query("token")
		}
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing token"})
			c.Abort()
			return
		}

		verifyURL := fmt.Sprintf("%s/api/v1/auth/verify?token=%s", authServiceURL, token)
		resp, err := http.Post(verifyURL, "application/json", nil)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Auth service unavailable"})
			c.Abort()
			return
		}
		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			body, _ := ioutil.ReadAll(resp.Body)
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": fmt.Sprintf("Token invalid: %s", string(body)),
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
