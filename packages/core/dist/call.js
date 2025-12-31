export class Call {
    id;
    startTime;
    _endTime;
    _status;
    _transcripts;
    constructor(props) {
        this.id = props.id;
        this.startTime = props.startTime;
        this._endTime = props.endTime;
        this._status = props.status || 'active';
        this._transcripts = [];
    }
    static create(props) {
        return new Call(props);
    }
    get status() {
        return this._status;
    }
    get endTime() {
        return this._endTime;
    }
    get transcripts() {
        return this._transcripts;
    }
    addTranscript(transcript) {
        if (this._status === 'completed') {
            throw new Error('Cannot add transcript to completed call');
        }
        if (transcript.callId !== this.id) {
            throw new Error('Transcript callId does not match call id');
        }
        if (transcript.timestamp < this.startTime) {
            throw new Error('Transcript timestamp cannot be before call start time');
        }
        this._transcripts.push(transcript);
    }
    complete(endTime) {
        if (this._status === 'completed') {
            throw new Error('Call is already completed');
        }
        if (endTime < this.startTime) {
            throw new Error('End time cannot be before start time');
        }
        this._endTime = endTime;
        this._status = 'completed';
    }
    markError(message) {
        this._status = 'error';
        // Error message stored for logging/debugging
        console.error(`Call ${this.id} error: ${message}`);
    }
    getTranscriptsSorted() {
        return [...this._transcripts].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }
    getTranscriptsBySpeaker(speaker) {
        return this._transcripts.filter(t => t.speaker === speaker);
    }
    getDurationSeconds() {
        if (!this._endTime) {
            return undefined;
        }
        return (this._endTime.getTime() - this.startTime.getTime()) / 1000;
    }
    getTranscriptCount() {
        return this._transcripts.length;
    }
}
//# sourceMappingURL=call.js.map