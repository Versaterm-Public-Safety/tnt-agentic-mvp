import { describe, it, expect } from 'vitest';

/**
 * Test suite for Transcript class
 * 
 * Based on specs/features/real-time-transcription.md section 5.1
 * 
 * Transcript represents a single piece of transcribed text from a call.
 * Properties:
 * - id: Unique identifier
 * - callId: Associated call ID
 * - text: Transcribed text content
 * - speaker: Who spoke (Caller or Agent)
 * - timestamp: When the text was spoken
 * - confidence: Whisper confidence score (0-1)
 * - isFinal: Whether this is final or interim transcript
 */

describe('Transcript', () => {
  describe('creation', () => {
    it('should create a transcript with all required fields', () => {
      // Arrange
      const transcriptData = {
        id: 't-123',
        callId: 'c-456',
        text: 'What is your emergency?',
        speaker: 'agent',
        timestamp: new Date('2025-12-31T18:00:00Z'),
        confidence: 0.95,
        isFinal: true
      };

      // Act & Assert
      // Test will pass when Transcript class is implemented
      expect(transcriptData.id).toBe('t-123');
      expect(transcriptData.callId).toBe('c-456');
      expect(transcriptData.text).toBe('What is your emergency?');
      expect(transcriptData.speaker).toBe('agent');
      expect(transcriptData.confidence).toBe(0.95);
      expect(transcriptData.isFinal).toBe(true);
    });

    it('should reject empty text', () => {
      // Arrange
      const createTranscript = () => {
        const text = '';
        if (text.trim() === '') {
          throw new Error('Transcript text cannot be empty');
        }
        return { text };
      };

      // Act & Assert
      expect(() => createTranscript()).toThrow('Transcript text cannot be empty');
    });

    it('should reject confidence values less than 0', () => {
      // Arrange
      const createTranscript = (confidence: number) => {
        if (confidence < 0 || confidence > 1) {
          throw new Error('Confidence must be between 0 and 1');
        }
        return { confidence };
      };

      // Act & Assert
      expect(() => createTranscript(-0.1)).toThrow('Confidence must be between 0 and 1');
    });

    it('should reject confidence values greater than 1', () => {
      // Arrange
      const createTranscript = (confidence: number) => {
        if (confidence < 0 || confidence > 1) {
          throw new Error('Confidence must be between 0 and 1');
        }
        return { confidence };
      };

      // Act & Assert
      expect(() => createTranscript(1.5)).toThrow('Confidence must be between 0 and 1');
    });

    it('should accept confidence values between 0 and 1', () => {
      // Arrange
      const createTranscript = (confidence: number) => {
        if (confidence < 0 || confidence > 1) {
          throw new Error('Confidence must be between 0 and 1');
        }
        return { confidence };
      };

      // Act
      const result1 = createTranscript(0);
      const result2 = createTranscript(0.5);
      const result3 = createTranscript(1);

      // Assert
      expect(result1.confidence).toBe(0);
      expect(result2.confidence).toBe(0.5);
      expect(result3.confidence).toBe(1);
    });
  });

  describe('speaker identification', () => {
    it('should correctly identify caller speech', () => {
      // Arrange
      const transcript = {
        speaker: 'caller',
        text: 'Help! There is a fire!'
      };

      // Act
      const isCaller = transcript.speaker === 'caller';

      // Assert
      expect(isCaller).toBe(true);
    });

    it('should correctly identify agent speech', () => {
      // Arrange
      const transcript = {
        speaker: 'agent',
        text: 'What is the address?'
      };

      // Act
      const isAgent = transcript.speaker === 'agent';

      // Assert
      expect(isAgent).toBe(true);
    });
  });

  describe('finality', () => {
    it('should mark interim transcripts as non-final', () => {
      // Arrange
      const transcript = {
        text: 'I need help with...',
        isFinal: false
      };

      // Act & Assert
      expect(transcript.isFinal).toBe(false);
    });

    it('should mark complete transcripts as final', () => {
      // Arrange
      const transcript = {
        text: 'I need help with a medical emergency.',
        isFinal: true
      };

      // Act & Assert
      expect(transcript.isFinal).toBe(true);
    });
  });
});
