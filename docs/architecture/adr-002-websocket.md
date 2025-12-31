# ADR-002: Use WebSocket for Real-Time Transcript Streaming

**Status**: Accepted  
**Date**: 2025-12-31  
**Deciders**: Research Agent  
**Tags**: architecture, real-time, communication

---

## Context

The TnT UI must display transcripts within 2 seconds of speech (per PRD). This requires a real-time, bidirectional communication channel between the transcription service and the browser UI.

We need to choose a protocol that:
- Supports real-time streaming
- Works in browser environments
- Has low latency (<100ms for transport)
- Is simple to implement for MVP

---

## Decision

Use **WebSocket (RFC 6455)** for real-time transcript streaming between server and client.

---

## Rationale

### Alternatives Considered

1. **HTTP Long Polling**
   - Pros: Simple, works everywhere, no special infrastructure
   - Cons: High latency (~200-500ms), inefficient (constant reconnects), server overhead
   - Rejected because: Latency unacceptable for "real-time" requirement

2. **Server-Sent Events (SSE)**
   - Pros: Simple, built-in browser support, automatic reconnection
   - Cons: Unidirectional (server → client only), HTTP/1.1 connection limits
   - Rejected because: Need bidirectional communication for future features (agent input)

3. **gRPC with Web**
   - Pros: Efficient binary protocol, strong typing with Protobuf
   - Cons: Complex setup, requires proxy for browser support, overkill for MVP
   - Rejected because: Complexity not justified for simple transcript messages

4. **GraphQL Subscriptions**
   - Pros: Flexible query language, strong ecosystem
   - Cons: Uses WebSocket under the hood anyway, adds complexity layer
   - Rejected because: WebSocket is simpler for point-to-point streaming

### Why WebSocket Wins

- **Low Latency**: ~10ms transport overhead (vs ~50ms SSE, ~200ms polling)
- **Bidirectional**: Supports both server → client (transcripts) and client → server (controls)
- **Browser Native**: Supported in all modern browsers (100% coverage)
- **Simple Protocol**: Easy to implement, debug, and test
- **Persistent Connection**: No reconnection overhead like HTTP polling
- **Efficient**: Binary or text framing, minimal overhead
- **Well-Established**: Mature standard (RFC 6455 from 2011), extensive tooling

---

## References

- [RFC 6455 - The WebSocket Protocol](https://datatracker.ietf.org/doc/html/rfc6455) - Official specification
- [MDN WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) - Browser implementation
- [ws npm package](https://www.npmjs.com/package/ws) - Node.js WebSocket library (most popular)
- [WebSocket vs SSE Comparison](https://ably.com/topic/websockets-vs-sse) - Performance benchmarks

---

## Consequences

### Positive

- Meets latency requirement (<100ms transport, <2s end-to-end)
- Simple implementation (ws library for server, native WebSocket API for client)
- Real-time bidirectional communication (future-proof for agent text-to-speech)
- Automatic reconnection logic easy to implement
- Works seamlessly with React (useEffect hook pattern)
- Industry-standard approach for real-time dashboards

### Negative

- Stateful connection (requires connection management)
- Need to handle reconnection logic on client side
- Requires WebSocket-capable hosting (most modern platforms support this)
- More complex than simple HTTP REST for testing

### Neutral

- Will use JSON messages for MVP (human-readable, easy to debug)
- Could switch to binary protocol (MessagePack/Protobuf) later for efficiency
- Need to define clear message protocol (documented in feature spec)

---

## Notes

- Message protocol defined in `specs/features/real-time-transcription.md`
- Client should auto-reconnect with exponential backoff
- Consider adding heartbeat/ping for connection health monitoring
- For production, upgrade to WSS (WebSocket Secure) with TLS
