import { Speaker } from './speaker';
export interface TranscriptProps {
    id: string;
    callId: string;
    text: string;
    speaker: Speaker;
    confidence: number;
    timestamp: Date;
    isFinal: boolean;
}
export declare class Transcript {
    readonly id: string;
    readonly callId: string;
    readonly text: string;
    readonly speaker: Speaker;
    readonly confidence: number;
    readonly timestamp: Date;
    readonly isFinal: boolean;
    private constructor();
    static create(props: TranscriptProps): Transcript;
}
//# sourceMappingURL=transcript.d.ts.map