import React from 'react';
import { CallStatus } from './components/CallStatus';
import { TranscriptPanel } from './components/TranscriptPanel';
import { useWebSocket } from './hooks/useWebSocket';
import { Transcript } from './components/TranscriptEntry';

export interface AppProps {
  websocketUrl?: string;
}

export const App: React.FC<AppProps> = ({
  websocketUrl = 'ws://localhost:8080',
}) => {
  const {
    transcripts,
    connectionStatus,
    error,
    reconnectAttempts,
  } = useWebSocket({ url: websocketUrl });

  // Convert TranscriptMessage (string timestamp) to Transcript (Date timestamp)
  const convertedTranscripts: Transcript[] = transcripts.map((msg) => ({
    id: msg.id,
    text: msg.text,
    speaker: msg.speaker,
    confidence: msg.confidence,
    timestamp: new Date(msg.timestamp),
    isFinal: msg.isFinal,
  }));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <header
        style={{
          padding: '16px 24px',
          backgroundColor: '#1976d2',
          color: 'white',
          fontSize: '20px',
          fontWeight: 600,
        }}
      >
        TnT - Real-Time Transcription
      </header>

      <CallStatus
        status={connectionStatus}
        error={error}
        reconnectAttempts={reconnectAttempts}
      />

      <TranscriptPanel transcripts={convertedTranscripts} />
    </div>
  );
};
