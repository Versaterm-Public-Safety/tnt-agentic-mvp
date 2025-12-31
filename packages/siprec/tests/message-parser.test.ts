import { describe, it, expect } from 'vitest';
import { SIPRecMessageParser } from '../src/message-parser';

describe('SIPRecMessageParser', () => {
  it('should parse INVITE with SDP', () => {
    const sipInvite = `INVITE sip:srs@192.168.1.100 SIP/2.0
Via: SIP/2.0/UDP 192.168.1.50:5060
From: <sip:caller@example.com>
To: <sip:callee@example.com>
Call-ID: test-call-123
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

    const parser = new SIPRecMessageParser();
    const result = parser.parseInvite(sipInvite);

    expect(result).not.toBeNull();
    expect(result?.metadata.callId).toBe('test-call-123');
    expect(result?.metadata.participants).toHaveLength(2);
    expect(result?.metadata.participants[0].role).toBe('caller');
    expect(result?.metadata.participants[1].role).toBe('callee');
    expect(result?.sdp).toContain('m=audio');
  });

  it('should handle missing Call-ID', () => {
    const invalidInvite = `INVITE sip:srs@192.168.1.100 SIP/2.0
From: <sip:caller@example.com>
To: <sip:callee@example.com>`;

    const parser = new SIPRecMessageParser();
    const result = parser.parseInvite(invalidInvite);

    expect(result).toBeNull();
  });
});
