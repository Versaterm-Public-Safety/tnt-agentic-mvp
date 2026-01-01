import type { RTPStream } from './types';

export class SDPParser {
  parse(sdpText: string): RTPStream[] {
    const streams: RTPStream[] = [];
    const lines = sdpText.split('\n');
    
    const currentMediaSection: { codec?: string; sampleRate?: number; channels?: number } = {};
    let payloadType: number | undefined;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // m=audio line
      if (trimmed.startsWith('m=audio')) {
        const parts = trimmed.split(' ');
        if (parts.length >= 4) {
          payloadType = parseInt(parts[3], 10);
        }
      }
      
      // a=rtpmap line (e.g., a=rtpmap:0 PCMU/8000)
      if (trimmed.startsWith('a=rtpmap:')) {
        const match = trimmed.match(/a=rtpmap:(\d+)\s+(\S+)\/(\d+)(?:\/(\d+))?/);
        if (match) {
          const pt = parseInt(match[1], 10);
          if (pt === payloadType || payloadType === undefined) {
            currentMediaSection.codec = match[2];
            currentMediaSection.sampleRate = parseInt(match[3], 10);
            currentMediaSection.channels = match[4] ? parseInt(match[4], 10) : 1;
          }
        }
      }
    }
    
    if (payloadType !== undefined && currentMediaSection.codec) {
      streams.push({
        ssrc: 0, // SSRC comes from RTP packets
        payloadType,
        codec: currentMediaSection.codec,
        sampleRate: currentMediaSection.sampleRate || 8000,
        channels: currentMediaSection.channels || 1
      });
    }
    
    return streams;
  }
}
