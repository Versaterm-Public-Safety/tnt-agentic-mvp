import { EventEmitter } from 'events';
export declare class RTPHandler extends EventEmitter {
    private buffer;
    handlePacket(packet: Buffer): void;
    private extractAudioFrame;
    getBufferedAudio(): Buffer;
}
//# sourceMappingURL=rtp-handler.d.ts.map