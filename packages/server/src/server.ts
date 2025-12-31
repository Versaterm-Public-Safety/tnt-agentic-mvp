import { WhisperTranscriptionService } from '@tnt/transcription';
import { TntWebSocketServer } from './websocket-server';
import { AudioRouter } from './audio-router';

export interface ServerConfig {
  websocket: {
    port: number;
  };
  transcription: {
    modelPath: string;
  };
}

export class TntServer {
  private wsServer: TntWebSocketServer;
  private transcriptionService: WhisperTranscriptionService;
  private audioRouter: AudioRouter;
  private config: ServerConfig;

  constructor(config: ServerConfig) {
    this.config = config;
    
    this.transcriptionService = new WhisperTranscriptionService({
      modelPath: config.transcription.modelPath,
    });

    this.wsServer = new TntWebSocketServer({
      port: config.websocket.port,
    });

    this.audioRouter = new AudioRouter(
      this.transcriptionService,
      this.wsServer
    );
  }

  async start(): Promise<void> {
    console.log('Starting TnT Server...');
    
    await this.wsServer.start();
    console.log(`WebSocket server listening on port ${this.config.websocket.port}`);

    console.log('TnT Server started successfully');
    console.log('Note: SIPREC integration requires full SIP server (see TODO)');
  }

  async stop(): Promise<void> {
    console.log('Stopping TnT Server...');
    
    await this.wsServer.stop();

    console.log('TnT Server stopped');
  }

  getAudioRouter(): AudioRouter {
    return this.audioRouter;
  }

  getStatus() {
    return {
      websocket: {
        clients: this.wsServer.getClientCount(),
      },
      audio: {
        activeCalls: this.audioRouter.getActiveCallCount(),
      },
    };
  }
}
