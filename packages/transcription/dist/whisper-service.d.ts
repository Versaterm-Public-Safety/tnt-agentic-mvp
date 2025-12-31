import type { TranscriptionService, AudioBuffer, TranscriptionResult } from './transcription-service';
/**
 * Real Whisper.cpp implementation for audio transcription
 * Converts audio buffers to text using OpenAI's Whisper model
 */
export declare class WhisperTranscriptionService implements TranscriptionService {
    private modelPath;
    private tempDir;
    constructor(options?: {
        modelPath?: string;
        tempDir?: string;
    });
    transcribe(audio: AudioBuffer): Promise<TranscriptionResult>;
    private audioBufferToWav;
    private createWavHeader;
    private writeString;
    private estimateConfidence;
    private generateId;
    private cleanupTempFile;
}
//# sourceMappingURL=whisper-service.d.ts.map