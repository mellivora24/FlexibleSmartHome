package realtime

import (
	"log"
	"sync"
)

type Client interface {
	Send(message []byte) error
	Close() error
}

type Manager struct {
	clients map[string][]Client
	mu      sync.RWMutex
}

func NewManager() *Manager {
	return &Manager{
		clients: make(map[string][]Client),
	}
}

func (m *Manager) AddClient(uid string, c Client) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.clients[uid] = append(m.clients[uid], c)
}

func (m *Manager) RemoveClient(uid string, c Client) {
	m.mu.Lock()
	defer m.mu.Unlock()

	clients := m.clients[uid]
	for i, client := range clients {
		if client == c {
			m.clients[uid] = append(clients[:i], clients[i+1:]...)
			break
		}
	}

	if len(m.clients[uid]) == 0 {
		delete(m.clients, uid)
	}
}

func (m *Manager) BroadcastToUser(uid string, msg []byte) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	clients, ok := m.clients[uid]
	if !ok {
		log.Printf("[realtime/manager.go] No clients found for UID: %s", uid)
		return
	}

	for _, client := range clients {
		go func() {
			err := client.Send(msg)
			if err != nil {
				log.Println("[realtime/manager.go] Error sending message to client:", err)
				return
			}
		}()
	}
}
