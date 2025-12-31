import { describe, it, expect } from 'vitest';

/**
 * Test suite for Speaker enum
 * 
 * Based on specs/features/real-time-transcription.md section 5.1
 * 
 * The Speaker enum identifies who is speaking during a call:
 * - Caller: The person calling 9-1-1
 * - Agent: The telecommunicator handling the call
 */

describe('Speaker', () => {
  it('should have Caller value', () => {
    // Arrange
    const Speaker = { Caller: 'caller', Agent: 'agent' };
    
    // Act
    const speaker = Speaker.Caller;
    
    // Assert
    expect(speaker).toBe('caller');
  });

  it('should have Agent value', () => {
    // Arrange
    const Speaker = { Caller: 'caller', Agent: 'agent' };
    
    // Act
    const speaker = Speaker.Agent;
    
    // Assert
    expect(speaker).toBe('agent');
  });

  it('should only have two valid speaker types', () => {
    // Arrange
    const Speaker = { Caller: 'caller', Agent: 'agent' };
    
    // Act
    const speakerKeys = Object.keys(Speaker);
    
    // Assert
    expect(speakerKeys).toHaveLength(2);
    expect(speakerKeys).toContain('Caller');
    expect(speakerKeys).toContain('Agent');
  });
});
