// Generate a simple test audio file (1 second of silence at 16kHz)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWavHeader(dataSize, sampleRate, channels) {
  const header = Buffer.alloc(44);
  
  // "RIFF" chunk descriptor
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  
  // "fmt " sub-chunk
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * channels * 2, 28);
  header.writeUInt16LE(channels * 2, 32);
  header.writeUInt16LE(16, 34);
  
  // "data" sub-chunk
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);
  
  return header;
}

const sampleRate = 16000;
const channels = 1;
const duration = 1.0;
const dataSize = sampleRate * channels * 2 * duration;

const header = createWavHeader(dataSize, sampleRate, channels);
const silence = Buffer.alloc(dataSize, 0);

const wavData = Buffer.concat([header, silence]);
const outputPath = path.join(__dirname, 'fixtures', 'test-silence.wav');

fs.writeFileSync(outputPath, wavData);
console.log(`Created test audio file: ${outputPath}`);
console.log(`Size: ${wavData.length} bytes`);
console.log(`Duration: ${duration}s at ${sampleRate}Hz`);
