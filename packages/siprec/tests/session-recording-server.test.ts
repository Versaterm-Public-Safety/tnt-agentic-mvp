import { describe, it, expect } from 'vitest';
import { SessionRecordingServer } from '../src/session-recording-server';

describe('SessionRecordingServer', () => {
  it('should handle SIP INVITE and create session', () => {
    return new Promise<void>((resolve) => {
      const srs = new SessionRecordingServer();
    
    const sipInvite = `INVITE sip:srs@192.168.1.100 SIP/2.0
Via: SIP/2.0/UDP 192.168.1.50:5060
From: <sip:caller@example.com>
To: <sip:callee@example.com>
Call-ID: test-call-456
CSeq: 1 INVITE
Content-Type: application/sdp
Content-Length: 100

v=0
o=- 123456 789012 IN IP4 192.168.1.1
s=SIPREC Session
c=IN IP4 192.168.1.1
t=0 0
m=audio 49170 RTP/AVP 0
a=rtpmap:0 PCMU/8000`;

    srs.on('session-started', (session) => {
      expect(session.sessionId).toBe('session-1');
      expect(session.metadata.callId).toBe('test-call-456');
      expect(session.status).toBe('active');
      expect(session.streams).toHaveLength(1);
      resolve();
    });

    srs.handleSIPMessage(sipInvite, 'session-1');
    });
  });

  it('should handle RTP packets and emit audio', () => {
    return new Promise<void>((resolve) => {
      const srs = new SessionRecordingServer();
    
    const sipInvite = `INVITE sip:srs@192.168.1.100 SIP/2.0
From: <sip:caller@example.com>
To: <sip:callee@example.com>
Call-ID: test-call-789

v=0
m=audio 49170 RTP/AVP 0
a=rtpmap:0 PCMU/8000`;

    srs.handleSIPMessage(sipInvite, 'session-2');

    // Create RTP packet
    const rtpPacket = Buffer.alloc(32);
    rtpPacket[0] = 0x80; // RTP v2
    rtpPacket[1] = 0x00; // PT=0
    rtpPacket.writeUInt32BE(12345, 8); // SSRC
    rtpPacket.write('audio', 12);

    srs.on('audio', ({ sessionId, frame }) => {
      expect(sessionId).toBe('session-2');
      expect(frame.ssrc).toBe(12345);
      resolve();
    });

    srs.handleRTPPacket(rtpPacket, 'session-2');
    });
  });

  it('should end session properly', () => {
    const srs = new SessionRecordingServer();
    
    const sipInvite = `INVITE sip:srs@192.168.1.100 SIP/2.0
From: <sip:caller@example.com>
To: <sip:callee@example.com>
Call-ID: test-end

v=0
m=audio 49170 RTP/AVP 0
a=rtpmap:0 PCMU/8000`;

    srs.handleSIPMessage(sipInvite, 'session-3');
    
    const session = srs.getSession('session-3');
    expect(session?.status).toBe('active');
    
    srs.endSession('session-3');
    
    const endedSession = srs.getSession('session-3');
    expect(endedSession).toBeUndefined();
  });
});
