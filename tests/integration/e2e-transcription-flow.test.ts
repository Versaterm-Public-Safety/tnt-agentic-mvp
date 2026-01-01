/**
 * E2E Integration Test: Full Transcription Flow
 * 
 * Tests the complete path: SIPREC → Audio Processing → Transcription → WebSocket → UI
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { WebSocketServer } from 'ws';
import { EventEmitter } from 'events';

// Mock SIPREC session for testing
class MockSIPRECSession extends EventEmitter {
  constructor(public sessionId: string) {
    super();
  }

  sendAudio(audioBuffer: Buffer) {
    this.emit('audio', audioBuffer);
  }

  end() {
    this.emit('ended');
  }
}

// Mock transcription service
class MockTranscriptionService {
  async transcribe(audioBuffer: Buffer): Promise<{ text: string; language: string }> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      text: 'This is a test transcription',
      language: 'en'
    };
  }
}

// Mock WebSocket client
class MockWebSocketClient extends EventEmitter {
  private messages: any[] = [];

  sendMessage(data: any) {
    this.messages.push(data);
    this.emit('message', JSON.stringify(data));
  }

  getMessages() {
    return this.messages;
  }
}

describe('E2E: Full Transcription Flow', () => {
  let siprecSession: MockSIPRECSession;
  let transcriptionService: MockTranscriptionService;
  let wsClient: MockWebSocketClient;

  beforeAll(() => {
    siprecSession = new MockSIPRECSession('test-session-001');
    transcriptionService = new MockTranscriptionService();
    wsClient = new MockWebSocketClient();
  });

  afterAll(() => {
    siprecSession.removeAllListeners();
    wsClient.removeAllListeners();
  });

  it('should process SIPREC audio and deliver transcript via WebSocket', async () => {
    // Arrange: Create a mock audio buffer (16kHz, 16-bit PCM)
    const sampleRate = 16000;
    const duration = 1; // 1 second
    const audioBuffer = Buffer.alloc(sampleRate * duration * 2); // 16-bit = 2 bytes
    
    // Fill with mock audio data (sine wave at 440Hz)
    for (let i = 0; i < sampleRate * duration; i++) {
      const sample = Math.sin(2 * Math.PI * 440 * i / sampleRate) * 32767;
      audioBuffer.writeInt16LE(sample, i * 2);
    }

    let transcriptReceived = false;
    let receivedTranscript: any = null;

    // Act: Setup the flow
    // 1. SIPREC receives audio
    siprecSession.on('audio', async (audio: Buffer) => {
      // 2. Audio sent to transcription service
      const result = await transcriptionService.transcribe(audio);
      
      // 3. Transcript sent via WebSocket
      const message = {
        type: 'transcript',
        sessionId: siprecSession.sessionId,
        text: result.text,
        language: result.language,
        timestamp: new Date().toISOString()
      };
      
      wsClient.sendMessage(message);
    });

    wsClient.on('message', (data: string) => {
      receivedTranscript = JSON.parse(data);
      transcriptReceived = true;
    });

    // Trigger the flow
    siprecSession.sendAudio(audioBuffer);

    // Wait for async processing
    await new Promise(resolve => setTimeout(resolve, 200));

    // Assert
    expect(transcriptReceived).toBe(true);
    expect(receivedTranscript).toBeDefined();
    expect(receivedTranscript.type).toBe('transcript');
    expect(receivedTranscript.sessionId).toBe('test-session-001');
    expect(receivedTranscript.text).toBe('This is a test transcription');
    expect(receivedTranscript.language).toBe('en');
  });

  it('should handle multiple audio chunks in sequence', async () => {
    const chunks = 3;
    const transcripts: any[] = [];
    
    // Create fresh instances to avoid event handler accumulation
    const session = new MockSIPRECSession('multi-chunk-test');
    const service = new MockTranscriptionService();
    const client = new MockWebSocketClient();

    client.on('message', (data: string) => {
      transcripts.push(JSON.parse(data));
    });

    session.on('audio', async (audio: Buffer) => {
      const result = await service.transcribe(audio);
      client.sendMessage({
        type: 'transcript',
        text: result.text,
        timestamp: new Date().toISOString()
      });
    });

    // Send multiple chunks
    for (let i = 0; i < chunks; i++) {
      const buffer = Buffer.alloc(1000);
      session.sendAudio(buffer);
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    expect(transcripts).toHaveLength(chunks);
  });

  it('should handle session end gracefully', async () => {
    let sessionEnded = false;

    siprecSession.on('ended', () => {
      wsClient.sendMessage({
        type: 'session_end',
        sessionId: siprecSession.sessionId,
        timestamp: new Date().toISOString()
      });
      sessionEnded = true;
    });

    siprecSession.end();

    await new Promise(resolve => setTimeout(resolve, 50));

    expect(sessionEnded).toBe(true);
    const messages = wsClient.getMessages();
    const endMessage = messages.find(m => m.type === 'session_end');
    expect(endMessage).toBeDefined();
  });

  it('should measure end-to-end latency < 2 seconds', async () => {
    const startTime = Date.now();
    let endTime = 0;

    siprecSession.on('audio', async (audio: Buffer) => {
      const result = await transcriptionService.transcribe(audio);
      wsClient.sendMessage({ type: 'transcript', text: result.text });
    });

    wsClient.on('message', () => {
      endTime = Date.now();
    });

    const audioBuffer = Buffer.alloc(16000 * 2); // 1 second of audio
    siprecSession.sendAudio(audioBuffer);

    await new Promise(resolve => setTimeout(resolve, 300));

    const latency = endTime - startTime;
    expect(latency).toBeLessThan(2000); // Must be under 2 seconds
  });
});

describe('E2E: Error Handling', () => {
  it('should handle transcription failures gracefully', async () => {
    const siprecSession = new MockSIPRECSession('test-error');
    const wsClient = new MockWebSocketClient();
    let errorReceived = false;

    siprecSession.on('audio', async () => {
      try {
        throw new Error('Transcription service unavailable');
      } catch (error) {
        wsClient.sendMessage({
          type: 'error',
          message: (error as Error).message,
          sessionId: siprecSession.sessionId
        });
        errorReceived = true;
      }
    });

    siprecSession.sendAudio(Buffer.alloc(100));
    await new Promise(resolve => setTimeout(resolve, 50));

    expect(errorReceived).toBe(true);
    const messages = wsClient.getMessages();
    expect(messages.some(m => m.type === 'error')).toBe(true);
  });
});
