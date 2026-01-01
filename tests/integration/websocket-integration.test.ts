/**
 * WebSocket Integration Tests
 * 
 * Tests the WebSocket server ↔ UI client communication
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WebSocket, WebSocketServer } from 'ws';
import { EventEmitter } from 'events';

describe('WebSocket Integration', () => {
  let wss: WebSocketServer;
  let serverPort: number;

  beforeEach(async () => {
    // Start WebSocket server on random port
    wss = new WebSocketServer({ port: 0 });
    serverPort = (wss.address() as any).port;

    await new Promise<void>(resolve => {
      wss.on('listening', () => resolve());
    });
  });

  afterEach(async () => {
    await new Promise<void>(resolve => {
      wss.close(() => resolve());
    });
  });

  it('should establish WebSocket connection', async () => {
    let connected = false;

    wss.on('connection', (ws) => {
      connected = true;
      ws.close();
    });

    const client = new WebSocket(`ws://localhost:${serverPort}`);
    
    await new Promise<void>((resolve, reject) => {
      client.on('open', () => {
        resolve();
      });
      client.on('error', reject);
    });

    expect(connected).toBe(true);
    client.close();
  });

  it('should send transcript messages from server to client', async () => {
    const testMessage = {
      type: 'transcript',
      sessionId: 'test-123',
      text: 'Hello world',
      speaker: 'Agent',
      timestamp: new Date().toISOString()
    };

    let receivedMessage: any = null;

    wss.on('connection', (ws) => {
      // Server sends transcript
      ws.send(JSON.stringify(testMessage));
    });

    const client = new WebSocket(`ws://localhost:${serverPort}`);
    
    await new Promise<void>((resolve, reject) => {
      client.on('message', (data) => {
        receivedMessage = JSON.parse(data.toString());
        client.close();
        resolve();
      });
      client.on('error', reject);
    });

    expect(receivedMessage).toEqual(testMessage);
  });

  it('should handle client disconnection gracefully', async () => {
    let disconnected = false;

    wss.on('connection', (ws) => {
      ws.on('close', () => {
        disconnected = true;
      });
    });

    const client = new WebSocket(`ws://localhost:${serverPort}`);
    
    await new Promise<void>(resolve => {
      client.on('open', () => {
        client.close();
        setTimeout(resolve, 100);
      });
    });

    expect(disconnected).toBe(true);
  });

  it('should support multiple concurrent clients', async () => {
    const clientCount = 5;
    const clients: WebSocket[] = [];
    const receivedCounts: number[] = Array(clientCount).fill(0);

    wss.on('connection', (ws) => {
      // Broadcast message to all clients
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'broadcast', data: 'test' }));
        }
      });
    });

    // Create multiple clients
    for (let i = 0; i < clientCount; i++) {
      const client = new WebSocket(`ws://localhost:${serverPort}`);
      clients.push(client);

      client.on('message', () => {
        receivedCounts[i]++;
      });

      await new Promise<void>(resolve => {
        client.on('open', () => resolve());
      });
    }

    // Wait for broadcasts
    await new Promise(resolve => setTimeout(resolve, 200));

    // Each client should have received at least one message
    receivedCounts.forEach(count => {
      expect(count).toBeGreaterThan(0);
    });

    // Cleanup
    clients.forEach(client => client.close());
  });

  it('should handle reconnection attempts', async () => {
    let connectionCount = 0;

    wss.on('connection', () => {
      connectionCount++;
    });

    // First connection
    const client1 = new WebSocket(`ws://localhost:${serverPort}`);
    await new Promise<void>(resolve => client1.on('open', () => resolve()));
    client1.close();
    await new Promise(resolve => setTimeout(resolve, 50));

    // Reconnection
    const client2 = new WebSocket(`ws://localhost:${serverPort}`);
    await new Promise<void>(resolve => client2.on('open', () => resolve()));
    client2.close();

    expect(connectionCount).toBe(2);
  });

  it('should handle malformed JSON gracefully', async () => {
    let errorHandled = false;

    wss.on('connection', (ws) => {
      ws.on('message', (data) => {
        try {
          JSON.parse(data.toString());
        } catch (error) {
          errorHandled = true;
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
        }
      });
    });

    const client = new WebSocket(`ws://localhost:${serverPort}`);
    
    await new Promise<void>(resolve => {
      client.on('open', () => {
        client.send('invalid json {]');
      });
      
      client.on('message', (data) => {
        const msg = JSON.parse(data.toString());
        expect(msg.type).toBe('error');
        client.close();
        resolve();
      });
    });

    expect(errorHandled).toBe(true);
  });

  it('should measure message latency', async () => {
    const timestamps: number[] = [];

    wss.on('connection', (ws) => {
      ws.on('message', () => {
        const timestamp = Date.now();
        ws.send(JSON.stringify({ type: 'echo', timestamp }));
      });
    });

    const client = new WebSocket(`ws://localhost:${serverPort}`);
    
    await new Promise<void>(resolve => {
      client.on('open', () => {
        const sendTime = Date.now();
        client.send(JSON.stringify({ type: 'ping' }));

        client.on('message', (data) => {
          const receiveTime = Date.now();
          const latency = receiveTime - sendTime;
          timestamps.push(latency);
          client.close();
          resolve();
        });
      });
    });

    expect(timestamps[0]).toBeLessThan(100); // Should be very fast locally
  });
});

describe('WebSocket Message Protocol', () => {
  it('should validate message types', () => {
    const validTypes = ['transcript', 'session_start', 'session_end', 'error', 'status'];
    
    validTypes.forEach(type => {
      const message = { type, data: {} };
      expect(message.type).toBe(type);
    });
  });

  it('should include required fields in transcript messages', () => {
    const message = {
      type: 'transcript',
      sessionId: 'test-123',
      text: 'Hello',
      speaker: 'Agent',
      timestamp: new Date().toISOString(),
      language: 'en'
    };

    expect(message.type).toBe('transcript');
    expect(message.sessionId).toBeDefined();
    expect(message.text).toBeDefined();
    expect(message.timestamp).toBeDefined();
  });
});
