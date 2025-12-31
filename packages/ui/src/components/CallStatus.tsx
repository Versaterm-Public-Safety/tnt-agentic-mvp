import React from 'react';

export interface CallStatusProps {
  status: 'connected' | 'disconnected' | 'reconnecting';
  callId?: string;
  error?: string | null;
  reconnectAttempts?: number;
}

export const CallStatus: React.FC<CallStatusProps> = ({
  status,
  callId,
  error,
  reconnectAttempts = 0,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'green';
      case 'disconnected':
        return 'red';
      case 'reconnecting':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return callId ? `Connected - Call ${callId}` : 'Connected';
      case 'disconnected':
        return 'Disconnected';
      case 'reconnecting':
        return `Reconnecting... (Attempt ${reconnectAttempts})`;
      default:
        return 'Unknown';
    }
  };

  return (
    <div
      style={{
        padding: '12px 16px',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(),
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: '14px' }}>
          {getStatusText()}
        </div>
        {error && (
          <div style={{ fontSize: '12px', color: '#d32f2f', marginTop: '4px' }}>
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
};
