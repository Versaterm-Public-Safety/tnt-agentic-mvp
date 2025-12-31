// Generate a simple test audio file (1 second of silence at 16kHz)
const fs = require('fs');
const path = require('path');

function createWavHeader(dataSize, sampleRate, channels) {
  const header = Buffer.alloc(44);
  
  // "RIFF" chunk descriptor
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  
  // "fmt " sub-chunk
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // Subchunk size
  header.writeUInt16LE(1, 20);  // Audio format (PCM)
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * channels * 2, 28); // Byte rate
  header.writeUInt16LE(channels * 2, 32); // Block align
  header.writeUInt16LE(16, 34); // Bits per sample
  
  // "data" sub-chunk
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);
  
  return header;
}

// Create 1 second of silence (16kHz, mono, 16-bit)
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
