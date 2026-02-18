import { useState, useEffect, useRef } from 'react';
import { WebSocketMessage } from '../types';

const GATEWAY_URL = 'ws://localhost:18789';
const GATEWAY_TOKEN = '7b4c1e60de9a78dcfeb19cd185eed50268bc99234b8664f2';

export function useWebSocket() {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const ws = new WebSocket(GATEWAY_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      // Authenticate
      sendMessage('connect', {
        role: 'operator',
        auth: { token: GATEWAY_TOKEN }
      });
    };

    ws.onmessage = (event) => {
      const data: WebSocketMessage = JSON.parse(event.data);
      console.log('Received:', data);

      if (data.type === 'resp' && data.result) {
        setConnected(true);
        setError(null);
      } else if (data.error) {
        setError(data.error.message || 'Connection failed');
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Connection failed');
      setConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = (method: string, params?: any) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return Promise.reject('Not connected');
    }

    const id = ++requestIdRef.current;
    const message = {
      type: 'req',
      id,
      method,
      params
    };

    return new Promise((resolve, reject) => {
      const handler = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        if (data.id === id) {
          wsRef.current?.removeEventListener('message', handler);
          if (data.error) {
            reject(data.error);
          } else {
            resolve(data.result);
          }
        }
      };

      wsRef.current?.addEventListener('message', handler);
      wsRef.current?.send(JSON.stringify(message));

      // Timeout after 30 seconds
      setTimeout(() => {
        wsRef.current?.removeEventListener('message', handler);
        reject(new Error('Request timeout'));
      }, 30000);
    });
  };

  const sendAgentMessage = async (sessionKey: string, message: string) => {
    return sendMessage('sessions.send', {
      sessionKey,
      message
    });
  };

  return { connected, error, sendMessage, sendAgentMessage };
}
