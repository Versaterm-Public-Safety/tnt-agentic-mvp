#!/usr/bin/env node

import { TntServer } from './server';

const config = {
  websocket: {
    port: parseInt(process.env.WS_PORT || '8080', 10),
  },
  transcription: {
    modelPath: process.env.WHISPER_MODEL_PATH || './models/ggml-base.bin',
  },
};

const server = new TntServer(config);

process.on('SIGINT', async () => {
  console.log('\nReceived SIGINT, shutting down gracefully...');
  await server.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nReceived SIGTERM, shutting down gracefully...');
  await server.stop();
  process.exit(0);
});

server.start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
