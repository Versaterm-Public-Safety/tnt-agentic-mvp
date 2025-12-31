import { EventEmitter } from 'events';
export class RTPHandler extends EventEmitter {
    buffer = [];
    handlePacket(packet) {
        const audioFrame = this.extractAudioFrame(packet);
        if (audioFrame) {
            this.emit('audio', audioFrame);
        }
    }
    extractAudioFrame(packet) {
        if (packet.length < 12) {
            return null;
        }
        // Parse RTP header (RFC 3550)
        const version = (packet[0] >> 6) & 0x03;
        if (version !== 2) {
            return null;
        }
        const hasExtension = (packet[0] & 0x10) !== 0;
        const csrcCount = packet[0] & 0x0F;
        const ssrc = packet.readUInt32BE(8);
        let headerLength = 12 + (csrcCount * 4);
        if (hasExtension && packet.length > headerLength + 4) {
            const extLength = packet.readUInt16BE(headerLength + 2) * 4;
            headerLength += 4 + extLength;
        }
        if (packet.length <= headerLength) {
            return null;
        }
        const audioData = packet.subarray(headerLength);
        return {
            data: audioData,
            timestamp: Date.now(),
            ssrc
        };
    }
    getBufferedAudio() {
        const combined = Buffer.concat(this.buffer);
        this.buffer = [];
        return combined;
    }
}
//# sourceMappingURL=rtp-handler.js.map