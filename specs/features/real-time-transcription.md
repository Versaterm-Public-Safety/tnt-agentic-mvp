# Feature Specification: Real-Time Transcription Display

**Version**: 1.0  
**Date**: 2025-12-31  
**Status**: Draft  
**Agent**: Research Agent

---

## 1. Overview

### 1.1 Purpose

This specification defines the MVP "thin slice" for the TnT (Transcription and Translation) initiative: **Real-time transcription display of 9-1-1 calls**. This feature enables telecommunicators to view live text transcripts of active calls, improving accuracy and reducing cognitive load.

### 1.2 Scope

**In Scope (MVP)**:
- Real-time transcription of both caller and agent speech
- Browser-based UI displaying transcripts
- Speaker identification (Caller vs Agent)
- WebSocket streaming for low-latency updates
- Local Whisper.cpp for transcription (no external API keys)

**Out of Scope (Future Phases)**:
- Language detection and translation (Phase 2)
- Supervisor view and search (Phase 3)
- Historical transcript storage (Phase 3)
- Integration with Komutel/Komlog (Phase 4)

### 1.3 Source Requirements

This specification is derived from the PRD (`tnt.prd`), specifically:
- **Section 4.1**: Core Transcription user stories
- **Section 5.1**: Performance metrics (WER < 20%, latency < 2s)
- **Section 6.1**: In-scope items (browser UI, real-time transcription)

---

## 2. User Story

**As a Telecommunicator**,  
**I want to** see a real-time text transcript of my active 9-1-1 call,  
**So that** I can visually verify critical details (addresses, names) and reduce the cognitive load of remembering every detail from a stressful conversation.

---

## 3. Acceptance Criteria

| ID | Criterion | Source |
|----|-----------|--------|
| AC-1 | The transcript MUST appear in a browser-based UI | PRD 4.1 |
| AC-2 | Both caller and agent speech MUST be transcribed and labeled | PRD 4.1 |
| AC-3 | Text MUST appear within 2 seconds of being spoken | PRD 4.1 |
| AC-4 | The system SHOULD achieve WER ≤ 20% (goal: 17%) | PRD 5.1 |
| AC-5 | UI MUST update in real-time without manual refresh | Implied |

---

## 4. Architecture Overview

### 4.1 System Components

```
┌─────────────────┐     Audio      ┌──────────────────┐
│   Mock Audio    │────────────────▶│  Transcription   │
│     Source      │    (WAV/PCM)    │   Service        │
│  (Demo/Test)    │                 │  (Whisper.cpp)   │
└─────────────────┘                 └─────────┬────────┘
                                              │ Text
                                              ▼
                                    ┌──────────────────┐
                                    │  WebSocket       │
                                    │  Server          │
                                    └─────────┬────────┘
                                              │ WS
                                              ▼
                                    ┌──────────────────┐
                                    │   React UI       │
                                    │ (Browser Client) │
                                    └──────────────────┘
```

### 4.2 Component Responsibilities

| Component | Responsibility | Package |
|-----------|---------------|---------|
| **Transcription Service** | Convert audio to text using Whisper.cpp | `@tnt/transcription` |
| **WebSocket Server** | Stream transcript updates to clients | `@tnt/server` |
| **React UI** | Display transcripts in real-time | `@tnt/ui` |
| **Core Domain** | Define domain models (Call, Transcript, Speaker) | `@tnt/core` |

---

## 5. Domain Model

### 5.1 Entities

#### Speaker

```typescript
enum Speaker {
  Caller = 'caller',
  Agent = 'agent'
}
```

#### Transcript

```typescript
interface Transcript {
  id: string;              // Unique identifier
  callId: string;          // Associated call ID
  text: string;            // Transcribed text
  speaker: Speaker;        // Who spoke
  timestamp: Date;         // When spoken
  confidence: number;      // Whisper confidence (0-1)
  isFinal: boolean;        // Is this final or interim?
}
```

#### Call

```typescript
interface Call {
  id: string;              // Unique identifier
  startTime: Date;         // Call start time
  endTime?: Date;          // Call end time (undefined if active)
  status: 'active' | 'completed';
  transcripts: Transcript[]; // All transcripts for this call
}
```

---

## 6. API Specification

### 6.1 WebSocket Protocol

**Connection**: `ws://localhost:8080`

#### Client → Server Messages

```typescript
// Request to start transcription for a call
{
  type: 'start_call',
  callId: string
}

// Request to end call
{
  type: 'end_call',
  callId: string
}
```

#### Server → Client Messages

```typescript
// Transcript update
{
  type: 'transcript',
  callId: string,
  transcript: {
    id: string,
    text: string,
    speaker: 'caller' | 'agent',
    timestamp: string,  // ISO 8601
    confidence: number,
    isFinal: boolean
  }
}

// Call status update
{
  type: 'call_status',
  callId: string,
  status: 'active' | 'completed',
  startTime: string,
  endTime?: string
}

// Error message
{
  type: 'error',
  code: string,
  message: string
}
```

---

## 7. UI Requirements

### 7.1 Components

```
TranscriptionApp
├── Header
│   ├── CallStatus (active/inactive indicator)
│   └── CallId display
├── TranscriptPanel
│   ├── TranscriptEntry (caller) - left-aligned, blue
│   ├── TranscriptEntry (agent) - right-aligned, green
│   └── Auto-scroll to latest
└── ControlPanel
    ├── StartButton (start demo call)
    └── StopButton (end demo call)
```

### 7.2 Display Rules

| Element | Requirement |
|---------|-------------|
| Caller text | Left-aligned, blue background, labeled "Caller" |
| Agent text | Right-aligned, green background, labeled "Agent" |
| Timestamp | Display time for each transcript entry |
| Auto-scroll | Automatically scroll to show latest transcript |
| Reconnect | Auto-reconnect WebSocket if connection drops |

---

## 8. Performance Requirements

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| Latency | < 2 seconds from speech to display | Timestamp difference |
| WER | ≤ 20% (goal: 17%) | Manual evaluation with test audio |
| UI Update | < 100ms from WebSocket receipt | Performance profiling |
| Concurrent Users | Support 1 user (MVP) | Load testing (future) |

---

## 9. Technical Constraints

### 9.1 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Language | TypeScript | Type safety, AI agent-friendly |
| Transcription | Whisper.cpp | Local execution, no API keys |
| Real-time | WebSocket | Low latency, bidirectional |
| UI | React + Vite | Fast dev, industry standard |
| Testing | Vitest | Fast, modern |
| Build | Turborepo | Monorepo caching |

### 9.2 Constraints

- **No external API keys**: Use Whisper.cpp locally
- **TypeScript strict mode**: No `any` types allowed
- **Browser-based UI**: Must work in Chrome, Firefox, Edge
- **No authentication**: MVP demo only

---

## 10. Test Strategy

### 10.1 Unit Tests

- Domain models (Call, Transcript, Speaker)
- WebSocket message serialization/deserialization
- React components (TranscriptPanel, CallStatus)

### 10.2 Integration Tests

- WebSocket server → client communication
- Transcription service → WebSocket server flow

### 10.3 E2E Tests

- Full flow: Audio → Transcription → WebSocket → UI
- User actions: Start call, view transcripts, stop call

---

## 11. Success Criteria

| Criterion | Definition of Done |
|-----------|-------------------|
| **Functional** | User can see transcripts appearing in browser UI as audio plays |
| **Latency** | Text appears within 2 seconds of speech |
| **Accuracy** | Labels correctly identify caller vs agent |
| **Reliability** | UI reconnects automatically if WebSocket drops |
| **Code Quality** | 100% TypeScript, no `any`, tests pass |

---

## 12. Future Considerations

### 12.1 Phase 2 Enhancements

- Language detection (8 sec detection time, 80% accuracy)
- Real-time translation (8 languages → English/French)
- Text-to-speech for agent responses

### 12.2 Phase 3 Enhancements

- Supervisor view (live monitoring)
- Transcript search functionality
- Historical transcript storage

### 12.3 Phase 4 Enhancements

- Komutel/Komlog integration (live audio tap)
- SIPREC protocol implementation
- Production-grade authentication

---

## 13. Open Questions

| Question | Status | Resolution |
|----------|--------|------------|
| Which Whisper model size (tiny/base/small)? | Open | To be decided by Test Agent based on accuracy vs performance |
| Mock audio source format (WAV/MP3)? | Open | To be decided by Implementation Agent |

---

## 14. Approval

| Stakeholder | Role | Status |
|-------------|------|--------|
| Research Agent | Author | ✅ Complete |
| Test Agent | Reviewer | Pending |
| Implementation Agent | Implementer | Pending |
| Validation Agent | Validator | Pending |

---

**Document Status**: Draft - Ready for Test Agent review  
**Next Steps**: Test Agent should create unit tests based on domain model and API specification
