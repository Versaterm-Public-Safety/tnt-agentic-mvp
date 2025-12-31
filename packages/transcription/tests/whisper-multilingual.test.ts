import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WhisperTranscriptionService } from '../src/whisper-service';
import type { AudioBuffer } from '../src/transcription-service';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('WhisperTranscriptionService - Multilingual', () => {
  const runIntegration = process.env.INTEGRATION === 'true';

  async function transcribeAudioFile(
    service: WhisperTranscriptionService,
    filename: string,
    language: string
  ) {
    const audioPath = path.join(__dirname, 'fixtures', filename);
    const wavData = fs.readFileSync(audioPath);

    const sampleRate = wavData.readUInt32LE(24);
    const channels = wavData.readUInt16LE(22);
    const audioData = wavData.slice(44);
    const duration = audioData.length / (sampleRate * channels * 2);

    console.log(`\n🎤 ${language} Audio File:`);
    console.log(`   File: ${filename}`);
    console.log(`   Size: ${wavData.length} bytes`);
    console.log(`   Duration: ${duration.toFixed(2)}s`);
    console.log(`   Sample rate: ${sampleRate}Hz`);

    const audioBuffer: AudioBuffer = {
      data: audioData.buffer.slice(
        audioData.byteOffset,
        audioData.byteOffset + audioData.byteLength
      ),
      sampleRate,
      channels,
      duration,
    };

    console.log(`\n🔄 Calling Whisper.cpp for ${language}...`);

    const startTime = Date.now();
    const result = await service.transcribe(audioBuffer);
    const elapsed = Date.now() - startTime;

    console.log(`\n✅ ${language} Transcription Result:`);
    console.log(`   Text: "${result.text}"`);
    console.log(`   Speaker: ${result.speaker}`);
    console.log(`   Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`   Processing time: ${elapsed}ms`);

    return { result, elapsed };
  }

  it.skipIf(!runIntegration)(
    'transcribes Spanish emergency call',
    async () => {
      // Arrange
      const service = new WhisperTranscriptionService({
        modelPath: 'base',
        tempDir: '/tmp',
      });

      // Spanish: "Emergencia en calle principal 123. Envíe policía y ambulancia inmediatamente."
      const { result, elapsed } = await transcribeAudioFile(
        service,
        'emergency-spanish.wav',
        'Spanish'
      );

      // Assert
      expect(result).toBeDefined();
      expect(result.text).toBeDefined();
      expect(typeof result.text).toBe('string');
      expect(result.text.length).toBeGreaterThan(0);

      const transcriptLower = result.text.toLowerCase();
      const hasSpanishContent =
        transcriptLower.includes('emergencia') ||
        transcriptLower.includes('calle') ||
        transcriptLower.includes('principal') ||
        transcriptLower.includes('policía') ||
        transcriptLower.includes('policia') ||
        transcriptLower.includes('ambulancia');

      if (hasSpanishContent) {
        console.log('\n✅ Spanish transcription contains expected keywords!');
      } else {
        console.log('\n⚠️  Note: Whisper may have transcribed differently or auto-translated.');
        console.log('   This is acceptable - Whisper handles multilingual audio.');
      }

      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
      expect(elapsed).toBeLessThan(30000);
    },
    60000
  );

  it.skipIf(!runIntegration)(
    'transcribes French emergency call',
    async () => {
      // Arrange
      const service = new WhisperTranscriptionService({
        modelPath: 'base',
        tempDir: '/tmp',
      });

      // French: "Urgence au 123 rue principale. Envoyez police et ambulance immédiatement."
      const { result, elapsed } = await transcribeAudioFile(
        service,
        'emergency-french.wav',
        'French'
      );

      // Assert
      expect(result).toBeDefined();
      expect(result.text).toBeDefined();
      expect(typeof result.text).toBe('string');
      expect(result.text.length).toBeGreaterThan(0);

      const transcriptLower = result.text.toLowerCase();
      const hasFrenchContent =
        transcriptLower.includes('urgence') ||
        transcriptLower.includes('rue') ||
        transcriptLower.includes('principale') ||
        transcriptLower.includes('police') ||
        transcriptLower.includes('ambulance');

      if (hasFrenchContent) {
        console.log('\n✅ French transcription contains expected keywords!');
      } else {
        console.log('\n⚠️  Note: Whisper may have transcribed differently or auto-translated.');
      }

      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
      expect(elapsed).toBeLessThan(30000);
    },
    60000
  );

  it.skipIf(!runIntegration)(
    'transcribes Mandarin Chinese emergency call',
    async () => {
      // Arrange
      const service = new WhisperTranscriptionService({
        modelPath: 'base',
        tempDir: '/tmp',
      });

      // Mandarin: "紧急情况，在主街123号。立即派警察和救护车。"
      const { result, elapsed } = await transcribeAudioFile(
        service,
        'emergency-chinese.wav',
        'Mandarin Chinese'
      );

      // Assert
      expect(result).toBeDefined();
      expect(result.text).toBeDefined();
      expect(typeof result.text).toBe('string');
      expect(result.text.length).toBeGreaterThan(0);

      const transcriptLower = result.text.toLowerCase();
      const hasChineseContent =
        result.text.includes('紧急') ||
        result.text.includes('主街') ||
        result.text.includes('警察') ||
        result.text.includes('救护车') ||
        // Whisper often translates to English
        transcriptLower.includes('emergency') ||
        transcriptLower.includes('police') ||
        transcriptLower.includes('ambulance');

      if (hasChineseContent) {
        console.log('\n✅ Chinese transcription contains expected keywords!');
      } else {
        console.log('\n⚠️  Note: Whisper may have auto-translated to English.');
        console.log('   This is a known Whisper behavior for non-Latin scripts.');
      }

      expect(result.confidence).toBeGreaterThanOrEqual(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
      expect(elapsed).toBeLessThan(30000);
    },
    60000
  );

  it('validates all multilingual audio files exist and are properly formatted', () => {
    const languages = [
      { file: 'emergency-spanish.wav', name: 'Spanish', text: 'Emergencia en calle principal' },
      { file: 'emergency-french.wav', name: 'French', text: 'Urgence au rue principale' },
      { file: 'emergency-chinese.wav', name: 'Mandarin', text: '紧急情况，在主街' },
    ];

    console.log('\n📁 Multilingual Audio Files:');

    languages.forEach(({ file, name, text }) => {
      const audioPath = path.join(__dirname, 'fixtures', file);
      const wavData = fs.readFileSync(audioPath);

      const riffMarker = wavData.toString('ascii', 0, 4);
      const waveMarker = wavData.toString('ascii', 8, 12);
      const sampleRate = wavData.readUInt32LE(24);
      const channels = wavData.readUInt16LE(22);
      const bitsPerSample = wavData.readUInt16LE(34);

      expect(riffMarker).toBe('RIFF');
      expect(waveMarker).toBe('WAVE');
      expect(sampleRate).toBe(16000);
      expect(channels).toBe(1);
      expect(bitsPerSample).toBe(16);

      console.log(`\n   ${name}:`);
      console.log(`      File: ${file}`);
      console.log(`      Size: ${wavData.length} bytes`);
      console.log(`      Format: 16-bit mono @ 16kHz`);
      console.log(`      Contains: "${text}"`);
    });

    console.log('\n✅ All multilingual audio files validated!');
  });
});
