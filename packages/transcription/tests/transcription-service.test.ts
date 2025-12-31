import { describe, it, expect, beforeEach } from 'vitest';
import type { TranscriptionService, AudioBuffer } from '../src/transcription-service';

// Fake implementation for testing (per ADR-003)
class FakeTranscriptionService implements TranscriptionService {
  async transcribe(audio: AudioBuffer): Promise<{
    id: string;
    text: string;
    speaker: 'caller' | 'agent';
    confidence: number;
    timestamp: Date;
    isFinal: boolean;
  }> {
    // Return canned response for deterministic tests
    return {
      id: 'fake-transcript-001',
      text: 'This is a fake transcription for testing',
      speaker: 'caller',
      confidence: 0.95,
      timestamp: new Date('2025-01-01T12:00:00Z'),
      isFinal: true,
    };
  }
}

describe('TranscriptionService', () => {
  let service: TranscriptionService;

  beforeEach(() => {
    service = new FakeTranscriptionService();
  });

  describe('transcribe', () => {
    it('transcribes audio buffer to text', async () => {
      // Arrange
      const audioBuffer: AudioBuffer = {
        data: new ArrayBuffer(1024),
        sampleRate: 16000,
        channels: 1,
        duration: 1.0,
      };

      // Act
      const result = await service.transcribe(audioBuffer);

      // Assert
      expect(result.text).toBeDefined();
      expect(typeof result.text).toBe('string');
      expect(result.text.length).toBeGreaterThan(0);
    });

    it('returns transcript with valid structure', async () => {
      // Arrange
      const audioBuffer: AudioBuffer = {
        data: new ArrayBuffer(1024),
        sampleRate: 16000,
        channels: 1,
        duration: 1.0,
      };

      // Act
      const result = await service.transcribe(audioBuffer);

      // Assert
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('text');
      expect(result).toHaveProperty('speaker');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('isFinal');
    });

    it('returns confidence between 0 and 1', async () => {
      // Arrange
      const audioBuffer: AudioBuffer = {
        data: new ArrayBuffer(1024),
        sampleRate: 16000,
        channels: 1,
        duration: 1.0,
      };

      // Act
      const result = await service.transcribe(audioBuffer);

      // Assert
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('returns valid speaker type', async () => {
      // Arrange
      const audioBuffer: AudioBuffer = {
        data: new ArrayBuffer(1024),
        sampleRate: 16000,
        channels: 1,
        duration: 1.0,
      };

      // Act
      const result = await service.transcribe(audioBuffer);

      // Assert
      expect(['caller', 'agent']).toContain(result.speaker);
    });

    it('processes multiple audio buffers', async () => {
      // Arrange
      const audioBuffer1: AudioBuffer = {
        data: new ArrayBuffer(1024),
        sampleRate: 16000,
        channels: 1,
        duration: 1.0,
      };
      const audioBuffer2: AudioBuffer = {
        data: new ArrayBuffer(2048),
        sampleRate: 16000,
        channels: 1,
        duration: 2.0,
      };

      // Act
      const result1 = await service.transcribe(audioBuffer1);
      const result2 = await service.transcribe(audioBuffer2);

      // Assert
      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
    });
  });

  describe('performance', () => {
    it('completes transcription within reasonable time', async () => {
      // Arrange
      const audioBuffer: AudioBuffer = {
        data: new ArrayBuffer(8000 * 2), // 1 second of 16kHz mono
        sampleRate: 16000,
        channels: 1,
        duration: 1.0,
      };
      const startTime = Date.now();

      // Act
      await service.transcribe(audioBuffer);
      const elapsed = Date.now() - startTime;

      // Assert
      // Fake service should be instant, real Whisper should be <2s for 1s audio
      expect(elapsed).toBeLessThan(2000);
    });
  });
});
