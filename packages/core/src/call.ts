import { Transcript } from './transcript';
import { Speaker } from './speaker';

export type CallStatus = 'active' | 'completed' | 'error';

export interface CallProps {
  id: string;
  startTime: Date;
  endTime?: Date;
  status?: CallStatus;
}

export class Call {
  readonly id: string;
  readonly startTime: Date;
  private _endTime?: Date;
  private _status: CallStatus;
  private _transcripts: Transcript[];

  private constructor(props: CallProps) {
    this.id = props.id;
    this.startTime = props.startTime;
    this._endTime = props.endTime;
    this._status = props.status || 'active';
    this._transcripts = [];
  }

  static create(props: CallProps): Call {
    return new Call(props);
  }

  get status(): CallStatus {
    return this._status;
  }

  get endTime(): Date | undefined {
    return this._endTime;
  }

  get transcripts(): ReadonlyArray<Transcript> {
    return this._transcripts;
  }

  addTranscript(transcript: Transcript): void {
    if (this._status === 'completed') {
      throw new Error('Cannot add transcript to completed call');
    }

    if (transcript.callId !== this.id) {
      throw new Error('Transcript callId does not match call id');
    }

    if (transcript.timestamp < this.startTime) {
      throw new Error('Transcript timestamp cannot be before call start time');
    }

    this._transcripts.push(transcript);
  }

  complete(endTime: Date): void {
    if (this._status === 'completed') {
      throw new Error('Call is already completed');
    }

    if (endTime < this.startTime) {
      throw new Error('End time cannot be before start time');
    }

    this._endTime = endTime;
    this._status = 'completed';
  }

  markError(message: string): void {
    this._status = 'error';
    // Error message stored for logging/debugging
    console.error(`Call ${this.id} error: ${message}`);
  }

  getTranscriptsSorted(): Transcript[] {
    return [...this._transcripts].sort((a, b) => 
      a.timestamp.getTime() - b.timestamp.getTime()
    );
  }

  getTranscriptsBySpeaker(speaker: Speaker): Transcript[] {
    return this._transcripts.filter(t => t.speaker === speaker);
  }

  getDurationSeconds(): number | undefined {
    if (!this._endTime) {
      return undefined;
    }
    return (this._endTime.getTime() - this.startTime.getTime()) / 1000;
  }

  getTranscriptCount(): number {
    return this._transcripts.length;
  }
}
