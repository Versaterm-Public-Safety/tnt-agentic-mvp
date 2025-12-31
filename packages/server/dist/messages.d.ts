import { Speaker } from '@tnt/core';
/**
 * WebSocket message types based on specs/features/real-time-transcription.md section 6.1
 */
export interface StartCallMessage {
    type: 'start_call';
    callId: string;
}
export interface EndCallMessage {
    type: 'end_call';
    callId: string;
}
export type ClientMessage = StartCallMessage | EndCallMessage;
export interface TranscriptData {
    id: string;
    text: string;
    speaker: Speaker;
    timestamp: string;
    confidence: number;
    isFinal: boolean;
}
export interface TranscriptMessage {
    type: 'transcript';
    callId: string;
    transcript: TranscriptData;
}
export interface CallStatusMessage {
    type: 'call_status';
    callId: string;
    status: 'active' | 'completed';
    startTime: string;
    endTime?: string;
}
export interface ErrorMessage {
    type: 'error';
    code: string;
    message: string;
}
export type ServerMessage = TranscriptMessage | CallStatusMessage | ErrorMessage;
export type WebSocketMessage = ClientMessage | ServerMessage;
//# sourceMappingURL=messages.d.ts.map