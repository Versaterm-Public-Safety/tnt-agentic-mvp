import { WebSocketServer, WebSocket } from 'ws';
export class TntWebSocketServer {
    wss = null;
    clients = new Set();
    heartbeatTimer = null;
    config;
    constructor(config) {
        this.config = {
            port: config.port,
            heartbeatInterval: config.heartbeatInterval ?? 30000,
        };
    }
    start() {
        return new Promise((resolve, reject) => {
            try {
                this.wss = new WebSocketServer({ port: this.config.port });
                this.wss.on('connection', (ws) => {
                    this.handleConnection(ws);
                });
                this.wss.on('listening', () => {
                    console.log(`WebSocket server listening on port ${this.config.port}`);
                    this.startHeartbeat();
                    resolve();
                });
                this.wss.on('error', (error) => {
                    console.error('WebSocket server error:', error);
                    reject(error);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async stop() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
        this.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.close();
            }
        });
        this.clients.clear();
        if (this.wss) {
            return new Promise((resolve) => {
                this.wss.close(() => {
                    console.log('WebSocket server stopped');
                    resolve();
                });
            });
        }
    }
    broadcast(message) {
        const data = JSON.stringify(message);
        this.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    }
    handleConnection(ws) {
        console.log('New WebSocket client connected');
        this.clients.add(ws);
        ws.isAlive = true;
        ws.on('pong', () => {
            ws.isAlive = true;
        });
        ws.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                this.handleMessage(ws, message);
            }
            catch (error) {
                console.error('Invalid message format:', error);
                this.sendError(ws, 'INVALID_MESSAGE', 'Invalid message format');
            }
        });
        ws.on('close', () => {
            console.log('Client disconnected');
            this.clients.delete(ws);
        });
        ws.on('error', (error) => {
            console.error('WebSocket client error:', error);
            this.clients.delete(ws);
        });
        this.sendStatus(ws, 'connected');
    }
    handleMessage(_ws, message) {
        console.log('Received message:', message);
    }
    sendError(ws, code, message) {
        if (ws.readyState === WebSocket.OPEN) {
            const error = {
                type: 'error',
                code,
                message,
                timestamp: new Date().toISOString(),
            };
            ws.send(JSON.stringify(error));
        }
    }
    sendStatus(ws, status, callId) {
        if (ws.readyState === WebSocket.OPEN) {
            const statusMsg = {
                type: 'status',
                status,
                callId,
            };
            ws.send(JSON.stringify(statusMsg));
        }
    }
    startHeartbeat() {
        this.heartbeatTimer = setInterval(() => {
            this.clients.forEach((ws) => {
                if (ws.isAlive === false) {
                    console.log('Terminating inactive client');
                    this.clients.delete(ws);
                    return ws.terminate();
                }
                ws.isAlive = false;
                ws.ping();
            });
        }, this.config.heartbeatInterval);
    }
    getClientCount() {
        return this.clients.size;
    }
}
//# sourceMappingURL=websocket-server.js.map