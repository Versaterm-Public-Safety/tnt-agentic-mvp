import { describe, it, expect } from 'vitest';
import { Speaker, isValidSpeaker } from '../src/speaker';

describe('Speaker', () => {
  describe('type validation', () => {
    it('accepts caller as valid speaker', () => {
      // Arrange
      const speaker: Speaker = 'caller';

      // Assert
      expect(isValidSpeaker(speaker)).toBe(true);
    });

    it('accepts agent as valid speaker', () => {
      // Arrange
      const speaker: Speaker = 'agent';

      // Assert
      expect(isValidSpeaker(speaker)).toBe(true);
    });

    it('rejects invalid speaker string', () => {
      // Arrange
      const invalidSpeaker = 'unknown';

      // Assert
      expect(isValidSpeaker(invalidSpeaker as any)).toBe(false);
    });

    it('rejects null', () => {
      // Assert
      expect(isValidSpeaker(null as any)).toBe(false);
    });

    it('rejects undefined', () => {
      // Assert
      expect(isValidSpeaker(undefined as any)).toBe(false);
    });

    it('rejects number', () => {
      // Assert
      expect(isValidSpeaker(123 as any)).toBe(false);
    });

    it('rejects object', () => {
      // Assert
      expect(isValidSpeaker({ speaker: 'caller' } as any)).toBe(false);
    });
  });

  describe('type safety', () => {
    it('allows assignment to caller', () => {
      // Act
      const speaker: Speaker = 'caller';

      // Assert
      expect(speaker).toBe('caller');
    });

    it('allows assignment to agent', () => {
      // Act
      const speaker: Speaker = 'agent';

      // Assert
      expect(speaker).toBe('agent');
    });

    // TypeScript compile-time test (will fail if uncommented)
    // it('prevents assignment of invalid string', () => {
    //   const speaker: Speaker = 'invalid'; // Should cause TS error
    // });
  });

  describe('equality', () => {
    it('compares caller speakers as equal', () => {
      // Arrange
      const speaker1: Speaker = 'caller';
      const speaker2: Speaker = 'caller';

      // Assert
      expect(speaker1 === speaker2).toBe(true);
    });

    it('compares agent speakers as equal', () => {
      // Arrange
      const speaker1: Speaker = 'agent';
      const speaker2: Speaker = 'agent';

      // Assert
      expect(speaker1 === speaker2).toBe(true);
    });

    it('compares different speakers as not equal', () => {
      // Arrange
      const speaker1: Speaker = 'caller';
      const speaker2: Speaker = 'agent';

      // Assert
      expect(speaker1 === speaker2).toBe(false);
    });
  });
});
