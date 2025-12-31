import { describe, it, expect } from 'vitest';
import { Transcript } from '../src/transcript';

describe('Transcript', () => {
  describe('creation', () => {
    it('creates transcript with valid data', () => {
      // Arrange
      const props = {
        id: 'transcript-001',
        callId: 'call-abc-123',
        text: 'Hello, this is an emergency',
        speaker: 'caller' as const,
        confidence: 0.95,
        timestamp: new Date('2025-01-01T12:00:00Z'),
        isFinal: true,
      };

      // Act
      const transcript = Transcript.create(props);

      // Assert
      expect(transcript.id).toBe('transcript-001');
      expect(transcript.callId).toBe('call-abc-123');
      expect(transcript.text).toBe('Hello, this is an emergency');
      expect(transcript.speaker).toBe('caller');
      expect(transcript.confidence).toBe(0.95);
      expect(transcript.timestamp).toEqual(new Date('2025-01-01T12:00:00Z'));
      expect(transcript.isFinal).toBe(true);
    });

    it('creates transcript with agent speaker', () => {
      // Arrange
      const props = {
        id: 'transcript-002',
        callId: 'call-abc-123',
        text: 'What is your emergency?',
        speaker: 'agent' as const,
        confidence: 0.98,
        timestamp: new Date('2025-01-01T12:00:01Z'),
        isFinal: true,
      };

      // Act
      const transcript = Transcript.create(props);

      // Assert
      expect(transcript.speaker).toBe('agent');
      expect(transcript.text).toBe('What is your emergency?');
    });

    it('creates interim transcript (not final)', () => {
      // Arrange
      const props = {
        id: 'transcript-003',
        callId: 'call-abc-123',
        text: 'Partial transcr...',
        speaker: 'caller' as const,
        confidence: 0.75,
        timestamp: new Date('2025-01-01T12:00:02Z'),
        isFinal: false,
      };

      // Act
      const transcript = Transcript.create(props);

      // Assert
      expect(transcript.isFinal).toBe(false);
    });
  });

  describe('validation', () => {
    it('throws on empty text', () => {
      // Arrange
      const props = {
        id: 'transcript-004',
        callId: 'call-abc-123',
        text: '',
        speaker: 'caller' as const,
        confidence: 0.95,
        timestamp: new Date('2025-01-01T12:00:00Z'),
        isFinal: true,
      };

      // Act & Assert
      expect(() => Transcript.create(props)).toThrow('Text cannot be empty');
    });

    it('throws on whitespace-only text', () => {
      // Arrange
      const props = {
        id: 'transcript-005',
        callId: 'call-abc-123',
        text: '   ',
        speaker: 'caller' as const,
        confidence: 0.95,
        timestamp: new Date('2025-01-01T12:00:00Z'),
        isFinal: true,
      };

      // Act & Assert
      expect(() => Transcript.create(props)).toThrow('Text cannot be empty');
    });

    it('throws on negative confidence', () => {
      // Arrange
      const props = {
        id: 'transcript-006',
        callId: 'call-abc-123',
        text: 'Valid text',
        speaker: 'caller' as const,
        confidence: -0.1,
        timestamp: new Date('2025-01-01T12:00:00Z'),
        isFinal: true,
      };

      // Act & Assert
      expect(() => Transcript.create(props)).toThrow('Confidence must be between 0 and 1');
    });

    it('throws on confidence greater than 1', () => {
      // Arrange
      const props = {
        id: 'transcript-007',
        callId: 'call-abc-123',
        text: 'Valid text',
        speaker: 'caller' as const,
        confidence: 1.5,
        timestamp: new Date('2025-01-01T12:00:00Z'),
        isFinal: true,
      };

      // Act & Assert
      expect(() => Transcript.create(props)).toThrow('Confidence must be between 0 and 1');
    });

    it('accepts confidence at boundary 0', () => {
      // Arrange
      const props = {
        id: 'transcript-008',
        callId: 'call-abc-123',
        text: 'Low confidence text',
        speaker: 'caller' as const,
        confidence: 0,
        timestamp: new Date('2025-01-01T12:00:00Z'),
        isFinal: true,
      };

      // Act
      const transcript = Transcript.create(props);

      // Assert
      expect(transcript.confidence).toBe(0);
    });

    it('accepts confidence at boundary 1', () => {
      // Arrange
      const props = {
        id: 'transcript-009',
        callId: 'call-abc-123',
        text: 'Perfect confidence',
        speaker: 'caller' as const,
        confidence: 1,
        timestamp: new Date('2025-01-01T12:00:00Z'),
        isFinal: true,
      };

      // Act
      const transcript = Transcript.create(props);

      // Assert
      expect(transcript.confidence).toBe(1);
    });

    it('throws on invalid speaker type', () => {
      // Arrange
      const props = {
        id: 'transcript-010',
        callId: 'call-abc-123',
        text: 'Valid text',
        speaker: 'unknown' as any,
        confidence: 0.95,
        timestamp: new Date('2025-01-01T12:00:00Z'),
        isFinal: true,
      };

      // Act & Assert
      expect(() => Transcript.create(props)).toThrow('Speaker must be caller or agent');
    });
  });

  describe('immutability', () => {
    it('prevents modification of text property', () => {
      // Arrange
      const props = {
        id: 'transcript-011',
        callId: 'call-abc-123',
        text: 'Original text',
        speaker: 'caller' as const,
        confidence: 0.95,
        timestamp: new Date('2025-01-01T12:00:00Z'),
        isFinal: true,
      };
      const transcript = Transcript.create(props);

      // Act & Assert
      expect(() => {
        (transcript as any).text = 'Modified text';
      }).toThrow();
    });

    it('prevents modification of speaker property', () => {
      // Arrange
      const props = {
        id: 'transcript-012',
        callId: 'call-abc-123',
        text: 'Valid text',
        speaker: 'caller' as const,
        confidence: 0.95,
        timestamp: new Date('2025-01-01T12:00:00Z'),
        isFinal: true,
      };
      const transcript = Transcript.create(props);

      // Act & Assert
      expect(() => {
        (transcript as any).speaker = 'agent';
      }).toThrow();
    });
  });

  describe('edge cases', () => {
    it('handles very long transcript text', () => {
      // Arrange
      const longText = 'A'.repeat(5000);
      const props = {
        id: 'transcript-013',
        callId: 'call-abc-123',
        text: longText,
        speaker: 'caller' as const,
        confidence: 0.85,
        timestamp: new Date('2025-01-01T12:00:00Z'),
        isFinal: true,
      };

      // Act
      const transcript = Transcript.create(props);

      // Assert
      expect(transcript.text).toBe(longText);
      expect(transcript.text.length).toBe(5000);
    });

    it('handles low confidence threshold (0.8)', () => {
      // Arrange
      const props = {
        id: 'transcript-014',
        callId: 'call-abc-123',
        text: 'Uncertain speech',
        speaker: 'caller' as const,
        confidence: 0.8,
        timestamp: new Date('2025-01-01T12:00:00Z'),
        isFinal: true,
      };

      // Act
      const transcript = Transcript.create(props);

      // Assert
      expect(transcript.confidence).toBe(0.8);
    });

    it('handles confidence just below threshold (0.79)', () => {
      // Arrange
      const props = {
        id: 'transcript-015',
        callId: 'call-abc-123',
        text: 'Low confidence speech',
        speaker: 'caller' as const,
        confidence: 0.79,
        timestamp: new Date('2025-01-01T12:00:00Z'),
        isFinal: true,
      };

      // Act
      const transcript = Transcript.create(props);

      // Assert
      expect(transcript.confidence).toBe(0.79);
      expect(transcript.confidence).toBeLessThan(0.8);
    });
  });
});
