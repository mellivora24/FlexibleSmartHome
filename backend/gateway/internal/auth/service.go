package auth

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"time"

	"github.com/mellivora24/flexiblesmarthome/gateway/internal/shared"
)

type Service interface {
	VerifyToken(token string) (*VerifyTokenResponse, error)
}

type service struct {
	authServiceURL string
	httpClient     *http.Client
}

func NewService(authServiceURL string) Service {
	return &service{
		authServiceURL: authServiceURL,
		httpClient: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

func (s *service) VerifyToken(token string) (*VerifyTokenResponse, error) {
	if token == "" {
		return nil, shared.ErrInvalidInput
	}

	u, _ := url.Parse(s.authServiceURL)
	q := u.Query()
	q.Set("token", token)
	u.RawQuery = q.Encode()

	req, err := http.NewRequest("POST", u.String(), nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to call auth service: %w", err)
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			log.Print("failed to close response body")
			return
		}
	}(resp.Body)

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		//log.Print("Error when verifying token: status not ok")
		return nil, shared.ErrUnauthorized
	}

	var authResp struct {
		Data VerifyTokenResponse `json:"data"`
	}

	if err := json.Unmarshal(body, &authResp); err != nil {
		return nil, fmt.Errorf("failed to parse auth response: %w", err)
	}

	if !authResp.Data.IsValid {
		//log.Print("Token is invalid")
		return nil, shared.ErrUnauthorized
	}

	return &authResp.Data, nil
}
