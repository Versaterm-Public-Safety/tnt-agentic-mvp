import { TranscriptionService } from '@tnt/transcription';
import { TntWebSocketServer } from './websocket-server';
import { TranscriptUpdate } from './protocol';

export interface AudioChunk {
  callId: string;
  audio: Buffer;
  speaker: 'caller' | 'agent';
  timestamp: Date;
}

export class AudioRouter {
  private transcriptionService: TranscriptionService;
  private wsServer: TntWebSocketServer;
  private processingCalls: Set<string> = new Set();

  constructor(
    transcriptionService: TranscriptionService,
    wsServer: TntWebSocketServer
  ) {
    this.transcriptionService = transcriptionService;
    this.wsServer = wsServer;
  }

  async processAudioChunk(chunk: AudioChunk): Promise<void> {
    const { callId, audio, speaker, timestamp } = chunk;

    if (!this.processingCalls.has(callId)) {
      console.log(`Starting transcription for call ${callId}`);
      this.processingCalls.add(callId);
    }

    try {
      const audioBuffer = {
        data: audio.buffer.slice(audio.byteOffset, audio.byteOffset + audio.byteLength) as ArrayBuffer,
        sampleRate: 16000,
        channels: 1,
        duration: audio.length / (16000 * 2),
      };

      const result = await this.transcriptionService.transcribe(audioBuffer);

      if (result.text.trim().length > 0) {
        const update: TranscriptUpdate = {
          type: 'transcript',
          callId,
          transcript: {
            id: this.generateTranscriptId(callId, timestamp),
            text: result.text,
            speaker,
            confidence: result.confidence ?? 0.9,
            timestamp: timestamp.toISOString(),
            isFinal: true,
          },
        };

        this.wsServer.broadcast(update);
        console.log(`Transcription sent for call ${callId}: "${result.text}"`);
      }
    } catch (error) {
      console.error(`Transcription error for call ${callId}:`, error);
      this.wsServer.broadcast({
        type: 'error',
        code: 'TRANSCRIPTION_ERROR',
        message: error instanceof Error ? error.message : 'Unknown transcription error',
        timestamp: new Date().toISOString(),
      });
    }
  }

  endCall(callId: string): void {
    if (this.processingCalls.has(callId)) {
      console.log(`Ending transcription for call ${callId}`);
      this.processingCalls.delete(callId);
      
      this.wsServer.broadcast({
        type: 'status',
        status: 'disconnected',
        callId,
      });
    }
  }

  private generateTranscriptId(callId: string, timestamp: Date): string {
    return `${callId}-${timestamp.getTime()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getActiveCallCount(): number {
    return this.processingCalls.size;
  }
}
