package model

import (
	"fmt"
	"sync"

	ws "github.com/gorilla/websocket"
)

type Client interface {
	Send(message []byte) error
	Close() error
	GetUID() string
	GetMID() string
	GetSendChannel() <-chan []byte
	GetConn() *ws.Conn
}

type WSClient struct {
	uid  string
	mid  string
	conn *ws.Conn
	send chan []byte
	once sync.Once
}

func NewWSClient(uid string, mid string, conn *ws.Conn) *WSClient {
	return &WSClient{
		uid:  uid,
		mid:  mid,
		conn: conn,
		send: make(chan []byte, 256),
	}
}

func (c *WSClient) GetUID() string {
	return c.uid
}

func (c *WSClient) GetMID() string {
	return c.mid
}

func (c *WSClient) Send(msg []byte) error {
	select {
	case c.send <- msg:
		return nil
	default:
		return fmt.Errorf("client websocket channel full")
	}
}

func (c *WSClient) Close() error {
	var err error
	c.once.Do(func() {
		close(c.send)
		err = c.conn.Close()
	})
	return err
}

func (c *WSClient) GetSendChannel() <-chan []byte {
	return c.send
}

func (c *WSClient) GetConn() *ws.Conn {
	return c.conn
}
