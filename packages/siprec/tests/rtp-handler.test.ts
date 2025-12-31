import { describe, it, expect } from 'vitest';
import { RTPHandler } from '../src/rtp-handler';

describe('RTPHandler', () => {
  it('should extract audio from valid RTP packet', () => {
    return new Promise<void>((resolve) => {
      const handler = new RTPHandler();
      
      // Create a minimal RTP packet (version 2, no padding, no extension, no CSRC)
      const packet = Buffer.alloc(32);
      packet[0] = 0x80; // V=2, P=0, X=0, CC=0
      packet[1] = 0x00; // M=0, PT=0 (PCMU)
      packet.writeUInt16BE(1234, 2); // Sequence number
      packet.writeUInt32BE(5678, 4); // Timestamp
      packet.writeUInt32BE(9999, 8); // SSRC
      // Audio payload starts at byte 12
      packet.write('test audio data', 12);

      handler.on('audio', (frame) => {
        expect(frame.ssrc).toBe(9999);
        expect(frame.data.toString()).toContain('test audio data');
        resolve();
      });

      handler.handlePacket(packet);
    });
  });

  it('should reject packets that are too short', () => {
    const handler = new RTPHandler();
    const shortPacket = Buffer.alloc(5);

    let emitted = false;
    handler.on('audio', () => {
      emitted = true;
    });

    handler.handlePacket(shortPacket);
    expect(emitted).toBe(false);
  });

  it('should reject non-RTP packets', () => {
    const handler = new RTPHandler();
    const badPacket = Buffer.alloc(20);
    badPacket[0] = 0x00; // Version 0 (invalid)

    let emitted = false;
    handler.on('audio', () => {
      emitted = true;
    });

    handler.handlePacket(badPacket);
    expect(emitted).toBe(false);
  });
});
