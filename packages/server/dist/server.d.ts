import { AudioRouter } from './audio-router';
export interface ServerConfig {
    websocket: {
        port: number;
    };
    transcription: {
        modelPath: string;
    };
}
export declare class TntServer {
    private wsServer;
    private transcriptionService;
    private audioRouter;
    private config;
    constructor(config: ServerConfig);
    start(): Promise<void>;
    stop(): Promise<void>;
    getAudioRouter(): AudioRouter;
    getStatus(): {
        websocket: {
            clients: number;
        };
        audio: {
            activeCalls: number;
        };
    };
}
//# sourceMappingURL=server.d.ts.map