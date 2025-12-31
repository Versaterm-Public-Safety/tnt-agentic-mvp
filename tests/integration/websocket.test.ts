import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { WebSocketServer, WebSocket } from 'ws';

describe('WebSocket Integration Tests', () => {
  let wsServer: WebSocketServer;
  const PORT = 8081;

  beforeAll(() => {
    wsServer = new WebSocketServer({ port: PORT });
  });

  afterAll(() => {
    wsServer.close();
  });

  it('should establish WebSocket connection', async () => {
    return new Promise<void>((resolve, reject) => {
      wsServer.once('connection', (ws) => {
        expect(ws.readyState).toBe(WebSocket.OPEN);
        ws.close();
        resolve();
      });

      const client = new WebSocket(`ws://localhost:${PORT}`);
      client.on('error', reject);
    });
  });

  it('should handle bidirectional message exchange', async () => {
    return new Promise<void>((resolve, reject) => {
      wsServer.once('connection', (ws) => {
        ws.on('message', (data) => {
          const message = JSON.parse(data.toString());
          expect(message.type).toBe('ping');
          
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        });
      });

      const client = new WebSocket(`ws://localhost:${PORT}`);
      
      client.on('open', () => {
        client.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
      });

      client.on('message', (data) => {
        const message = JSON.parse(data.toString());
        expect(message.type).toBe('pong');
        client.close();
        resolve();
      });

      client.on('error', reject);
    });
  });

  it('should handle multiple concurrent connections', async () => {
    const numClients = 5;
    const connections: WebSocket[] = [];

    const promises = Array.from({ length: numClients }).map((_, i) => {
      return new Promise<void>((resolve, reject) => {
        const client = new WebSocket(`ws://localhost:${PORT}`);
        connections.push(client);

        client.on('open', () => {
          client.send(JSON.stringify({ id: i, message: `Client ${i}` }));
        });

        client.on('error', reject);
        
        setTimeout(() => {
          expect(client.readyState).toBe(WebSocket.OPEN);
          resolve();
        }, 100);
      });
    });

    await Promise.all(promises);
    
    connections.forEach(conn => conn.close());
    expect(connections.length).toBe(numClients);
  });

  it('should handle connection errors gracefully', async () => {
    return new Promise<void>((resolve) => {
      const client = new WebSocket('ws://localhost:9999'); // Invalid port
      
      client.on('error', (error) => {
        expect(error).toBeDefined();
        resolve();
      });
    });
  });

  it('should handle large message payloads', async () => {
    return new Promise<void>((resolve, reject) => {
      const largePayload = 'x'.repeat(100000); // 100KB payload

      wsServer.once('connection', (ws) => {
        ws.on('message', (data) => {
          const message = JSON.parse(data.toString());
          expect(message.data.length).toBe(100000);
          ws.send(JSON.stringify({ received: true }));
        });
      });

      const client = new WebSocket(`ws://localhost:${PORT}`);
      
      client.on('open', () => {
        client.send(JSON.stringify({ data: largePayload }));
      });

      client.on('message', (data) => {
        const message = JSON.parse(data.toString());
        expect(message.received).toBe(true);
        client.close();
        resolve();
      });

      client.on('error', reject);
    });
  });
});
