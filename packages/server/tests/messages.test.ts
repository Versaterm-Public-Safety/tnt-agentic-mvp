import { describe, it, expect } from 'vitest';

/**
 * Test suite for WebSocket message types
 * 
 * Based on specs/features/real-time-transcription.md section 6.1
 * 
 * WebSocket Protocol:
 * - Connection: ws://localhost:8080
 * - Client → Server: start_call, end_call
 * - Server → Client: transcript, call_status, error
 */

describe('WebSocket Messages', () => {
  describe('Client to Server messages', () => {
    it('should create valid start_call message', () => {
      // Arrange
      const message = {
        type: 'start_call',
        callId: 'c-123'
      };

      // Act
      const json = JSON.stringify(message);
      const parsed = JSON.parse(json);

      // Assert
      expect(parsed.type).toBe('start_call');
      expect(parsed.callId).toBe('c-123');
    });

    it('should create valid end_call message', () => {
      // Arrange
      const message = {
        type: 'end_call',
        callId: 'c-123'
      };

      // Act
      const json = JSON.stringify(message);
      const parsed = JSON.parse(json);

      // Assert
      expect(parsed.type).toBe('end_call');
      expect(parsed.callId).toBe('c-123');
    });
  });

  describe('Server to Client messages', () => {
    it('should create valid transcript message', () => {
      // Arrange
      const message = {
        type: 'transcript',
        callId: 'c-123',
        transcript: {
          id: 't-456',
          text: 'What is your emergency?',
          speaker: 'agent',
          timestamp: '2025-12-31T18:00:00Z',
          confidence: 0.95,
          isFinal: true
        }
      };

      // Act
      const json = JSON.stringify(message);
      const parsed = JSON.parse(json);

      // Assert
      expect(parsed.type).toBe('transcript');
      expect(parsed.callId).toBe('c-123');
      expect(parsed.transcript.id).toBe('t-456');
      expect(parsed.transcript.text).toBe('What is your emergency?');
      expect(parsed.transcript.speaker).toBe('agent');
      expect(parsed.transcript.confidence).toBe(0.95);
      expect(parsed.transcript.isFinal).toBe(true);
    });

    it('should create valid call_status message for active call', () => {
      // Arrange
      const message = {
        type: 'call_status',
        callId: 'c-123',
        status: 'active',
        startTime: '2025-12-31T18:00:00Z'
      };

      // Act
      const json = JSON.stringify(message);
      const parsed = JSON.parse(json);

      // Assert
      expect(parsed.type).toBe('call_status');
      expect(parsed.callId).toBe('c-123');
      expect(parsed.status).toBe('active');
      expect(parsed.startTime).toBe('2025-12-31T18:00:00Z');
      expect(parsed.endTime).toBeUndefined();
    });

    it('should create valid call_status message for completed call', () => {
      // Arrange
      const message = {
        type: 'call_status',
        callId: 'c-123',
        status: 'completed',
        startTime: '2025-12-31T18:00:00Z',
        endTime: '2025-12-31T18:05:00Z'
      };

      // Act
      const json = JSON.stringify(message);
      const parsed = JSON.parse(json);

      // Assert
      expect(parsed.type).toBe('call_status');
      expect(parsed.status).toBe('completed');
      expect(parsed.endTime).toBe('2025-12-31T18:05:00Z');
    });

    it('should create valid error message', () => {
      // Arrange
      const message = {
        type: 'error',
        code: 'INVALID_CALL_ID',
        message: 'Call ID c-999 not found'
      };

      // Act
      const json = JSON.stringify(message);
      const parsed = JSON.parse(json);

      // Assert
      expect(parsed.type).toBe('error');
      expect(parsed.code).toBe('INVALID_CALL_ID');
      expect(parsed.message).toBe('Call ID c-999 not found');
    });
  });

  describe('Message validation', () => {
    it('should validate message type field exists', () => {
      // Arrange
      const validateMessage = (msg: unknown) => {
        const parsed = msg as { type?: string };
        if (!parsed.type) {
          throw new Error('Message must have type field');
        }
      };

      // Act & Assert
      expect(() => validateMessage({ type: 'transcript' })).not.toThrow();
      expect(() => validateMessage({})).toThrow('Message must have type field');
    });

    it('should validate transcript has required fields', () => {
      // Arrange
      const validateTranscript = (transcript: unknown) => {
        const t = transcript as Partial<{
          id: string;
          text: string;
          speaker: string;
          timestamp: string;
          confidence: number;
          isFinal: boolean;
        }>;
        
        if (!t.id || !t.text || !t.speaker) {
          throw new Error('Transcript missing required fields');
        }
      };

      const validTranscript = {
        id: 't-1',
        text: 'Hello',
        speaker: 'caller',
        timestamp: '2025-12-31T18:00:00Z',
        confidence: 0.9,
        isFinal: true
      };

      const invalidTranscript = {
        id: 't-1'
        // missing text and speaker
      };

      // Act & Assert
      expect(() => validateTranscript(validTranscript)).not.toThrow();
      expect(() => validateTranscript(invalidTranscript)).toThrow('Transcript missing required fields');
    });
  });

  describe('JSON serialization', () => {
    it('should serialize and deserialize dates as ISO strings', () => {
      // Arrange
      const message = {
        type: 'call_status',
        startTime: new Date('2025-12-31T18:00:00Z').toISOString()
      };

      // Act
      const json = JSON.stringify(message);
      const parsed = JSON.parse(json);

      // Assert
      expect(parsed.startTime).toBe('2025-12-31T18:00:00.000Z');
      expect(typeof parsed.startTime).toBe('string');
    });

    it('should handle special characters in text', () => {
      // Arrange
      const message = {
        type: 'transcript',
        transcript: {
          text: 'Address: 123 "Main" St. & Ave.'
        }
      };

      // Act
      const json = JSON.stringify(message);
      const parsed = JSON.parse(json);

      // Assert
      expect(parsed.transcript.text).toBe('Address: 123 "Main" St. & Ave.');
    });
  });
});
