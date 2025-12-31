# ADR-002: WebSocket for Real-Time Transport

## Status
**Accepted** - 2025-12-31

## Context

The TnT MVP requires real-time, bidirectional communication between the transcription server (@tnt/server) and browser UI (@tnt/ui) for:

1. **Server → Client**: Streaming transcript updates as they're generated
2. **Client → Server**: Connection management (heartbeat, reconnection requests)
3. **Low latency**: Must meet <100ms transport overhead requirement (NFR-003)
4. **Reliability**: Handle network interruptions gracefully with reconnection
5. **Browser compatibility**: Must work in modern browsers without plugins

**Performance target**: Transport latency < 100ms (constitution.md), end-to-end latency < 2 seconds (spec.md § 5.1)

## Decision

We will use **WebSocket** (RFC 6455) as the transport protocol, implemented with:
- **Server**: `ws` library (Node.js)
- **Client**: Native browser `WebSocket` API
- **Message format**: JSON-serialized TypeScript interfaces

### Message Protocol

**Server → Client: TranscriptUpdate**
```typescript
interface TranscriptUpdate {
  type: 'transcript';
  callId: string;
  transcript: {
    id: string;
    text: string;
    speaker: 'caller' | 'agent';
    confidence: number;
    timestamp: string;  // ISO 8601
    isFinal: boolean;
  };
}
```

**Server → Client: ConnectionStatus**
```typescript
interface ConnectionStatus {
  type: 'status';
  status: 'connected' | 'disconnected' | 'reconnecting';
  callId?: string;
}
```

**Server → Client: ErrorMessage**
```typescript
interface ErrorMessage {
  type: 'error';
  code: string;
  message: string;
  timestamp: string;
}
```

### Connection Management

- **Heartbeat**: Client sends ping every 30s, server responds with pong
- **Reconnection**: Exponential backoff (1s, 2s, 4s max)
- **Graceful shutdown**: Server sends "disconnecting" status before close

## Rationale

### Why WebSocket?

**Pros**:
- ✅ **Full duplex**: Bidirectional communication over single TCP connection
- ✅ **Low latency**: ~1-5ms overhead per message (well under 100ms target)
- ✅ **Native browser support**: No libraries needed client-side
- ✅ **Firewall-friendly**: Uses HTTP upgrade, traverses proxies
- ✅ **Efficient**: Persistent connection, no HTTP overhead per message
- ✅ **Mature ecosystem**: `ws` library is battle-tested, widely used

**Cons**:
- ⚠️ **Connection state**: Must handle disconnections/reconnections
- ⚠️ **No built-in reconnection**: Application must implement (acceptable, gives control)
- ⚠️ **Load balancing complexity**: Requires sticky sessions (not an issue for MVP)

### Alternatives Considered

1. **Server-Sent Events (SSE)**
   - **Pros**: Simpler (HTTP-based), auto-reconnection, EventSource API
   - **Cons**: **Unidirectional only** (server → client), would need separate HTTP POST for client → server
   - **Why not chosen**: Need bidirectional for future features (e.g., agent commands)

2. **HTTP Long Polling**
   - **Pros**: Works everywhere, no special protocol
   - **Cons**: **High latency** (100-500ms per request), inefficient (new connection per message), complex state management
   - **Why not chosen**: Latency target (<100ms) impossible to meet

3. **gRPC-Web**
   - **Pros**: Type-safe, efficient binary protocol, streaming support
   - **Cons**: Requires Envoy proxy, more complex setup, overkill for simple messages
   - **Why not chosen**: Added infrastructure complexity not justified for MVP

4. **Socket.io**
   - **Pros**: Higher-level abstraction, built-in reconnection, fallback to polling
   - **Cons**: Larger bundle size, custom protocol (not standard WebSocket), unnecessary abstraction
   - **Why not chosen**: Native WebSocket + simple reconnection logic is sufficient

### Evidence: Latency Benchmarks

**WebSocket latency** (measured with `ws` library):
- Message send → receive (localhost): **<1ms**
- Message send → receive (same datacenter): **1-5ms**
- Message send → receive (cross-region): **50-100ms**

Source: [WebSocket Performance Study](https://blog.jayway.com/2015/04/13/600k-concurrent-websocket-connections-on-aws-using-node-js/)

**Transcript update size**:
- Typical transcript: ~100 bytes JSON
- At 10 transcripts/second: 1KB/s bandwidth (negligible)

## Consequences

### Positive

✅ **Low latency**: WebSocket overhead ~1-5ms, well under 100ms target  
✅ **Real-time UX**: Transcripts appear immediately as generated  
✅ **Simple protocol**: JSON messages, easy to debug and extend  
✅ **Type safety**: TypeScript interfaces ensure message schema consistency  
✅ **Browser native**: No client library dependencies  

### Negative

⚠️ **Reconnection complexity**: Must implement exponential backoff logic  
⚠️ **State management**: Client must track connection state (connected, disconnected, reconnecting)  
⚠️ **Debugging**: Harder to inspect than HTTP (though browser DevTools support WebSocket)  

### Neutral

🔵 **Scalability**: WebSocket requires sticky sessions for horizontal scaling (future concern)  
🔵 **Load balancing**: Need WebSocket-aware load balancer (Nginx, HAProxy) - not an issue for MVP  

## References

- [RFC 6455 - WebSocket Protocol](https://datatracker.ietf.org/doc/html/rfc6455)
- [ws Library Documentation](https://github.com/websockets/ws)
- [MDN WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [WebSocket vs SSE Comparison](https://ably.com/topic/websockets-vs-sse)

## Implementation Notes

### Server Setup (@tnt/server)

```typescript
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    // Handle client messages
  });
  
  ws.on('close', () => {
    // Cleanup
  });
  
  // Send transcript update
  ws.send(JSON.stringify({
    type: 'transcript',
    callId: '123',
    transcript: { /* ... */ }
  }));
});
```

### Client Setup (@tnt/ui)

```typescript
const ws = new WebSocket('ws://localhost:8080');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  switch (message.type) {
    case 'transcript':
      // Update UI
      break;
    case 'error':
      // Handle error
      break;
  }
};

ws.onclose = () => {
  // Reconnect with backoff
  setTimeout(reconnect, backoffDelay);
};
```

## Validation

**Verify decision**:
```bash
# 1. Start server
pnpm --filter @tnt/server dev

# 2. Connect from browser console
const ws = new WebSocket('ws://localhost:8080');
ws.onmessage = (e) => console.log(e.data);

# 3. Measure latency
const start = Date.now();
ws.send('ping');
ws.onmessage = () => console.log(`Latency: ${Date.now() - start}ms`);

# Expected: <10ms on localhost
```

**Success criteria**:
- ✅ WebSocket connection established <100ms
- ✅ Message round-trip latency <10ms (localhost)
- ✅ Reconnection works after intentional disconnect
- ✅ Multiple concurrent connections supported (supervisor + agent)

---

**Status**: Accepted  
**Implemented**: Pending (Implementation Agent)  
**Last Reviewed**: 2025-12-31
