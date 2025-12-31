# Feature Specification: Real-Time Transcription Display with SIPREC

**Feature Branch**: `main` (MVP)  
**Created**: 2025-12-31  
**Status**: Draft  
**Version**: 1.0.0

---

## 1. Overview

This feature enables real-time transcription of 9-1-1 emergency calls with SIPREC (Session Initiation Protocol Recording) compliance for NG911/ESInet infrastructure integration. The system receives audio via SIPREC protocol, transcribes it using Whisper.cpp (local AI), identifies speakers (caller/agent), and displays transcripts in a browser UI with sub-2-second latency.

**Business Value**: Reduces telecommunicator cognitive load, improves information accuracy, enables supervisor monitoring, and provides compliance with NG911 standards.

**Architectural Approach**: Microservices architecture with @tnt/core domain, @tnt/siprec for protocol handling, @tnt/transcription for AI processing, @tnt/server for WebSocket transport, and @tnt/ui for display.

---

## 2. User Stories

### US-1: Telecommunicator Views Real-Time Transcript (P1) 🎯 MVP
**As a** Telecommunicator  
**I want to** see a real-time text transcript of my active 9-1-1 call  
**So that** I can visually verify critical details (addresses, names) and reduce cognitive load

**Acceptance Scenarios**:
1. **Given** an active 9-1-1 call with ongoing conversation  
   **When** the caller speaks "My address is 123 Main Street"  
   **Then** the transcript appears in the UI within 2 seconds with speaker label "Caller"

2. **Given** an active call  
   **When** the telecommunicator responds "What is your emergency?"  
   **Then** the transcript appears with speaker label "Agent" within 2 seconds

### US-2: Supervisor Monitors Live Call (P2)
**As a** Supervisor  
**I want to** view the transcript of a live call in progress  
**So that** I can monitor high-risk situations and provide support

**Acceptance Scenarios**:
1. **Given** a call is active  
   **When** I open the supervisor view and select the call  
   **Then** I see the complete transcript from call start to current moment

### Edge Cases
- **What happens when audio drops?** System displays last known transcript, attempts reconnection with exponential backoff (1s, 2s, 4s max), shows "Connection Lost" indicator
- **What happens with overlapping speech?** Both speakers transcribed separately with timestamps, UI shows concurrent transcripts
- **What happens with silence/no audio?** No transcript generated, no UI updates (existing transcripts remain visible)
- **What happens with poor audio quality?** Transcription confidence <0.8 triggers visual indicator (yellow highlight), text still displayed
- **What happens when call ends?** Final transcript marked complete, WebSocket connection gracefully closed, data preserved for review

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Source (PRD §) | Acceptance Criteria |
|----|-------------|----------|----------------|---------------------|
| FR-001 | System MUST transcribe caller speech to text | P1 | spec.md § 4.1 | AC-4.1.1 |
| FR-002 | System MUST transcribe agent speech to text | P1 | spec.md § 4.1 | AC-4.1.2 |
| FR-003 | System MUST identify speaker (caller vs agent) | P1 | spec.md § 4.1 | AC-4.1.2 |
| FR-004 | System MUST display transcripts in browser UI | P1 | spec.md § 4.3 | AC-4.3.1 |
| FR-005 | System MUST receive audio via SIPREC protocol | P1 | MVP architecture | AC-4.4.1 |
| FR-006 | System MUST extract audio from RTP streams | P1 | MVP architecture | AC-4.4.2 |
| FR-007 | System MUST support multi-consumer fan-out (TnT + Recording) | P2 | PLAN § 1.2 | AC-4.4.3 |
| FR-008 | System MUST transport transcripts via WebSocket | P1 | ADR-002 | Tests verify WS messages |
| FR-009 | UI MUST be architecturally independent | P1 | spec.md § 4.3 | AC-4.3.2 |

### 3.2 Non-Functional Requirements

| ID | Requirement | Metric | Target | Source |
|----|-------------|--------|--------|--------|
| NFR-001 | Transcription latency | Time from speech end to UI display | < 2000ms | spec.md § 5.1 |
| NFR-002 | Transcription accuracy | Word Error Rate (WER) | ≤ 20% (goal: 17%) | spec.md § 4.1 |
| NFR-003 | WebSocket transport overhead | Added latency | < 100ms | constitution.md |
| NFR-004 | System availability | Uptime during call | 99.9% | Implied (emergency service) |
| NFR-005 | Audio format support | PCM sample rate | 16kHz mono or 44.1kHz stereo | Whisper.cpp requirements |
| NFR-006 | Concurrent calls | Number of simultaneous transcriptions | 10 (MVP) | MVP scope |
| NFR-007 | TypeScript type safety | No `any` types | 0 instances | constitution.md § III |
| NFR-008 | Test coverage | Code coverage for domain logic | > 80% | constitution.md |

### 3.3 Constraints

- **No External API Keys**: Must run locally using Whisper.cpp (no cloud AI services)
- **SIPREC Compliance**: Must implement RFC 7865/7866 for NG911/ESInet compatibility
- **Browser-Only UI**: No desktop application, browser deployment only
- **Node.js 20+**: Server components require Node.js 20 or higher
- **TypeScript Strict Mode**: All code must compile with strict type checking

### 3.4 Assumptions

- Audio streams are available via SIPREC from SBC (Session Border Controller)
- Audio quality is sufficient for transcription (16kHz+ sample rate, minimal noise)
- Whisper.cpp model (small/base) provides adequate accuracy for English speech
- WebSocket connections are stable (standard TCP reliability)
- Browsers support modern WebSocket API (Chrome 16+, Firefox 11+, Safari 7+)

---

## 4. Success Criteria

| ID | Criterion | Measurement | Target |
|----|-----------|-------------|--------|
| SC-001 | Transcription appears in UI | End-to-end latency | < 2 seconds from speech end |
| SC-002 | Speaker identification accuracy | Correct speaker label | > 95% |
| SC-003 | Word accuracy | Word Error Rate (WER) | ≤ 20% |
| SC-004 | SIPREC session handling | Successful session setup | 100% for valid SIPREC INVITEs |
| SC-005 | UI responsiveness | Time to first render | < 100ms |
| SC-006 | Test coverage | Domain logic coverage | > 80% |
| SC-007 | Type safety | TypeScript errors | 0 errors, 0 `any` types |
| SC-008 | Build success | Clean compilation | `pnpm build` exits 0 |

---

## 5. Key Entities

### 5.1 Domain Model

```typescript
// @tnt/core - Domain entities

/**
 * Transcript represents a single transcribed utterance
 * Immutable value object
 */
interface Transcript {
  id: string;              // UUID
  callId: string;          // Reference to parent Call
  text: string;            // Transcribed text (non-empty)
  speaker: Speaker;        // Who spoke
  confidence: number;      // 0.0-1.0, Whisper confidence score
  timestamp: Date;         // When speech occurred
  isFinal: boolean;        // true = final, false = interim (for streaming)
}

/**
 * Call represents an emergency call session
 * Aggregate root
 */
interface Call {
  id: string;                    // UUID
  startTime: Date;               // Call initiation
  endTime?: Date;                // Call completion (undefined if active)
  status: CallStatus;            // Lifecycle state
  transcripts: Transcript[];     // Ordered collection
}

/**
 * Speaker union type
 */
type Speaker = 'caller' | 'agent';

/**
 * CallStatus state machine
 */
type CallStatus = 'active' | 'completed' | 'error';

/**
 * SIPREC Session (from @tnt/siprec)
 */
interface SiprecSession {
  sessionId: string;             // SIPREC session identifier
  sdp: string;                   // Session Description Protocol
  metadata: SiprecMetadata;      // Recording metadata (RFC 7866)
  streams: RtpStream[];          // Audio streams (caller + agent)
}

interface SiprecMetadata {
  participants: Participant[];
  timestamp: Date;
  recordingId?: string;
}

interface Participant {
  aor: string;                   // Address of Record (SIP URI)
  role: 'caller' | 'callee';     // Maps to Speaker type
}

interface RtpStream {
  ssrc: number;                  // Synchronization Source identifier
  codec: string;                 // Audio codec (e.g., 'PCMU', 'PCMA')
  sampleRate: number;            // Hz (e.g., 8000, 16000)
  participant: Participant;      // Associated participant
}
```

### 5.2 Value Objects

- **Transcript**: Immutable, validated at construction (non-empty text, valid confidence)
- **Speaker**: String literal union, validated at type level
- **CallStatus**: String literal union representing state machine

### 5.3 Aggregates

- **Call**: Aggregate root managing Transcript collection, enforcing invariants (transcripts ordered by timestamp)

---

## 6. API Contracts

### 6.1 WebSocket Messages (Client ↔ Server)

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
    timestamp: string;        // ISO 8601
    isFinal: boolean;
  };
}
```

**Server → Client: ErrorMessage**
```typescript
interface ErrorMessage {
  type: 'error';
  code: string;               // ERROR_CODE enum
  message: string;            // Human-readable
  timestamp: string;
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

### 6.2 SIPREC Protocol (SBC → SRS)

**SIPREC INVITE** (RFC 7866 § 4)
```
INVITE sip:srs@tnt.local SIP/2.0
Via: SIP/2.0/TCP sbc.example.com:5060
From: <sip:sbc@example.com>
To: <sip:srs@tnt.local>
Call-ID: siprec-session-12345
Content-Type: multipart/mixed; boundary=boundary42

--boundary42
Content-Type: application/sdp

v=0
o=- 123456 123456 IN IP4 192.168.1.100
s=SIPREC Session
c=IN IP4 192.168.1.100
t=0 0
m=audio 20000 RTP/AVP 0 8
a=rtpmap:0 PCMU/8000
a=rtpmap:8 PCMA/8000
a=label:1
m=audio 20002 RTP/AVP 0 8
a=rtpmap:0 PCMU/8000
a=rtpmap:8 PCMA/8000
a=label:2

--boundary42
Content-Type: application/rs-metadata+xml
Content-Disposition: recording-session

<?xml version="1.0" encoding="UTF-8"?>
<recording xmlns="urn:ietf:params:xml:ns:recording:1">
  <datamode>complete</datamode>
  <session session_id="siprec-session-12345">
    <sipSessionID>call-abc-123</sipSessionID>
  </session>
  <participant participant_id="caller-1">
    <aor>sip:caller@emergency.com</aor>
  </participant>
  <participant participant_id="agent-1">
    <aor>sip:agent@psap.local</aor>
  </participant>
  <stream stream_id="1" session_id="siprec-session-12345">
    <label>1</label>
  </stream>
  <stream stream_id="2" session_id="siprec-session-12345">
    <label>2</label>
  </stream>
</recording>
--boundary42--
```

**Expected Response: 200 OK**
```
SIP/2.0 200 OK
Via: SIP/2.0/TCP sbc.example.com:5060
From: <sip:sbc@example.com>
To: <sip:srs@tnt.local>;tag=789
Call-ID: siprec-session-12345
Content-Type: application/sdp

v=0
o=- 654321 654321 IN IP4 10.0.0.50
s=TnT SRS
c=IN IP4 10.0.0.50
t=0 0
m=audio 30000 RTP/AVP 0 8
a=rtpmap:0 PCMU/8000
a=rtpmap:8 PCMA/8000
m=audio 30002 RTP/AVP 0 8
a=rtpmap:0 PCMU/8000
a=rtpmap:8 PCMA/8000
```

---

## 7. Error Scenarios

| Scenario | Expected Behavior | Recovery | Test Coverage |
|----------|-------------------|----------|---------------|
| WebSocket disconnects mid-call | UI shows "Connection Lost", attempt reconnect (1s, 2s, 4s backoff) | Auto-reconnect, resume transcript stream | Integration test |
| Invalid SIPREC INVITE (malformed SDP) | Reject with SIP 400 Bad Request, log error | Client must retry with valid format | Unit test |
| Audio codec unsupported | Accept session but log warning, attempt transcoding if possible | Fallback to supported codec or fail gracefully | Unit test |
| Whisper.cpp transcription fails | Log error, skip that audio chunk, continue with next | Resilience to transient AI failures | Unit test |
| Transcript confidence < 0.5 | Display with low-confidence indicator (orange highlight) | User sees uncertainty, can request repeat | UI test |
| Empty/null transcript text | Reject at domain layer with TranscriptError | Prevent invalid state | Unit test |
| Speaker not 'caller' or 'agent' | Reject at type level (TypeScript), runtime validation | Type safety prevents invalid values | Unit test |
| Call already completed | Reject new transcripts with 409 Conflict | State machine enforces lifecycle | Unit test |

---

## 8. Out of Scope (MVP)

| Feature | Reason | Future Consideration |
|---------|--------|----------------------|
| Language detection | Complexity beyond MVP | Phase 2: spec.md § 4.2 |
| Translation | Depends on language detection | Phase 2: spec.md § 4.2 |
| Text-to-speech (agent response) | Additional AI integration | Phase 2: spec.md § 4.2 |
| Transcript search | Requires persistence layer | Phase 2 |
| Historical call review | Requires database | Phase 2 |
| Radio traffic transcription | Different audio source | spec.md § 6.2 |
| Video transcription | NG911 future | spec.md § 6.2 |
| Sentiment analysis | Advanced AI | spec.md § 6.2 |

---

## 9. Open Questions

1. ~~**Audio format from SIPREC:** What codecs must we support?~~  
   **RESOLVED**: PCMU (G.711 μ-law) and PCMA (G.711 A-law) at 8kHz minimum. Will upsample to 16kHz for Whisper.

2. ~~**Whisper model size:** tiny, base, small, or medium?~~  
   **RESOLVED**: Start with `base` model (74M params) for balance of speed and accuracy. See ADR-003.

3. ~~**WebSocket authentication:** Do we need JWT tokens?~~  
   **RESOLVED**: MVP uses no authentication (localhost only). Phase 2 will add token-based auth.

4. **Fan-out proxy location:** Should @tnt/siprec-proxy be separate service or library?  
   **OPEN**: Decide during implementation phase. Leaning toward separate service for scalability.

5. **Transcript persistence:** Do we store transcripts beyond call lifetime?  
   **OPEN**: MVP is in-memory only. Future: PostgreSQL or equivalent.

---

## 10. Testing Strategy

### 10.1 Unit Tests (Khorikov AAA Pattern)

**@tnt/core**
- Transcript creation with validation (empty text throws, invalid confidence throws)
- Call lifecycle state machine (active → completed, no backwards transitions)
- Speaker type validation

**@tnt/siprec**
- SIPREC INVITE parsing (SDP extraction, metadata XML parsing)
- RTP stream management (SSRC mapping to participants)
- SIP message generation (200 OK response formatting)

**@tnt/transcription**
- TranscriptionService interface contract
- Audio format validation (reject non-PCM, wrong sample rate)
- Whisper adapter (mock) returns expected Transcript structure

**@tnt/server**
- WebSocket message serialization/deserialization
- Connection lifecycle (connect, send, disconnect)
- Error handling (malformed messages rejected)

**@tnt/ui**
- Component rendering (TranscriptPanel displays transcripts)
- Speaker differentiation (caller vs agent styling)
- Empty state (no transcripts shows placeholder)

### 10.2 Integration Tests

**SIPREC to Transcription Flow**
- SBC simulator → SIPREC SRS → Audio extraction → Transcription service → Output verified

**WebSocket End-to-End**
- Server sends TranscriptUpdate → UI receives and displays → Content verified

**Error Recovery**
- WebSocket disconnect → Reconnection logic → Transcript stream resumes

### 10.3 E2E Tests

**Complete Call Flow**
1. SBC simulator initiates SIPREC session
2. Audio streams (caller + agent) sent as RTP packets
3. Transcription service processes audio
4. WebSocket delivers transcripts to UI
5. UI displays both speakers correctly
6. Call terminates gracefully

### 10.4 Test Doubles Strategy

| Dependency | Test Double | Type | Rationale |
|------------|-------------|------|-----------|
| Whisper.cpp | `FakeTranscriptionService` | Fake | Returns canned transcripts, no AI needed |
| WebSocket connection | `MockWebSocket` | Mock | Verify messages sent/received |
| SIPREC SBC | `SbcSimulator` | Simulator | Generates realistic SIPREC sessions |
| RTP streams | In-memory buffers | Fake | Avoids network I/O |
| Time | `vi.useFakeTimers()` | Stub | Deterministic timestamp testing |

---

## 11. Performance Targets

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Transcription latency | < 2000ms | `Date.now()` at speech end → UI render |
| WebSocket message latency | < 100ms | Server send timestamp → Client receive |
| UI render time (transcript) | < 50ms | React profiler |
| SIPREC session setup | < 500ms | INVITE → 200 OK response |
| Memory usage (10 concurrent calls) | < 500MB | Node.js `process.memoryUsage()` |
| CPU usage (transcription) | < 80% single core | `top` or profiler |

---

## 12. Acceptance Criteria Mapping

| AC ID | Requirement | Test File | Test Name | Success Metric |
|-------|-------------|-----------|-----------|----------------|
| AC-4.1.1 | Transcript appears in browser UI | `e2e/transcription-flow.test.ts` | `displays transcript in UI` | Text visible in DOM |
| AC-4.1.2 | Caller and agent labeled | `core/transcript.test.ts`, `ui/components.test.tsx` | `identifies speaker correctly` | Label matches input |
| AC-4.1.3 | Text within 2 seconds | `integration/latency.test.ts` | `meets latency requirement` | ≤ 2000ms measured |
| AC-4.1.4 | WER ≤ 20% | Manual validation with test corpus | N/A (model accuracy) | Whisper base spec sheet |
| AC-4.3.1 | Standalone browser window | `ui/app.test.tsx` | `runs independently` | Vite dev server starts |
| AC-4.3.2 | Architecturally independent | Architecture review | N/A | No tight coupling |
| AC-4.4.1 | SIPREC session handling | `siprec/srs.test.ts` | `accepts SIPREC INVITE` | 200 OK response |
| AC-4.4.2 | RTP audio extraction | `siprec/rtp.test.ts` | `extracts audio buffers` | Valid PCM output |
| AC-4.4.3 | Fan-out proxy | `siprec-proxy/proxy.test.ts` | `forwards to multiple consumers` | TnT + Recording receive |

---

**This specification serves as the contract between Research Agent and Test Agent. All acceptance criteria are testable and traceable to implementation.**

**Reviewed by**: Research Agent  
**Approved for**: Test Agent Phase  
**Next Step**: Create Architecture Decision Records (ADRs) for key technical decisions
