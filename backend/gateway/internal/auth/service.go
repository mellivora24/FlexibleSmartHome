package auth

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
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

	req, err := http.NewRequest("POST", s.authServiceURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to call auth service: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, shared.ErrUnauthorized
	}

	var authResp struct {
		Data VerifyTokenResponse `json:"data"`
	}

	if err := json.Unmarshal(body, &authResp); err != nil {
		return nil, fmt.Errorf("failed to parse auth response: %w", err)
	}

	if !authResp.Data.IsValid {
		return nil, shared.ErrUnauthorized
	}

	return &authResp.Data, nil
}
