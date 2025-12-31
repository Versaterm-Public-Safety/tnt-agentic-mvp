export interface TranscriptUpdate {
  type: 'transcript';
  callId: string;
  transcript: {
    id: string;
    text: string;
    speaker: 'caller' | 'agent';
    confidence: number;
    timestamp: string;
    isFinal: boolean;
  };
}

export interface ErrorMessage {
  type: 'error';
  code: string;
  message: string;
  timestamp: string;
}

export interface ConnectionStatus {
  type: 'status';
  status: 'connected' | 'disconnected' | 'reconnecting';
  callId?: string;
}

export type WebSocketMessage = TranscriptUpdate | ErrorMessage | ConnectionStatus;

export function isTranscriptUpdate(msg: unknown): msg is TranscriptUpdate {
  const m = msg as any;
  return (
    m?.type === 'transcript' &&
    typeof m?.callId === 'string' &&
    typeof m?.transcript?.id === 'string' &&
    typeof m?.transcript?.text === 'string' &&
    (m?.transcript?.speaker === 'caller' || m?.transcript?.speaker === 'agent') &&
    typeof m?.transcript?.confidence === 'number' &&
    typeof m?.transcript?.timestamp === 'string' &&
    typeof m?.transcript?.isFinal === 'boolean'
  );
}

export function isErrorMessage(msg: unknown): msg is ErrorMessage {
  const m = msg as any;
  return (
    m?.type === 'error' &&
    typeof m?.code === 'string' &&
    typeof m?.message === 'string' &&
    typeof m?.timestamp === 'string'
  );
}

export function isConnectionStatus(msg: unknown): msg is ConnectionStatus {
  const m = msg as any;
  return (
    m?.type === 'status' &&
    (m?.status === 'connected' || m?.status === 'disconnected' || m?.status === 'reconnecting')
  );
}
