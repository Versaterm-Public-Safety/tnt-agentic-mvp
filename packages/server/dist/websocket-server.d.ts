import { WebSocketMessage } from './protocol';
export interface WebSocketServerConfig {
    port: number;
    heartbeatInterval?: number;
}
export declare class TntWebSocketServer {
    private wss;
    private clients;
    private heartbeatTimer;
    private config;
    constructor(config: WebSocketServerConfig);
    start(): Promise<void>;
    stop(): Promise<void>;
    broadcast(message: WebSocketMessage): void;
    private handleConnection;
    private handleMessage;
    private sendError;
    private sendStatus;
    private startHeartbeat;
    getClientCount(): number;
}
//# sourceMappingURL=websocket-server.d.ts.map