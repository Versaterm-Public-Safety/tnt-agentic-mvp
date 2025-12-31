import { describe, it, expect, beforeEach } from 'vitest';
import { Call } from '../src/call';
import { Transcript } from '../src/transcript';

describe('Call', () => {
  describe('creation', () => {
    it('creates call with valid data', () => {
      // Arrange
      const props = {
        id: 'call-001',
        startTime: new Date('2025-01-01T12:00:00Z'),
      };

      // Act
      const call = Call.create(props);

      // Assert
      expect(call.id).toBe('call-001');
      expect(call.startTime).toEqual(new Date('2025-01-01T12:00:00Z'));
      expect(call.status).toBe('active');
      expect(call.endTime).toBeUndefined();
      expect(call.transcripts).toEqual([]);
    });

    it('creates call with active status by default', () => {
      // Arrange & Act
      const call = Call.create({
        id: 'call-002',
        startTime: new Date('2025-01-01T12:00:00Z'),
      });

      // Assert
      expect(call.status).toBe('active');
    });
  });

  describe('transcript management', () => {
    let call: ReturnType<typeof Call.create>;

    beforeEach(() => {
      call = Call.create({
        id: 'call-003',
        startTime: new Date('2025-01-01T12:00:00Z'),
      });
    });

    it('adds transcript to call', () => {
      // Arrange
      const transcript = Transcript.create({
        id: 'transcript-001',
        callId: 'call-003',
        text: 'Emergency text',
        speaker: 'caller',
        confidence: 0.95,
        timestamp: new Date('2025-01-01T12:00:01Z'),
        isFinal: true,
      });

      // Act
      call.addTranscript(transcript);

      // Assert
      expect(call.transcripts).toHaveLength(1);
      expect(call.transcripts[0]).toBe(transcript);
    });

    it('adds multiple transcripts in order', () => {
      // Arrange
      const transcript1 = Transcript.create({
        id: 'transcript-001',
        callId: 'call-003',
        text: 'First',
        speaker: 'caller',
        confidence: 0.95,
        timestamp: new Date('2025-01-01T12:00:01Z'),
        isFinal: true,
      });
      const transcript2 = Transcript.create({
        id: 'transcript-002',
        callId: 'call-003',
        text: 'Second',
        speaker: 'agent',
        confidence: 0.98,
        timestamp: new Date('2025-01-01T12:00:02Z'),
        isFinal: true,
      });

      // Act
      call.addTranscript(transcript1);
      call.addTranscript(transcript2);

      // Assert
      expect(call.transcripts).toHaveLength(2);
      expect(call.transcripts[0].text).toBe('First');
      expect(call.transcripts[1].text).toBe('Second');
    });

    it('maintains transcript ordering by timestamp', () => {
      // Arrange
      const transcript1 = Transcript.create({
        id: 'transcript-001',
        callId: 'call-003',
        text: 'First',
        speaker: 'caller',
        confidence: 0.95,
        timestamp: new Date('2025-01-01T12:00:01Z'),
        isFinal: true,
      });
      const transcript2 = Transcript.create({
        id: 'transcript-002',
        callId: 'call-003',
        text: 'Second',
        speaker: 'agent',
        confidence: 0.98,
        timestamp: new Date('2025-01-01T12:00:02Z'),
        isFinal: true,
      });

      // Act - Add in reverse order
      call.addTranscript(transcript2);
      call.addTranscript(transcript1);

      // Assert - Should be sorted by timestamp
      const sorted = call.getTranscriptsSorted();
      expect(sorted[0].text).toBe('First');
      expect(sorted[1].text).toBe('Second');
    });
  });

  describe('lifecycle management', () => {
    it('completes active call', () => {
      // Arrange
      const call = Call.create({
        id: 'call-004',
        startTime: new Date('2025-01-01T12:00:00Z'),
      });
      const endTime = new Date('2025-01-01T12:05:00Z');

      // Act
      call.complete(endTime);

      // Assert
      expect(call.status).toBe('completed');
      expect(call.endTime).toEqual(endTime);
    });

    it('throws when completing already completed call', () => {
      // Arrange
      const call = Call.create({
        id: 'call-005',
        startTime: new Date('2025-01-01T12:00:00Z'),
      });
      call.complete(new Date('2025-01-01T12:05:00Z'));

      // Act & Assert
      expect(() => {
        call.complete(new Date('2025-01-01T12:06:00Z'));
      }).toThrow('Call is already completed');
    });

    it('throws when adding transcript to completed call', () => {
      // Arrange
      const call = Call.create({
        id: 'call-006',
        startTime: new Date('2025-01-01T12:00:00Z'),
      });
      call.complete(new Date('2025-01-01T12:05:00Z'));

      const transcript = Transcript.create({
        id: 'transcript-003',
        callId: 'call-006',
        text: 'Late transcript',
        speaker: 'caller',
        confidence: 0.95,
        timestamp: new Date('2025-01-01T12:06:00Z'),
        isFinal: true,
      });

      // Act & Assert
      expect(() => {
        call.addTranscript(transcript);
      }).toThrow('Cannot add transcript to completed call');
    });

    it('marks call as error status', () => {
      // Arrange
      const call = Call.create({
        id: 'call-007',
        startTime: new Date('2025-01-01T12:00:00Z'),
      });

      // Act
      call.markError('Connection lost');

      // Assert
      expect(call.status).toBe('error');
    });
  });

  describe('validation', () => {
    it('throws when end time is before start time', () => {
      // Arrange
      const call = Call.create({
        id: 'call-008',
        startTime: new Date('2025-01-01T12:00:00Z'),
      });
      const invalidEndTime = new Date('2025-01-01T11:59:00Z'); // Before start

      // Act & Assert
      expect(() => {
        call.complete(invalidEndTime);
      }).toThrow('End time cannot be before start time');
    });

    it('throws when adding transcript with mismatched callId', () => {
      // Arrange
      const call = Call.create({
        id: 'call-009',
        startTime: new Date('2025-01-01T12:00:00Z'),
      });

      const transcript = Transcript.create({
        id: 'transcript-004',
        callId: 'different-call-id', // Mismatch
        text: 'Wrong call',
        speaker: 'caller',
        confidence: 0.95,
        timestamp: new Date('2025-01-01T12:00:01Z'),
        isFinal: true,
      });

      // Act & Assert
      expect(() => {
        call.addTranscript(transcript);
      }).toThrow('Transcript callId does not match call id');
    });

    it('throws when adding transcript with timestamp before call start', () => {
      // Arrange
      const call = Call.create({
        id: 'call-010',
        startTime: new Date('2025-01-01T12:00:00Z'),
      });

      const transcript = Transcript.create({
        id: 'transcript-005',
        callId: 'call-010',
        text: 'Too early',
        speaker: 'caller',
        confidence: 0.95,
        timestamp: new Date('2025-01-01T11:59:00Z'), // Before call start
        isFinal: true,
      });

      // Act & Assert
      expect(() => {
        call.addTranscript(transcript);
      }).toThrow('Transcript timestamp cannot be before call start time');
    });
  });

  describe('queries', () => {
    let call: ReturnType<typeof Call.create>;

    beforeEach(() => {
      call = Call.create({
        id: 'call-011',
        startTime: new Date('2025-01-01T12:00:00Z'),
      });

      // Add multiple transcripts
      call.addTranscript(Transcript.create({
        id: 't1',
        callId: 'call-011',
        text: 'Caller speaks',
        speaker: 'caller',
        confidence: 0.95,
        timestamp: new Date('2025-01-01T12:00:01Z'),
        isFinal: true,
      }));

      call.addTranscript(Transcript.create({
        id: 't2',
        callId: 'call-011',
        text: 'Agent responds',
        speaker: 'agent',
        confidence: 0.98,
        timestamp: new Date('2025-01-01T12:00:02Z'),
        isFinal: true,
      }));

      call.addTranscript(Transcript.create({
        id: 't3',
        callId: 'call-011',
        text: 'Caller continues',
        speaker: 'caller',
        confidence: 0.90,
        timestamp: new Date('2025-01-01T12:00:03Z'),
        isFinal: true,
      }));
    });

    it('gets all transcripts for a speaker', () => {
      // Act
      const callerTranscripts = call.getTranscriptsBySpeaker('caller');

      // Assert
      expect(callerTranscripts).toHaveLength(2);
      expect(callerTranscripts.every(t => t.speaker === 'caller')).toBe(true);
    });

    it('calculates call duration', () => {
      // Arrange
      call.complete(new Date('2025-01-01T12:05:00Z'));

      // Act
      const duration = call.getDurationSeconds();

      // Assert
      expect(duration).toBe(300); // 5 minutes = 300 seconds
    });

    it('returns undefined duration for active call', () => {
      // Act
      const duration = call.getDurationSeconds();

      // Assert
      expect(duration).toBeUndefined();
    });

    it('counts total transcripts', () => {
      // Act
      const count = call.getTranscriptCount();

      // Assert
      expect(count).toBe(3);
    });
  });
});
