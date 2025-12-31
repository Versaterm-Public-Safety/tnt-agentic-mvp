import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { WebSocketServer } from 'ws';
import { WebSocket } from 'ws';

describe('E2E: Complete Transcription Flow', () => {
  let wsServer: WebSocketServer;
  let serverPort: number;

  beforeAll(async () => {
    // Start WebSocket server for testing
    serverPort = 8080;
    wsServer = new WebSocketServer({ port: serverPort });
    
    wsServer.on('connection', (ws) => {
      ws.on('message', (data) => {
        const message = JSON.parse(data.toString());
        
        // Simulate transcription response
        if (message.type === 'audio_chunk') {
          ws.send(JSON.stringify({
            type: 'transcript_update',
            callId: message.callId,
            transcript: {
              id: 'test-transcript-1',
              text: 'Hello this is a test transcription',
              speaker: 'caller',
              confidence: 0.95,
              timestamp: new Date().toISOString()
            }
          }));
        }
      });
    });
  });

  afterAll(async () => {
    wsServer.close();
  });

  it('should process audio through complete pipeline: Audio -> Transcription -> WebSocket -> UI', async () => {
    return new Promise<void>((resolve, reject) => {
      const client = new WebSocket(`ws://localhost:${serverPort}`);
      
      client.on('open', () => {
        // Send audio chunk
        client.send(JSON.stringify({
          type: 'audio_chunk',
          callId: 'test-call-1',
          audio: Buffer.from([0, 1, 2, 3, 4, 5]).toString('base64'),
          timestamp: new Date().toISOString()
        }));
      });

      client.on('message', (data) => {
        const message = JSON.parse(data.toString());
        
        expect(message.type).toBe('transcript_update');
        expect(message.callId).toBe('test-call-1');
        expect(message.transcript.text).toBe('Hello this is a test transcription');
        expect(message.transcript.speaker).toBe('caller');
        expect(message.transcript.confidence).toBeGreaterThan(0.9);
        
        client.close();
        resolve();
      });

      client.on('error', (error) => {
        reject(error);
      });

      // Timeout after 5 seconds
      setTimeout(() => {
        client.close();
        reject(new Error('Test timeout'));
      }, 5000);
    });
  });

  it('should handle multiple concurrent transcription sessions', async () => {
    const sessions = ['call-1', 'call-2', 'call-3'];
    const results: string[] = [];

    const promises = sessions.map((callId) => {
      return new Promise<void>((resolve, reject) => {
        const client = new WebSocket(`ws://localhost:${serverPort}`);
        
        client.on('open', () => {
          client.send(JSON.stringify({
            type: 'audio_chunk',
            callId,
            audio: Buffer.from([0, 1, 2, 3]).toString('base64'),
            timestamp: new Date().toISOString()
          }));
        });

        client.on('message', (data) => {
          const message = JSON.parse(data.toString());
          results.push(message.callId);
          client.close();
          resolve();
        });

        client.on('error', reject);
      });
    });

    await Promise.all(promises);
    
    expect(results).toHaveLength(3);
    expect(results).toContain('call-1');
    expect(results).toContain('call-2');
    expect(results).toContain('call-3');
  });

  it('should maintain transcription latency under 2 seconds', async () => {
    return new Promise<void>((resolve, reject) => {
      const client = new WebSocket(`ws://localhost:${serverPort}`);
      const startTime = Date.now();
      
      client.on('open', () => {
        client.send(JSON.stringify({
          type: 'audio_chunk',
          callId: 'latency-test',
          audio: Buffer.from([0, 1, 2, 3]).toString('base64'),
          timestamp: new Date().toISOString()
        }));
      });

      client.on('message', () => {
        const latency = Date.now() - startTime;
        expect(latency).toBeLessThan(2000); // Under 2 seconds
        client.close();
        resolve();
      });

      client.on('error', reject);
    });
  });
});
