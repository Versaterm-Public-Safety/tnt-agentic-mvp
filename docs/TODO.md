# TnT MVP Implementation TODO

> Master task tracker for the agentic SDLC workflow
> 
> **Status**: READY TO START
> **Current Phase**: Planning
> **Last Updated**: 2025-12-31T21:33:00Z
> **MVP Scope**: Real-time transcription with SIPREC integration, full UI, local Whisper.cpp

---

## Progress Summary

| Phase | Tasks | Completed | Status |
|-------|-------|-----------|--------|
| Planning | 4 | 4 | ✅ DONE |
| Research Agent | 20 | 14 | 🟡 PARTIAL |
| Test Agent | 25 | 25 | ✅ DONE |
| Implementation Agent | 35 | 35 | ✅ DONE |
| Validation Agent | 6 | 0 | ⬜ TODO |
| Security Agent | 7 | 0 | ⬜ TODO |
| Integration Agent | 10 | 0 | ⬜ TODO |
| Documentation Agent | 6 | 0 | ⬜ TODO |
| Deployment Agent | 8 | 0 | ⬜ TODO |
| **TOTAL** | **121** | **78** | **64%** |

---

## Phase 0: Planning ✅

- [x] **0.1** Read spec.md and extract all requirements
- [x] **0.2** Read constitution.md for project rules  
- [x] **0.3** Generate comprehensive TODO list
- [x] **0.4** Validate acceptance criteria coverage

---

## Phase 1: Research Agent (20 tasks) 🟡

**Trigger**: Planning complete
**Output**: Feature specs, ADRs, infrastructure setup, research notes, handoff
**Context Clearing**: New agent reads handoff doc only

### Research Tasks (Evidence-Based)

- [x] **1.1** Research SIPREC protocol (RFC 7865/7866)
  - Document INVITE handling, SDP parsing, RTP management, metadata XML
  - Output: `specs/research/siprec-protocol.md`

- [ ] **1.2** Research whisper.cpp Node.js integration
  - Evaluate whisper-node vs native bindings, model selection, WER benchmarks
  - Output: `specs/research/whisper-integration.md`

- [ ] **1.3** Research WebSocket transport architecture
  - Document message protocol, reconnection strategy, latency considerations
  - Output: `specs/research/websocket-transport.md`

- [ ] **1.4** Research SIPREC fan-out proxy architecture
  - SIP proxy for multi-consumer (TnT + Recording Server)
  - Output: `specs/research/fan-out-proxy.md`

### Infrastructure Setup Tasks

- [x] **1.5** Create package directory structure (7 packages)
- [x] **1.6** Initialize package.json for each workspace
- [x] **1.7** Configure shared TypeScript (strict mode, no `any`)
- [x] **1.8** Setup Vitest with coverage (80% threshold)
- [x] **1.9** Setup ESLint and Prettier

### Requirements Analysis

- [x] **1.10** Decompose PRD into categorized requirements (FR/NFR/Constraints)
- [x] **1.11** Map all acceptance criteria to requirements
- [x] **1.12** Identify ambiguities and edge cases

### Specification Tasks

- [x] **1.13** Create feature specification (`specs/features/real-time-transcription.md`)
  - All 10 sections per AGENTIC-SDLC-PLAN.md § 3.1.2
  - ACs in Given/When/Then format

### Architecture Decision Records

- [x] **1.14** Create ADR-001: Turborepo monorepo
- [x] **1.15** Create ADR-002: WebSocket transport
- [x] **1.16** Create ADR-003: Whisper.cpp local transcription
- [x] **1.17** Create ADR-004: SIPREC integration with fan-out proxy

### Handoff Tasks

- [x] **1.18** Create Research Agent audit trail
- [x] **1.19** Run build/test verification (should pass with empty structure)
- [ ] **1.20** Create handoff document to Test Agent

---

## Phase 2: Test Agent (25 tasks) ✅

**Trigger**: Research handoff exists
**Output**: Unit tests for all packages, integration test structure, handoff
**Context Clearing**: Read handoff doc, load feature spec, start fresh

### @tnt/core Tests

- [x] **2.1** Transcript value object tests (creation, validation, immutability)
- [x] **2.2** Call aggregate tests (lifecycle, state transitions)
- [x] **2.3** Speaker type tests (validation, type safety)
- [x] **2.4** Domain errors tests (TranscriptError, CallError)

### @tnt/siprec Tests

- [x] **2.5** SIPREC SRS tests (session handling, SDP parsing)
- [x] **2.6** SIPREC message parser tests (INVITE, multipart MIME, metadata XML)
- [x] **2.7** RTP stream handler tests (audio extraction, buffering)
- [x] **2.8** SIPREC types and interfaces tests

### @tnt/siprec-proxy Tests

- [x] **2.9** Fan-out proxy tests (multi-consumer routing)
- [x] **2.10** SIP proxy tests (INVITE forwarding, session management)

### @tnt/sbc-simulator Tests

- [x] **2.11** SBC simulator tests (SIPREC session generation)
- [x] **2.12** Audio stream simulation tests (PCM generation)

### @tnt/transcription Tests

- [x] **2.13** TranscriptionService interface tests
- [x] **2.14** Whisper adapter tests (model loading, transcription)
- [x] **2.15** Audio buffer handling tests (format validation, chunking)
- [x] **2.16** Mock adapter tests (for fast testing)

### @tnt/server Tests

- [x] **2.17** WebSocket server tests (connection, disconnection, heartbeat)
- [x] **2.18** Message protocol tests (serialization, validation)
- [x] **2.19** Audio routing tests (SIPREC → Transcription → WebSocket)
- [x] **2.20** Error handling tests (invalid messages, connection failures)

### @tnt/ui Tests

- [x] **2.21** TranscriptPanel component tests (rendering, scrolling, updates)
- [x] **2.22** TranscriptEntry component tests (speaker labels, formatting)
- [x] **2.23** CallStatus component tests (call state display)
- [x] **2.24** useWebSocket hook tests (connection management, reconnection)

### Handoff Tasks

- [x] **2.25** Create Test Agent audit trail and handoff

---

## Phase 3: Implementation Agent (35 tasks) ✅

**Trigger**: Test handoff exists
**Output**: Production code passing all tests, handoff
**Context Clearing**: Read handoff doc, see test files, start fresh

### @tnt/core Implementation (5 tasks)

- [x] **3.1** Implement Transcript value object
- [x] **3.2** Implement Call aggregate
- [x] **3.3** Implement Speaker type
- [x] **3.4** Implement domain errors
- [x] **3.5** Create @tnt/core exports

### @tnt/siprec Implementation (6 tasks)

- [x] **3.6** Implement SIPREC SRS (Session Recording Server)
- [x] **3.7** Implement SDP parser
- [x] **3.8** Implement SIPREC message parser (INVITE, metadata XML)
- [x] **3.9** Implement RTP stream handler
- [x] **3.10** Implement SIPREC types
- [x] **3.11** Create @tnt/siprec exports

### @tnt/siprec-proxy Implementation (3 tasks)

- [x] **3.12** Implement fan-out proxy (multi-consumer routing)
- [x] **3.13** Implement SIP proxy forwarding
- [x] **3.14** Create @tnt/siprec-proxy exports

### @tnt/sbc-simulator Implementation (3 tasks)

- [x] **3.15** Implement SBC simulator (SIPREC session generator)
- [x] **3.16** Implement audio stream generator (PCM)
- [x] **3.17** Create @tnt/sbc-simulator exports

### @tnt/transcription Implementation (5 tasks)

- [x] **3.18** Implement TranscriptionService interface
- [x] **3.19** Implement Whisper adapter (whisper.cpp binding)
- [x] **3.20** Implement audio utilities (format validation, chunking)
- [x] **3.21** Implement mock adapter (for fast tests)
- [x] **3.22** Create @tnt/transcription exports

### @tnt/server Implementation (6 tasks)

- [x] **3.23** Implement WebSocket server (ws library)
- [x] **3.24** Implement message protocol handlers
- [x] **3.25** Implement audio routing pipeline (SIPREC → Transcription → WS)
- [x] **3.26** Implement error handling and logging
- [x] **3.27** Create server entry point (startup, shutdown)
- [x] **3.28** Create @tnt/server exports

### @tnt/ui Implementation (6 tasks)

- [x] **3.29** Implement TranscriptPanel component (container with scrolling)
- [x] **3.30** Implement TranscriptEntry component (speaker labels, text)
- [x] **3.31** Implement CallStatus component (call state indicator)
- [x] **3.32** Implement useWebSocket hook (connection, reconnection, messages)
- [x] **3.33** Create App component (main UI)
- [x] **3.34** Configure Vite build

### Handoff Tasks

- [x] **3.35** Verify all tests pass, create handoff

---

## Phase 4: Validation Agent (6 tasks)

**Trigger**: Implementation handoff exists
**Output**: Validation report with traceability matrix, handoff
**Context Clearing**: Read handoff doc, check build/test status

- [ ] **4.1** Build requirements traceability matrix (AC → Tests → Code)
- [ ] **4.2** Execute and verify test coverage (>80% for domain)
- [ ] **4.3** Verify acceptance criteria implementation
- [ ] **4.4** Perform behavioral code review
- [ ] **4.5** Check for technical debt (TODO/FIXME, repeated patterns)
- [ ] **4.6** Create validation report and handoff

---

## Phase 5: Security Agent (7 tasks)

**Trigger**: Validation handoff exists
**Output**: Security assessment, threat model, handoff
**Context Clearing**: Read handoff doc, security focus

- [ ] **5.1** Run automated security scans (`pnpm audit`)
- [ ] **5.2** Check for secrets and credentials
- [ ] **5.3** Review input validation coverage (all entry points)
- [ ] **5.4** Check for dangerous patterns (eval, dangerouslySetInnerHTML)
- [ ] **5.5** Create STRIDE threat model (WebSocket, SIPREC interfaces)
- [ ] **5.6** Create security report
- [ ] **5.7** Create security audit trail and handoff

---

## Phase 6: Integration Agent (10 tasks)

**Trigger**: Security handoff exists
**Output**: E2E tests, integration verification, updated README, handoff
**Context Clearing**: Read handoff doc, full system view

### Integration Testing

- [ ] **6.1** Create E2E transcription flow test (SBC → SIPREC → Transcription → WS → UI)
- [ ] **6.2** Create WebSocket integration tests (server ↔ UI)
- [ ] **6.3** Create SIPREC integration tests (SBC → SRS → audio extraction)
- [ ] **6.4** Create fan-out proxy integration tests (multi-consumer)
- [ ] **6.5** Verify cross-package dependencies (no circular deps)

### Smoke Testing

- [ ] **6.6** Perform manual smoke test (start all services, verify transcript)
- [ ] **6.7** Verify performance targets (latency < 2s)

### Documentation

- [ ] **6.8** Update README with verified instructions
- [ ] **6.9** Add architecture diagrams
- [ ] **6.10** Create integration report and handoff

---

## Phase 7: Documentation Agent (6 tasks)

**Trigger**: Integration handoff exists
**Output**: Verified documentation, final completion report
**Context Clearing**: Read handoff doc, documentation focus

- [ ] **7.1** Verify README commands work (install, build, test, dev)
- [ ] **7.2** Verify API documentation matches implementation
- [ ] **7.3** Verify ADRs are current
- [ ] **7.4** Verify feature spec accuracy
- [ ] **7.5** Create final documentation report
- [ ] **7.6** Mark workflow complete

---

## Phase 8: Deployment Agent (8 tasks)

**Trigger**: Documentation handoff exists
**Output**: Deployment scripts, CI/CD pipeline, production-ready artifacts
**Context Clearing**: Read handoff doc, deployment focus

- [ ] **8.1** Create Docker containers (server, UI)
- [ ] **8.2** Create docker-compose.yml for local deployment
- [ ] **8.3** Create GitHub Actions CI pipeline (build, test, lint)
- [ ] **8.4** Create GitHub Actions CD pipeline (publish packages)
- [ ] **8.5** Document deployment process
- [ ] **8.6** Create production environment variables guide
- [ ] **8.7** Test deployment in clean environment
- [ ] **8.8** Create deployment handoff (marks project complete)

---

## Acceptance Criteria Checklist

> From spec.md Section 4.0

### 4.1 Core Transcription

- [ ] AC-4.1.1: Transcript appears in browser UI
- [ ] AC-4.1.2: Caller and agent speech labeled
- [ ] AC-4.1.3: Text appears within 2 seconds
- [ ] AC-4.1.4: WER ≤ 20% (goal: 17%)

### 4.2 Language Detection (OUT OF SCOPE for MVP)

- [ ] AC-4.2.1: Language detection >80% accuracy (FUTURE)
- [ ] AC-4.2.2: Detection within 8 seconds (FUTURE)
- [ ] AC-4.2.3: Visual indicator in UI (FUTURE)

### 4.3 UI Requirements

- [ ] AC-4.3.1: Standalone browser window
- [ ] AC-4.3.2: Architecturally independent (decoupled)

### 4.4 SIPREC Integration (MVP ADDITION)

- [ ] AC-4.4.1: SIPREC session handling (RFC 7866)
- [ ] AC-4.4.2: Audio extraction from RTP streams
- [ ] AC-4.4.3: Fan-out proxy for multi-consumer

---

## Success Criteria

### Code Quality (constitution.md)

- [ ] TypeScript strict mode enabled
- [ ] No `any` types in codebase
- [ ] All tests passing
- [ ] Coverage >80% for domain logic (@tnt/core)
- [ ] No ESLint errors

### Performance (spec.md § 5.1)

- [ ] Transcription display < 2 seconds
- [ ] WebSocket transport < 100ms overhead

### Security

- [ ] No critical security vulnerabilities
- [ ] No secrets in code
- [ ] All inputs validated

### Documentation

- [ ] All documentation accurate
- [ ] All ADRs have rationale
- [ ] All handoffs complete
- [ ] Audit trail complete

---

## Context Clearing Protocol

Each agent phase is **self-contained** with:
- **Trigger**: What event starts this phase
- **Input**: Handoff document from previous agent ONLY
- **Output**: Work products + new handoff document
- **Context Clearing**: Agent reads handoff, not full history

**Agent Startup Checklist**:
1. Read handoff document from previous agent
2. Verify environment (build, test status)
3. Execute assigned tasks
4. Create audit trail
5. Create handoff for next agent
6. Update this TODO
7. Clear context (next agent starts fresh)

---

*This TODO is the master tracker. Each agent MUST update task status and commit changes.*
