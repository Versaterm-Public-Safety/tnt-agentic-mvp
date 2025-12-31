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

**Feature**: Real-time transcription display with SIPREC-compliant interfaces

```
                                          ┌─────────────────────────┐
                                          │  Recording Server       │
                                    ┌────▶│  (archival/compliance)  │
                                    │     └─────────────────────────┘
┌──────────────────┐    SIPREC    ┌─┴───────────────┐
│  SBC Simulator   │─────────────▶│  Fan-Out Proxy  │
│  (mock ESInet/   │              │  (packages/     │
│   SBC behavior)  │              │   siprec-proxy) │
└──────────────────┘              └─┬───────────────┘
                                    │     ┌─────────────────────────┐
                                    └────▶│  TnT System (SRS)       │
                                          │  (transcription)        │
                                          └────────┬────────────────┘
                                                   │
                                                   ▼
                                          ┌─────────────────────────┐
                                          │  Whisper.cpp (local AI) │
                                          └────────┬────────────────┘
                                                   │
                                                   ▼
                                          ┌─────────────────────────┐
                                          │  WebSocket → React UI   │
                                          └─────────────────────────┘
```

**Why this slice**:
- Delivers tangible value from the PRD
- Exercises all architectural layers
- Demonstrates AI integration without external API keys
- **Proves SIPREC compatibility with NG911/ESInet infrastructure**
- **Uses RFC-compliant interfaces (SIP, SDP, RTP, SIPREC)**
- **Enables multi-consumer architecture (TnT + Recording via Fan-Out Proxy)**
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
| **Call Recording** | **SIPREC (RFC 7866)** | **Industry standard for SIP recording** |
| **Fan-Out Proxy** | **Node.js SIP Proxy** | **Enables multi-consumer (TnT + Recording)** |
| **Signaling** | **SIP (RFC 3261)** | **NG911/NENA i3 compliant** |
| **Media Transport** | **RTP (RFC 3550)** | **Standard for real-time audio** |

---

## 1.4 Spec Kit Conventions Integration

This project follows **GitHub Spec Kit** conventions for specification-driven development (SDD), ensuring specifications serve as the authoritative source of truth.

### 1.4.1 Spec Kit Installation

**Prerequisites**: Python with `uv` tool installed

```bash
# Install specify-cli globally
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# Or initialize directly in a project
uvx --from git+https://github.com/github/spec-kit.git specify init .
```

### 1.4.2 Spec Kit Commands

Use these slash commands with your AI agent (Copilot, Claude, etc.):

| Command | Purpose | Agent Phase |
|---------|---------|-------------|
| `/speckit.constitution` | Define project rules and principles | Setup |
| `/speckit.specify` | Describe features (focus on UX, not tech) | Research Agent |
| `/speckit.clarify` | Resolve ambiguities and add constraints | Research Agent |
| `/speckit.plan` | Define technical architecture choices | Research Agent |
| `/speckit.tasks` | Generate implementation task breakdown | Test Agent |
| `/speckit.implement` | Execute implementation | Implementation Agent |

### 1.4.3 Core Principles

**Specifications as Living Artifacts**:
- Specs are dynamic, evolving documents coupled to the codebase
- As requirements change, specs are updated first
- Specs define "what" and "why" before "how"

**Phase-Gated Development with Spec Kit**:
1. **Constitution** (`/speckit.constitution`): Define rules (Setup)
2. **Specify** (`/speckit.specify`): Define user needs, goals (Research Agent)
3. **Clarify** (`/speckit.clarify`): Resolve ambiguities (Research Agent)
4. **Plan** (`/speckit.plan`): Detail technical architecture (Research Agent)
5. **Task** (`/speckit.tasks`): Break down into atomic units (Test Agent)
6. **Implement** (`/speckit.implement`): Write code (Implementation Agent)
7. **Validate**: Verify against specs (Validation Agent)
8. **Secure**: Security audit (Security Agent)
9. **Integrate**: E2E validation (Integration Agent)
10. **Document**: Ensure docs match reality (Documentation Agent)

### 1.4.4 Spec Kit File Structure

```
tnt-agentic-mvp/
├── spec.md                        # Master specification (single source of truth)
├── constitution.md                # Technical principles, non-negotiables
├── plan.md                        # Technical plan (optional, can be in docs/)
├── specs/
│   ├── features/                  # Feature-level specifications
│   │   └── real-time-transcription.md
│   └── tasks/                     # Granular task breakdowns (from /speckit.tasks)
├── docs/
│   ├── architecture/              # ADRs (architecture decisions)
│   ├── audit-trail/               # Agent work logs (traceability)
│   ├── handoffs/                  # Context transfer documents
│   └── strategy/                  # This plan document
└── packages/                      # Implementation code
```

### 1.4.5 Spec Kit Workflow Alignment

| Spec Kit Command | Agent | Output | Verification |
|------------------|-------|--------|--------------|
| `/speckit.constitution` | Setup | constitution.md | Rules defined |
| `/speckit.specify` | Research Agent | Feature specs | Spec completeness |
| `/speckit.clarify` | Research Agent | Clarified requirements | No ambiguities |
| `/speckit.plan` | Research Agent | ADRs, architecture | ADR rationale |
| `/speckit.tasks` | Test Agent | Task breakdown, tests | Tests valid |
| `/speckit.implement` | Implementation Agent | Production code | All tests pass |
| (validation) | Validation Agent | Gap analysis | Requirements met |
| (security) | Security Agent | Vulnerability assessment | No critical vulns |
| (integration) | Integration Agent | E2E tests | Full stack works |
| (documentation) | Documentation Agent | Updated docs | Docs match code |

### 1.4.6 Constitution (Technical Principles)

**Non-Negotiable Rules** (defined in `constitution.md`):
1. **Type Safety**: TypeScript strict mode, no `any` types
2. **Testing**: TDD approach, behavior over implementation
3. **Clean Code**: SOLID principles, meaningful names, small functions
4. **Security**: Input validation, no eval/dynamic code, no secrets
5. **Documentation**: Every decision has rationale (ADRs)
6. **Auditability**: Every change logged in audit trail
7. **Immutability**: Domain entities immutable where appropriate

**Architecture Principles**:
- Monorepo structure (Turborepo)
- Package independence (loose coupling)
- Clear boundaries (domain, server, UI)
- RFC compliance (WebSocket, SIPREC when implemented)

### 1.4.7 Spec-to-Code Traceability

Every code artifact traces back to specification:
- **Code** → Test → Spec → ADR → PRD
- **Domain Model** → Feature Spec Section 5 → PRD Section 4.1
- **WebSocket Messages** → Feature Spec Section 6 → ADR-002
- **Validation Logic** → Test → Feature Spec Acceptance Criteria

### 1.4.8 AI Agent Context

Specifications are written to be AI-consumable:
- Clear, actionable language
- Structured markdown
- Explicit acceptance criteria
- Minimal ambiguity
- Handoff documents preserve context between agents

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
│   │   ├── 6-integration-agent.yml
│   │   └── 7-documentation-agent.yml
│   └── copilot-instructions/         # Agent-specific instructions
│       ├── research-agent.md
│       ├── test-agent.md
│       ├── implementation-agent.md
│       ├── validation-agent.md
│       ├── security-agent.md
│       ├── integration-agent.md
│       └── documentation-agent.md
├── docs/
│   ├── architecture/                 # ADRs (Architecture Decision Records)
│   │   └── adr-template.md
│   ├── design/                       # Design docs with rationale
│   ├── audit-trail/                  # Agent work logs
│   ├── handoffs/                     # Agent handoff documents (CRITICAL)
│   │   └── HANDOFF-TEMPLATE.md       # Template for all handoffs
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
│   ├── siprec-proxy/                 # SIPREC Fan-Out Proxy (NEW)
│   │   ├── src/
│   │   ├── tests/
│   │   └── package.json
│   ├── siprec/                       # SIPREC SRS implementation (RFC 7865/7866)
│   │   ├── src/
│   │   ├── tests/
│   │   └── package.json
│   ├── sbc-simulator/                # Mock SBC for testing (SIPREC SRC)
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

### 3.0 Universal Agent Guidelines (All Agents)

**Loop Prevention and Recovery**:
All agents must be aware of loop patterns and take corrective action. The Validation Agent has primary responsibility for loop detection, but all agents should self-monitor.

**Self-Monitoring Rules**:
1. **Track iterations**: Count attempts at the same operation
2. **Recognize patterns**: Same error, same fix, same file repeatedly
3. **Set limits**: No more than 3 attempts before trying alternative
4. **Document blockers**: If stuck, write down what's blocking progress
5. **Escalate early**: Better to ask for help than spin indefinitely

**When Stuck, Follow STOP Protocol**:
```
S - Stop the current operation immediately
T - Think about what pattern is repeating  
O - Options: list 2-3 alternative approaches
P - Pick one and document why, or escalate to human
```

**Red Flags That Indicate a Loop**:
- "Let me try that again" more than twice
- Editing the same lines of code repeatedly
- Same test failing with "different" fixes
- Installing/uninstalling dependencies
- Reverting then re-applying changes
- Build errors that keep "almost" working

---

### 3.0.1 Agent Handoff Protocol (CRITICAL)

**Purpose**: Ensure complete context transfer between agents so each agent can start fresh without requiring access to previous conversation history.

**Handoff Document Location**: `docs/handoffs/{date}-{from-agent}-to-{to-agent}.md`

**Template**: `docs/handoffs/HANDOFF-TEMPLATE.md`

**Mandatory Handoff Contents**:

1. **Context Summary**
   - What was accomplished
   - Current state of codebase
   - Key files created/modified

2. **Critical Information**
   - Documents the next agent MUST read (ordered by priority)
   - Key decisions made and their rationale
   - Assumptions and constraints

3. **Pending Items**
   - Tasks not started (next agent's responsibility)
   - Known issues or blockers
   - Technical debt identified

4. **Environment State**
   - Build status (passing/failing)
   - Test results (X/Y passing)
   - Dependencies added/changed
   - Configuration changes

5. **Specific Instructions**
   - Exact starting point for next agent
   - Commands to run first
   - Anti-patterns to avoid
   - Success criteria

6. **Rollback Information**
   - Last known good commit SHA
   - Rollback command

**Handoff Workflow**:

```
┌─────────────────────────────────────────────────────────────┐
│                 AGENT HANDOFF PROCESS                        │
└─────────────────────────────────────────────────────────────┘

Current Agent Completion:
  1. Complete all assigned tasks
  2. Ensure build passes
  3. Ensure tests pass (or document failures)
  4. Update audit trail document
  5. Create handoff document from template
  6. Commit all changes with proper prefixes
  7. Log completion announcement
  8. Mark handoff checklist complete

Next Agent Startup:
  1. ANNOUNCE: Log startup message to audit trail
  2. Read handoff document FIRST
  3. Read all "must-read" documents listed
  4. Run verification commands
  5. Acknowledge receipt in handoff document
  6. Begin work with full context
```

**Handoff Checklist (Current Agent Must Complete)**:
```markdown
- [ ] All work committed with `[agent-name]` prefix
- [ ] `pnpm build` passes
- [ ] `pnpm test` passes (or failures documented)
- [ ] Audit trail updated: `docs/audit-trail/{date}-{agent}-{feature}.md`
- [ ] Handoff document created: `docs/handoffs/{date}-{from}-to-{to}.md`
- [ ] No uncommitted changes (`git status` clean)
- [ ] Branch pushed to remote
- [ ] Completion announcement logged
```

**Context Preservation Requirements**:

| Information Type | Location | Required |
|-----------------|----------|----------|
| Work completed | Handoff doc § 1 | ✅ |
| Decisions made | Handoff doc § 2.2 | ✅ |
| Key documents | Handoff doc § 2.1 | ✅ |
| Build/test status | Handoff doc § 4 | ✅ |
| Next steps | Handoff doc § 5 | ✅ |
| Rollback info | Handoff doc § 7 | ✅ |
| Code patterns | Handoff doc § 8 | ✅ |
| **Agent announcements** | **Audit trail** | **✅** |

**Why This Matters**:
- Agents operate with limited context windows
- Each agent session may start fresh
- Human reviewers need clear audit trails
- Enables parallel work if agents can be run independently
- Prevents loss of critical decisions and rationale

---

### 3.0.2 Agent Announcement and Logging Protocol (REQUIRED)

**Purpose**: Ensure every agent action is auditable with clear start/end markers and activity logs.

**Announcement Format**:

```
═══════════════════════════════════════════════════════════════
🤖 {AGENT_NAME} STARTING
═══════════════════════════════════════════════════════════════
Timestamp: {ISO 8601 timestamp}
Feature: {feature name}
Branch: {current branch}
Previous Agent: {agent name or "None"}
Handoff Document: {path to handoff document or "N/A"}
═══════════════════════════════════════════════════════════════
```

**Startup Sequence (EVERY AGENT MUST FOLLOW)**:

1. **Announce Start**
   ```markdown
   ## 🚀 Agent Startup
   
   **Agent**: {Agent Name}
   **Started**: {timestamp}
   **Feature**: {feature}
   **Branch**: {branch}
   ```

2. **Log Environment Check**
   ```markdown
   ## 📋 Environment Verification
   
   - Git status: {clean/dirty}
   - Build status: {pass/fail}
   - Test status: {X/Y passing}
   - Node version: {version}
   - pnpm version: {version}
   ```

3. **Log Handoff Acknowledgment** (if not first agent)
   ```markdown
   ## 📥 Handoff Received
   
   - From: {previous agent}
   - Document: {handoff path}
   - Key items noted: {count}
   - Blockers identified: {count or "none"}
   ```

**Activity Logging (DURING WORK)**:

Every significant action must be logged in the audit trail:

```markdown
## 📝 Activity Log

### {timestamp} - {action type}
- **Action**: {what was done}
- **Files**: {files affected}
- **Result**: {success/failure/partial}
- **Notes**: {any relevant details}
```

**Action Types to Log**:
| Action Type | When to Log |
|-------------|-------------|
| `FILE_CREATE` | Creating a new file |
| `FILE_MODIFY` | Modifying existing file |
| `FILE_DELETE` | Deleting a file |
| `TEST_RUN` | Running tests |
| `BUILD_RUN` | Running build |
| `DECISION` | Making a technical decision |
| `ISSUE_FOUND` | Discovering a problem |
| `ISSUE_RESOLVED` | Fixing a problem |
| `BLOCKED` | Encountering a blocker |
| `ESCALATE` | Escalating to human |

**Completion Sequence (EVERY AGENT MUST FOLLOW)**:

1. **Log Summary**
   ```markdown
   ## 📊 Work Summary
   
   - Files created: {count}
   - Files modified: {count}
   - Tests added: {count}
   - Tests passing: {X/Y}
   - Decisions made: {count}
   - Issues found: {count}
   - Issues resolved: {count}
   ```

2. **Announce Completion**
   ```markdown
   ## ✅ Agent Completion
   
   **Agent**: {Agent Name}
   **Completed**: {timestamp}
   **Duration**: {time elapsed}
   **Status**: {SUCCESS/PARTIAL/BLOCKED}
   **Next Agent**: {next agent name}
   **Handoff Document**: {path}
   ```

3. **Final Announcement**
   ```
   ═══════════════════════════════════════════════════════════════
   ✅ {AGENT_NAME} COMPLETE
   ═══════════════════════════════════════════════════════════════
   Duration: {elapsed time}
   Status: {SUCCESS/PARTIAL/BLOCKED}
   Files Changed: {count}
   Tests: {passing}/{total}
   Next: {next agent} 
   Handoff: {handoff document path}
   ═══════════════════════════════════════════════════════════════
   ```

**Audit Trail File Structure**:

Each agent creates/updates: `docs/audit-trail/{date}-{agent}-{feature}.md`

```markdown
# {Agent Name} Audit Trail

## Metadata
- **Date**: {date}
- **Feature**: {feature}
- **Branch**: {branch}
- **Start Time**: {timestamp}
- **End Time**: {timestamp}
- **Duration**: {elapsed}
- **Status**: {SUCCESS/PARTIAL/BLOCKED}

## Startup Announcement
{startup block}

## Environment Verification
{environment check}

## Handoff Acknowledgment
{handoff ack if applicable}

## Activity Log
{chronological list of all actions}

## Work Summary
{summary statistics}

## Completion Announcement
{completion block}

## Handoff Created
{link to handoff document}
```

**Example Audit Trail Entry**:

```markdown
# Validation Agent Audit Trail

## Metadata
- **Date**: 2025-12-31
- **Feature**: Real-Time Transcription Display
- **Branch**: main
- **Start Time**: 2025-12-31T18:40:00Z
- **End Time**: 2025-12-31T19:15:00Z
- **Duration**: 35 minutes
- **Status**: SUCCESS

## 🚀 Agent Startup

**Agent**: Validation Agent
**Started**: 2025-12-31T18:40:00Z
**Feature**: Real-Time Transcription Display
**Branch**: main

## 📋 Environment Verification

- Git status: clean
- Build status: PASS
- Test status: 24/24 passing
- Node version: v20.10.0
- pnpm version: 8.12.0

## 📥 Handoff Received

- From: Implementation Agent
- Document: docs/handoffs/2025-12-31-implementation-to-validation.md
- Key items noted: 4
- Blockers identified: none

## 📝 Activity Log

### 2025-12-31T18:42:00Z - TEST_RUN
- **Action**: Ran full test suite
- **Files**: all packages
- **Result**: success (24/24 passing)
- **Notes**: All tests pass as documented in handoff

### 2025-12-31T18:45:00Z - DECISION
- **Action**: Verified acceptance criteria mapping
- **Files**: specs/features/real-time-transcription.md
- **Result**: success
- **Notes**: All 5 acceptance criteria have corresponding implementation

... (more entries)

## 📊 Work Summary

- Files created: 1
- Files modified: 0
- Tests added: 0
- Tests passing: 24/24
- Decisions made: 3
- Issues found: 1 (minor)
- Issues resolved: 1

## ✅ Agent Completion

**Agent**: Validation Agent
**Completed**: 2025-12-31T19:15:00Z
**Duration**: 35 minutes
**Status**: SUCCESS
**Next Agent**: Security Agent
**Handoff Document**: docs/handoffs/2025-12-31-validation-to-security.md
```

---

### 3.1 Agent 1: Research Agent

**Purpose**: Analyze requirements deeply, research implementation approaches with evidence, create actionable specifications that enable TDD.

**Startup**: Read `spec.md` (or `tnt.prd`) and `constitution.md` FIRST

#### 3.1.0 Spec Kit Commands (Research Agent)

The Research Agent uses these spec-kit commands:

```bash
# 1. Define/verify the specification
/speckit.specify Build a real-time transcription display for 9-1-1 calls with speaker identification and latency under 2 seconds

# 2. Clarify any ambiguities found
/speckit.clarify What happens when audio drops? Define retry behavior and graceful degradation

# 3. Create the technical plan
/speckit.plan Use TypeScript monorepo with Turborepo, WebSocket for real-time transport, Whisper.cpp for local transcription
```

#### 3.1.1 Research Methodology

**Step 1: PRD Decomposition**
Don't just "read" the PRD. Extract and categorize:

| Category | Extract | Example |
|----------|---------|---------|
| **Functional Requirements** | What the system must DO | "Display transcripts in real-time" |
| **Non-Functional Requirements** | Quality attributes | "Latency < 2 seconds" |
| **Constraints** | Limitations | "Must run locally without API keys" |
| **Assumptions** | Implicit dependencies | "Audio comes from SIPREC stream" |
| **Ambiguities** | Unclear requirements | "Real-time" - what latency is acceptable? |

**Step 2: Technical Research (Evidence-Based)**
For each major technical decision, research with sources:

```markdown
## Research: {Topic}

### Question
{What are we trying to decide?}

### Options Investigated
1. **Option A**: {Description}
   - Source: {URL or reference}
   - Pros: {List}
   - Cons: {List}
   - Fits our constraints: Yes/No

2. **Option B**: ...

### Recommendation
{Which option and why, citing specific evidence}
```

**Step 3: Acceptance Criteria Definition**
Each AC must be:
- **Specific**: No ambiguity
- **Measurable**: Can be verified by a test
- **Testable**: Describes observable behavior

```markdown
## AC-1: Real-time transcript display

**Given**: An active call with audio streaming
**When**: Speech is detected in the audio
**Then**: 
  - Transcript text appears in UI within 2000ms of speech end
  - Speaker is correctly identified (caller/agent)
  - Confidence score is displayed if < 0.8

**Edge Cases**:
- Empty audio (silence) → No transcript generated
- Overlapping speech → Both speakers transcribed separately
- Network interruption → Graceful degradation with retry
```

#### 3.1.2 Feature Specification Structure

```markdown
# Feature: {Name}

## 1. Overview
{What this feature does and why it matters}

## 2. User Stories
- As a {role}, I want {capability}, so that {benefit}

## 3. Functional Requirements
| ID | Requirement | Priority | Source (PRD section) |
|----|-------------|----------|---------------------|
| FR-1 | ... | Must | PRD 4.1 |

## 4. Non-Functional Requirements
| ID | Requirement | Metric | Target |
|----|-------------|--------|--------|
| NFR-1 | Latency | Time from speech to display | < 2000ms |

## 5. Acceptance Criteria
{Detailed Given/When/Then for each testable behavior}

## 6. Domain Model
{Entities, value objects, relationships - with TypeScript interfaces}

## 7. API Contracts
{WebSocket messages, HTTP endpoints - with exact schemas}

## 8. Error Scenarios
| Scenario | Expected Behavior | Recovery |
|----------|-------------------|----------|
| Audio stream drops | Reconnect with backoff | Auto-retry 3x |

## 9. Out of Scope
{Explicitly list what this feature does NOT include}

## 10. Open Questions
{Anything needing clarification before implementation}
```

#### 3.1.3 ADR Requirements

Each ADR must have:
- **Context**: The actual problem, not just "we need to choose X"
- **Options**: At least 2 alternatives with pros/cons
- **Decision**: Clear choice with reasoning
- **Evidence**: Links to docs, benchmarks, or prior art
- **Consequences**: What this enables and what it costs

**Outputs**:
- `specs/features/{feature-name}.md` - Complete spec with all sections above
- `docs/architecture/adr-{number}-{title}.md` - Minimum 3 ADRs with evidence
- `docs/audit-trail/{date}-research-{feature}.md` - Research log with sources
- `docs/handoffs/{date}-research-to-test.md` - **Handoff document (REQUIRED)**

**Branch**: `agent/research/{feature-name}`

**CI Gate**: Spec has all 10 sections, ADRs have evidence links, all ACs are testable (Given/When/Then format)

---

### 3.2 Agent 2: Test Agent

**Purpose**: Derive comprehensive tests directly from specifications using systematic test design techniques - not just "write some tests."

**Startup**: Read `docs/handoffs/{date}-research-to-test.md` FIRST

#### 3.2.0 Spec Kit Commands (Test Agent)

The Test Agent uses the spec-kit tasks command to generate implementation tasks:

```bash
# Generate tasks from the specification
/speckit.tasks Generate test tasks for the real-time transcription feature based on acceptance criteria

# Example output structure:
# - Task 1: Create Transcript entity tests (validation, creation, immutability)
# - Task 2: Create Call entity tests (lifecycle, transcript association)
# - Task 3: Create WebSocket message contract tests
# - Task 4: Create integration test structure
```

The tasks command helps break down the specification into atomic, testable units that follow TDD principles.

#### 3.2.1 Test Derivation Methodology

**Step 1: AC-to-Test Mapping**
For EACH acceptance criterion, derive tests systematically:

```markdown
## AC-1: Real-time transcript display

### Happy Path Tests
- `should display transcript within 2000ms of speech end`
- `should identify caller speech correctly`
- `should identify agent speech correctly`
- `should show confidence score when below 0.8`

### Edge Case Tests (from spec section 8)
- `should handle empty audio without crashing`
- `should transcribe overlapping speech separately`
- `should retry on network interruption`

### Boundary Tests
- `should handle exactly 2000ms latency (boundary)`
- `should handle confidence score of exactly 0.8`

### Error Tests
- `should throw TranscriptionError on invalid audio format`
- `should emit error event on WebSocket failure`
```

**Step 2: Equivalence Partitioning**
For each input, identify partitions:

| Input | Valid Partitions | Invalid Partitions |
|-------|------------------|-------------------|
| Audio buffer | PCM 16kHz mono, PCM 44.1kHz stereo | Empty, wrong format, corrupted |
| Speaker ID | 'caller', 'agent' | null, undefined, invalid string |
| Confidence | 0.0-1.0 | negative, >1.0, NaN |

**Step 3: Test Structure (Khorikov-Aligned)**

```typescript
// ❌ BAD: Testing implementation
test('calls whisper.transcribe', () => {
  const spy = vi.spyOn(whisper, 'transcribe');
  service.process(audio);
  expect(spy).toHaveBeenCalled(); // Brittle!
});

// ✅ GOOD: Testing behavior
test('transcribes speech to text with speaker identification', () => {
  // Arrange
  const audio = createTestAudio({ speech: 'Hello', speaker: 'caller' });
  
  // Act
  const result = transcriptionService.transcribe(audio);
  
  // Assert
  expect(result.text).toBe('Hello');
  expect(result.speaker).toBe('caller');
  expect(result.confidence).toBeGreaterThan(0);
});
```

#### 3.2.2 Test Categories Required

| Category | Location | Purpose | Isolation |
|----------|----------|---------|-----------|
| **Domain Unit** | `packages/core/tests/` | Business logic | No I/O, no mocks of internals |
| **Service Unit** | `packages/*/tests/` | Service behavior | Mock external dependencies only |
| **Integration** | `tests/integration/` | Package boundaries | Real packages, mock external systems |
| **Contract** | `tests/contract/` | API shape verification | Verify request/response schemas |

#### 3.2.3 Test File Structure

```typescript
// packages/core/tests/transcript.test.ts

describe('Transcript', () => {
  describe('creation', () => {
    it('creates transcript with valid data', () => { ... });
    it('throws on empty text', () => { ... });
    it('throws on invalid speaker', () => { ... });
  });
  
  describe('confidence handling', () => {
    it('accepts confidence between 0 and 1', () => { ... });
    it('throws on negative confidence', () => { ... });
    it('throws on confidence greater than 1', () => { ... });
  });
  
  describe('speaker identification', () => {
    it('identifies caller speech', () => { ... });
    it('identifies agent speech', () => { ... });
  });
});
```

#### 3.2.4 Test Doubles Strategy

| Dependency Type | Double Type | Example |
|-----------------|-------------|---------|
| External API | Fake | `FakeWhisperService` with canned responses |
| Database | Fake | In-memory repository |
| Time | Stub | `vi.useFakeTimers()` |
| Random | Stub | Seeded random generator |
| File System | Fake | Virtual file system |
| Network | Mock | Only for verifying calls were made |

**Rule**: Mock at architectural boundaries, not internal classes.

**Outputs**:
- `packages/{package}/tests/*.test.ts` - Unit tests derived from ACs
- `tests/integration/*.test.ts` - Integration tests for package boundaries
- Test coverage report showing AC coverage
- `docs/audit-trail/{date}-test-{feature}.md` - Test derivation rationale
- `docs/handoffs/{date}-test-to-implement.md` - **Handoff document (REQUIRED)**

**Branch**: `agent/test/{feature-name}`

**CI Gate**: Every AC has at least one test, tests are syntactically valid, test file structure follows convention

---

### 3.3 Agent 3: Implementation Agent

**Purpose**: Implement production code that passes all tests while following architectural patterns and clean code principles - not just "make tests green."

**Startup**: Read `docs/handoffs/{date}-test-to-implement.md` FIRST

#### 3.3.0 Spec Kit Commands (Implementation Agent)

The Implementation Agent uses the spec-kit implement command:

```bash
# Execute implementation based on tasks and tests
/speckit.implement Implement the Transcript entity following TDD - make all transcript tests pass

# The implement command ensures:
# - Code follows the specification
# - Tests guide the implementation
# - Clean Code principles are applied
# - Constitution rules are followed
```

#### 3.3.1 Implementation Strategy

**Step 1: Understand the Domain**
Before writing code, identify from the spec:
- **Entities**: Objects with identity (Call, Session)
- **Value Objects**: Immutable objects defined by attributes (Transcript, Speaker)
- **Aggregates**: Consistency boundaries (Call with its Transcripts)
- **Domain Services**: Operations that don't belong to entities

**Step 2: Outside-In Implementation**
Start from the edges, work inward:

```
1. Define interfaces/types (contracts)
2. Implement domain entities (pure logic, no I/O)
3. Implement domain services (orchestration)
4. Implement infrastructure (adapters for external systems)
5. Wire everything together
```

**Step 3: TDD Red-Green-Refactor**
For each failing test:
1. **Red**: Verify test fails for the right reason
2. **Green**: Write minimal code to pass
3. **Refactor**: Improve design without changing behavior

#### 3.3.2 Code Quality Gates

| Check | Command | Requirement |
|-------|---------|-------------|
| Type Safety | `pnpm tsc --noEmit` | 0 errors, 0 `any` types |
| Lint | `pnpm lint` | 0 errors, 0 warnings |
| Tests | `pnpm test` | 100% pass rate |
| Coverage | `pnpm test --coverage` | >80% for domain logic |
| Build | `pnpm build` | Successful compilation |

#### 3.3.3 Architecture Patterns to Apply

**Domain Layer (`packages/core`)**:
```typescript
// Value Object - immutable, validated at construction
export class Transcript {
  private constructor(
    public readonly id: string,
    public readonly text: string,
    public readonly speaker: Speaker,
    public readonly confidence: number,
    public readonly timestamp: Date
  ) {}
  
  static create(props: TranscriptProps): Transcript {
    // Validation here
    if (!props.text?.trim()) {
      throw new TranscriptError('Text cannot be empty');
    }
    return new Transcript(...);
  }
}
```

**Service Layer**:
```typescript
// Dependency injection, no direct instantiation
export class TranscriptionService {
  constructor(
    private readonly transcriber: Transcriber, // Interface
    private readonly repository: TranscriptRepository // Interface
  ) {}
  
  async transcribe(audio: AudioBuffer): Promise<Transcript> {
    const result = await this.transcriber.process(audio);
    const transcript = Transcript.create(result);
    await this.repository.save(transcript);
    return transcript;
  }
}
```

#### 3.3.4 Implementation Checklist

For each component:
- [ ] All tests pass (not just "most")
- [ ] No `any` types (check with `grep -r ": any" --include="*.ts" packages/`)
- [ ] No `// TODO` or `// FIXME` left behind
- [ ] No commented-out code
- [ ] Public functions have JSDoc comments
- [ ] Error cases throw typed errors (not generic Error)
- [ ] Async operations have proper error handling
- [ ] No hardcoded values that should be configurable

**Outputs**:
- `packages/{package}/src/*.ts` - Production code following patterns above
- `docs/audit-trail/{date}-implementation-{feature}.md` - Implementation decisions
- `docs/handoffs/{date}-implement-to-validate.md` - **Handoff document (REQUIRED)**

**Branch**: `agent/implement/{feature-name}`

**CI Gate**: All tests pass, 0 TypeScript errors, 0 lint errors, coverage >80% for core, build succeeds

---

### 3.4 Agent 4: Validation Agent

**Purpose**: Rigorously verify implementation meets requirements through code analysis, test execution, and behavioral verification - not just pattern matching.

**Startup**: Read `docs/handoffs/{date}-implement-to-validate.md` FIRST

**Validation Philosophy**:
Grep finds text. Validation proves behavior. This agent must **execute code**, **trace requirements**, and **verify outcomes** - not just search for keywords.

**Responsibilities**:

#### 3.4.1 Requirements Traceability Matrix

For EACH acceptance criterion in the spec, create explicit traceability:

| AC ID | Requirement | Test File | Test Name | Execution Result | Code Location | Verified |
|-------|-------------|-----------|-----------|------------------|---------------|----------|
| AC-1 | Transcript displays within 2s | `transcript.test.ts` | `displays within latency threshold` | PASS/FAIL | `TranscriptPanel.tsx:45` | ✅/❌ |

**How to verify (not grep)**:
1. **Read the acceptance criterion** from spec
2. **Find the test** that exercises this behavior
3. **Run the test** and confirm it passes
4. **Read the implementation** and confirm it actually does what the test expects
5. **Check edge cases** - what happens at boundaries?

#### 3.4.2 Behavioral Verification Methods

| Verification Type | Method | NOT This |
|-------------------|--------|----------|
| **Function exists** | Import and call it, check return type | `grep "function processAudio"` |
| **Error handling** | Write/run test with invalid input, verify error thrown | `grep "throw new Error"` |
| **Type safety** | Run `tsc --noEmit`, check for `any` in compiler output | `grep "any"` (misses inferred any) |
| **API contract** | Call endpoint, verify response shape matches spec | `grep "router.post"` |
| **State transitions** | Test state machine with all valid/invalid transitions | `grep "status ="` |
| **Performance** | Run benchmark, measure actual latency | `grep "setTimeout"` |

#### 3.4.3 Validation Execution Steps

**Step 1: Test Execution Analysis**
```bash
# Run tests with coverage and timing
pnpm test --coverage --reporter=verbose

# Verify ALL tests pass (not just "some")
# Check coverage meets threshold (80% for domain logic)
# Identify any skipped tests (red flag)
```

**Step 2: Acceptance Criteria Walkthrough**
For each AC in `specs/features/{feature}.md`:
1. Quote the exact AC text
2. Identify which test(s) verify it
3. Run those specific tests
4. Read the implementation code
5. Confirm the code actually implements the behavior (not just passes the test)
6. Document: "AC-X verified by test Y, implemented in file Z, lines A-B"

**Step 3: Negative Testing**
- What happens with empty input?
- What happens with malformed input?
- What happens when dependencies fail?
- Are these cases tested? Do they behave correctly?

**Step 4: Integration Points**
- Do packages actually work together?
- Run integration tests, not just unit tests
- Verify data flows correctly across boundaries

**Step 5: Manual Code Review**
Read the actual implementation for:
- Logic errors tests might miss
- Security issues (input validation, injection)
- Performance concerns (O(n²) loops, memory leaks)
- Code that "works" but violates spec intent

#### 3.4.4 Validation Report Structure

```markdown
# Validation Report: {Feature}

## Summary
- Total Acceptance Criteria: X
- Verified: Y
- Failed: Z
- Blocked: W

## Traceability Matrix
| AC | Requirement | Test | Result | Code | Notes |
|----|-------------|------|--------|------|-------|
| AC-1 | ... | ... | PASS | ... | ... |

## Test Execution Results
- Total tests: X
- Passing: Y
- Failing: Z (list each with reason)
- Coverage: X% (threshold: 80%)

## Behavioral Verification
### AC-1: {Description}
- **Spec says**: {exact quote}
- **Test**: `{test file}:{test name}`
- **Test result**: PASS/FAIL
- **Implementation**: `{file}:{lines}`
- **Code review**: {What the code actually does}
- **Verdict**: ✅ VERIFIED / ❌ FAILED / ⚠️ PARTIAL

### AC-2: ...

## Edge Cases Verified
| Scenario | Expected | Actual | Status |
|----------|----------|--------|--------|
| Empty input | Error thrown | Error thrown | ✅ |
| Null speaker | Default to 'unknown' | Crashes | ❌ |

## Issues Found
### Issue 1: {Title}
- **Severity**: Critical/High/Medium/Low
- **AC Affected**: AC-X
- **Description**: {What's wrong}
- **Evidence**: {Test output, code snippet}
- **Recommendation**: {How to fix}

## Gaps Identified
- {Gap 1}: Spec says X, implementation does Y
- {Gap 2}: No test coverage for scenario Z

## Verdict
- [ ] All acceptance criteria met
- [ ] All tests pass
- [ ] Coverage threshold met
- [ ] No critical issues
- [ ] Ready for Security Agent
```

#### 3.4.5 What Validation Agent Must NOT Do

❌ **Do not** just grep for keywords and assume requirements are met
❌ **Do not** trust test names without running them
❌ **Do not** assume passing tests = correct implementation
❌ **Do not** skip reading the actual code
❌ **Do not** rubber-stamp without evidence

#### 3.4.6 Loop Detection and Recovery

The Validation Agent must also monitor for and address loop patterns:

| Loop Pattern | Detection Signal | Recovery Action |
|--------------|------------------|-----------------|
| **Repeated file edits** | Same file modified 3+ times with similar changes | Stop editing; document the issue; request human review |
| **Oscillating changes** | Change A → Change B → Change A pattern | Revert to last stable state; document both approaches; choose one definitively |
| **Infinite test failures** | Same test fails 5+ times with different "fixes" | Stop fixing; analyze root cause; consider if test or spec is wrong |
| **Dependency cycles** | Installing/uninstalling same packages | Lock dependencies; document conflict; escalate |
| **Retry without progress** | Same command fails 3+ times | Stop retrying; document error; try alternative approach or escalate |
| **Scope creep loop** | Continuously adding "just one more" fix | Stop; commit current work; create new task for additional items |

**Loop Recovery**: Follow STOP protocol (Section 3.0)

**Outputs**:
- `docs/audit-trail/{date}-validation-{feature}.md` - Full validation report with traceability matrix
- Issues filed if gaps found (with specific AC reference)
- `docs/handoffs/{date}-validate-to-security.md` - **Handoff document (REQUIRED)**

**Branch**: Works on existing implementation branch, creates validation commit

**CI Gate**: Validation report complete with all ACs traced, no critical gaps, all tests passing, handoff document present

---

### 3.5 Agent 5: Security Agent

**Purpose**: Perform systematic security analysis using multiple techniques - not just run `npm audit` and check boxes.

**Startup**: Read `docs/handoffs/{date}-validate-to-security.md` FIRST

#### 3.5.1 Security Analysis Methodology

**Layer 1: Automated Scanning**
```bash
# Dependency vulnerabilities
pnpm audit --audit-level=moderate

# Secret detection
npx secretlint "**/*"

# Static analysis (if configured)
pnpm lint --config eslint-security.config.js
```

**Layer 2: Manual Code Review (REQUIRED)**
Automated tools miss context. Review code for:

| Vulnerability Class | What to Look For | Example Bad Pattern |
|---------------------|------------------|---------------------|
| **Injection** | User input in queries/commands | `eval(userInput)`, `exec(cmd + userInput)` |
| **XSS** | Unescaped output in HTML | `innerHTML = userInput`, `dangerouslySetInnerHTML` |
| **SSRF** | User-controlled URLs | `fetch(userProvidedUrl)` |
| **Path Traversal** | User input in file paths | `fs.readFile(baseDir + userInput)` |
| **Secrets** | Hardcoded credentials | `const apiKey = "sk-..."` |
| **Insecure Deserialization** | Parsing untrusted data | `JSON.parse(untrustedInput)` without validation |

**Layer 3: Threat Modeling**
For each external interface, analyze:

```markdown
## Interface: WebSocket Connection

### Data Flow
Client → WebSocket → Server → Transcription Service

### Trust Boundary
Client is UNTRUSTED. All input must be validated.

### Threats (STRIDE)
| Threat | Risk | Mitigation |
|--------|------|------------|
| Spoofing | Medium | Require authentication token |
| Tampering | Medium | Validate message schema |
| Repudiation | Low | Log all messages with timestamps |
| Information Disclosure | High | Don't leak internal errors |
| Denial of Service | High | Rate limiting, message size limits |
| Elevation of Privilege | Low | No admin functions exposed |

### Mitigations Verified
- [ ] Input validation implemented
- [ ] Rate limiting configured
- [ ] Error messages sanitized
```

#### 3.5.2 Security Checklist with Evidence

| Check | Method | Evidence Required |
|-------|--------|-------------------|
| No `eval()` | `grep -r "eval(" --include="*.ts"` | Output showing 0 matches |
| No `Function()` | `grep -r "new Function" --include="*.ts"` | Output showing 0 matches |
| No hardcoded secrets | `secretlint` scan | Clean scan output |
| Input validation | Code review | List of all entry points with validation code |
| Dependency audit | `pnpm audit` | Audit output, remediation for any issues |
| No `dangerouslySetInnerHTML` | `grep -r "dangerouslySetInnerHTML"` | Output or justified exception |
| Error handling doesn't leak | Code review | Error responses don't include stack traces |

#### 3.5.3 Security Report Structure

```markdown
# Security Assessment: {Feature}

## Summary
- Critical Issues: X
- High Issues: Y
- Medium Issues: Z
- Low Issues: W
- Informational: V

## Automated Scan Results

### Dependency Audit
{Full pnpm audit output}

### Secret Scan
{secretlint output}

### Static Analysis
{ESLint security rules output}

## Manual Review Findings

### Finding 1: {Title}
- **Severity**: Critical/High/Medium/Low
- **Location**: `{file}:{line}`
- **Description**: {What's wrong}
- **Evidence**: {Code snippet}
- **Recommendation**: {How to fix}
- **CWE**: {CWE ID if applicable}

## Threat Model

### Interface: {Name}
{STRIDE analysis as above}

## Entry Points Reviewed
| Entry Point | Validation | Status |
|-------------|------------|--------|
| WebSocket message | Zod schema | ✅ |
| Audio buffer | Size + format check | ✅ |

## Verdict
- [ ] No critical/high vulnerabilities
- [ ] All entry points validated
- [ ] No secrets in code
- [ ] Dependencies up to date
- [ ] Ready for Integration Agent
```

**Outputs**:
- `docs/audit-trail/{date}-security-{feature}.md` - Full security assessment
- `docs/security/vulnerability-assessment.md` - Overall assessment with threat model
- `docs/handoffs/{date}-security-to-integration.md` - **Handoff document (REQUIRED)**

**Branch**: Works on existing branch, creates security commit

**CI Gate**: No critical/high vulnerabilities, all entry points documented, threat model complete

---

### 3.6 Agent 6: Integration Agent

**Purpose**: Verify the complete system works end-to-end through actual execution - not just "all packages build."

**Startup**: Read `docs/handoffs/{date}-security-to-integration.md` FIRST

#### 3.6.1 Integration Verification Methodology

**Step 1: Dependency Graph Verification**
```bash
# Verify package dependencies resolve correctly
pnpm ls --depth=2

# Check for circular dependencies
npx madge --circular packages/*/src/index.ts
```

**Step 2: Cross-Package Integration Tests**
Test that packages actually work together:

```typescript
// tests/integration/transcription-flow.test.ts
describe('Transcription Flow', () => {
  it('processes audio through full pipeline', async () => {
    // Use REAL packages, not mocks
    const audioBuffer = loadTestAudio('test-speech.wav');
    
    // @tnt/core + @tnt/transcription + @tnt/server working together
    const server = createTestServer();
    const client = new WebSocket(server.url);
    
    // Send audio
    client.send(JSON.stringify({ type: 'audio', data: audioBuffer }));
    
    // Verify transcript received
    const message = await waitForMessage(client, 'transcript');
    expect(message.text).toBeDefined();
    expect(message.speaker).toMatch(/caller|agent/);
  });
});
```

**Step 3: E2E Scenario Tests**
Test complete user scenarios:

| Scenario | Steps | Expected Outcome |
|----------|-------|------------------|
| New call | 1. Start server 2. Connect WS 3. Send audio 4. Receive transcript | Transcript displayed in < 2s |
| Speaker change | 1. Send caller audio 2. Send agent audio | Both transcripts with correct speaker |
| Error recovery | 1. Send invalid audio 2. Send valid audio | Error handled, second succeeds |
| Reconnection | 1. Connect 2. Disconnect 3. Reconnect | Session resumed |

**Step 4: Manual Smoke Test**
Actually run the application:

```bash
# Terminal 1: Start server
pnpm --filter @tnt/server dev

# Terminal 2: Start UI
pnpm --filter @tnt/ui dev

# Terminal 3: Run SBC simulator
pnpm --filter @tnt/sbc-simulator start

# Manual verification:
# 1. Open browser to localhost:3000
# 2. Trigger test call from simulator
# 3. Verify transcripts appear in UI
# 4. Verify speaker identification works
```

#### 3.6.2 Integration Report Structure

```markdown
# Integration Report: {Feature}

## Package Dependency Verification
{madge output - no circular deps}

## Cross-Package Tests
| Test Suite | Tests | Passed | Failed |
|------------|-------|--------|--------|
| transcription-flow | 5 | 5 | 0 |
| websocket-integration | 3 | 3 | 0 |

## E2E Scenario Results
| Scenario | Status | Notes |
|----------|--------|-------|
| New call | ✅ PASS | Latency: 1.2s |
| Speaker change | ✅ PASS | Both identified correctly |

## Manual Smoke Test
- [ ] Server starts without errors
- [ ] UI loads in browser
- [ ] WebSocket connects
- [ ] Audio processed
- [ ] Transcript displayed
- [ ] Speaker identified

## Performance Baseline
| Metric | Target | Actual |
|--------|--------|--------|
| Transcription latency | < 2000ms | 1200ms |
| WebSocket connect time | < 500ms | 150ms |
| UI render time | < 100ms | 45ms |

## Issues Found
{Any integration issues discovered}

## Verdict
- [ ] All packages integrate correctly
- [ ] E2E scenarios pass
- [ ] Performance targets met
- [ ] Ready for Documentation Agent
```

**Outputs**:
- `tests/e2e/*.test.ts` - E2E tests that exercise full stack
- `tests/integration/*.test.ts` - Cross-package integration tests
- Updated `README.md` with verified setup instructions
- `docs/audit-trail/{date}-integration-{feature}.md` - Integration report
- `docs/handoffs/{date}-integration-to-documentation.md` - **Handoff document (REQUIRED)**

**Branch**: Merges feature branch to `main`

**CI Gate**: All integration tests pass, E2E scenarios pass, smoke test documented, performance targets met

---

### 3.7 Agent 7: Documentation Agent

**Purpose**: Verify documentation accuracy through systematic comparison with actual implementation - not just "looks good."

**Startup**: Read `docs/handoffs/{date}-integration-to-documentation.md` FIRST

#### 3.7.1 Documentation Verification Methodology

**Step 1: README Verification**
Actually execute every command in the README:

```markdown
## README Command Verification

| Command | Expected Result | Actual Result | Status |
|---------|-----------------|---------------|--------|
| `pnpm install` | Dependencies installed | Dependencies installed | ✅ |
| `pnpm build` | Build succeeds | Build succeeds | ✅ |
| `pnpm test` | Tests pass | Tests pass | ✅ |
| `pnpm dev` | Server starts on :3000 | Server starts on :3000 | ✅ |
```

**Step 2: API Documentation vs Implementation**
For each documented API:

```markdown
## API Verification: WebSocket Messages

### Documented
{Quote from API docs}

### Actual (from code)
{TypeScript interface from source}

### Match: ✅/❌
{Differences if any}
```

**Step 3: ADR Currency Check**
For each ADR, verify the decision is still implemented:

| ADR | Decision | Still True? | Evidence |
|-----|----------|-------------|----------|
| ADR-001 | Use Whisper.cpp | ✅ | `packages/transcription/src/whisper.ts` exists |
| ADR-002 | WebSocket for transport | ✅ | `packages/server/src/websocket.ts` exists |

**Step 4: Feature Spec vs Implementation**
Compare each spec section to actual code:

```markdown
## Spec Verification: Real-Time Transcription

### Section 5: Domain Model

**Spec says**:
- Transcript has: id, text, speaker, confidence, timestamp

**Code has** (`packages/core/src/transcript.ts`):
- id: string ✅
- text: string ✅
- speaker: Speaker ✅
- confidence: number ✅
- timestamp: Date ✅

### Section 7: API Contracts
{Same verification}
```

#### 3.7.2 Documentation Updates Required

| Document | Check | Update If |
|----------|-------|-----------|
| README.md | All commands work | Any command fails |
| API.md | Matches TypeScript interfaces | Interface changed |
| ADRs | Decisions still valid | Implementation diverged |
| Feature Spec | Matches implementation | Implementation added/changed features |
| Architecture diagrams | Matches package structure | Packages added/removed |

#### 3.7.3 Documentation Report Structure

```markdown
# Documentation Verification Report

## Summary
- Documents reviewed: X
- Issues found: Y
- Updates made: Z

## README Verification
| Command | Status | Notes |
|---------|--------|-------|
| ... | ... | ... |

## API Documentation
| Endpoint/Message | Documented | Implemented | Match |
|------------------|------------|-------------|-------|
| TranscriptUpdate | ✅ | ✅ | ✅ |

## ADR Currency
| ADR | Status | Notes |
|-----|--------|-------|
| ADR-001 | Current | No changes needed |

## Feature Spec Accuracy
| Section | Matches Implementation | Notes |
|---------|------------------------|-------|
| Domain Model | ✅ | |
| API Contracts | ⚠️ | Added `callId` field |

## Updates Made
1. {Update 1}: {What was changed and why}
2. {Update 2}: ...

## Remaining Issues
{Any documentation that couldn't be verified or updated}

## Verdict
- [ ] README commands all work
- [ ] API docs match code
- [ ] ADRs are current
- [ ] Feature spec is accurate
- [ ] WORKFLOW COMPLETE
```

**Outputs**:
- Updated `README.md` (if commands were incorrect)
- Updated API documentation (if interfaces changed)
- Updated ADRs (if decisions changed)
- `docs/audit-trail/{date}-documentation-{feature}.md` - Verification report
- `docs/handoffs/{date}-documentation-complete.md` - **Final handoff document**

**Branch**: Works on existing branch, creates documentation commit

**CI Gate**: All README commands verified, API docs match code, no stale ADRs, handoff complete

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
│ • Dep audit   │                    │ • Finalize    │
│ • Vuln report │                    │   code        │
└───────────────┘                    └───────────────┘
                                            │
        ┌───────────────────────────────────┘
        ▼
┌───────────────┐
│ 7. DOCUMENT   │
│    AGENT      │
│               │
│ • Review docs │
│ • Update      │
│ • Verify      │
└───────────────┘
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
| Audit Logs | docs/audit-trail/ | Agent work logs with announcements |
| **AUDIT-TRAIL-TEMPLATE.md** | **docs/audit-trail/** | **Template for agent audit logs** |
| **Handoff Documents** | **docs/handoffs/** | **Context transfer between agents (CRITICAL)** |
| **HANDOFF-TEMPLATE.md** | **docs/handoffs/** | **Template for all agent handoffs** |

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

**Full Template Location**: `docs/audit-trail/AUDIT-TRAIL-TEMPLATE.md`

The audit trail template includes:
- Agent startup announcement with timestamp and objectives
- Environment verification checklist
- Handoff acknowledgment (for agents after Research)
- Chronological activity log with action types
- Decision documentation with rationale
- Issue tracking with resolution status
- Work summary with metrics
- Agent completion announcement
- Recommendations for next agent

**Required Sections** (see full template for details):

```markdown
# {Agent Name} Audit Trail

## Metadata
| Field | Value |
|-------|-------|
| Date | {YYYY-MM-DD} |
| Agent | {Agent Name} |
| Start Time | {timestamp} |
| End Time | {timestamp} |
| Status | {SUCCESS/PARTIAL/BLOCKED} |

## 🚀 Agent Startup
{Announcement block - REQUIRED}

## 📋 Environment Verification
{Build/test status checks - REQUIRED}

## 📥 Handoff Acknowledgment
{If not first agent - REQUIRED}

## 📝 Activity Log
{Chronological log of all actions - REQUIRED}

## 🔍 Decisions Made
{Technical decisions with rationale - REQUIRED}

## ⚠️ Issues Encountered
{Problems and resolutions - REQUIRED}

## 📊 Work Summary
{Files changed, tests, metrics - REQUIRED}

## ✅ Agent Completion
{Completion announcement - REQUIRED}
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

## 10. Executing the Agentic Workflow

### 10.1 Trigger Phrase

When the user says any of the following, execute the full agentic workflow:
- "Execute the plan"
- "Start the agentic workflow"
- "Run the SDLC agents"
- "Begin agent execution"

### 10.1.1 Automatic Agent Chaining (CRITICAL)

**RULE**: Agents execute automatically in sequence. **DO NOT** prompt for user input between agents unless explicitly blocked.

**Automatic Progression**:
```
Research Agent completes → AUTOMATICALLY start Test Agent
Test Agent completes → AUTOMATICALLY start Implementation Agent
Implementation Agent completes → AUTOMATICALLY start Validation Agent
Validation Agent completes → AUTOMATICALLY start Security Agent
Security Agent completes → AUTOMATICALLY start Integration Agent
Integration Agent completes → AUTOMATICALLY start Documentation Agent
Documentation Agent completes → WORKFLOW COMPLETE
```

**When to Prompt User (ONLY these cases)**:
| Situation | Action |
|-----------|--------|
| Unrecoverable build failure (3+ attempts) | Stop and ask for guidance |
| Spec is ambiguous AND affects critical path | Ask for clarification |
| Security vulnerability requires human decision | Stop and report |
| Loop detected that cannot be self-resolved | Stop and escalate |
| External dependency unavailable | Stop and report |

**When NOT to Prompt User**:
- Between successful agent completions
- For routine decisions covered by specs/ADRs
- For minor issues that can be documented and deferred
- For test failures that can be fixed
- For lint/type errors that can be resolved

**Implementation**:
After each agent's completion announcement:
1. Verify handoff document created
2. Verify build/tests pass (or failures documented)
3. **IMMEDIATELY** proceed to next agent
4. Do NOT wait for user confirmation

### 10.2 Pre-Execution Checklist

Before starting, verify:

```bash
# Navigate to project root (adjust path as needed)
cd "$(git rev-parse --show-toplevel)"

# 1. Check repository state
git status
git branch

# 2. Verify dependencies
pnpm install

# 3. Check current build/test status
pnpm build
pnpm test

# 4. Review current state
ls -la docs/handoffs/
ls -la docs/audit-trail/
```

### 10.3 Execution Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    AGENTIC WORKFLOW EXECUTION                            │
└─────────────────────────────────────────────────────────────────────────┘

Step 1: DETERMINE CURRENT STATE
  ├── Check for existing handoff documents in docs/handoffs/
  ├── Check for existing audit trails in docs/audit-trail/
  ├── Identify which agent should run next
  └── If fresh start → Begin with Research Agent

Step 2: LOAD AGENT CONTEXT
  ├── Read the handoff document from previous agent (if exists)
  ├── Read the agent-specific instructions (section 3.X of this plan)
  ├── Read relevant specifications in specs/features/
  └── Read relevant ADRs in docs/architecture/

Step 3: EXECUTE AGENT
  ├── Announce agent startup (see section 3.0.2)
  ├── Verify environment
  ├── Acknowledge handoff (if applicable)
  ├── Execute agent responsibilities
  ├── Log all activities
  ├── Create/update audit trail
  └── Announce completion

Step 4: HANDOFF
  ├── Create handoff document for next agent
  ├── Commit all changes with [agent-name] prefix
  ├── Verify build/tests pass
  └── Clear context and proceed to next agent

Step 5: REPEAT (AUTOMATIC - NO USER PROMPT)
  ├── IMMEDIATELY proceed to next agent
  ├── Do NOT wait for user confirmation
  └── Continue until Documentation Agent completes
```

**CRITICAL AUTOMATION RULE**: 
The workflow runs continuously. Each agent completion triggers the next agent automatically.
User interaction is ONLY required when blocked (see section 10.1.1).

### 10.4 Agent Execution Order

| Order | Agent | Trigger Condition | Output | Est. Duration |
|-------|-------|-------------------|--------|---------------|
| 1 | Research Agent | Fresh start OR no specs exist | Feature specs, ADRs | 30-60 min |
| 2 | Test Agent | Research handoff exists | Unit tests, integration test structure | 45-90 min |
| 3 | Implementation Agent | Test handoff exists | Production code passing tests | 60-120 min |
| 4 | Validation Agent | Implementation handoff exists | Validation report | 20-40 min |
| 5 | Security Agent | Validation handoff exists | Security report | 15-30 min |
| 6 | Integration Agent | Security handoff exists | E2E tests, finalized code | 30-60 min |
| 7 | Documentation Agent | Integration handoff exists | Updated/verified documentation | 20-40 min |

**Total Estimated Duration**: 3.5-7 hours (depending on complexity and issues encountered)

### 10.5 Execution Instructions

#### Starting Fresh (No Prior Work)

1. **Check state**: `ls -la docs/handoffs/` - if empty, start with Research Agent
2. **Announce**: "🤖 RESEARCH AGENT STARTING"
3. **Read**: `tnt.prd` and `docs/strategy/AGENTIC-SDLC-PLAN.md`
4. **Execute**: Agent tasks per section 3.1
5. **Create outputs**: Feature spec, ADRs, audit trail, handoff document
6. **Announce**: "✅ RESEARCH AGENT COMPLETE"
7. **AUTOMATICALLY proceed** to next agent (no user prompt)

#### Resuming from Existing State

1. **Check latest handoff**: `ls -lt docs/handoffs/ | head -5`
2. **Read handoff** and identify "Next Agent" field
3. **Execute that agent's workflow** per section 3.X
4. **Continue sequential execution** until complete

### 10.6 Per-Agent Quick Reference

Each agent follows this pattern:
1. **Announce start** with banner
2. **Read handoff** from previous agent (except Research Agent)
3. **Verify environment** (build/test status)
4. **Execute responsibilities** per section 3.X
5. **Log activities** in audit trail
6. **Create handoff** for next agent
7. **Announce completion** and **AUTOMATICALLY proceed**

| Agent | Section | Key Inputs | Key Outputs |
|-------|---------|------------|-------------|
| Research | 3.1 | PRD, Plan | Feature spec, ADRs |
| Test | 3.2 | Feature spec, ADRs | Unit tests |
| Implementation | 3.3 | Tests, Spec | Production code |
| Validation | 3.4 | Code, Spec | Validation report |
| Security | 3.5 | Code | Security report |
| Integration | 3.6 | All packages | E2E tests, README |
| Documentation | 3.7 | All docs | Verified/updated docs |

#### Research Agent Execution
```markdown
═══════════════════════════════════════════════════════════════
🤖 RESEARCH AGENT STARTING
═══════════════════════════════════════════════════════════════

## Objectives
1. Analyze PRD and extract requirements
2. Research implementation approaches
3. Create feature specifications
4. Write Architecture Decision Records

## Required Reading
- `tnt.prd` - Product Requirements Document
- `docs/strategy/AGENTIC-SDLC-PLAN.md` - This plan

## Actions
1. Read and summarize PRD requirements
2. Research best practices (web search if needed)
3. Create `specs/features/real-time-transcription.md`
4. Create ADRs for each major technical decision
5. Document all research in audit trail

## Outputs
- [ ] Feature specification created
- [ ] ADRs created (minimum 3)
- [ ] Audit trail completed
- [ ] Handoff document created

## Completion
When all outputs exist, announce completion and create handoff.
Then AUTOMATICALLY proceed to Test Agent (no user prompt).
```

#### Test Agent Execution
```markdown
═══════════════════════════════════════════════════════════════
🤖 TEST AGENT STARTING
═══════════════════════════════════════════════════════════════

## Startup
1. Read handoff: `docs/handoffs/{date}-research-to-test.md`
2. Acknowledge receipt in handoff document

## Objectives
1. Create unit tests for domain models
2. Create unit tests for services
3. Define test doubles at boundaries
4. Follow Khorikov's testing principles

## Required Reading
- Handoff document from Research Agent
- `specs/features/real-time-transcription.md`
- All ADRs in `docs/architecture/`

## Actions
1. Create tests in `packages/*/tests/`
2. Tests should be syntactically valid
3. Tests can fail (no implementation yet)
4. Follow AAA pattern

## Outputs
- [ ] Unit tests for @tnt/core
- [ ] Unit tests for @tnt/server
- [ ] Unit tests for @tnt/transcription
- [ ] Integration test structure
- [ ] Audit trail completed
- [ ] Handoff document created

## Completion
When all outputs exist, announce completion and create handoff.
Then AUTOMATICALLY proceed to Implementation Agent (no user prompt).
```

#### Implementation Agent Execution
```markdown
═══════════════════════════════════════════════════════════════
🤖 IMPLEMENTATION AGENT STARTING
═══════════════════════════════════════════════════════════════

## Startup
1. Read handoff: `docs/handoffs/{date}-test-to-implement.md`
2. Acknowledge receipt

## Objectives
1. Implement code to pass all tests (TDD)
2. Follow Clean Code principles
3. No shortcuts or TODOs

## Required Reading
- Handoff from Test Agent
- All test files
- Feature specification
- ADRs

## Actions
1. Implement domain models in @tnt/core
2. Implement services
3. Implement UI components
4. Run tests continuously: `pnpm test`
5. Ensure build passes: `pnpm build`

## Outputs
- [ ] All tests passing
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] No `any` types
- [ ] Audit trail completed
- [ ] Handoff document created

## Completion
When all outputs exist, announce completion and create handoff.
Then AUTOMATICALLY proceed to Validation Agent (no user prompt).
```

#### Validation Agent Execution
```markdown
═══════════════════════════════════════════════════════════════
🤖 VALIDATION AGENT STARTING
═══════════════════════════════════════════════════════════════

## Startup
1. Read handoff: `docs/handoffs/{date}-implement-to-validate.md`
2. Acknowledge receipt

## Objectives
1. Verify implementation against specification
2. Check all acceptance criteria
3. Identify gaps or deviations
4. Detect any loop patterns from previous agents

## Required Reading
- Handoff from Implementation Agent
- Feature specification (for acceptance criteria)
- Implementation code
- Test results

## Actions
1. Run validation checklist (section 3.4)
2. Compare implementation to spec line-by-line
3. Document any gaps
4. Verify no TODO/FIXME unresolved
5. Check for loop patterns

## Outputs
- [ ] Validation report
- [ ] Gap analysis (if any)
- [ ] Loop detection report (if any)
- [ ] Audit trail completed
- [ ] Handoff document created

## Completion
When all outputs exist, announce completion and create handoff.
Then AUTOMATICALLY proceed to Security Agent (no user prompt).
```

#### Security Agent Execution
```markdown
═══════════════════════════════════════════════════════════════
🤖 SECURITY AGENT STARTING
═══════════════════════════════════════════════════════════════

## Startup
1. Read handoff: `docs/handoffs/{date}-validate-to-security.md`
2. Acknowledge receipt

## Objectives
1. Run security scans
2. Audit dependencies
3. Check for vulnerabilities
4. Verify no secrets in code

## Required Reading
- Handoff from Validation Agent
- All source code

## Actions
1. Run `pnpm audit`
2. Check for hardcoded secrets
3. Review input validation
4. Check for XSS vulnerabilities
5. Verify no eval() or dynamic code execution

## Outputs
- [ ] Security scan results
- [ ] Vulnerability assessment
- [ ] Remediation actions (if needed)
- [ ] Audit trail completed
- [ ] Handoff document created

## Completion
When all outputs exist, announce completion and create handoff.
Then AUTOMATICALLY proceed to Integration Agent (no user prompt).
```

#### Integration Agent Execution
```markdown
═══════════════════════════════════════════════════════════════
🤖 INTEGRATION AGENT STARTING
═══════════════════════════════════════════════════════════════

## Startup
1. Read handoff: `docs/handoffs/{date}-security-to-integration.md`
2. Acknowledge receipt

## Objectives
1. Write E2E tests
2. Verify full stack integration
3. Update documentation
4. Prepare for merge

## Required Reading
- Handoff from Security Agent
- All previous audit trails
- README.md

## Actions
1. Create E2E tests in `tests/e2e/`
2. Run full test suite
3. Update README with final instructions
4. Verify no merge conflicts
5. Create final summary

## Outputs
- [ ] E2E tests passing
- [ ] README updated
- [ ] Documentation complete
- [ ] Final audit trail
- [ ] Final handoff (for human review)

## Completion
After Integration Agent completes, announce completion and create handoff.
Then AUTOMATICALLY proceed to Documentation Agent (no user prompt).
```

#### Documentation Agent Execution
```markdown
═══════════════════════════════════════════════════════════════
🤖 DOCUMENTATION AGENT STARTING
═══════════════════════════════════════════════════════════════

## Startup
1. Read handoff: `docs/handoffs/{date}-integration-to-documentation.md`
2. Acknowledge receipt

## Objectives
1. Review all documentation for accuracy
2. Update README with latest features
3. Ensure API docs match implementation
4. Verify ADRs reflect actual decisions

## Required Reading
- Handoff from Integration Agent
- All documentation in docs/
- README.md
- All specs/features/

## Actions
1. Review README for accuracy
2. Verify ADRs match implementation
3. Check feature specs match what was built
4. Ensure audit trails are complete
5. Update any outdated documentation

## Outputs
- [ ] README verified/updated
- [ ] All documentation accurate
- [ ] Final audit trail
- [ ] Final completion handoff

## Completion
After Documentation Agent completes, the WORKFLOW IS COMPLETE.
Announce: "✅ AGENTIC WORKFLOW COMPLETE - All 7 agents finished"
Human review is recommended before merge to main.
```

### 10.7 Context Clearing Between Agents

**NOTE**: Context clearing is conceptual. In practice, the agent continues automatically.
The handoff document ensures all context is preserved for auditability.

```markdown
## Context Clear Protocol (Automatic Flow)

After agent completion:
1. Verify handoff document is complete
2. Verify audit trail is complete
3. Commit all changes
4. **IMMEDIATELY start next agent** (no user prompt)
5. Next agent reads from:
   - Handoff document
   - Files in repository
   - This plan document
```

### 10.8 Error Handling During Execution

**CRITICAL**: Only prompt user when truly blocked. Attempt self-recovery first.

| Situation | Action | Prompt User? |
|-----------|--------|--------------|
| Build fails (1st-2nd time) | Analyze error, attempt fix | NO |
| Build fails (3rd time) | Document, escalate | YES |
| Tests fail | Analyze, fix implementation or test | NO |
| Handoff missing | Cannot proceed | YES |
| Spec ambiguous (minor) | Make reasonable assumption, document | NO |
| Spec ambiguous (critical path) | Need clarification | YES |
| Security vulnerability (low/medium) | Document, continue | NO |
| Security vulnerability (critical) | Stop, report | YES |
| Loop detected (can self-resolve) | Follow STOP protocol, try alternative | NO |
| Loop detected (cannot resolve) | Document, escalate | YES |

#### Concrete Error Examples

**Example 1: Build Failure (Self-Recoverable)**
```
Error: Cannot find module '@tnt/core'
```
**Action**: Check package.json dependencies, run `pnpm install`, verify tsconfig paths. Fix and retry.

**Example 2: Build Failure (Requires Escalation)**
```
Error: node-gyp rebuild failed (3rd attempt)
Native module compilation error on whisper-node
```
**Action**: Document in audit trail, escalate to user with error details and attempted solutions.

**Example 3: Test Failure (Self-Recoverable)**
```
FAIL packages/core/tests/transcript.test.ts
  × should validate transcript text is not empty
    Expected: TranscriptError
    Received: undefined
```
**Action**: Implementation missing validation. Add validation logic to Transcript class.

**Example 4: Spec Ambiguity (Minor - Self-Resolve)**
```
Spec says "display transcript updates in real-time"
Question: What's the update interval?
```
**Action**: Assume 100ms debounce (reasonable default), document decision in audit trail.

**Example 5: Spec Ambiguity (Critical - Escalate)**
```
Spec says "support multiple languages"
Question: Which languages? How many? Translation or just transcription?
```
**Action**: This affects architecture. Stop and ask user for clarification.

**Example 6: Security Vulnerability (Low - Continue)**
```
pnpm audit: 2 low severity vulnerabilities in dev dependencies
```
**Action**: Document in security report, continue (dev-only, not production risk).

**Example 7: Security Vulnerability (Critical - Escalate)**
```
pnpm audit: 1 critical vulnerability in production dependency
CVE-2024-XXXXX: Remote code execution in ws@7.4.0
```
**Action**: Stop immediately, report to user with CVE details and remediation options.

**Example 8: Loop Detection**
```
Attempt 1: Fix TypeScript error by adding type annotation
Attempt 2: Fix TypeScript error by changing import
Attempt 3: Fix TypeScript error by reverting and re-adding
```
**Action**: STOP. This is an oscillating loop. Document both approaches, pick one definitively, or escalate if neither works.

### 10.9 Quick Start Command

When user says "Execute the plan", run this sequence and then **AUTOMATICALLY EXECUTE ALL AGENTS**:

```bash
# Step 1: Determine current state
cd "$(git rev-parse --show-toplevel)"
echo "=== Current State ==="
ls -la docs/handoffs/ 2>/dev/null || echo "No handoffs yet"
ls -la docs/audit-trail/ 2>/dev/null || echo "No audit trails yet"

# Step 2: Verify environment
pnpm install
pnpm build
pnpm test

# Step 3: Identify next agent (check latest handoff)
# If no handoffs → Start Research Agent
# If handoff exists → Read "Next Agent" field and start that agent
```

Then execute agents automatically in sequence until complete or blocked:
1. Start with identified agent
2. Complete all agent tasks
3. Create handoff document
4. **IMMEDIATELY proceed to next agent** (no user prompt)
5. Repeat until Documentation Agent completes or blocker encountered

---

## 11. Next Steps (Legacy Section)

**For automated execution** (PREFERRED):

Say "Execute the plan" and the agent will:
1. Determine current workflow state
2. Load appropriate agent context
3. Execute agent responsibilities
4. Create handoff for next agent
5. **AUTOMATICALLY continue to next agent** (no prompts between agents)
6. Complete when Documentation Agent finishes OR stop when blocked

**For manual execution** (fallback):

1. Read this entire plan thoroughly
2. Initialize the monorepo structure using Turborepo (if not done)
3. Begin with Research Agent tasks
4. Follow the agent workflow sequentially
5. Create audit trail documents for each agent phase
6. Ensure all CI gates pass before proceeding to next agent
7. Update this plan if adjustments are needed (document why)

---

*This plan serves as the authoritative guide for implementing the TnT MVP using an agentic SDLC workflow.*

**Key Automation Principle**: Agents execute automatically in sequence. User input is ONLY requested when truly blocked.
