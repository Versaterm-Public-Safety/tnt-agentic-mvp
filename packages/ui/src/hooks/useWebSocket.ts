import { useEffect, useState, useCallback, useRef } from 'react';

export interface TranscriptMessage {
  id: string;
  text: string;
  speaker: 'caller' | 'agent';
  confidence: number;
  timestamp: string;
  isFinal: boolean;
}

export interface WebSocketMessage {
  type: 'transcript' | 'status' | 'error';
  callId?: string;
  transcript?: TranscriptMessage;
  status?: 'connected' | 'disconnected' | 'reconnecting';
  code?: string;
  message?: string;
  timestamp?: string;
}

export interface UseWebSocketOptions {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export interface UseWebSocketReturn {
  transcripts: TranscriptMessage[];
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  error: string | null;
  reconnectAttempts: number;
}

export function useWebSocket(options: UseWebSocketOptions): UseWebSocketReturn {
  const {
    url,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
  } = options;

  const [transcripts, setTranscripts] = useState<TranscriptMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReconnectRef = useRef(true);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN || 
        wsRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnectionStatus('connected');
        setReconnectAttempts(0);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          if (message.type === 'transcript' && message.transcript) {
            setTranscripts((prev) => [...prev, message.transcript!]);
          } else if (message.type === 'status') {
            if (message.status) {
              setConnectionStatus(message.status);
            }
          } else if (message.type === 'error') {
            setError(message.message || 'Unknown error');
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('WebSocket connection error');
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        setConnectionStatus('disconnected');

        if (shouldReconnectRef.current && reconnectAttempts < maxReconnectAttempts) {
          setConnectionStatus('reconnecting');
          setReconnectAttempts((prev) => prev + 1);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else if (reconnectAttempts >= maxReconnectAttempts) {
          setError(`Failed to reconnect after ${maxReconnectAttempts} attempts`);
        }
      };
    } catch (err) {
      console.error('Failed to create WebSocket:', err);
      setError('Failed to establish WebSocket connection');
      setConnectionStatus('disconnected');
    }
  }, [url, reconnectInterval, maxReconnectAttempts, reconnectAttempts]);

  useEffect(() => {
    shouldReconnectRef.current = true;
    connect();

    return () => {
      shouldReconnectRef.current = false;
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  return {
    transcripts,
    connectionStatus,
    error,
    reconnectAttempts,
  };
}
