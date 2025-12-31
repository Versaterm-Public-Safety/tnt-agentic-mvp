import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TranscriptPanel } from '../src/components/TranscriptPanel';
import { TranscriptEntry } from '../src/components/TranscriptEntry';
import { CallStatus } from '../src/components/CallStatus';

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

describe('CallStatus', () => {
  it('displays connected status', () => {
    // Arrange & Act
    render(<CallStatus status="connected" />);

    // Assert
    expect(screen.getByText(/connected/i)).toBeInTheDocument();
  });

  it('displays disconnected status', () => {
    // Arrange & Act
    render(<CallStatus status="disconnected" />);

    // Assert
    expect(screen.getByText(/disconnected/i)).toBeInTheDocument();
  });

  it('displays reconnecting status with attempt count', () => {
    // Arrange & Act
    render(<CallStatus status="reconnecting" reconnectAttempts={3} />);

    // Assert
    expect(screen.getByText(/reconnecting/i)).toBeInTheDocument();
    expect(screen.getByText(/attempt 3/i)).toBeInTheDocument();
  });

  it('displays call ID when provided', () => {
    // Arrange & Act
    render(<CallStatus status="connected" callId="call-123" />);

    // Assert
    expect(screen.getByText(/call-123/i)).toBeInTheDocument();
  });

  it('displays error message when provided', () => {
    // Arrange & Act
    render(<CallStatus status="disconnected" error="Connection timeout" />);

    // Assert
    expect(screen.getByText(/connection timeout/i)).toBeInTheDocument();
  });

  it('shows green indicator for connected status', () => {
    // Arrange & Act
    const { container } = render(<CallStatus status="connected" />);

    // Assert
    const indicators = container.querySelectorAll('div');
    const greenIndicator = Array.from(indicators).find(
      (div) => div.style.backgroundColor === 'green'
    );
    expect(greenIndicator).toBeTruthy();
  });

  it('shows red indicator for disconnected status', () => {
    // Arrange & Act
    const { container } = render(<CallStatus status="disconnected" />);

    // Assert
    const indicators = container.querySelectorAll('div');
    const redIndicator = Array.from(indicators).find(
      (div) => div.style.backgroundColor === 'red'
    );
    expect(redIndicator).toBeTruthy();
  });

  it('shows orange indicator for reconnecting status', () => {
    // Arrange & Act
    const { container } = render(<CallStatus status="reconnecting" />);

    // Assert
    const indicators = container.querySelectorAll('div');
    const orangeIndicator = Array.from(indicators).find(
      (div) => div.style.backgroundColor === 'orange'
    );
    expect(orangeIndicator).toBeTruthy();
  });
});

