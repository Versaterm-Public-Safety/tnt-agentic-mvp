import { EventEmitter } from 'events';
import type { SIPRecSession } from './types';
export declare class SessionRecordingServer extends EventEmitter {
    private sessions;
    private messageParser;
    private sdpParser;
    private rtpHandlers;
    handleSIPMessage(message: string, sessionId: string): void;
    handleRTPPacket(packet: Buffer, sessionId: string): void;
    endSession(sessionId: string): void;
    getSession(sessionId: string): SIPRecSession | undefined;
    getAllSessions(): SIPRecSession[];
}
//# sourceMappingURL=session-recording-server.d.ts.map