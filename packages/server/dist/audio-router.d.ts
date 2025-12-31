import { TranscriptionService } from '@tnt/transcription';
import { TntWebSocketServer } from './websocket-server';
export interface AudioChunk {
    callId: string;
    audio: Buffer;
    speaker: 'caller' | 'agent';
    timestamp: Date;
}
export declare class AudioRouter {
    private transcriptionService;
    private wsServer;
    private processingCalls;
    constructor(transcriptionService: TranscriptionService, wsServer: TntWebSocketServer);
    processAudioChunk(chunk: AudioChunk): Promise<void>;
    endCall(callId: string): void;
    private generateTranscriptId;
    getActiveCallCount(): number;
}
//# sourceMappingURL=audio-router.d.ts.map