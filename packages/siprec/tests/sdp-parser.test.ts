import { describe, it, expect } from 'vitest';
import { SDPParser } from '../src/sdp-parser';

describe('SDPParser', () => {
  it('should parse basic SDP with PCMU codec', () => {
    const sdp = `v=0
o=- 123456 789012 IN IP4 192.168.1.1
s=SIPREC Session
c=IN IP4 192.168.1.1
t=0 0
m=audio 49170 RTP/AVP 0
a=rtpmap:0 PCMU/8000`;

    const parser = new SDPParser();
    const streams = parser.parse(sdp);

    expect(streams).toHaveLength(1);
    expect(streams[0]).toMatchObject({
      payloadType: 0,
      codec: 'PCMU',
      sampleRate: 8000,
      channels: 1
    });
  });

  it('should parse SDP with PCMA codec', () => {
    const sdp = `v=0
o=- 123456 789012 IN IP4 192.168.1.1
s=SIPREC Session
c=IN IP4 192.168.1.1
t=0 0
m=audio 49170 RTP/AVP 8
a=rtpmap:8 PCMA/8000`;

    const parser = new SDPParser();
    const streams = parser.parse(sdp);

    expect(streams).toHaveLength(1);
    expect(streams[0]).toMatchObject({
      payloadType: 8,
      codec: 'PCMA',
      sampleRate: 8000,
      channels: 1
    });
  });

  it('should handle empty SDP', () => {
    const parser = new SDPParser();
    const streams = parser.parse('');

    expect(streams).toHaveLength(0);
  });
});
