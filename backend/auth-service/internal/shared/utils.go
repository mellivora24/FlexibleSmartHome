package shared

import (
	"strconv"
	"strings"
)

func StringToInt64(str string) (int64, error) {
	if strings.TrimSpace(str) == "" {
		return 0, ErrcanparseidEmpytystring
	}

	num, err := strconv.ParseInt(str, 10, 64)
	if err != nil {
		return 0, err
	}

	return num, nil
}
