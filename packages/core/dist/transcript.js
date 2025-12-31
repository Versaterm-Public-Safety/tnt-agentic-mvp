import { isValidSpeaker } from './speaker';
export class Transcript {
    id;
    callId;
    text;
    speaker;
    confidence;
    timestamp;
    isFinal;
    constructor(props) {
        this.id = props.id;
        this.callId = props.callId;
        this.text = props.text;
        this.speaker = props.speaker;
        this.confidence = props.confidence;
        this.timestamp = props.timestamp;
        this.isFinal = props.isFinal;
        Object.freeze(this);
    }
    static create(props) {
        // Validate text
        if (!props.text || props.text.trim().length === 0) {
            throw new Error('Text cannot be empty');
        }
        // Validate confidence
        if (props.confidence < 0 || props.confidence > 1) {
            throw new Error('Confidence must be between 0 and 1');
        }
        // Validate speaker
        if (!isValidSpeaker(props.speaker)) {
            throw new Error('Speaker must be caller or agent');
        }
        return new Transcript(props);
    }
}
//# sourceMappingURL=transcript.js.map