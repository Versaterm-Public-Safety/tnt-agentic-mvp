export interface Transcript {
  id: string;
  text: string;
  speaker: 'caller' | 'agent';
  confidence: number;
  timestamp: Date;
  isFinal: boolean;
}

export interface TranscriptEntryProps {
  transcript: Transcript;
}

export function TranscriptEntry({ transcript }: TranscriptEntryProps) {
  const isLowConfidence = transcript.confidence < 0.8;
  
  const formatTime = (date: Date): string => {
    return date.toISOString().substring(11, 19); // HH:MM:SS
  };

  return (
    <div 
      className={`transcript-entry ${transcript.speaker}`}
      data-speaker={transcript.speaker}
      data-low-confidence={isLowConfidence || undefined}
      data-interim={!transcript.isFinal || undefined}
    >
      <div className="speaker-label">
        {transcript.speaker === 'caller' ? 'Caller' : 'Agent'}
      </div>
      <div className="timestamp">{formatTime(transcript.timestamp)}</div>
      <div className={`text ${isLowConfidence ? 'low-confidence' : ''}`}>
        {transcript.text}
      </div>
    </div>
  );
}
