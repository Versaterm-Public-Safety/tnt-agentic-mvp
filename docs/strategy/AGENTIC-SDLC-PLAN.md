# Agentic SDLC Implementation Plan

## TnT (Transcription and Translation) MVP

**Created**: 2025-12-31
**Purpose**: Demonstrate a working agentic SDLC using Spec Kit within the GitHub Copilot ecosystem
**Target Audience**: Developers skeptical of AI-assisted development who need confidence in AI-produced work
**Timeline**: 1 week

---

## 1. Project Overview

### 1.1 Vision

Build a functional MVP demonstrating real-time 9-1-1 call transcription that proves:
1. Agentic SDLC is workable and valuable
2. AI-produced code is auditable and trustworthy
3. The workflow catches issues a competent human would catch
4. Documentation and artifacts provide high confidence in code quality

### 1.2 MVP Thin Slice

**Feature**: Real-time transcription display (simplest end-to-end value)

```
Audio Input → Whisper (local) → WebSocket → React UI
   (mock)      (real AI)         (real)      (real)
```

**Why this slice**:
- Delivers tangible value from the PRD
- Exercises all architectural layers
- Demonstrates AI integration without external API keys
- Completable in 1 week

### 1.3 Technology Decisions

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Language | TypeScript | Type safety, excellent tooling, wide adoption |
| Monorepo | Turborepo | Fast builds, easy auditability, single git history |
| UI | React + Vite | Industry standard, fast dev experience |
| Testing | Vitest + Testing Library | Fast, modern, Khorikov-compatible |
| Transcription | Whisper.cpp (local) | No API keys needed, runs locally |
| Real-time | WebSocket | Standard for streaming data |
| Package Manager | pnpm | Fast, disk-efficient, workspace support |

---

## 2. Repository Structure

```
tnt-agentic-mvp/
├── .github/
│   ├── workflows/                    # CI/CD with agent handoff gates
│   │   ├── 1-research-agent.yml
│   │   ├── 2-test-agent.yml
│   │   ├── 3-implementation-agent.yml
│   │   ├── 4-validation-agent.yml
│   │   ├── 5-security-agent.yml
│   │   └── 6-integration-agent.yml
│   └── copilot-instructions/         # Agent-specific instructions
│       ├── research-agent.md
│       ├── test-agent.md
│       ├── implementation-agent.md
│       ├── validation-agent.md
│       ├── security-agent.md
│       └── integration-agent.md
├── docs/
│   ├── architecture/                 # ADRs (Architecture Decision Records)
│   │   └── adr-template.md
│   ├── design/                       # Design docs with rationale
│   ├── audit-trail/                  # Agent work logs
│   └── strategy/                     # This plan and related docs
├── specs/
│   ├── spec.md                       # Master specification (from PRD)
│   ├── features/                     # Feature-level specs
│   │   └── real-time-transcription.md
│   └── tasks/                        # Agent task assignments
├── packages/
│   ├── core/                         # Domain models, business logic
│   │   ├── src/
│   │   ├── tests/
│   │   └── package.json
│   ├── transcription/                # Whisper integration service
│   │   ├── src/
│   │   ├── tests/
│   │   └── package.json
│   ├── server/                       # WebSocket server
│   │   ├── src/
│   │   ├── tests/
│   │   └── package.json
│   └── ui/                           # React browser UI
│       ├── src/
│       ├── tests/
│       └── package.json
├── tests/
│   ├── integration/                  # Service boundary tests
│   └── e2e/                          # End-to-end tests
├── turbo.json                        # Turborepo configuration
├── package.json                      # Root package.json
├── pnpm-workspace.yaml               # Workspace definition
├── tsconfig.base.json                # Shared TypeScript config
└── README.md                         # Project documentation
```

---

## 3. Agent Definitions

### 3.1 Agent 1: Research Agent

**Purpose**: Analyze requirements, research best practices, create detailed specifications

**Responsibilities**:
- Read and understand the PRD (`tnt.prd`)
- Research implementation approaches (web search)
- Create feature specifications in `specs/features/`
- Write Architecture Decision Records (ADRs)
- Document rationale with external references

**Outputs**:
- `specs/features/{feature-name}.md` - Detailed feature spec
- `docs/architecture/adr-{number}-{title}.md` - Decision records
- `docs/audit-trail/{date}-research-{feature}.md` - Work log

**Branch**: `agent/research/{feature-name}`

**CI Gate**: Spec completeness check, markdown lint

---

### 3.2 Agent 2: Test Agent

**Purpose**: Create comprehensive test suites following Khorikov's principles

**Responsibilities**:
- Read feature specifications
- Create unit tests with high isolation
- Define test doubles (mocks, stubs, fakes)
- Ensure tests are deterministic and fast
- Follow AAA pattern (Arrange-Act-Assert)

**Testing Principles** (from Khorikov):
- Test behavior, not implementation
- Isolate domain logic from external dependencies
- Use test doubles at architectural boundaries only
- Prefer state verification over interaction verification
- One assertion concept per test

**Outputs**:
- `packages/{package}/tests/*.test.ts` - Unit tests
- `tests/integration/*.test.ts` - Integration tests
- `docs/audit-trail/{date}-test-{feature}.md` - Work log

**Branch**: `agent/test/{feature-name}`

**CI Gate**: Tests must be syntactically valid (can fail execution since no implementation yet)

---

### 3.3 Agent 3: Implementation Agent

**Purpose**: Write production code that passes all tests

**Responsibilities**:
- Implement code to pass existing tests (TDD)
- Follow Clean Code principles (Robert C. Martin)
- Apply DDD patterns as domain emerges
- Write clear, self-documenting code
- Minimal comments (only for non-obvious logic)

**Clean Code Principles**:
- Meaningful names
- Small functions (do one thing)
- No side effects
- DRY (Don't Repeat Yourself)
- Dependency injection for testability

**Outputs**:
- `packages/{package}/src/*.ts` - Production code
- `docs/audit-trail/{date}-implementation-{feature}.md` - Work log

**Branch**: `agent/implement/{feature-name}`

**CI Gate**: All tests pass, lint passes, build succeeds

---

### 3.4 Agent 4: Validation Agent

**Purpose**: Verify implementation meets requirements exactly, no shortcuts

**Responsibilities**:
- Compare implementation against spec line-by-line
- Check all acceptance criteria are met
- Identify any gaps or deviations
- Verify edge cases are handled
- Ensure no TODO/FIXME left unresolved

**Validation Checklist**:
- [ ] All acceptance criteria from spec implemented
- [ ] Error handling complete
- [ ] Edge cases covered
- [ ] No hardcoded values that should be configurable
- [ ] No commented-out code
- [ ] No `any` types in TypeScript
- [ ] All public APIs documented

**Outputs**:
- `docs/audit-trail/{date}-validation-{feature}.md` - Validation report
- Issues/comments on PR if gaps found

**Branch**: Works on existing implementation branch, creates validation commit

**CI Gate**: Validation report generated, no critical gaps

---

### 3.5 Agent 5: Security Agent

**Purpose**: Identify security vulnerabilities before production

**Responsibilities**:
- Run static analysis security testing (SAST)
- Audit dependencies for known vulnerabilities
- Check for common security anti-patterns
- Review authentication/authorization (if applicable)
- Verify no secrets in codebase

**Security Checks**:
- `npm audit` - Dependency vulnerabilities
- ESLint security plugins
- Input validation review
- XSS prevention (React handles most)
- No `eval()`, `Function()`, or dynamic code execution
- No hardcoded credentials or API keys
- HTTPS enforcement
- Content Security Policy headers

**Outputs**:
- `docs/audit-trail/{date}-security-{feature}.md` - Security report
- `docs/security/vulnerability-assessment.md` - Overall assessment

**Branch**: Works on existing branch, creates security commit

**CI Gate**: No high/critical vulnerabilities, security report complete

---

### 3.6 Agent 6: Integration Agent

**Purpose**: Ensure components work together, finalize for merge

**Responsibilities**:
- Write/run end-to-end tests
- Verify all packages integrate correctly
- Update documentation
- Ensure README is current
- Create final PR for merge to main

**Integration Checklist**:
- [ ] E2E tests pass
- [ ] All packages build together
- [ ] Documentation complete
- [ ] README updated with setup instructions
- [ ] CHANGELOG updated
- [ ] No merge conflicts with main

**Outputs**:
- `tests/e2e/*.test.ts` - E2E tests
- Updated `README.md`
- `docs/audit-trail/{date}-integration-{feature}.md` - Work log

**Branch**: Merges feature branch to `main`

**CI Gate**: Full test suite passes, E2E passes, docs complete

---

## 4. Workflow Orchestration

### 4.1 Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTOMATED PIPELINE                           │
│  (Manual trigger option via workflow_dispatch)                  │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────┐    PR + CI Gate    ┌───────────────┐
│ 1. RESEARCH   │──────────────────▶ │ 2. TEST       │
│    AGENT      │                    │    AGENT      │
│               │                    │               │
│ • Web search  │                    │ • Read specs  │
│ • Create spec │                    │ • Write tests │
│ • ADR docs    │                    │ • TDD setup   │
└───────────────┘                    └───────────────┘
                                            │
        ┌───────────────────────────────────┘
        ▼
┌───────────────┐    PR + CI Gate    ┌───────────────┐
│ 3. IMPLEMENT  │──────────────────▶ │ 4. VALIDATE   │
│    AGENT      │                    │    AGENT      │
│               │                    │               │
│ • Write code  │                    │ • Req check   │
│ • Pass tests  │                    │ • No shortcuts│
│ • Clean code  │                    │ • Gap report  │
└───────────────┘                    └───────────────┘
                                            │
        ┌───────────────────────────────────┘
        ▼
┌───────────────┐    PR + CI Gate    ┌───────────────┐
│ 5. SECURITY   │──────────────────▶ │ 6. INTEGRATE  │
│    AGENT      │                    │    AGENT      │
│               │                    │               │
│ • SAST scan   │                    │ • E2E tests   │
│ • Dep audit   │                    │ • Merge to    │
│ • Vuln report │                    │   main        │
└───────────────┘                    └───────────────┘
```

### 4.2 GitHub Actions Configuration

Each agent workflow will:
1. Trigger automatically on previous stage completion OR manually via `workflow_dispatch`
2. Check out code
3. Load agent-specific instructions from `.github/copilot-instructions/`
4. Execute agent tasks
5. Create commits with `[agent-name]` prefix
6. Open/update PR
7. Run CI checks
8. Signal next stage on success

### 4.3 Branch Strategy

```
main
 │
 └── agent/research/real-time-transcription
      │
      └── agent/test/real-time-transcription
           │
           └── agent/implement/real-time-transcription
                │
                └── (validation, security commits on same branch)
                     │
                     └── PR merge to main
```

### 4.4 Commit Convention

```
[{agent-name}] {type}: {description}

Types: feat, test, docs, fix, refactor, security

Examples:
[research-agent] docs: add ADR for Whisper integration
[test-agent] test: add unit tests for TranscriptionService
[implementation-agent] feat: implement WebSocket streaming
[validation-agent] docs: add validation report
[security-agent] security: fix XSS vulnerability in transcript display
[integration-agent] docs: update README with setup instructions
```

---

## 5. Week Schedule

### Day 1-2: Foundation + Research Agent

**Tasks**:
- [ ] Initialize monorepo with Turborepo
- [ ] Set up TypeScript configuration
- [ ] Configure Vitest
- [ ] Create directory structure
- [ ] Research Agent: Create feature spec for real-time transcription
- [ ] Research Agent: Write ADRs for key decisions
- [ ] Set up GitHub Actions workflows

### Day 3: Test Agent

**Tasks**:
- [ ] Test Agent: Create unit tests for core domain
- [ ] Test Agent: Create unit tests for transcription service
- [ ] Test Agent: Create integration test structure
- [ ] Verify tests are syntactically valid

### Day 4: Implementation Agent

**Tasks**:
- [ ] Implementation Agent: Implement core domain models
- [ ] Implementation Agent: Implement Whisper integration
- [ ] Implementation Agent: Implement WebSocket server
- [ ] Implementation Agent: Implement React UI
- [ ] All tests passing

### Day 5: Validation + Security Agents

**Tasks**:
- [ ] Validation Agent: Review all acceptance criteria
- [ ] Validation Agent: Create gap report
- [ ] Security Agent: Run security scans
- [ ] Security Agent: Create vulnerability assessment
- [ ] Fix any identified issues

### Day 6: Integration Agent

**Tasks**:
- [ ] Integration Agent: Write E2E tests
- [ ] Integration Agent: Verify full stack works
- [ ] Integration Agent: Update all documentation
- [ ] Integration Agent: Final PR review

### Day 7: Buffer/Polish

**Tasks**:
- [ ] Address any outstanding issues
- [ ] Polish documentation
- [ ] Create demo script
- [ ] Final review and merge

---

## 6. Technical Specifications

### 6.1 Whisper Integration

**Library**: `whisper.cpp` via `whisper-node` npm package

**Why Whisper**:
- Open source, no API keys required
- Runs locally for privacy
- High accuracy transcription
- Supports multiple languages (future translation feature)

**Configuration**:
```typescript
interface WhisperConfig {
  modelPath: string;      // Path to Whisper model file
  language: 'en';         // Initial: English only
  sampleRate: 16000;      // Audio sample rate
  channels: 1;            // Mono audio
}
```

### 6.2 WebSocket Protocol

**Message Types**:
```typescript
// Client -> Server
interface AudioChunk {
  type: 'audio';
  data: ArrayBuffer;
  timestamp: number;
}

// Server -> Client
interface TranscriptUpdate {
  type: 'transcript';
  text: string;
  speaker: 'caller' | 'agent';
  timestamp: number;
  isFinal: boolean;
}

interface ErrorMessage {
  type: 'error';
  code: string;
  message: string;
}
```

### 6.3 Domain Model (Initial)

```typescript
// Core domain entities (will be refined by agents)
interface Call {
  id: string;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed';
  transcripts: Transcript[];
}

interface Transcript {
  id: string;
  callId: string;
  text: string;
  speaker: Speaker;
  timestamp: Date;
  confidence: number;
}

type Speaker = 'caller' | 'agent';
```

### 6.4 UI Components

```
TranscriptionApp
├── Header
│   └── CallStatus (active/inactive indicator)
├── TranscriptPanel
│   ├── TranscriptEntry (caller)
│   └── TranscriptEntry (agent)
└── ControlPanel
    ├── StartButton
    └── StopButton
```

---

## 7. Documentation Requirements

### 7.1 Required Documents

| Document | Location | Purpose |
|----------|----------|---------|
| README.md | Root | Project overview, setup, usage |
| ARCHITECTURE.md | docs/ | System architecture overview |
| ADRs | docs/architecture/ | Decision records with rationale |
| API.md | docs/ | WebSocket API documentation |
| TESTING.md | docs/ | Testing strategy and patterns |
| SECURITY.md | docs/security/ | Security considerations |
| CONTRIBUTING.md | Root | How to contribute |
| Audit Logs | docs/audit-trail/ | Agent work logs |

### 7.2 ADR Template

```markdown
# ADR-{number}: {Title}

## Status
{Proposed | Accepted | Deprecated | Superseded}

## Context
{What is the issue we're addressing?}

## Decision
{What is the change we're making?}

## Rationale
{Why this decision? What alternatives were considered?}

## References
- {Link to book, article, or documentation}
- {Link to relevant standard or best practice}

## Consequences
{What are the positive and negative outcomes?}
```

### 7.3 Audit Trail Template

```markdown
# Agent Work Log: {Agent Name}

## Date: {YYYY-MM-DD}
## Feature: {Feature Name}
## Branch: {Branch Name}

## Tasks Completed
- [ ] Task 1
- [ ] Task 2

## Decisions Made
| Decision | Rationale | Alternatives Considered |
|----------|-----------|------------------------|
| ... | ... | ... |

## Files Created/Modified
- `path/to/file.ts` - Description
- `path/to/file.ts` - Description

## Issues Encountered
- Issue 1: Description and resolution
- Issue 2: Description and resolution

## Verification
- [ ] All acceptance criteria addressed
- [ ] No shortcuts taken
- [ ] Code follows established patterns

## Commit Hashes
- `abc123` - Commit message
- `def456` - Commit message
```

---

## 8. Success Criteria

### 8.1 Functional MVP
- [ ] Audio can be captured (mock or real microphone)
- [ ] Whisper transcribes audio in real-time
- [ ] Transcripts display in React UI via WebSocket
- [ ] Both caller and agent speech labeled
- [ ] UI updates within 2 seconds of speech

### 8.2 Code Quality
- [ ] No TypeScript `any` types
- [ ] All public functions documented
- [ ] Test coverage > 80% for domain logic
- [ ] No ESLint errors
- [ ] Clean Code principles followed

### 8.3 Documentation
- [ ] README complete with setup instructions
- [ ] All ADRs written with rationale and references
- [ ] API documentation complete
- [ ] Agent audit trails complete
- [ ] Architecture diagrams included

### 8.4 Security
- [ ] No known vulnerabilities in dependencies
- [ ] No secrets in codebase
- [ ] Input validation implemented
- [ ] Security report generated

### 8.5 Auditability
- [ ] All agent work logged
- [ ] Atomic commits with clear messages
- [ ] PR history shows agent progression
- [ ] Decisions traceable to rationale

---

## 9. References

### Books (Principles Applied)
1. **Unit Testing Principles, Practices, and Patterns** - Vladimir Khorikov
   - Test isolation patterns
   - Test double usage guidelines
   - Behavior vs implementation testing

2. **Clean Code** - Robert C. Martin
   - Naming conventions
   - Function size and purpose
   - Code organization

3. **Domain-Driven Design** - Eric Evans
   - Ubiquitous language
   - Bounded contexts
   - Entity and Value Object patterns

4. **Specification by Example** - Gojko Adzic
   - Living documentation
   - Executable specifications

5. **xUnit Test Patterns** - Gerard Meszaros
   - Test organization
   - Fixture patterns

### Tools Documentation
- [Turborepo](https://turbo.build/repo/docs)
- [Vitest](https://vitest.dev/)
- [Whisper.cpp](https://github.com/ggerganov/whisper.cpp)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Spec Kit](https://github.com/github/spec-kit)

---

## 10. Next Steps

**For the implementing agent/model**:

1. Read this entire plan thoroughly
2. Initialize the monorepo structure using Turborepo
3. Begin with Research Agent tasks (Day 1-2)
4. Follow the agent workflow sequentially
5. Create audit trail documents for each agent phase
6. Ensure all CI gates pass before proceeding to next agent
7. Update this plan if adjustments are needed (document why)

**Command to start**:
```bash
cd /Users/rmohid/Stash/learning/tnt-agentic-mvp
# Initialize Spec Kit
specify init --here --ai copilot
# Then follow agent workflow
```

---

*This plan serves as the authoritative guide for implementing the TnT MVP using an agentic SDLC workflow.*
