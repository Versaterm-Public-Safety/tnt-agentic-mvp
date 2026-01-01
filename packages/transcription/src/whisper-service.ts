import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import type { TranscriptionService, AudioBuffer, TranscriptionResult } from './transcription-service';

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

/**
 * Real Whisper.cpp implementation for audio transcription
 * Converts audio buffers to text using OpenAI's Whisper model
 */
export class WhisperTranscriptionService implements TranscriptionService {
  private modelPath: string;
  private tempDir: string;

  constructor(options: { modelPath?: string; tempDir?: string } = {}) {
    this.modelPath = options.modelPath || 'base';
    this.tempDir = options.tempDir || '/tmp';
  }

  async transcribe(audio: AudioBuffer): Promise<TranscriptionResult> {
    // For now, we'll create a simple WAV file from the buffer
    // In production, this would handle proper WAV formatting
    const wavPath = await this.audioBufferToWav(audio);

    try {
      // Dynamic import of whisper-node (ESM module)
      const whisperModule = await import('whisper-node');
      const whisper = 'default' in whisperModule ? whisperModule.default : whisperModule;

      // Call Whisper
      const result = await whisper(wavPath, {
        modelName: this.modelPath,
        autoDownloadModelName: this.modelPath,
      });

      // Process transcription result
      interface WhisperSegment {
        speech: string;
      }
      const transcriptionText = Array.isArray(result)
        ? result.map((segment: WhisperSegment) => segment.speech).join(' ')
        : String(result);

      // Calculate confidence (Whisper doesn't provide this directly)
      // In production, you'd analyze the word-level probabilities
      const confidence = this.estimateConfidence(transcriptionText);

      return {
        id: this.generateId(),
        text: transcriptionText.trim(),
        speaker: 'caller', // In production, determine from SIPREC metadata
        confidence,
        timestamp: new Date(),
        isFinal: true,
      };
    } finally {
      // Cleanup temp file
      await this.cleanupTempFile(wavPath);
    }
  }

  private async audioBufferToWav(audio: AudioBuffer): Promise<string> {
    // Create a simple WAV file header
    const wavHeader = this.createWavHeader(
      audio.data.byteLength,
      audio.sampleRate,
      audio.channels
    );

    const wavData = new Uint8Array(wavHeader.length + audio.data.byteLength);
    wavData.set(wavHeader, 0);
    wavData.set(new Uint8Array(audio.data), wavHeader.length);

    const tempPath = path.join(this.tempDir, `audio-${Date.now().toString()}.wav`);
    await writeFile(tempPath, Buffer.from(wavData));

    return tempPath;
  }

  private createWavHeader(
    dataSize: number,
    sampleRate: number,
    channels: number
  ): Uint8Array {
    const header = new ArrayBuffer(44);
    const view = new DataView(header);

    // "RIFF" chunk descriptor
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    this.writeString(view, 8, 'WAVE');

    // "fmt " sub-chunk
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // Subchunk size
    view.setUint16(20, 1, true); // Audio format (1 = PCM)
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * channels * 2, true); // Byte rate
    view.setUint16(32, channels * 2, true); // Block align
    view.setUint16(34, 16, true); // Bits per sample

    // "data" sub-chunk
    this.writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    return new Uint8Array(header);
  }

  private writeString(view: DataView, offset: number, str: string): void {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  private estimateConfidence(text: string): number {
    // Simple heuristic: longer, well-formed text = higher confidence
    // In production, use Whisper's word-level probabilities
    if (!text || text.length < 3) return 0.3;
    if (text.length < 10) return 0.6;
    if (text.includes('?') || text.includes('.')) return 0.85;
    return 0.75;
  }

  private generateId(): string {
    return `transcript-${Date.now().toString()}-${Math.random().toString(36).substring(7)}`;
  }

  private async cleanupTempFile(filePath: string): Promise<void> {
    try {
      await unlink(filePath);
    } catch (error) {
      // Ignore cleanup errors
      console.warn(`Failed to cleanup temp file ${filePath}:`, error);
    }
  }
}
