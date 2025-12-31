import { EventEmitter } from 'events';
import type { SIPRecSession, AudioFrame } from './types';
import { SIPRecMessageParser } from './message-parser';
import { SDPParser } from './sdp-parser';
import { RTPHandler } from './rtp-handler';

export class SessionRecordingServer extends EventEmitter {
  private sessions = new Map<string, SIPRecSession>();
  private messageParser = new SIPRecMessageParser();
  private sdpParser = new SDPParser();
  private rtpHandlers = new Map<string, RTPHandler>();
  
  handleSIPMessage(message: string, sessionId: string): void {
    const parsed = this.messageParser.parseInvite(message);
    if (!parsed) {
      this.emit('error', new Error('Failed to parse SIP INVITE'));
      return;
    }
    
    const streams = this.sdpParser.parse(parsed.sdp);
    
    const session: SIPRecSession = {
      sessionId,
      metadata: parsed.metadata,
      streams,
      status: 'active'
    };
    
    this.sessions.set(sessionId, session);
    
    // Create RTP handler for this session
    const rtpHandler = new RTPHandler();
    rtpHandler.on('audio', (frame: AudioFrame) => {
      this.emit('audio', { sessionId, frame });
    });
    this.rtpHandlers.set(sessionId, rtpHandler);
    
    this.emit('session-started', session);
  }
  
  handleRTPPacket(packet: Buffer, sessionId: string): void {
    const rtpHandler = this.rtpHandlers.get(sessionId);
    if (rtpHandler) {
      rtpHandler.handlePacket(packet);
    }
  }
  
  endSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.status = 'ended';
      this.emit('session-ended', session);
      this.sessions.delete(sessionId);
      this.rtpHandlers.delete(sessionId);
    }
  }
  
  getSession(sessionId: string): SIPRecSession | undefined {
    return this.sessions.get(sessionId);
  }
  
  getAllSessions(): SIPRecSession[] {
    return Array.from(this.sessions.values());
  }
}
