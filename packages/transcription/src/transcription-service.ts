export interface AudioBuffer {
  data: ArrayBuffer;
  sampleRate: number;
  channels: number;
  duration: number;
}

export interface TranscriptionResult {
  id: string;
  text: string;
  speaker: 'caller' | 'agent';
  confidence: number;
  timestamp: Date;
  isFinal: boolean;
}

export interface TranscriptionService {
  transcribe(audio: AudioBuffer): Promise<TranscriptionResult>;
}
