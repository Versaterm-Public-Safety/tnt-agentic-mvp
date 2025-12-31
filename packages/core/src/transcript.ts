import { Speaker } from './speaker';

/**
 * Transcript represents a single piece of transcribed text from a call
 */
export class Transcript {
  readonly id: string;
  readonly callId: string;
  readonly text: string;
  readonly speaker: Speaker;
  readonly timestamp: Date;
  readonly confidence: number;
  readonly isFinal: boolean;

  constructor(data: {
    id: string;
    callId: string;
    text: string;
    speaker: Speaker;
    timestamp: Date;
    confidence: number;
    isFinal: boolean;
  }) {
    // Validate text
    if (!data.text || data.text.trim() === '') {
      throw new Error('Transcript text cannot be empty');
    }

    // Validate confidence
    if (data.confidence < 0 || data.confidence > 1) {
      throw new Error('Confidence must be between 0 and 1');
    }

    this.id = data.id;
    this.callId = data.callId;
    this.text = data.text;
    this.speaker = data.speaker;
    this.timestamp = data.timestamp;
    this.confidence = data.confidence;
    this.isFinal = data.isFinal;
  }
}
