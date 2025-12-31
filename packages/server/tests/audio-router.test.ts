import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AudioRouter, AudioChunk } from '../src/audio-router';
import { TntWebSocketServer } from '../src/websocket-server';
import { TranscriptionService } from '@tnt/transcription';

describe('AudioRouter', () => {
  let mockTranscriptionService: TranscriptionService;
  let mockWsServer: TntWebSocketServer;
  let audioRouter: AudioRouter;

  beforeEach(() => {
    mockTranscriptionService = {
      transcribe: vi.fn(),
    } as unknown as TranscriptionService;

    mockWsServer = {
      broadcast: vi.fn(),
    } as unknown as TntWebSocketServer;

    audioRouter = new AudioRouter(mockTranscriptionService, mockWsServer);
  });

  it('processes audio chunk and broadcasts transcript', async () => {
    // Arrange
    const audioChunk: AudioChunk = {
      callId: 'call-123',
      audio: Buffer.from([1, 2, 3, 4]),
      speaker: 'caller',
      timestamp: new Date('2025-01-01T12:00:00Z'),
    };

    vi.mocked(mockTranscriptionService.transcribe).mockResolvedValue({
      text: 'Hello world',
      confidence: 0.95,
    });

    // Act
    await audioRouter.processAudioChunk(audioChunk);

    // Assert
    expect(mockTranscriptionService.transcribe).toHaveBeenCalledWith(
      expect.objectContaining({
        sampleRate: 16000,
        channels: 1,
      })
    );
    expect(mockWsServer.broadcast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'transcript',
        callId: 'call-123',
        transcript: expect.objectContaining({
          text: 'Hello world',
          speaker: 'caller',
          confidence: 0.95,
        }),
      })
    );
  });

  it('does not broadcast empty transcripts', async () => {
    // Arrange
    const audioChunk: AudioChunk = {
      callId: 'call-123',
      audio: Buffer.from([1, 2, 3, 4]),
      speaker: 'caller',
      timestamp: new Date(),
    };

    vi.mocked(mockTranscriptionService.transcribe).mockResolvedValue({
      text: '   ',
      confidence: 0.5,
    });

    // Act
    await audioRouter.processAudioChunk(audioChunk);

    // Assert
    expect(mockWsServer.broadcast).not.toHaveBeenCalled();
  });

  it('handles transcription errors gracefully', async () => {
    // Arrange
    const audioChunk: AudioChunk = {
      callId: 'call-123',
      audio: Buffer.from([1, 2, 3, 4]),
      speaker: 'caller',
      timestamp: new Date(),
    };

    vi.mocked(mockTranscriptionService.transcribe).mockRejectedValue(
      new Error('Transcription failed')
    );

    // Act
    await audioRouter.processAudioChunk(audioChunk);

    // Assert
    expect(mockWsServer.broadcast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        code: 'TRANSCRIPTION_ERROR',
        message: 'Transcription failed',
      })
    );
  });

  it('tracks active calls', async () => {
    // Arrange
    const audioChunk: AudioChunk = {
      callId: 'call-123',
      audio: Buffer.from([1, 2, 3, 4]),
      speaker: 'caller',
      timestamp: new Date(),
    };

    vi.mocked(mockTranscriptionService.transcribe).mockResolvedValue({
      text: 'Test',
      confidence: 0.9,
    });

    // Act
    await audioRouter.processAudioChunk(audioChunk);

    // Assert
    expect(audioRouter.getActiveCallCount()).toBe(1);
  });

  it('ends call and broadcasts disconnection status', () => {
    // Arrange
    const audioChunk: AudioChunk = {
      callId: 'call-123',
      audio: Buffer.from([1, 2, 3, 4]),
      speaker: 'caller',
      timestamp: new Date(),
    };

    vi.mocked(mockTranscriptionService.transcribe).mockResolvedValue({
      text: 'Test',
      confidence: 0.9,
    });

    audioRouter.processAudioChunk(audioChunk);

    // Act
    audioRouter.endCall('call-123');

    // Assert
    expect(mockWsServer.broadcast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'status',
        status: 'disconnected',
        callId: 'call-123',
      })
    );
    expect(audioRouter.getActiveCallCount()).toBe(0);
  });

  it('processes multiple calls concurrently', async () => {
    // Arrange
    const chunk1: AudioChunk = {
      callId: 'call-1',
      audio: Buffer.from([1, 2, 3, 4]),
      speaker: 'caller',
      timestamp: new Date(),
    };

    const chunk2: AudioChunk = {
      callId: 'call-2',
      audio: Buffer.from([5, 6, 7, 8]),
      speaker: 'agent',
      timestamp: new Date(),
    };

    vi.mocked(mockTranscriptionService.transcribe).mockResolvedValue({
      text: 'Test',
      confidence: 0.9,
    });

    // Act
    await Promise.all([
      audioRouter.processAudioChunk(chunk1),
      audioRouter.processAudioChunk(chunk2),
    ]);

    // Assert
    expect(audioRouter.getActiveCallCount()).toBe(2);
  });
});
