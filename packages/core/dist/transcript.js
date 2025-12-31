/**
 * Transcript represents a single piece of transcribed text from a call
 */
export class Transcript {
    id;
    callId;
    text;
    speaker;
    timestamp;
    confidence;
    isFinal;
    constructor(data) {
        // Validate text
        if (!data.text || data.text.trim() === '') {
            throw new Error('Transcript text cannot be empty');
        }
        // Validate confidence
        if (data.confidence < 0 || data.confidence > 1) {
            throw new Error('Confidence must be between 0 and 1');
        }
        this.id = data.id;
        this.callId = data.callId;
        this.text = data.text;
        this.speaker = data.speaker;
        this.timestamp = data.timestamp;
        this.confidence = data.confidence;
        this.isFinal = data.isFinal;
    }
}
//# sourceMappingURL=transcript.js.map