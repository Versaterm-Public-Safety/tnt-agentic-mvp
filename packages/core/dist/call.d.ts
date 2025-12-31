import { Transcript } from './transcript';
import { Speaker } from './speaker';
export type CallStatus = 'active' | 'completed' | 'error';
export interface CallProps {
    id: string;
    startTime: Date;
    endTime?: Date;
    status?: CallStatus;
}
export declare class Call {
    readonly id: string;
    readonly startTime: Date;
    private _endTime?;
    private _status;
    private _transcripts;
    private constructor();
    static create(props: CallProps): Call;
    get status(): CallStatus;
    get endTime(): Date | undefined;
    get transcripts(): ReadonlyArray<Transcript>;
    addTranscript(transcript: Transcript): void;
    complete(endTime: Date): void;
    markError(message: string): void;
    getTranscriptsSorted(): Transcript[];
    getTranscriptsBySpeaker(speaker: Speaker): Transcript[];
    getDurationSeconds(): number | undefined;
    getTranscriptCount(): number;
}
//# sourceMappingURL=call.d.ts.map