import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TranscriptPanel } from '../src/components/TranscriptPanel';
import { TranscriptEntry } from '../src/components/TranscriptEntry';

describe('TranscriptPanel', () => {
  it('renders without transcripts (empty state)', () => {
    // Arrange & Act
    render(<TranscriptPanel transcripts={[]} />);

    // Assert
    expect(screen.getByText(/no transcripts/i)).toBeInTheDocument();
  });

  it('renders single transcript', () => {
    // Arrange
    const transcripts = [
      {
        id: 't1',
        text: 'Emergency at 123 Main Street',
        speaker: 'caller' as const,
        confidence: 0.95,
        timestamp: new Date('2025-01-01T12:00:00Z'),
        isFinal: true,
      },
    ];

    // Act
    render(<TranscriptPanel transcripts={transcripts} />);

    // Assert
    expect(screen.getByText('Emergency at 123 Main Street')).toBeInTheDocument();
  });

  it('renders multiple transcripts in order', () => {
    // Arrange
    const transcripts = [
      {
        id: 't1',
        text: 'First message',
        speaker: 'caller' as const,
        confidence: 0.95,
        timestamp: new Date('2025-01-01T12:00:00Z'),
        isFinal: true,
      },
      {
        id: 't2',
        text: 'Second message',
        speaker: 'agent' as const,
        confidence: 0.98,
        timestamp: new Date('2025-01-01T12:00:01Z'),
        isFinal: true,
      },
    ];

    // Act
    render(<TranscriptPanel transcripts={transcripts} />);

    // Assert
    expect(screen.getByText('First message')).toBeInTheDocument();
    expect(screen.getByText('Second message')).toBeInTheDocument();
  });

  it('distinguishes caller vs agent speakers visually', () => {
    // Arrange
    const transcripts = [
      {
        id: 't1',
        text: 'Caller speaks',
        speaker: 'caller' as const,
        confidence: 0.95,
        timestamp: new Date('2025-01-01T12:00:00Z'),
        isFinal: true,
      },
      {
        id: 't2',
        text: 'Agent responds',
        speaker: 'agent' as const,
        confidence: 0.98,
        timestamp: new Date('2025-01-01T12:00:01Z'),
        isFinal: true,
      },
    ];

    // Act
    const { container } = render(<TranscriptPanel transcripts={transcripts} />);

    // Assert
    const callerElements = container.querySelectorAll('[data-speaker="caller"]');
    const agentElements = container.querySelectorAll('[data-speaker="agent"]');
    expect(callerElements.length).toBe(1);
    expect(agentElements.length).toBe(1);
  });
});

describe('TranscriptEntry', () => {
  it('renders transcript text', () => {
    // Arrange
    const transcript = {
      id: 't1',
      text: 'Test transcript text',
      speaker: 'caller' as const,
      confidence: 0.95,
      timestamp: new Date('2025-01-01T12:00:00Z'),
      isFinal: true,
    };

    // Act
    render(<TranscriptEntry transcript={transcript} />);

    // Assert
    expect(screen.getByText('Test transcript text')).toBeInTheDocument();
  });

  it('displays speaker label', () => {
    // Arrange
    const transcript = {
      id: 't1',
      text: 'Test',
      speaker: 'caller' as const,
      confidence: 0.95,
      timestamp: new Date('2025-01-01T12:00:00Z'),
      isFinal: true,
    };

    // Act
    render(<TranscriptEntry transcript={transcript} />);

    // Assert
    expect(screen.getByText(/caller/i)).toBeInTheDocument();
  });

  it('shows low confidence indicator when confidence < 0.8', () => {
    // Arrange
    const transcript = {
      id: 't1',
      text: 'Uncertain text',
      speaker: 'caller' as const,
      confidence: 0.75,
      timestamp: new Date('2025-01-01T12:00:00Z'),
      isFinal: true,
    };

    // Act
    const { container } = render(<TranscriptEntry transcript={transcript} />);

    // Assert
    const lowConfidenceIndicator = container.querySelector('[data-low-confidence="true"]');
    expect(lowConfidenceIndicator).toBeInTheDocument();
  });

  it('does not show low confidence indicator when confidence >= 0.8', () => {
    // Arrange
    const transcript = {
      id: 't1',
      text: 'Confident text',
      speaker: 'caller' as const,
      confidence: 0.85,
      timestamp: new Date('2025-01-01T12:00:00Z'),
      isFinal: true,
    };

    // Act
    const { container } = render(<TranscriptEntry transcript={transcript} />);

    // Assert
    const lowConfidenceIndicator = container.querySelector('[data-low-confidence="true"]');
    expect(lowConfidenceIndicator).not.toBeInTheDocument();
  });

  it('styles interim transcripts differently', () => {
    // Arrange
    const transcript = {
      id: 't1',
      text: 'Interim text...',
      speaker: 'caller' as const,
      confidence: 0.90,
      timestamp: new Date('2025-01-01T12:00:00Z'),
      isFinal: false,
    };

    // Act
    const { container } = render(<TranscriptEntry transcript={transcript} />);

    // Assert
    const interimElement = container.querySelector('[data-interim="true"]');
    expect(interimElement).toBeInTheDocument();
  });

  it('formats timestamp correctly', () => {
    // Arrange
    const transcript = {
      id: 't1',
      text: 'Test',
      speaker: 'caller' as const,
      confidence: 0.95,
      timestamp: new Date('2025-01-01T12:34:56Z'),
      isFinal: true,
    };

    // Act
    render(<TranscriptEntry transcript={transcript} />);

    // Assert
    // Should display time in HH:MM:SS format
    expect(screen.getByText(/12:34:56/)).toBeInTheDocument();
  });
});
