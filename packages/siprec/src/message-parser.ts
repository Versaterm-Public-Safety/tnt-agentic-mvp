import type { SIPRecMetadata, Participant } from './types';

export class SIPRecMessageParser {
  parseInvite(sipMessage: string): { sdp: string; metadata: SIPRecMetadata } | null {
    // Normalize line endings to handle both \r\n and \n
    const normalized = sipMessage.replace(/\r\n/g, '\n');
    const lines = normalized.split('\n');
    
    // Extract Call-ID
    const callIdLine = lines.find(l => l.toLowerCase().startsWith('call-id:'));
    if (!callIdLine) {
      return null;
    }
    const callId = callIdLine.substring(8).trim();
    
    // Find SDP body (after empty line)
    const emptyLineIndex = lines.findIndex(l => l.trim() === '');
    if (emptyLineIndex === -1) {
      return null;
    }
    
    const sdp = lines.slice(emptyLineIndex + 1).join('\n');
    
    // Create basic metadata
    const metadata: SIPRecMetadata = {
      callId,
      participants: this.extractParticipants(sipMessage),
      startTime: new Date()
    };
    
    return { sdp, metadata };
  }
  
  private extractParticipants(sipMessage: string): Participant[] {
    const participants: Participant[] = [];
    const normalized = sipMessage.replace(/\r\n/g, '\n');
    const lines = normalized.split('\n');
    
    // Extract From header
    const fromLine = lines.find(l => l.toLowerCase().startsWith('from:'));
    if (fromLine) {
      const fromMatch = fromLine.match(/<([^>]+)>/);
      if (fromMatch) {
        participants.push({
          name: 'Caller',
          uri: fromMatch[1],
          role: 'caller'
        });
      }
    }
    
    // Extract To header
    const toLine = lines.find(l => l.toLowerCase().startsWith('to:'));
    if (toLine) {
      const toMatch = toLine.match(/<([^>]+)>/);
      if (toMatch) {
        participants.push({
          name: 'Callee',
          uri: toMatch[1],
          role: 'callee'
        });
      }
    }
    
    return participants;
  }
}
