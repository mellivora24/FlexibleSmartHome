package auth

type VerifyTokenResponse struct {
	UID     int  `json:"uid"`
	MCUCode int  `json:"mcu_code"`
	IsValid bool `json:"valid"`
}
