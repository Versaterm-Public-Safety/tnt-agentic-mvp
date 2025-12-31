import { Transcript } from './transcript';
/**
 * Call status
 */
export type CallStatus = 'active' | 'completed';
/**
 * Call represents an active or completed 9-1-1 call with its transcripts
 */
export declare class Call {
    readonly id: string;
    readonly startTime: Date;
    readonly transcripts: Transcript[];
    private _status;
    private _endTime?;
    constructor(data: {
        id: string;
        startTime: Date;
        status?: CallStatus;
        endTime?: Date;
        transcripts?: Transcript[];
    });
    get status(): CallStatus;
    get endTime(): Date | undefined;
    /**
     * End the call
     */
    end(endTime: Date): void;
    /**
     * Add a transcript to the call
     */
    addTranscript(transcript: Transcript): void;
    /**
     * Get transcript by ID
     */
    getTranscriptById(id: string): Transcript | undefined;
    /**
     * Get call duration in seconds
     */
    getDuration(): number | undefined;
}
//# sourceMappingURL=call.d.ts.map