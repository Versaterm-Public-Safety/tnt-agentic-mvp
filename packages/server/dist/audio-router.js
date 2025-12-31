export class AudioRouter {
    transcriptionService;
    wsServer;
    processingCalls = new Set();
    constructor(transcriptionService, wsServer) {
        this.transcriptionService = transcriptionService;
        this.wsServer = wsServer;
    }
    async processAudioChunk(chunk) {
        const { callId, audio, speaker, timestamp } = chunk;
        if (!this.processingCalls.has(callId)) {
            console.log(`Starting transcription for call ${callId}`);
            this.processingCalls.add(callId);
        }
        try {
            const audioBuffer = {
                data: audio.buffer.slice(audio.byteOffset, audio.byteOffset + audio.byteLength),
                sampleRate: 16000,
                channels: 1,
                duration: audio.length / (16000 * 2),
            };
            const result = await this.transcriptionService.transcribe(audioBuffer);
            if (result.text.trim().length > 0) {
                const update = {
                    type: 'transcript',
                    callId,
                    transcript: {
                        id: this.generateTranscriptId(callId, timestamp),
                        text: result.text,
                        speaker,
                        confidence: result.confidence ?? 0.9,
                        timestamp: timestamp.toISOString(),
                        isFinal: true,
                    },
                };
                this.wsServer.broadcast(update);
                console.log(`Transcription sent for call ${callId}: "${result.text}"`);
            }
        }
        catch (error) {
            console.error(`Transcription error for call ${callId}:`, error);
            this.wsServer.broadcast({
                type: 'error',
                code: 'TRANSCRIPTION_ERROR',
                message: error instanceof Error ? error.message : 'Unknown transcription error',
                timestamp: new Date().toISOString(),
            });
        }
    }
    endCall(callId) {
        if (this.processingCalls.has(callId)) {
            console.log(`Ending transcription for call ${callId}`);
            this.processingCalls.delete(callId);
            this.wsServer.broadcast({
                type: 'status',
                status: 'disconnected',
                callId,
            });
        }
    }
    generateTranscriptId(callId, timestamp) {
        return `${callId}-${timestamp.getTime()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    getActiveCallCount() {
        return this.processingCalls.size;
    }
}
//# sourceMappingURL=audio-router.js.map