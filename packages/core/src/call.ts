import { Transcript } from './transcript';

/**
 * Call status
 */
export type CallStatus = 'active' | 'completed';

/**
 * Call represents an active or completed 9-1-1 call with its transcripts
 */
export class Call {
  readonly id: string;
  readonly startTime: Date;
  readonly transcripts: Transcript[];
  
  private _status: CallStatus;
  private _endTime?: Date;

  constructor(data: {
    id: string;
    startTime: Date;
    status?: CallStatus;
    endTime?: Date;
    transcripts?: Transcript[];
  }) {
    this.id = data.id;
    this.startTime = data.startTime;
    this._status = data.status || 'active';
    this._endTime = data.endTime;
    this.transcripts = data.transcripts || [];

    // Validate completed calls must have endTime
    if (this._status === 'completed' && !this._endTime) {
      throw new Error('Completed calls must have endTime');
    }
  }

  get status(): CallStatus {
    return this._status;
  }

  get endTime(): Date | undefined {
    return this._endTime;
  }

  /**
   * End the call
   */
  end(endTime: Date): void {
    this._status = 'completed';
    this._endTime = endTime;
  }

  /**
   * Add a transcript to the call
   */
  addTranscript(transcript: Transcript): void {
    this.transcripts.push(transcript);
  }

  /**
   * Get transcript by ID
   */
  getTranscriptById(id: string): Transcript | undefined {
    return this.transcripts.find(t => t.id === id);
  }

  /**
   * Get call duration in seconds
   */
  getDuration(): number | undefined {
    if (!this._endTime) {
      return undefined;
    }
    return (this._endTime.getTime() - this.startTime.getTime()) / 1000;
  }
}
