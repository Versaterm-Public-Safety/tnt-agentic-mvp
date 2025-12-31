import { Speaker } from './speaker';
/**
 * Transcript represents a single piece of transcribed text from a call
 */
export declare class Transcript {
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
    });
}
//# sourceMappingURL=transcript.d.ts.map