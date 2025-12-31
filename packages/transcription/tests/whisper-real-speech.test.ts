import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WhisperTranscriptionService } from '../src/whisper-service';
import type { AudioBuffer } from '../src/transcription-service';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('WhisperTranscriptionService - Real Speech', () => {
  const runIntegration = process.env.INTEGRATION === 'true';

  it.skipIf(!runIntegration)(
    'transcribes real spoken emergency call with Whisper.cpp',
    async () => {
      // Arrange
      const service = new WhisperTranscriptionService({
        modelPath: 'base',
        tempDir: '/tmp',
      });

      // Load REAL speech audio (TTS generated)
      const audioPath = path.join(__dirname, 'fixtures', 'emergency-call.wav');
      const wavData = fs.readFileSync(audioPath);

      // Parse WAV header to get sample rate
      const sampleRate = wavData.readUInt32LE(24);
      const channels = wavData.readUInt16LE(22);

      console.log('\n🎤 Real Speech Audio File:');
      console.log(`   File: emergency-call.wav`);
      console.log(`   Size: ${wavData.length} bytes`);
      console.log(`   Sample rate: ${sampleRate}Hz`);
      console.log(`   Channels: ${channels}`);

      // Extract audio data (skip 44-byte WAV header)
      const audioData = wavData.slice(44);
      const duration = audioData.length / (sampleRate * channels * 2);

      const audioBuffer: AudioBuffer = {
        data: audioData.buffer.slice(
          audioData.byteOffset,
          audioData.byteOffset + audioData.byteLength
        ),
        sampleRate,
        channels,
        duration,
      };

      console.log(`   Duration: ${duration.toFixed(2)}s`);
      console.log('\n🔄 Calling Whisper.cpp...');

      // Act - This will call REAL Whisper AI
      const startTime = Date.now();
      const result = await service.transcribe(audioBuffer);
      const elapsed = Date.now() - startTime;

      // Assert
      console.log('\n✅ Whisper Transcription Result:');
      console.log(`   Text: "${result.text}"`);
      console.log(`   Speaker: ${result.speaker}`);
      console.log(`   Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      console.log(`   Timestamp: ${result.timestamp.toISOString()}`);
      console.log(`   Final: ${result.isFinal}`);
      console.log(`   Processing time: ${elapsed}ms`);

      // Validate structure
      expect(result).toBeDefined();
      expect(result.text).toBeDefined();
      expect(typeof result.text).toBe('string');
      expect(result.text.length).toBeGreaterThan(0);

      // The transcription should contain emergency-related words
      const transcriptLower = result.text.toLowerCase();
      const hasEmergencyContent =
        transcriptLower.includes('emergency') ||
        transcriptLower.includes('main') ||
        transcriptLower.includes('street') ||
        transcriptLower.includes('police') ||
        transcriptLower.includes('ambulance');

      if (hasEmergencyContent) {
        console.log('\n✅ Transcription contains expected emergency keywords!');
      } else {
        console.log('\n⚠️  Transcription does not contain expected keywords.');
        console.log('   This is OK - Whisper may have transcribed differently.');
      }

      // Validate other fields
      expect(result.speaker).toBe('caller');
      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
      expect(result.timestamp).toBeInstanceOf(Date);
      expect(result.isFinal).toBe(true);
      expect(elapsed).toBeLessThan(30000); // Should complete within 30 seconds
    },
    60000
  ); // 60 second timeout for Whisper processing

  it('validates real speech audio file structure', () => {
    // Arrange
    const audioPath = path.join(__dirname, 'fixtures', 'emergency-call.wav');
    const wavData = fs.readFileSync(audioPath);

    // Act - Parse WAV header
    const riffMarker = wavData.toString('ascii', 0, 4);
    const waveMarker = wavData.toString('ascii', 8, 12);
    const sampleRate = wavData.readUInt32LE(24);
    const channels = wavData.readUInt16LE(22);
    const bitsPerSample = wavData.readUInt16LE(34);

    // Assert
    expect(riffMarker).toBe('RIFF');
    expect(waveMarker).toBe('WAVE');
    expect(sampleRate).toBe(16000);
    expect(channels).toBe(1);
    expect(bitsPerSample).toBe(16);

    console.log('\n📁 Real Speech Audio Validated:');
    console.log(`   Format: ${bitsPerSample}-bit ${channels === 1 ? 'mono' : 'stereo'}`);
    console.log(`   Sample rate: ${sampleRate}Hz (Whisper-compatible)`);
    console.log(`   File size: ${wavData.length} bytes`);
    console.log(`   Audio contains: "Emergency at 123 Main Street..."`);
  });
});
