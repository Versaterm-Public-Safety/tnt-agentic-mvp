/**
 * Call represents an active or completed 9-1-1 call with its transcripts
 */
export class Call {
    id;
    startTime;
    transcripts;
    _status;
    _endTime;
    constructor(data) {
        this.id = data.id;
        this.startTime = data.startTime;
        this._status = data.status || 'active';
        this._endTime = data.endTime;
        this.transcripts = data.transcripts || [];
        // Validate completed calls must have endTime
        if (this._status === 'completed' && !this._endTime) {
            throw new Error('Completed calls must have endTime');
        }
    }
    get status() {
        return this._status;
    }
    get endTime() {
        return this._endTime;
    }
    /**
     * End the call
     */
    end(endTime) {
        this._status = 'completed';
        this._endTime = endTime;
    }
    /**
     * Add a transcript to the call
     */
    addTranscript(transcript) {
        this.transcripts.push(transcript);
    }
    /**
     * Get transcript by ID
     */
    getTranscriptById(id) {
        return this.transcripts.find(t => t.id === id);
    }
    /**
     * Get call duration in seconds
     */
    getDuration() {
        if (!this._endTime) {
            return undefined;
        }
        return (this._endTime.getTime() - this.startTime.getTime()) / 1000;
    }
}
//# sourceMappingURL=call.js.map