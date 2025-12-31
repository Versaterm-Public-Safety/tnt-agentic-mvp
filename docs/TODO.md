# TnT MVP Implementation TODO

> Master task tracker for the agentic SDLC workflow
> 
> **Status**: IN_PROGRESS
> **Current Phase**: Planning Phase
> **Last Updated**: 2025-12-31T21:27:00Z

---

## Progress Summary

| Phase | Tasks | Completed | Status |
|-------|-------|-----------|--------|
| Planning | 4 | 4 | ✅ COMPLETE |
| Research Agent | 15 | 0 | ⏳ PENDING |
| Test Agent | 12 | 0 | ⏳ PENDING |
| Implementation Agent | 16 | 0 | ⏳ PENDING |
| Validation Agent | 6 | 0 | ⏳ PENDING |
| Security Agent | 7 | 0 | ⏳ PENDING |
| Integration Agent | 8 | 0 | ⏳ PENDING |
| Documentation Agent | 6 | 0 | ⏳ PENDING |
| **TOTAL** | **74** | **4** | **5%** |

---

## Phase 0: Planning ✅

- [x] Read spec.md (PRD)
- [x] Read constitution.md (project rules)
- [x] Generate comprehensive TODO list
- [x] Validate acceptance criteria coverage

---

## Phase 1: Research Agent

**Trigger**: Planning complete  
**Output**: Feature specs, ADRs, infrastructure setup, audit trail, handoff  
**Section**: AGENTIC-SDLC-PLAN.md § 3.1

### Infrastructure Setup Tasks

- [ ] **1.1** Create package directory structure
  - **Context**: Create `packages/` directory with subdirectories for: `core`, `siprec`, `siprec-proxy`, `sbc-simulator`, `transcription`, `server`, `ui`
  - **Input**: AGENTIC-SDLC-PLAN.md § 2 (Repository Structure)
  - **Output**: Empty package directories with README.md placeholder in each
  - **Verify**: `ls packages/` shows all 7 package directories

- [ ] **1.2** Initialize package.json for each workspace package
  - **Context**: Each package needs its own package.json with name `@tnt/{package-name}`, version `0.0.1`, TypeScript as dev dependency
  - **Input**: Root package.json for reference, pnpm-workspace.yaml
  - **Output**: 7 package.json files in `packages/*/package.json`
  - **Verify**: `pnpm install` succeeds without errors

- [ ] **1.3** Configure shared TypeScript configuration
  - **Context**: Create per-package tsconfig.json extending `tsconfig.base.json`. Enable strict mode, noImplicitAny, target ES2022
  - **Input**: `tsconfig.base.json` at root
  - **Output**: `packages/*/tsconfig.json` files extending base config
  - **Verify**: `pnpm tsc --noEmit` runs without config errors

- [ ] **1.4** Setup Vitest configuration for testing
  - **Context**: Configure Vitest at root level with workspace support. Include coverage reporting with c8/istanbul
  - **Input**: turbo.json test task configuration
  - **Output**: `vitest.config.ts` at root, coverage thresholds set to 80%
  - **Verify**: `pnpm test` command exists and runs (even if no tests yet)

- [ ] **1.5** Setup ESLint and Prettier configuration
  - **Context**: Configure ESLint with TypeScript parser, no-any rule, import sorting. Prettier for consistent formatting
  - **Input**: Constitution rules on code quality
  - **Output**: `.eslintrc.js`, `.prettierrc` at root
  - **Verify**: `pnpm lint` command works

### Requirements Analysis Tasks

- [ ] **1.6** Decompose PRD into categorized requirements
  - **Context**: Extract from spec.md: Functional Requirements (FR), Non-Functional Requirements (NFR), Constraints, Assumptions
  - **Input**: `spec.md` sections 4.0, 5.0, 6.0, 7.0
  - **Output**: Requirements table in feature spec with PRD section references
  - **Verify**: Every spec.md requirement has a corresponding FR/NFR entry

- [ ] **1.7** Research SIPREC protocol implementation (RFC 7865/7866)
  - **Context**: Understand SIP Recording protocol for NG911/ESInet integration. Document SDP format, RTP handling, metadata requirements
  - **Input**: RFC 7865, RFC 7866, AGENTIC-SDLC-PLAN.md architecture diagram
  - **Output**: Research notes in feature spec § Technical Research, key decisions documented
  - **Verify**: Research section has RFC citations and implementation approach

- [ ] **1.8** Research Whisper.cpp integration options
  - **Context**: Evaluate whisper-node, whisper.cpp bindings for Node.js. Document model selection (tiny/base/small), audio format requirements
  - **Input**: whisper.cpp GitHub repo, npm packages
  - **Output**: ADR-003 with evidence links and benchmarks
  - **Verify**: ADR includes performance data and integration approach

### Specification & Documentation Tasks

- [ ] **1.9** Create feature specification document
  - **Context**: Full feature spec with all 10 required sections per AGENTIC-SDLC-PLAN.md § 3.1.2
  - **Input**: spec.md, decomposed requirements, research notes
  - **Output**: `specs/features/real-time-transcription.md` with sections 1-10
  - **Verify**: All 10 sections present, ACs in Given/When/Then format

- [ ] **1.10** Create ADR-001: Monorepo with Turborepo
  - **Context**: Document decision to use Turborepo for monorepo management. Include alternatives considered (Nx, Lerna)
  - **Input**: turbo.json configuration, AGENTIC-SDLC-PLAN.md rationale
  - **Output**: `docs/architecture/adr-001-turborepo-monorepo.md`
  - **Verify**: ADR has Context, Decision, Rationale, Consequences sections

- [ ] **1.11** Create ADR-002: WebSocket for real-time transport
  - **Context**: Document WebSocket choice over alternatives (SSE, polling). Include latency requirements from spec.md
  - **Input**: spec.md § 5.1 performance metrics, AGENTIC-SDLC-PLAN.md § 6.2
  - **Output**: `docs/architecture/adr-002-websocket-transport.md`
  - **Verify**: ADR includes latency targets and protocol design

- [ ] **1.12** Create ADR-003: Whisper.cpp for local transcription
  - **Context**: Document Whisper.cpp choice. Include model selection, no-API-key benefit, accuracy targets
  - **Input**: Research from task 1.8, spec.md WER targets
  - **Output**: `docs/architecture/adr-003-whisper-transcription.md`
  - **Verify**: ADR includes WER expectations and model choice

- [ ] **1.13** Create ADR-004: SIPREC for call recording integration
  - **Context**: Document SIPREC protocol choice for NG911 compatibility. Include fan-out proxy architecture
  - **Input**: Research from task 1.7, AGENTIC-SDLC-PLAN.md architecture
  - **Output**: `docs/architecture/adr-004-siprec-integration.md`
  - **Verify**: ADR includes RFC references and architecture diagram

### Handoff Tasks

- [ ] **1.14** Create Research Agent audit trail
  - **Context**: Document all research activities, decisions made, files created/modified
  - **Input**: All tasks 1.1-1.13 completion status
  - **Output**: `docs/audit-trail/{date}-research-real-time-transcription.md`
  - **Verify**: Audit trail has startup announcement, activity log, completion

- [ ] **1.15** Create handoff document to Test Agent
  - **Context**: Complete handoff per AGENTIC-SDLC-PLAN.md § 3.0.1 template. Include all must-read documents
  - **Input**: All Research Agent outputs, build/test status
  - **Output**: `docs/handoffs/{date}-research-to-test.md`
  - **Verify**: Handoff has all 6 required sections, build passes

### Phase 1 Completion Criteria
- [ ] All 7 package directories exist with package.json
- [ ] TypeScript configuration compiles without errors
- [ ] Vitest runs (even with no tests)
- [ ] ESLint configured and runs
- [ ] Feature spec has all 10 sections
- [ ] 4 ADRs created with evidence
- [ ] Handoff document complete

---

## Phase 2: Test Agent

**Trigger**: Research handoff exists at `docs/handoffs/*-research-to-test.md`  
**Output**: Unit tests for all packages, integration test structure, audit trail, handoff  
**Section**: AGENTIC-SDLC-PLAN.md § 3.2

### @tnt/core Tests

- [ ] **2.1** Create Transcript entity tests
  - **Context**: Test Transcript value object creation, validation (non-empty text, valid speaker, confidence 0-1), immutability
  - **Input**: Feature spec § Domain Model, ADR-003 for confidence thresholds
  - **Output**: `packages/core/tests/transcript.test.ts`
  - **Verify**: Tests cover happy path + 5 edge cases (empty text, invalid speaker, confidence bounds)

- [ ] **2.2** Create Call entity tests
  - **Context**: Test Call aggregate creation, lifecycle (active→completed), transcript association, timestamp validation
  - **Input**: Feature spec § Domain Model
  - **Output**: `packages/core/tests/call.test.ts`
  - **Verify**: Tests cover creation, state transitions, transcript adding

- [ ] **2.3** Create Speaker value object tests
  - **Context**: Test Speaker type ('caller' | 'agent'), validation, equality
  - **Input**: Feature spec § Domain Model
  - **Output**: `packages/core/tests/speaker.test.ts`
  - **Verify**: Tests for valid/invalid speaker values

### @tnt/siprec Tests

- [ ] **2.4** Create SIPREC SRS (Session Recording Server) tests
  - **Context**: Test SIPREC session handling, SDP parsing, RTP stream management. Use fakes for network
  - **Input**: ADR-004, RFC 7865/7866 requirements
  - **Output**: `packages/siprec/tests/srs.test.ts`
  - **Verify**: Tests cover session setup, metadata extraction, stream handling

- [ ] **2.5** Create SIPREC message parser tests
  - **Context**: Test SIP INVITE parsing, multipart MIME handling, metadata XML parsing
  - **Input**: RFC 7866 § 8 (Recording Metadata), ADR-004
  - **Output**: `packages/siprec/tests/parser.test.ts`
  - **Verify**: Tests parse sample SIPREC messages correctly

### @tnt/sbc-simulator Tests

- [ ] **2.6** Create SBC simulator tests
  - **Context**: Test mock SBC behavior for generating SIPREC sessions, audio stream simulation
  - **Input**: ADR-004, feature spec § Test Strategy
  - **Output**: `packages/sbc-simulator/tests/simulator.test.ts`
  - **Verify**: Simulator can generate valid SIPREC sessions

### @tnt/transcription Tests

- [ ] **2.7** Create TranscriptionService tests
  - **Context**: Test transcription interface, async processing, result handling. Use FakeWhisperAdapter
  - **Input**: Feature spec § API Contracts, ADR-003
  - **Output**: `packages/transcription/tests/service.test.ts`
  - **Verify**: Tests cover transcribe(), error handling, latency requirements

- [ ] **2.8** Create audio buffer handling tests
  - **Context**: Test audio format validation (PCM 16kHz), buffer chunking, resampling if needed
  - **Input**: ADR-003 audio requirements
  - **Output**: `packages/transcription/tests/audio.test.ts`
  - **Verify**: Tests validate format, reject invalid audio

### @tnt/server Tests

- [ ] **2.9** Create WebSocket handler tests
  - **Context**: Test WebSocket connection, message routing, error handling. Use ws mock
  - **Input**: Feature spec § API Contracts, ADR-002
  - **Output**: `packages/server/tests/websocket.test.ts`
  - **Verify**: Tests cover connect, disconnect, message types

- [ ] **2.10** Create message protocol tests
  - **Context**: Test message serialization/deserialization, schema validation (AudioChunk, TranscriptUpdate)
  - **Input**: AGENTIC-SDLC-PLAN.md § 6.2 message types
  - **Output**: `packages/server/tests/protocol.test.ts`
  - **Verify**: Tests validate all message types from spec

### @tnt/ui Tests

- [ ] **2.11** Create React component tests
  - **Context**: Test TranscriptPanel, TranscriptEntry, CallStatus with React Testing Library
  - **Input**: Feature spec § UI Components, AGENTIC-SDLC-PLAN.md § 6.4
  - **Output**: `packages/ui/tests/components.test.tsx`
  - **Verify**: Tests render components, verify props, test user interactions

### Handoff Tasks

- [ ] **2.12** Create Test Agent audit trail and handoff
  - **Context**: Document all test files created, coverage expectations, any blockers
  - **Input**: All tasks 2.1-2.11 outputs
  - **Output**: `docs/audit-trail/{date}-test-real-time-transcription.md`, `docs/handoffs/{date}-test-to-implement.md`
  - **Verify**: Audit trail complete, handoff has test inventory

### Phase 2 Completion Criteria
- [ ] Tests exist for all 7 packages
- [ ] Tests are syntactically valid (`pnpm test` runs without syntax errors)
- [ ] Tests fail appropriately (TDD red state)
- [ ] Every AC from feature spec has at least one test
- [ ] Handoff document lists all test files and their purposes

---

## Phase 3: Implementation Agent

**Trigger**: Test handoff exists at `docs/handoffs/*-test-to-implement.md`  
**Output**: Production code passing all tests, audit trail, handoff  
**Section**: AGENTIC-SDLC-PLAN.md § 3.3

### @tnt/core Implementation

- [ ] **3.1** Implement Transcript value object
  - **Context**: Immutable class with factory method, validation at construction. Fields: id, text, speaker, confidence, timestamp
  - **Input**: Tests from 2.1, feature spec § Domain Model
  - **Output**: `packages/core/src/transcript.ts`
  - **Verify**: All transcript.test.ts tests pass

- [ ] **3.2** Implement Call aggregate
  - **Context**: Entity with identity, lifecycle state machine, transcript collection management
  - **Input**: Tests from 2.2, feature spec § Domain Model
  - **Output**: `packages/core/src/call.ts`
  - **Verify**: All call.test.ts tests pass

- [ ] **3.3** Implement Speaker type and domain errors
  - **Context**: Speaker union type, TranscriptError, CallError custom error classes
  - **Input**: Tests from 2.3, feature spec § Error Scenarios
  - **Output**: `packages/core/src/speaker.ts`, `packages/core/src/errors.ts`
  - **Verify**: All speaker.test.ts tests pass

- [ ] **3.4** Create @tnt/core package exports
  - **Context**: Barrel file exporting all public types and classes
  - **Input**: Implementation files 3.1-3.3
  - **Output**: `packages/core/src/index.ts`
  - **Verify**: Package can be imported by other packages

### @tnt/siprec Implementation

- [ ] **3.5** Implement SIPREC SRS (Session Recording Server)
  - **Context**: Handle SIPREC INVITE, parse metadata, manage RTP streams. Emit events for new sessions/audio
  - **Input**: Tests from 2.4-2.5, ADR-004
  - **Output**: `packages/siprec/src/srs.ts`, `packages/siprec/src/parser.ts`
  - **Verify**: All siprec tests pass

- [ ] **3.6** Implement SIPREC types and exports
  - **Context**: TypeScript interfaces for SIPREC messages, session state, metadata
  - **Input**: RFC 7866 definitions, tests
  - **Output**: `packages/siprec/src/types.ts`, `packages/siprec/src/index.ts`
  - **Verify**: Types exported, no `any` types

### @tnt/sbc-simulator Implementation

- [ ] **3.7** Implement SBC simulator for testing
  - **Context**: Mock SBC that sends SIPREC sessions with configurable audio. For E2E testing
  - **Input**: Tests from 2.6, ADR-004
  - **Output**: `packages/sbc-simulator/src/simulator.ts`, `packages/sbc-simulator/src/index.ts`
  - **Verify**: Simulator tests pass, can generate SIPREC sessions

### @tnt/transcription Implementation

- [ ] **3.8** Implement TranscriptionService interface and factory
  - **Context**: Abstract interface with create() factory. Dependency injection ready
  - **Input**: Tests from 2.7, ADR-003
  - **Output**: `packages/transcription/src/service.ts`
  - **Verify**: Service interface tests pass

- [ ] **3.9** Implement Whisper adapter (or mock for MVP)
  - **Context**: Adapter implementing TranscriptionService using whisper.cpp or mock returning canned responses
  - **Input**: Tests from 2.7-2.8, ADR-003
  - **Output**: `packages/transcription/src/whisper-adapter.ts` or `packages/transcription/src/mock-adapter.ts`
  - **Verify**: Adapter tests pass, transcription works

- [ ] **3.10** Implement audio utilities
  - **Context**: Audio format validation, buffer handling, PCM conversion utilities
  - **Input**: Tests from 2.8
  - **Output**: `packages/transcription/src/audio.ts`, `packages/transcription/src/index.ts`
  - **Verify**: Audio tests pass

### @tnt/server Implementation

- [ ] **3.11** Implement WebSocket server
  - **Context**: ws-based server with connection management, heartbeat, error handling
  - **Input**: Tests from 2.9, ADR-002
  - **Output**: `packages/server/src/websocket.ts`
  - **Verify**: WebSocket tests pass

- [ ] **3.12** Implement message protocol handlers
  - **Context**: Message type handlers for AudioChunk→Transcription, TranscriptUpdate broadcast
  - **Input**: Tests from 2.10, feature spec § API Contracts
  - **Output**: `packages/server/src/handlers.ts`, `packages/server/src/protocol.ts`
  - **Verify**: Protocol tests pass

- [ ] **3.13** Create @tnt/server entry point
  - **Context**: Main server startup, configuration, graceful shutdown
  - **Input**: All server components
  - **Output**: `packages/server/src/index.ts`
  - **Verify**: Server starts and accepts connections

### @tnt/ui Implementation

- [ ] **3.14** Implement React components
  - **Context**: TranscriptPanel (container), TranscriptEntry (item), CallStatus (indicator) components
  - **Input**: Tests from 2.11, AGENTIC-SDLC-PLAN.md § 6.4
  - **Output**: `packages/ui/src/components/TranscriptPanel.tsx`, `TranscriptEntry.tsx`, `CallStatus.tsx`
  - **Verify**: Component tests pass

- [ ] **3.15** Implement WebSocket client hook
  - **Context**: React hook useWebSocket() for connection management, message handling, reconnection
  - **Input**: ADR-002, server message protocol
  - **Output**: `packages/ui/src/hooks/useWebSocket.ts`
  - **Verify**: Hook integrates with components

- [ ] **3.16** Create @tnt/ui app entry and exports
  - **Context**: Main App component, Vite configuration, package exports
  - **Input**: All UI components and hooks
  - **Output**: `packages/ui/src/App.tsx`, `packages/ui/src/index.ts`, `packages/ui/vite.config.ts`
  - **Verify**: `pnpm --filter @tnt/ui dev` starts dev server

### Handoff Tasks

- [ ] **3.17** Verify all tests pass and create handoff
  - **Context**: Run full test suite, verify coverage >80% for @tnt/core, create audit trail and handoff
  - **Input**: All implementation tasks 3.1-3.16
  - **Output**: `docs/audit-trail/{date}-implementation-real-time-transcription.md`, `docs/handoffs/{date}-implement-to-validate.md`
  - **Verify**: `pnpm test` 100% pass, `pnpm build` succeeds, no `any` types

### Phase 3 Completion Criteria
- [ ] All tests pass (100%)
- [ ] `pnpm tsc --noEmit` shows 0 errors
- [ ] `grep -r ": any" packages/` returns 0 matches
- [ ] `pnpm build` succeeds
- [ ] Coverage >80% for @tnt/core
- [ ] All packages export correctly

---

## Phase 4: Validation Agent

**Trigger**: Implementation handoff exists at `docs/handoffs/*-implement-to-validate.md`  
**Output**: Validation report with traceability matrix, audit trail, handoff  
**Section**: AGENTIC-SDLC-PLAN.md § 3.4

### Validation Tasks

- [ ] **4.1** Build requirements traceability matrix
  - **Context**: Map each AC from spec.md to: test file(s), test name(s), implementation file(s), line numbers
  - **Input**: Feature spec ACs, test files, implementation files
  - **Output**: Traceability matrix table in validation report
  - **Verify**: Every AC has test and implementation mapping

- [ ] **4.2** Execute and verify test coverage
  - **Context**: Run `pnpm test --coverage`, verify thresholds met, identify uncovered code paths
  - **Input**: All test files
  - **Output**: Coverage report, gap analysis if coverage <80%
  - **Verify**: Coverage meets thresholds, critical paths covered

- [ ] **4.3** Verify acceptance criteria implementation
  - **Context**: For each AC, read test, run test, read implementation, confirm behavior matches spec
  - **Input**: Feature spec § Acceptance Criteria, implementation code
  - **Output**: AC verification table with PASS/FAIL/PARTIAL status
  - **Verify**: All core ACs verified (4.1.1-4.1.4, 4.3.1-4.3.2)

- [ ] **4.4** Perform behavioral code review
  - **Context**: Review implementation for: spec compliance, edge case handling, error scenarios, performance concerns
  - **Input**: Implementation code, feature spec § Error Scenarios
  - **Output**: Code review findings in validation report
  - **Verify**: No critical gaps, issues documented

- [ ] **4.5** Check for loop patterns and technical debt
  - **Context**: Review for TODO/FIXME comments, repeated code patterns, incomplete implementations
  - **Input**: All source files
  - **Output**: Technical debt inventory
  - **Verify**: No blocking technical debt

- [ ] **4.6** Create validation report and handoff
  - **Context**: Complete validation report per AGENTIC-SDLC-PLAN.md § 3.4.4 template
  - **Input**: Tasks 4.1-4.5 outputs
  - **Output**: `docs/audit-trail/{date}-validation-real-time-transcription.md`, `docs/handoffs/{date}-validate-to-security.md`
  - **Verify**: Report has all required sections, verdict clear

### Phase 4 Completion Criteria
- [ ] Traceability matrix complete
- [ ] All ACs verified or gaps documented
- [ ] Coverage thresholds met
- [ ] No critical gaps blocking release
- [ ] Handoff document complete

---

## Phase 5: Security Agent

**Trigger**: Validation handoff exists at `docs/handoffs/*-validate-to-security.md`  
**Output**: Security assessment, threat model, audit trail, handoff  
**Section**: AGENTIC-SDLC-PLAN.md § 3.5

### Security Analysis Tasks

- [ ] **5.1** Run automated security scans
  - **Context**: Execute `pnpm audit`, document all vulnerabilities by severity
  - **Input**: package.json files, node_modules
  - **Output**: Dependency audit results in security report
  - **Verify**: Audit completes, results documented

- [ ] **5.2** Check for secrets and credentials
  - **Context**: Scan codebase for hardcoded secrets, API keys, passwords. Use pattern matching
  - **Input**: All source files
  - **Output**: Secret scan results (should be clean)
  - **Verify**: No secrets found in code

- [ ] **5.3** Review input validation coverage
  - **Context**: Identify all entry points (WebSocket messages, API inputs), verify validation exists
  - **Input**: Server handlers, message parsers
  - **Output**: Entry point inventory with validation status
  - **Verify**: All entry points have input validation

- [ ] **5.4** Check for dangerous patterns
  - **Context**: Scan for eval(), Function(), dangerouslySetInnerHTML, unsanitized user input
  - **Input**: All source files
  - **Output**: Pattern scan results
  - **Verify**: No dangerous patterns found

- [ ] **5.5** Create STRIDE threat model
  - **Context**: Analyze WebSocket interface and SIPREC interface for Spoofing, Tampering, Repudiation, Information Disclosure, DoS, Elevation
  - **Input**: Architecture from ADRs, feature spec § API Contracts
  - **Output**: Threat model table with mitigations
  - **Verify**: All interfaces analyzed

- [ ] **5.6** Create security report
  - **Context**: Full security assessment per AGENTIC-SDLC-PLAN.md § 3.5.3 template
  - **Input**: Tasks 5.1-5.5 outputs
  - **Output**: `docs/security/vulnerability-assessment.md`
  - **Verify**: Report has all sections, verdict clear

- [ ] **5.7** Create security audit trail and handoff
  - **Context**: Document security review activities and findings
  - **Input**: Security report
  - **Output**: `docs/audit-trail/{date}-security-real-time-transcription.md`, `docs/handoffs/{date}-security-to-integration.md`
  - **Verify**: Handoff has security status, any remediation needed

### Phase 5 Completion Criteria
- [ ] No critical/high vulnerabilities (or remediated)
- [ ] No secrets in code
- [ ] All entry points validated
- [ ] Threat model complete
- [ ] Handoff document complete

---

## Phase 6: Integration Agent

**Trigger**: Security handoff exists at `docs/handoffs/*-security-to-integration.md`  
**Output**: E2E tests, integration verification, updated README, handoff  
**Section**: AGENTIC-SDLC-PLAN.md § 3.6

### Integration Testing Tasks

- [ ] **6.1** Create end-to-end transcription flow test
  - **Context**: Test complete flow: SBC simulator → SIPREC → Transcription → WebSocket → UI
  - **Input**: All packages, feature spec § User Stories
  - **Output**: `tests/e2e/transcription-flow.test.ts`
  - **Verify**: E2E test exercises full stack

- [ ] **6.2** Create WebSocket integration tests
  - **Context**: Test real WebSocket connections between server and UI packages
  - **Input**: @tnt/server, @tnt/ui packages
  - **Output**: `tests/integration/websocket.test.ts`
  - **Verify**: Client-server communication works

- [ ] **6.3** Create SIPREC integration tests
  - **Context**: Test SBC simulator → SIPREC SRS → audio extraction pipeline
  - **Input**: @tnt/sbc-simulator, @tnt/siprec packages
  - **Output**: `tests/integration/siprec.test.ts`
  - **Verify**: SIPREC sessions processed correctly

- [ ] **6.4** Verify cross-package dependencies
  - **Context**: Check for circular dependencies, verify import paths work
  - **Input**: All packages
  - **Output**: Dependency analysis in integration report
  - **Verify**: No circular dependencies, imports resolve

### Smoke Testing Tasks

- [ ] **6.5** Perform manual smoke test
  - **Context**: Start all services, connect UI, trigger test call, verify transcript appears
  - **Input**: All packages running
  - **Output**: Smoke test documentation with screenshots/logs
  - **Verify**: End-to-end flow works manually

- [ ] **6.6** Verify performance targets
  - **Context**: Measure transcription latency, verify <2 second display time
  - **Input**: Running system, spec.md § 5.1
  - **Output**: Performance measurements in integration report
  - **Verify**: Latency within spec

### Documentation Tasks

- [ ] **6.7** Update README with verified instructions
  - **Context**: Test all README commands, update any incorrect instructions
  - **Input**: Current README.md
  - **Output**: Updated README.md with working instructions
  - **Verify**: Fresh clone + README instructions work

- [ ] **6.8** Create integration report and handoff
  - **Context**: Complete integration report per AGENTIC-SDLC-PLAN.md § 3.6.2 template
  - **Input**: Tasks 6.1-6.7 outputs
  - **Output**: `docs/audit-trail/{date}-integration-real-time-transcription.md`, `docs/handoffs/{date}-integration-to-documentation.md`
  - **Verify**: All E2E tests pass, smoke test documented

### Phase 6 Completion Criteria
- [ ] E2E tests pass
- [ ] Integration tests pass
- [ ] No circular dependencies
- [ ] Smoke test documented
- [ ] Performance targets met
- [ ] README instructions verified

---

## Phase 7: Documentation Agent

**Trigger**: Integration handoff exists at `docs/handoffs/*-integration-to-documentation.md`  
**Output**: Verified documentation, final completion report  
**Section**: AGENTIC-SDLC-PLAN.md § 3.7

### Documentation Verification Tasks

- [ ] **7.1** Verify README commands work
  - **Context**: Execute each README command in fresh environment: install, build, test, dev
  - **Input**: README.md
  - **Output**: Command verification table in doc report
  - **Verify**: All commands work as documented

- [ ] **7.2** Verify API documentation matches implementation
  - **Context**: Compare documented WebSocket messages, types with actual code
  - **Input**: API docs, TypeScript interfaces
  - **Output**: API accuracy report
  - **Verify**: Docs match code exactly

- [ ] **7.3** Verify ADRs are current
  - **Context**: For each ADR, confirm decision is still implemented as documented
  - **Input**: ADR files, implementation code
  - **Output**: ADR currency check in doc report
  - **Verify**: All ADRs reflect current implementation

- [ ] **7.4** Verify feature spec accuracy
  - **Context**: Compare feature spec with implementation, note any divergence
  - **Input**: Feature spec, implementation code
  - **Output**: Spec accuracy report
  - **Verify**: Spec matches what was built

- [ ] **7.5** Create final documentation report
  - **Context**: Complete documentation verification report, update any inaccurate docs
  - **Input**: Tasks 7.1-7.4 outputs
  - **Output**: `docs/audit-trail/{date}-documentation-real-time-transcription.md`
  - **Verify**: All docs verified or updated

- [ ] **7.6** Mark workflow complete
  - **Context**: Create final handoff document marking workflow complete, ready for merge
  - **Input**: All phase outputs
  - **Output**: `docs/handoffs/{date}-workflow-complete.md`, update this TODO status
  - **Verify**: All phases complete, all criteria met

### Phase 7 Completion Criteria
- [ ] All README commands verified
- [ ] API docs match implementation
- [ ] All ADRs current
- [ ] Feature spec accurate
- [ ] All audit trails complete
- [ ] Workflow marked COMPLETE

---

## Acceptance Criteria Checklist

> From spec.md Section 4.0 (User Stories & Functional Requirements)

### 4.1 Core Transcription

| AC ID | Requirement | Test | Implementation | Verified |
|-------|-------------|------|----------------|----------|
| AC-4.1.1 | Transcript appears in browser UI | | | ⬜ |
| AC-4.1.2 | Caller and agent speech labeled | | | ⬜ |
| AC-4.1.3 | Text appears within 2 seconds | | | ⬜ |
| AC-4.1.4 | WER ≤ 20% (goal: 17%) | | | ⬜ |

### 4.2 Language Detection (Future - Out of Scope for MVP)

| AC ID | Requirement | Status |
|-------|-------------|--------|
| AC-4.2.1 | Language detection >80% accuracy | OUT OF SCOPE |
| AC-4.2.2 | Detection within 8 seconds | OUT OF SCOPE |
| AC-4.2.3 | Visual indicator in UI | OUT OF SCOPE |

### 4.3 UI Requirements

| AC ID | Requirement | Test | Implementation | Verified |
|-------|-------------|------|----------------|----------|
| AC-4.3.1 | Standalone browser window | | | ⬜ |
| AC-4.3.2 | Architecturally independent | | | ⬜ |

### 4.4 SIPREC Integration (MVP Addition)

| AC ID | Requirement | Test | Implementation | Verified |
|-------|-------------|------|----------------|----------|
| AC-4.4.1 | SIPREC session handling (RFC 7866) | | | ⬜ |
| AC-4.4.2 | Audio extraction from RTP streams | | | ⬜ |
| AC-4.4.3 | Fan-out proxy for multi-consumer | | | ⬜ |

---

## Success Criteria Checklist

> From constitution.md and spec.md Section 5.0

### Code Quality (constitution.md)

- [ ] TypeScript strict mode enabled
- [ ] No `any` types in codebase
- [ ] All tests passing
- [ ] Coverage >80% for domain logic (@tnt/core)
- [ ] No ESLint errors
- [ ] Clean Code principles followed

### Performance (spec.md § 5.1)

- [ ] Transcription display < 2 seconds
- [ ] WebSocket transport < 100ms overhead

### Security (constitution.md § 4)

- [ ] No critical security vulnerabilities
- [ ] No secrets in code
- [ ] All inputs validated

### Documentation (constitution.md § 6)

- [ ] All documentation accurate
- [ ] All ADRs have rationale
- [ ] All handoffs complete
- [ ] Audit trail complete

---

## Notes

- **MVP Scope**: Real-time transcription with SIPREC integration
- **Packages**: core, siprec, siprec-proxy, sbc-simulator, transcription, server, ui (7 total)
- **Out of Scope**: Language detection, translation, radio traffic, video
- **Key Dependencies**: Whisper.cpp for local transcription (no API keys), SIPREC for NG911 compatibility

---

## Context Clearing Protocol

Each task in this TODO is **self-contained** with:
- **Context**: What this task is about and why
- **Input**: What documents/files to read before starting
- **Output**: What files/artifacts to produce
- **Verify**: How to confirm the task is complete

When starting a new task or phase:
1. Read the task's Context, Input, Output, Verify sections
2. Read any referenced handoff document
3. Execute the task
4. Verify completion criteria
5. Update this TODO with completion status

---

*This TODO is the single source of truth for workflow progress. Each agent MUST update this file.*
