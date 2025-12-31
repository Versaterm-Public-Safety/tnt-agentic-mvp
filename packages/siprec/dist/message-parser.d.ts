import type { SIPRecMetadata } from './types';
export declare class SIPRecMessageParser {
    parseInvite(sipMessage: string): {
        sdp: string;
        metadata: SIPRecMetadata;
    } | null;
    private extractParticipants;
}
//# sourceMappingURL=message-parser.d.ts.map