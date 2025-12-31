import { describe, it, expect } from 'vitest';
import {
  TranscriptUpdate,
  ErrorMessage,
  ConnectionStatus,
  isTranscriptUpdate,
  isErrorMessage,
  isConnectionStatus,
} from '../src/protocol';

describe('WebSocket Protocol', () => {
  describe('TranscriptUpdate message', () => {
    it('validates valid TranscriptUpdate message', () => {
      // Arrange
      const message: TranscriptUpdate = {
        type: 'transcript',
        callId: 'call-123',
        transcript: {
          id: 'transcript-001',
          text: 'Emergency at 123 Main Street',
          speaker: 'caller',
          confidence: 0.95,
          timestamp: '2025-01-01T12:00:00Z',
          isFinal: true,
        },
      };

      // Act
      const isValid = isTranscriptUpdate(message);

      // Assert
      expect(isValid).toBe(true);
    });

    it('serializes to JSON correctly', () => {
      // Arrange
      const message: TranscriptUpdate = {
        type: 'transcript',
        callId: 'call-123',
        transcript: {
          id: 'transcript-001',
          text: 'Test',
          speaker: 'agent',
          confidence: 0.98,
          timestamp: '2025-01-01T12:00:00Z',
          isFinal: true,
        },
      };

      // Act
      const json = JSON.stringify(message);
      const parsed = JSON.parse(json);

      // Assert
      expect(parsed.type).toBe('transcript');
      expect(parsed.callId).toBe('call-123');
      expect(parsed.transcript.text).toBe('Test');
    });

    it('handles interim transcripts (isFinal: false)', () => {
      // Arrange
      const message: TranscriptUpdate = {
        type: 'transcript',
        callId: 'call-123',
        transcript: {
          id: 'transcript-001',
          text: 'Partial...',
          speaker: 'caller',
          confidence: 0.75,
          timestamp: '2025-01-01T12:00:00Z',
          isFinal: false,
        },
      };

      // Act
      const isValid = isTranscriptUpdate(message);

      // Assert
      expect(isValid).toBe(true);
      expect(message.transcript.isFinal).toBe(false);
    });

    it('rejects message with invalid type', () => {
      // Arrange
      const message = {
        type: 'invalid',
        callId: 'call-123',
        transcript: {
          id: 'transcript-001',
          text: 'Test',
          speaker: 'caller',
          confidence: 0.95,
          timestamp: '2025-01-01T12:00:00Z',
          isFinal: true,
        },
      };

      // Act
      const isValid = isTranscriptUpdate(message as any);

      // Assert
      expect(isValid).toBe(false);
    });

    it('rejects message with invalid speaker', () => {
      // Arrange
      const message = {
        type: 'transcript',
        callId: 'call-123',
        transcript: {
          id: 'transcript-001',
          text: 'Test',
          speaker: 'unknown',
          confidence: 0.95,
          timestamp: '2025-01-01T12:00:00Z',
          isFinal: true,
        },
      };

      // Act
      const isValid = isTranscriptUpdate(message as any);

      // Assert
      expect(isValid).toBe(false);
    });
  });

  describe('ErrorMessage', () => {
    it('validates valid ErrorMessage', () => {
      // Arrange
      const message: ErrorMessage = {
        type: 'error',
        code: 'TRANSCRIPTION_FAILED',
        message: 'Failed to transcribe audio',
        timestamp: '2025-01-01T12:00:00Z',
      };

      // Act
      const isValid = isErrorMessage(message);

      // Assert
      expect(isValid).toBe(true);
    });

    it('serializes error message to JSON', () => {
      // Arrange
      const message: ErrorMessage = {
        type: 'error',
        code: 'CONNECTION_LOST',
        message: 'WebSocket connection lost',
        timestamp: '2025-01-01T12:00:00Z',
      };

      // Act
      const json = JSON.stringify(message);
      const parsed = JSON.parse(json);

      // Assert
      expect(parsed.type).toBe('error');
      expect(parsed.code).toBe('CONNECTION_LOST');
    });
  });

  describe('ConnectionStatus', () => {
    it('validates connected status', () => {
      // Arrange
      const message: ConnectionStatus = {
        type: 'status',
        status: 'connected',
        callId: 'call-123',
      };

      // Act
      const isValid = isConnectionStatus(message);

      // Assert
      expect(isValid).toBe(true);
    });

    it('validates disconnected status', () => {
      // Arrange
      const message: ConnectionStatus = {
        type: 'status',
        status: 'disconnected',
      };

      // Act
      const isValid = isConnectionStatus(message);

      // Assert
      expect(isValid).toBe(true);
    });

    it('validates reconnecting status', () => {
      // Arrange
      const message: ConnectionStatus = {
        type: 'status',
        status: 'reconnecting',
        callId: 'call-123',
      };

      // Act
      const isValid = isConnectionStatus(message);

      // Assert
      expect(isValid).toBe(true);
    });

    it('allows optional callId', () => {
      // Arrange
      const message: ConnectionStatus = {
        type: 'status',
        status: 'disconnected',
        // callId omitted
      };

      // Act
      const isValid = isConnectionStatus(message);

      // Assert
      expect(isValid).toBe(true);
      expect(message.callId).toBeUndefined();
    });
  });

  describe('message type discrimination', () => {
    it('distinguishes transcript from error messages', () => {
      // Arrange
      const transcriptMsg: TranscriptUpdate = {
        type: 'transcript',
        callId: 'call-123',
        transcript: {
          id: 't1',
          text: 'Test',
          speaker: 'caller',
          confidence: 0.95,
          timestamp: '2025-01-01T12:00:00Z',
          isFinal: true,
        },
      };
      const errorMsg: ErrorMessage = {
        type: 'error',
        code: 'TEST_ERROR',
        message: 'Test',
        timestamp: '2025-01-01T12:00:00Z',
      };

      // Act & Assert
      expect(isTranscriptUpdate(transcriptMsg)).toBe(true);
      expect(isErrorMessage(transcriptMsg)).toBe(false);
      expect(isTranscriptUpdate(errorMsg)).toBe(false);
      expect(isErrorMessage(errorMsg)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('handles very long transcript text in message', () => {
      // Arrange
      const longText = 'A'.repeat(5000);
      const message: TranscriptUpdate = {
        type: 'transcript',
        callId: 'call-123',
        transcript: {
          id: 'transcript-001',
          text: longText,
          speaker: 'caller',
          confidence: 0.85,
          timestamp: '2025-01-01T12:00:00Z',
          isFinal: true,
        },
      };

      // Act
      const json = JSON.stringify(message);
      const parsed: TranscriptUpdate = JSON.parse(json);

      // Assert
      expect(parsed.transcript.text).toBe(longText);
      expect(parsed.transcript.text.length).toBe(5000);
    });

    it('handles special characters in error message', () => {
      // Arrange
      const message: ErrorMessage = {
        type: 'error',
        code: 'INVALID_INPUT',
        message: 'Error: Invalid input "test"\n\tAt line 42',
        timestamp: '2025-01-01T12:00:00Z',
      };

      // Act
      const json = JSON.stringify(message);
      const parsed: ErrorMessage = JSON.parse(json);

      // Assert
      expect(parsed.message).toContain('"test"');
      expect(parsed.message).toContain('\n\t');
    });
  });
});
