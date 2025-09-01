package shared

import (
	"io"
	"net/http"
)

func VerifyToken(authCfg *AUTH_CONFIG, token string) bool {
	verifyUrl := authCfg.URL + token
	resp, err := http.Get(verifyUrl)
	if err != nil {
		return false
	}
	defer func(Body io.ReadCloser) {
		_ = Body.Close()
	}(resp.Body)

	if resp.StatusCode == http.StatusOK {
		return true
	}

	return false
}
