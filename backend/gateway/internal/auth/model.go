package auth

type VerifyTokenResponse struct {
	UID     int64 `json:"uid"`
	MID     int64 `json:"mid"`
	IsValid bool  `json:"valid"`
}
