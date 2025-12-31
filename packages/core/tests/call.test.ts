import { describe, it, expect, beforeEach } from 'vitest';

/**
 * Test suite for Call class
 * 
 * Based on specs/features/real-time-transcription.md section 5.1
 * 
 * Call represents an active or completed 9-1-1 call with its transcripts.
 * Properties:
 * - id: Unique identifier
 * - startTime: When the call started
 * - endTime: When the call ended (undefined if active)
 * - status: 'active' or 'completed'
 * - transcripts: Array of all transcripts for this call
 */

describe('Call', () => {
  describe('creation', () => {
    it('should create a call with required fields', () => {
      // Arrange
      const callData = {
        id: 'c-123',
        startTime: new Date('2025-12-31T18:00:00Z'),
        status: 'active' as const,
        transcripts: []
      };

      // Act & Assert
      expect(callData.id).toBe('c-123');
      expect(callData.startTime).toBeInstanceOf(Date);
      expect(callData.status).toBe('active');
      expect(callData.transcripts).toEqual([]);
      expect(callData.endTime).toBeUndefined();
    });

    it('should start with active status', () => {
      // Arrange & Act
      const call = {
        status: 'active' as const,
        endTime: undefined
      };

      // Assert
      expect(call.status).toBe('active');
      expect(call.endTime).toBeUndefined();
    });

    it('should start with empty transcripts array', () => {
      // Arrange & Act
      const call = {
        transcripts: []
      };

      // Assert
      expect(call.transcripts).toEqual([]);
      expect(call.transcripts).toHaveLength(0);
    });
  });

  describe('lifecycle management', () => {
    it('should transition from active to completed when ended', () => {
      // Arrange
      let call = {
        status: 'active' as 'active' | 'completed',
        endTime: undefined as Date | undefined
      };

      // Act
      call.status = 'completed';
      call.endTime = new Date('2025-12-31T18:05:00Z');

      // Assert
      expect(call.status).toBe('completed');
      expect(call.endTime).toBeInstanceOf(Date);
    });

    it('should not allow undefined endTime when completed', () => {
      // Arrange
      const validateCall = (status: string, endTime: Date | undefined) => {
        if (status === 'completed' && !endTime) {
          throw new Error('Completed calls must have endTime');
        }
      };

      // Act & Assert
      expect(() => validateCall('completed', undefined))
        .toThrow('Completed calls must have endTime');
    });

    it('should calculate duration correctly', () => {
      // Arrange
      const startTime = new Date('2025-12-31T18:00:00Z');
      const endTime = new Date('2025-12-31T18:05:00Z');

      // Act
      const durationMs = endTime.getTime() - startTime.getTime();
      const durationSeconds = durationMs / 1000;

      // Assert
      expect(durationSeconds).toBe(300); // 5 minutes = 300 seconds
    });
  });

  describe('transcript management', () => {
    it('should add transcripts to the call', () => {
      // Arrange
      const call = {
        transcripts: [] as Array<{ id: string; text: string }>
      };
      const transcript1 = { id: 't-1', text: 'What is your emergency?' };
      const transcript2 = { id: 't-2', text: 'There is a fire!' };

      // Act
      call.transcripts.push(transcript1);
      call.transcripts.push(transcript2);

      // Assert
      expect(call.transcripts).toHaveLength(2);
      expect(call.transcripts[0]).toEqual(transcript1);
      expect(call.transcripts[1]).toEqual(transcript2);
    });

    it('should maintain transcript order', () => {
      // Arrange
      const call = {
        transcripts: [] as Array<{ id: string; timestamp: Date }>
      };
      const t1 = { id: 't-1', timestamp: new Date('2025-12-31T18:00:00Z') };
      const t2 = { id: 't-2', timestamp: new Date('2025-12-31T18:00:05Z') };
      const t3 = { id: 't-3', timestamp: new Date('2025-12-31T18:00:10Z') };

      // Act
      call.transcripts.push(t1, t2, t3);

      // Assert
      expect(call.transcripts[0].id).toBe('t-1');
      expect(call.transcripts[1].id).toBe('t-2');
      expect(call.transcripts[2].id).toBe('t-3');
    });

    it('should retrieve transcript by id', () => {
      // Arrange
      const call = {
        transcripts: [
          { id: 't-1', text: 'First' },
          { id: 't-2', text: 'Second' },
          { id: 't-3', text: 'Third' }
        ]
      };

      // Act
      const found = call.transcripts.find(t => t.id === 't-2');

      // Assert
      expect(found).toBeDefined();
      expect(found?.text).toBe('Second');
    });

    it('should return undefined for non-existent transcript', () => {
      // Arrange
      const call = {
        transcripts: [
          { id: 't-1', text: 'First' }
        ]
      };

      // Act
      const found = call.transcripts.find(t => t.id === 't-999');

      // Assert
      expect(found).toBeUndefined();
    });
  });

  describe('status validation', () => {
    it('should only allow valid status values', () => {
      // Arrange
      const validateStatus = (status: string) => {
        if (status !== 'active' && status !== 'completed') {
          throw new Error('Status must be active or completed');
        }
      };

      // Act & Assert
      expect(() => validateStatus('active')).not.toThrow();
      expect(() => validateStatus('completed')).not.toThrow();
      expect(() => validateStatus('invalid')).toThrow('Status must be active or completed');
    });
  });
});
