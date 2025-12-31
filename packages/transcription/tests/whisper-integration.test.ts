import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WhisperTranscriptionService } from '../src/whisper-service';
import type { AudioBuffer } from '../src/transcription-service';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('WhisperTranscriptionService (Integration)', () => {
  // Skip these tests by default as they require Whisper model download
  // Run with: INTEGRATION=true pnpm test
  const runIntegration = process.env.INTEGRATION === 'true';

  it.skipIf(!runIntegration)('transcribes real audio file with Whisper.cpp', async () => {
    // Arrange
    const service = new WhisperTranscriptionService({
      modelPath: 'base',
      tempDir: '/tmp',
    });

    // Load test audio file
    const audioPath = path.join(__dirname, 'fixtures', 'test-silence.wav');
    const wavData = fs.readFileSync(audioPath);
    
    // Extract audio data (skip 44-byte WAV header)
    const audioData = wavData.slice(44);
    
    const audioBuffer: AudioBuffer = {
      data: audioData.buffer,
      sampleRate: 16000,
      channels: 1,
      duration: 1.0,
    };

    // Act
    const result = await service.transcribe(audioBuffer);

    // Assert
    expect(result).toBeDefined();
    expect(result.text).toBeDefined();
    expect(typeof result.text).toBe('string');
    expect(result.speaker).toBe('caller');
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(result.timestamp).toBeInstanceOf(Date);
    expect(result.isFinal).toBe(true);
    
    console.log('✅ Real Whisper transcription result:');
    console.log(`   Text: "${result.text}"`);
    console.log(`   Speaker: ${result.speaker}`);
    console.log(`   Confidence: ${(result.confidence * 100).toFixed(1)}%`);
  }, 30000); // 30 second timeout for Whisper processing

  it('demonstrates audio buffer creation from WAV file', () => {
    // Arrange
    const audioPath = path.join(__dirname, 'fixtures', 'test-silence.wav');
    const wavData = fs.readFileSync(audioPath);
    
    // Act
    const header = wavData.slice(0, 44);
    const audioData = wavData.slice(44);
    
    // Parse WAV header
    const riffMarker = header.toString('ascii', 0, 4);
    const waveMarker = header.toString('ascii', 8, 12);
    const sampleRate = header.readUInt32LE(24);
    const channels = header.readUInt16LE(22);
    
    // Assert
    expect(riffMarker).toBe('RIFF');
    expect(waveMarker).toBe('WAVE');
    expect(sampleRate).toBe(16000);
    expect(channels).toBe(1);
    expect(audioData.length).toBe(32000); // 1 second at 16kHz = 16000 samples * 2 bytes
    
    console.log('📁 Test audio file validated:');
    console.log(`   Sample rate: ${sampleRate}Hz`);
    console.log(`   Channels: ${channels}`);
    console.log(`   Data size: ${audioData.length} bytes`);
  });

  it('creates valid audio buffer structure', () => {
    // Arrange
    const audioPath = path.join(__dirname, 'fixtures', 'test-silence.wav');
    const wavData = fs.readFileSync(audioPath);
    const audioData = wavData.slice(44);
    
    // Act
    const audioBuffer: AudioBuffer = {
      data: audioData.buffer.slice(audioData.byteOffset, audioData.byteOffset + audioData.byteLength),
      sampleRate: 16000,
      channels: 1,
      duration: 1.0,
    };
    
    // Assert
    expect(audioBuffer.data).toBeInstanceOf(ArrayBuffer);
    expect(audioBuffer.data.byteLength).toBe(32000);
    expect(audioBuffer.sampleRate).toBe(16000);
    expect(audioBuffer.channels).toBe(1);
    expect(audioBuffer.duration).toBe(1.0);
    
    console.log('🎤 AudioBuffer structure validated:');
    console.log(`   Buffer size: ${audioBuffer.data.byteLength} bytes`);
    console.log(`   Sample rate: ${audioBuffer.sampleRate}Hz`);
    console.log(`   Duration: ${audioBuffer.duration}s`);
  });
});
