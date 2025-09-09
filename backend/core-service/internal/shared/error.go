package shared

import (
	"errors"
	"net/http"
)

// Custom error types
var (
	ErrNotFound         = errors.New("resource not found")
	ErrInvalidInput     = errors.New("invalid input")
	ErrUnauthorized     = errors.New("unauthorized")
	ErrForbidden        = errors.New("forbidden")
	ErrInternalError    = errors.New("internal server error")
	ErrDatabaseError    = errors.New("database error")
	ErrMQTTError        = errors.New("mqtt error")
	ErrWebSocketError   = errors.New("websocket error")
	ErrValidationError  = errors.New("validation error")
	ErrDuplicateEntry   = errors.New("duplicate entry")
	ErrResourceInUse    = errors.New("resource in use")
	ErrInvalidOperation = errors.New("invalid operation")
)

// ErrorResponse represents a standardized error response
type ErrorResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Details string `json:"details,omitempty"`
}

// GetHTTPStatus returns the appropriate HTTP status code for an error
func GetHTTPStatus(err error) int {
	switch err {
	case ErrNotFound:
		return http.StatusNotFound
	case ErrInvalidInput, ErrValidationError:
		return http.StatusBadRequest
	case ErrUnauthorized:
		return http.StatusUnauthorized
	case ErrForbidden:
		return http.StatusForbidden
	case ErrDuplicateEntry:
		return http.StatusConflict
	case ErrResourceInUse:
		return http.StatusConflict
	case ErrInvalidOperation:
		return http.StatusBadRequest
	default:
		return http.StatusInternalServerError
	}
}

// NewErrorResponse creates a new error response
func NewErrorResponse(err error, details ...string) ErrorResponse {
	response := ErrorResponse{
		Code:    GetHTTPStatus(err),
		Message: err.Error(),
	}
	
	if len(details) > 0 {
		response.Details = details[0]
	}
	
	return response
}
