import { WebSocketServer, WebSocket } from 'ws';
import { WebSocketMessage } from './protocol';

interface WebSocketWithAlive extends WebSocket {
  isAlive: boolean;
}

export interface WebSocketServerConfig {
  port: number;
  heartbeatInterval?: number;
}

export class TntWebSocketServer {
  private wss: WebSocketServer | null = null;
  private clients: Set<WebSocketWithAlive> = new Set();
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private config: Required<WebSocketServerConfig>;

  constructor(config: WebSocketServerConfig) {
    this.config = {
      port: config.port,
      heartbeatInterval: config.heartbeatInterval ?? 30000,
    };
  }

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.wss = new WebSocketServer({ port: this.config.port });

        this.wss.on('connection', (ws: WebSocket) => {
          this.handleConnection(ws);
        });

        this.wss.on('listening', () => {
          console.log(`WebSocket server listening on port ${this.config.port}`);
          this.startHeartbeat();
          resolve();
        });

        this.wss.on('error', (error) => {
          console.error('WebSocket server error:', error);
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async stop(): Promise<void> {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.close();
      }
    });
    this.clients.clear();

    if (this.wss) {
      return new Promise((resolve) => {
        this.wss!.close(() => {
          console.log('WebSocket server stopped');
          resolve();
        });
      });
    }
  }

  broadcast(message: WebSocketMessage): void {
    const data = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  private handleConnection(ws: WebSocket): void {
    console.log('New WebSocket client connected');
    const wsWithAlive = ws as WebSocketWithAlive;
    wsWithAlive.isAlive = true;
    this.clients.add(wsWithAlive);

    wsWithAlive.on('pong', () => {
      wsWithAlive.isAlive = true;
    });

    wsWithAlive.on('message', (data: Buffer) => {
      try {
        const message: unknown = JSON.parse(data.toString());
        this.handleMessage(wsWithAlive, message);
      } catch (error) {
        console.error('Invalid message format:', error);
        this.sendError(wsWithAlive, 'INVALID_MESSAGE', 'Invalid message format');
      }
    });

    wsWithAlive.on('close', () => {
      console.log('Client disconnected');
      this.clients.delete(wsWithAlive);
    });

    wsWithAlive.on('error', (error) => {
      console.error('WebSocket client error:', error);
      this.clients.delete(wsWithAlive);
    });

    this.sendStatus(wsWithAlive, 'connected');
  }

  private handleMessage(_ws: WebSocket, message: unknown): void {
    console.log('Received message:', message);
  }

  private sendError(ws: WebSocket, code: string, message: string): void {
    if (ws.readyState === WebSocket.OPEN) {
      const error: WebSocketMessage = {
        type: 'error',
        code,
        message,
        timestamp: new Date().toISOString(),
      };
      ws.send(JSON.stringify(error));
    }
  }

  private sendStatus(ws: WebSocket, status: 'connected' | 'disconnected' | 'reconnecting', callId?: string): void {
    if (ws.readyState === WebSocket.OPEN) {
      const statusMsg: WebSocketMessage = {
        type: 'status',
        status,
        callId,
      };
      ws.send(JSON.stringify(statusMsg));
    }
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      this.clients.forEach((ws) => {
        if (!ws.isAlive) {
          console.log('Terminating inactive client');
          this.clients.delete(ws);
          ws.terminate();
          return;
        }

        ws.isAlive = false;
        ws.ping();
      });
    }, this.config.heartbeatInterval);
  }

  getClientCount(): number {
    return this.clients.size;
  }
}
