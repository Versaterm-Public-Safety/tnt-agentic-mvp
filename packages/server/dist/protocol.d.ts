export interface TranscriptUpdate {
    type: 'transcript';
    callId: string;
    transcript: {
        id: string;
        text: string;
        speaker: 'caller' | 'agent';
        confidence: number;
        timestamp: string;
        isFinal: boolean;
    };
}
export interface ErrorMessage {
    type: 'error';
    code: string;
    message: string;
    timestamp: string;
}
export interface ConnectionStatus {
    type: 'status';
    status: 'connected' | 'disconnected' | 'reconnecting';
    callId?: string;
}
export type WebSocketMessage = TranscriptUpdate | ErrorMessage | ConnectionStatus;
export declare function isTranscriptUpdate(msg: unknown): msg is TranscriptUpdate;
export declare function isErrorMessage(msg: unknown): msg is ErrorMessage;
export declare function isConnectionStatus(msg: unknown): msg is ConnectionStatus;
//# sourceMappingURL=protocol.d.ts.map