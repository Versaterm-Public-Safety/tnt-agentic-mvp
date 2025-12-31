# TnT MVP Implementation TODO

> Master task tracker for the agentic SDLC workflow
> 
> **Status**: IN_PROGRESS
> **Current Phase**: Planning Phase
> **Last Updated**: 2025-12-31T21:00:00Z

---

## Progress Summary

| Phase | Tasks | Completed | Status |
|-------|-------|-----------|--------|
| Planning | 4 | 4 | ✅ COMPLETE |
| Research Agent | 6 | 0 | ⏳ PENDING |
| Test Agent | 6 | 0 | ⏳ PENDING |
| Implementation Agent | 7 | 0 | ⏳ PENDING |
| Validation Agent | 5 | 0 | ⏳ PENDING |
| Security Agent | 6 | 0 | ⏳ PENDING |
| Integration Agent | 6 | 0 | ⏳ PENDING |
| Documentation Agent | 5 | 0 | ⏳ PENDING |
| **TOTAL** | **45** | **4** | **9%** |

---

## Phase 0: Planning ✅

- [x] Read spec.md (PRD)
- [x] Read constitution.md (project rules)
- [x] Generate comprehensive TODO list
- [x] Validate acceptance criteria coverage

---

## Phase 1: Research Agent

**Trigger**: Planning complete  
**Output**: Feature specs, ADRs, audit trail, handoff  
**Section**: AGENTIC-SDLC-PLAN.md § 3.1

### Tasks

- [ ] **1.1** Decompose PRD into requirements (FR/NFR/constraints/assumptions)
- [ ] **1.2** Research technical approaches with evidence
- [ ] **1.3** Create feature spec: `specs/features/real-time-transcription.md`
- [ ] **1.4** Create ADRs (minimum 3):
  - [ ] ADR-001: Monorepo with Turborepo
  - [ ] ADR-002: WebSocket for real-time transport
  - [ ] ADR-003: Whisper.cpp for local transcription
- [ ] **1.5** Create audit trail: `docs/audit-trail/{date}-research-real-time-transcription.md`
- [ ] **1.6** Create handoff: `docs/handoffs/{date}-research-to-test.md`

### Acceptance Criteria for Phase
- [ ] Feature spec has all 10 required sections
- [ ] ADRs have evidence links
- [ ] All ACs are in Given/When/Then format

---

## Phase 2: Test Agent

**Trigger**: Research handoff exists  
**Output**: Unit tests, integration test structure, audit trail, handoff  
**Section**: AGENTIC-SDLC-PLAN.md § 3.2

### Tasks

- [ ] **2.1** Create @tnt/core domain tests:
  - [ ] Transcript entity tests (creation, validation, immutability)
  - [ ] Call entity tests (lifecycle, transcript association)
  - [ ] Speaker value object tests
- [ ] **2.2** Create @tnt/transcription tests:
  - [ ] TranscriptionService tests
  - [ ] Whisper adapter tests (with fakes)
- [ ] **2.3** Create @tnt/server tests:
  - [ ] WebSocket handler tests
  - [ ] Message protocol tests
- [ ] **2.4** Create integration test structure in `tests/integration/`
- [ ] **2.5** Create audit trail: `docs/audit-trail/{date}-test-real-time-transcription.md`
- [ ] **2.6** Create handoff: `docs/handoffs/{date}-test-to-implement.md`

### Acceptance Criteria for Phase
- [ ] Every spec AC has at least one test
- [ ] Tests are syntactically valid (may fail - TDD red)
- [ ] Test file structure follows convention

---

## Phase 3: Implementation Agent

**Trigger**: Test handoff exists  
**Output**: Production code, all tests passing, audit trail, handoff  
**Section**: AGENTIC-SDLC-PLAN.md § 3.3

### Tasks

- [ ] **3.1** Implement @tnt/core domain entities:
  - [ ] Transcript class with validation
  - [ ] Call class with lifecycle management
  - [ ] Speaker type
  - [ ] Error types (TranscriptError, CallError)
- [ ] **3.2** Implement @tnt/transcription service:
  - [ ] TranscriptionService interface
  - [ ] Whisper adapter (or mock for MVP)
  - [ ] Audio buffer handling
- [ ] **3.3** Implement @tnt/server WebSocket:
  - [ ] WebSocket server setup
  - [ ] Message handlers (audio, transcript)
  - [ ] Connection management
- [ ] **3.4** Implement @tnt/ui React components:
  - [ ] TranscriptPanel component
  - [ ] TranscriptEntry component
  - [ ] CallStatus component
  - [ ] WebSocket client hook
- [ ] **3.5** Verify all tests pass: `pnpm test`
- [ ] **3.6** Create audit trail: `docs/audit-trail/{date}-implementation-real-time-transcription.md`
- [ ] **3.7** Create handoff: `docs/handoffs/{date}-implement-to-validate.md`

### Acceptance Criteria for Phase
- [ ] All tests pass (100%)
- [ ] 0 TypeScript errors (`pnpm tsc --noEmit`)
- [ ] 0 `any` types
- [ ] Build succeeds (`pnpm build`)
- [ ] Coverage >80% for @tnt/core

---

## Phase 4: Validation Agent

**Trigger**: Implementation handoff exists  
**Output**: Validation report, gap analysis, audit trail, handoff  
**Section**: AGENTIC-SDLC-PLAN.md § 3.4

### Tasks

- [ ] **4.1** Build requirements traceability matrix:
  - [ ] Map each AC to test(s)
  - [ ] Map each AC to implementation code
  - [ ] Verify all ACs covered
- [ ] **4.2** Run and verify all tests: `pnpm test --coverage`
- [ ] **4.3** Verify acceptance criteria (see checklist below)
- [ ] **4.4** Create validation report: `docs/audit-trail/{date}-validation-real-time-transcription.md`
- [ ] **4.5** Create handoff: `docs/handoffs/{date}-validate-to-security.md`

### Acceptance Criteria for Phase
- [ ] All ACs have verified implementation
- [ ] No critical gaps identified
- [ ] All tests passing

---

## Phase 5: Security Agent

**Trigger**: Validation handoff exists  
**Output**: Security report, threat model, audit trail, handoff  
**Section**: AGENTIC-SDLC-PLAN.md § 3.5

### Tasks

- [ ] **5.1** Run dependency audit: `pnpm audit`
- [ ] **5.2** Check for secrets in code:
  - [ ] Run secret scan
  - [ ] Verify no hardcoded credentials
- [ ] **5.3** Review input validation:
  - [ ] All entry points identified
  - [ ] All inputs validated
- [ ] **5.4** Create threat model (STRIDE analysis)
- [ ] **5.5** Create security report: `docs/security/vulnerability-assessment.md`
- [ ] **5.6** Create handoff: `docs/handoffs/{date}-security-to-integration.md`

### Acceptance Criteria for Phase
- [ ] No critical/high vulnerabilities
- [ ] All entry points documented
- [ ] No secrets in code
- [ ] Threat model complete

---

## Phase 6: Integration Agent

**Trigger**: Security handoff exists  
**Output**: E2E tests, integration report, updated README, handoff  
**Section**: AGENTIC-SDLC-PLAN.md § 3.6

### Tasks

- [ ] **6.1** Create E2E tests in `tests/e2e/`:
  - [ ] Full transcription flow test
  - [ ] WebSocket connection test
  - [ ] Error recovery test
- [ ] **6.2** Verify cross-package integration:
  - [ ] Check for circular dependencies
  - [ ] Verify package imports work
- [ ] **6.3** Run smoke tests:
  - [ ] Start server
  - [ ] Connect UI
  - [ ] Verify transcript flow
- [ ] **6.4** Update README with verified setup instructions
- [ ] **6.5** Create integration report: `docs/audit-trail/{date}-integration-real-time-transcription.md`
- [ ] **6.6** Create handoff: `docs/handoffs/{date}-integration-to-documentation.md`

### Acceptance Criteria for Phase
- [ ] All E2E tests pass
- [ ] No circular dependencies
- [ ] Smoke test documented
- [ ] README commands verified

---

## Phase 7: Documentation Agent

**Trigger**: Integration handoff exists  
**Output**: Verified documentation, final report  
**Section**: AGENTIC-SDLC-PLAN.md § 3.7

### Tasks

- [ ] **7.1** Verify README commands work:
  - [ ] `pnpm install` - dependencies install
  - [ ] `pnpm build` - build succeeds
  - [ ] `pnpm test` - tests pass
  - [ ] `pnpm dev` - server starts
- [ ] **7.2** Verify API docs match implementation
- [ ] **7.3** Verify ADRs are current (decisions still valid)
- [ ] **7.4** Create final documentation report: `docs/audit-trail/{date}-documentation-real-time-transcription.md`
- [ ] **7.5** Mark workflow complete

### Acceptance Criteria for Phase
- [ ] All README commands work
- [ ] API docs match code
- [ ] ADRs current
- [ ] All audit trails complete

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

- **MVP Scope**: Real-time transcription only (no translation for MVP)
- **Out of Scope**: Language detection, translation, radio traffic, video
- **Key Dependency**: Whisper.cpp for local transcription (no API keys)

---

*This TODO is the single source of truth for workflow progress. Each agent MUST update this file.*
