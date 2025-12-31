import { EventEmitter } from 'events';
import { SIPRecMessageParser } from './message-parser';
import { SDPParser } from './sdp-parser';
import { RTPHandler } from './rtp-handler';
export class SessionRecordingServer extends EventEmitter {
    sessions = new Map();
    messageParser = new SIPRecMessageParser();
    sdpParser = new SDPParser();
    rtpHandlers = new Map();
    handleSIPMessage(message, sessionId) {
        const parsed = this.messageParser.parseInvite(message);
        if (!parsed) {
            this.emit('error', new Error('Failed to parse SIP INVITE'));
            return;
        }
        const streams = this.sdpParser.parse(parsed.sdp);
        const session = {
            sessionId,
            metadata: parsed.metadata,
            streams,
            status: 'active'
        };
        this.sessions.set(sessionId, session);
        // Create RTP handler for this session
        const rtpHandler = new RTPHandler();
        rtpHandler.on('audio', (frame) => {
            this.emit('audio', { sessionId, frame });
        });
        this.rtpHandlers.set(sessionId, rtpHandler);
        this.emit('session-started', session);
    }
    handleRTPPacket(packet, sessionId) {
        const rtpHandler = this.rtpHandlers.get(sessionId);
        if (rtpHandler) {
            rtpHandler.handlePacket(packet);
        }
    }
    endSession(sessionId) {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.status = 'ended';
            this.emit('session-ended', session);
            this.sessions.delete(sessionId);
            this.rtpHandlers.delete(sessionId);
        }
    }
    getSession(sessionId) {
        return this.sessions.get(sessionId);
    }
    getAllSessions() {
        return Array.from(this.sessions.values());
    }
}
//# sourceMappingURL=session-recording-server.js.map