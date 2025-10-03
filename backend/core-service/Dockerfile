FROM golang:1.24-alpine AS builder

RUN apk add --no-cache git ca-certificates tzdata

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o core-service ./cmd/api/main.go

FROM alpine:latest

RUN apk update && apk add --no-cache ca-certificates tzdata
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

WORKDIR /app

COPY --from=builder /app/core-service .
COPY --from=builder /app/internal/config/config.yaml ./internal/config/
COPY --from=builder /app/migrations ./migrations/

RUN chown -R appuser:appgroup /app
USER appuser
EXPOSE 8082

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8082/api/v1/core/health || exit 1

CMD ["./core-service"]
