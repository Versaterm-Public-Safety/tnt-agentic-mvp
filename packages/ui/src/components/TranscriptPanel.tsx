import { TranscriptEntry, type Transcript } from './TranscriptEntry';

export interface TranscriptPanelProps {
  transcripts: Transcript[];
}

export function TranscriptPanel({ transcripts }: TranscriptPanelProps) {
  if (transcripts.length === 0) {
    return (
      <div className="transcript-panel empty">
        <p>No transcripts available</p>
      </div>
    );
  }

  return (
    <div className="transcript-panel">
      {transcripts.map((transcript) => (
        <TranscriptEntry key={transcript.id} transcript={transcript} />
      ))}
    </div>
  );
}
