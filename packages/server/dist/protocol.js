export function isTranscriptUpdate(msg) {
    const m = msg;
    return (m?.type === 'transcript' &&
        typeof m?.callId === 'string' &&
        typeof m?.transcript?.id === 'string' &&
        typeof m?.transcript?.text === 'string' &&
        (m?.transcript?.speaker === 'caller' || m?.transcript?.speaker === 'agent') &&
        typeof m?.transcript?.confidence === 'number' &&
        typeof m?.transcript?.timestamp === 'string' &&
        typeof m?.transcript?.isFinal === 'boolean');
}
export function isErrorMessage(msg) {
    const m = msg;
    return (m?.type === 'error' &&
        typeof m?.code === 'string' &&
        typeof m?.message === 'string' &&
        typeof m?.timestamp === 'string');
}
export function isConnectionStatus(msg) {
    const m = msg;
    return (m?.type === 'status' &&
        (m?.status === 'connected' || m?.status === 'disconnected' || m?.status === 'reconnecting'));
}
//# sourceMappingURL=protocol.js.map