export interface SIPRecMetadata {
  callId: string;
  participants: Participant[];
  startTime: Date;
}

export interface Participant {
  name: string;
  uri: string;
  role: 'caller' | 'callee';
}

export interface RTPStream {
  ssrc: number;
  payloadType: number;
  codec: string;
  sampleRate: number;
  channels: number;
}

export interface SIPRecSession {
  sessionId: string;
  metadata: SIPRecMetadata;
  streams: RTPStream[];
  status: 'active' | 'inactive' | 'ended';
}

export interface AudioFrame {
  data: Buffer;
  timestamp: number;
  ssrc: number;
}
