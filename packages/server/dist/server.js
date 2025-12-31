import { WhisperTranscriptionService } from '@tnt/transcription';
import { TntWebSocketServer } from './websocket-server';
import { AudioRouter } from './audio-router';
export class TntServer {
    wsServer;
    transcriptionService;
    audioRouter;
    config;
    constructor(config) {
        this.config = config;
        this.transcriptionService = new WhisperTranscriptionService({
            modelPath: config.transcription.modelPath,
        });
        this.wsServer = new TntWebSocketServer({
            port: config.websocket.port,
        });
        this.audioRouter = new AudioRouter(this.transcriptionService, this.wsServer);
    }
    async start() {
        console.log('Starting TnT Server...');
        await this.wsServer.start();
        console.log(`WebSocket server listening on port ${this.config.websocket.port}`);
        console.log('TnT Server started successfully');
        console.log('Note: SIPREC integration requires full SIP server (see TODO)');
    }
    async stop() {
        console.log('Stopping TnT Server...');
        await this.wsServer.stop();
        console.log('TnT Server stopped');
    }
    getAudioRouter() {
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
//# sourceMappingURL=server.js.map