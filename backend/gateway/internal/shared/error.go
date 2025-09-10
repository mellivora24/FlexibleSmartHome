package shared

import "errors"

var (
	ErrInvalidInput     = errors.New("invalid input")
	ErrUnauthorized     = errors.New("unauthorized")
	ErrForbidden        = errors.New("forbidden")
	ErrNotFound         = errors.New("not found")
	ErrInternalServer   = errors.New("internal server error")
	ErrServiceUnavailable = errors.New("service unavailable")
)
