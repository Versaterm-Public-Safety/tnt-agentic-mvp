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
- `docs/handoffs/{date}-research-to-test.md` - **Handoff document (REQUIRED)**

**Branch**: `agent/research/{feature-name}`

**CI Gate**: Spec completeness check, markdown lint, handoff document present

---

### 3.2 Agent 2: Test Agent

**Purpose**: Create comprehensive test suites following Khorikov's principles

**Startup**: Read `docs/handoffs/{date}-research-to-test.md` FIRST

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
- `docs/handoffs/{date}-test-to-implement.md` - **Handoff document (REQUIRED)**

**Branch**: `agent/test/{feature-name}`

**CI Gate**: Tests must be syntactically valid (can fail execution since no implementation yet), handoff document present

---

### 3.3 Agent 3: Implementation Agent

**Purpose**: Write production code that passes all tests

**Startup**: Read `docs/handoffs/{date}-test-to-implement.md` FIRST

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
- `docs/handoffs/{date}-implement-to-validate.md` - **Handoff document (REQUIRED)**

**Branch**: `agent/implement/{feature-name}`

**CI Gate**: All tests pass, lint passes, build succeeds, handoff document present

---

### 3.4 Agent 4: Validation Agent

**Purpose**: Verify implementation meets requirements exactly, no shortcuts, and detect/break agent loops

**Startup**: Read `docs/handoffs/{date}-implement-to-validate.md` FIRST

**Responsibilities**:
- Compare implementation against spec line-by-line
- Check all acceptance criteria are met
- Identify any gaps or deviations
- Verify edge cases are handled
- Ensure no TODO/FIXME left unresolved
- **Detect when agents are stuck in loops and provide escape instructions**

**Validation Checklist**:
- [ ] All acceptance criteria from spec implemented
- [ ] Error handling complete
- [ ] Edge cases covered
- [ ] No hardcoded values that should be configurable
- [ ] No commented-out code
- [ ] No `any` types in TypeScript
- [ ] All public APIs documented
- [ ] **No agent loop patterns detected**

**Loop Detection and Recovery**:
The Validation Agent must monitor for and address these loop patterns:

| Loop Pattern | Detection Signal | Recovery Action |
|--------------|------------------|-----------------|
| **Repeated file edits** | Same file modified 3+ times with similar changes | Stop editing; document the issue; request human review |
| **Oscillating changes** | Change A → Change B → Change A pattern | Revert to last stable state; document both approaches; choose one definitively |
| **Infinite test failures** | Same test fails 5+ times with different "fixes" | Stop fixing; analyze root cause; consider if test or spec is wrong |
| **Dependency cycles** | Installing/uninstalling same packages | Lock dependencies; document conflict; escalate |
| **Retry without progress** | Same command fails 3+ times | Stop retrying; document error; try alternative approach or escalate |
| **Scope creep loop** | Continuously adding "just one more" fix | Stop; commit current work; create new task for additional items |

**Loop Recovery Instructions**:
When a loop is detected, the Validation Agent should:

1. **STOP** - Immediately halt the current operation
2. **DOCUMENT** - Record in audit trail:
   - What loop pattern was detected
   - How many iterations occurred
   - What was being attempted
   - Current state of the codebase
3. **ASSESS** - Determine root cause:
   - Is the spec ambiguous or contradictory?
   - Is there a technical blocker?
   - Is the approach fundamentally flawed?
4. **DECIDE** - Choose one of:
   - **Revert**: Roll back to last known good state
   - **Escalate**: Flag for human review with clear description
   - **Pivot**: Try a completely different approach (document why)
   - **Accept**: If partial progress is acceptable, commit and move on
5. **ANNOTATE** - Add to validation report:
   ```markdown
   ## Loop Detection Report
   - **Pattern**: [type of loop]
   - **Iterations**: [count]
   - **Resolution**: [action taken]
   - **Recommendation**: [for future agents]
   ```

**Anti-Loop Safeguards**:
- Maximum 3 attempts at any single fix before escalation
- Maximum 5 edit operations on the same file per session
- If build fails 3 times consecutively, stop and analyze
- If tests fail with same error 3 times, investigate test validity
- Track "time in current task" - if >30 mins on single item, reassess

**Outputs**:
- `docs/audit-trail/{date}-validation-{feature}.md` - Validation report (including any loop incidents)
- Issues/comments on PR if gaps found
- **Loop incident reports if any detected**
- `docs/handoffs/{date}-validate-to-security.md` - **Handoff document (REQUIRED)**

**Branch**: Works on existing implementation branch, creates validation commit

**CI Gate**: Validation report generated, no critical gaps, **no unresolved loops**, handoff document present

---

### 3.5 Agent 5: Security Agent

**Purpose**: Identify security vulnerabilities before production

**Startup**: Read `docs/handoffs/{date}-validate-to-security.md` FIRST

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
- `docs/handoffs/{date}-security-to-integration.md` - **Handoff document (REQUIRED)**

**Branch**: Works on existing branch, creates security commit

**CI Gate**: No high/critical vulnerabilities, security report complete, handoff document present

---

### 3.6 Agent 6: Integration Agent

**Purpose**: Ensure components work together, finalize for merge

**Startup**: Read `docs/handoffs/{date}-security-to-integration.md` FIRST

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
- `docs/handoffs/{date}-integration-complete.md` - **Final handoff document (for human review)**

**Branch**: Merges feature branch to `main`

**CI Gate**: Full test suite passes, E2E passes, docs complete, final handoff present

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

### 10.2 Pre-Execution Checklist

Before starting, verify:

```bash
cd /Users/rmohid/Stash/learning/tnt-agentic-mvp

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

Step 5: REPEAT
  └── Continue until Integration Agent completes
```

### 10.4 Agent Execution Order

| Order | Agent | Trigger Condition | Output |
|-------|-------|-------------------|--------|
| 1 | Research Agent | Fresh start OR no specs exist | Feature specs, ADRs |
| 2 | Test Agent | Research handoff exists | Unit tests, integration test structure |
| 3 | Implementation Agent | Test handoff exists | Production code passing tests |
| 4 | Validation Agent | Implementation handoff exists | Validation report |
| 5 | Security Agent | Validation handoff exists | Security report |
| 6 | Integration Agent | Security handoff exists | E2E tests, final merge |

### 10.5 Detailed Execution Instructions

#### Starting Fresh (No Prior Work)

```markdown
## Execute Plan - Fresh Start

1. **Announce**: "🤖 RESEARCH AGENT STARTING"

2. **Read Required Documents**:
   - This plan: `docs/strategy/AGENTIC-SDLC-PLAN.md`
   - PRD: `tnt.prd`
   
3. **Execute Research Agent Tasks**:
   - Create feature specification
   - Write ADRs for key decisions
   - Document research findings
   
4. **Create Outputs**:
   - `specs/features/{feature}.md`
   - `docs/architecture/adr-*.md`
   - `docs/audit-trail/{date}-research-{feature}.md`
   - `docs/handoffs/{date}-research-to-test.md`

5. **Announce**: "✅ RESEARCH AGENT COMPLETE"

6. **Clear context, then continue with Test Agent**
```

#### Resuming from Existing State

```markdown
## Execute Plan - Resume

1. **Check for latest handoff**:
   ```bash
   ls -lt docs/handoffs/ | head -5
   ```

2. **Identify next agent** from handoff document's "Next Agent" field

3. **Load context** from handoff document

4. **Execute that agent's workflow**

5. **Continue sequential execution**
```

### 10.6 Per-Agent Execution Scripts

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
After Integration Agent completes, the workflow is done.
Human review is recommended before merge to main.
```

### 10.7 Context Clearing Between Agents

**CRITICAL**: After each agent completes, the context should be cleared to simulate fresh agent sessions.

```markdown
## Context Clear Protocol

After agent completion:
1. Verify handoff document is complete
2. Verify audit trail is complete
3. Commit all changes
4. **STOP current work**
5. **START fresh** with next agent
6. Next agent reads ONLY from:
   - Handoff document
   - Files in repository
   - This plan document
```

### 10.8 Error Handling During Execution

| Situation | Action |
|-----------|--------|
| Build fails | Stop, document error in audit trail, attempt fix (max 3 tries), escalate if unresolved |
| Tests fail | Stop, analyze failure, fix implementation or test, document decision |
| Handoff missing | Cannot proceed; request human to run previous agent |
| Spec ambiguous | Document ambiguity, make reasonable assumption, note in audit trail |
| Blocker found | Document in audit trail, create issue, escalate to human |
| Loop detected | Follow STOP protocol (section 3.0), document, escalate |

### 10.9 Quick Start Command

When user says "Execute the plan", run this sequence:

```bash
# Step 1: Determine current state
cd /Users/rmohid/Stash/learning/tnt-agentic-mvp
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

Then execute the appropriate agent based on current state.

---

## 11. Next Steps (Legacy Section)

**For manual execution**:

1. Read this entire plan thoroughly
2. Initialize the monorepo structure using Turborepo (if not done)
3. Begin with Research Agent tasks
4. Follow the agent workflow sequentially
5. Create audit trail documents for each agent phase
6. Ensure all CI gates pass before proceeding to next agent
7. Update this plan if adjustments are needed (document why)

**For automated execution**:

Say "Execute the plan" and the agent will:
1. Determine current workflow state
2. Load appropriate agent context
3. Execute agent responsibilities
4. Create handoff for next agent
5. Continue until complete

---

*This plan serves as the authoritative guide for implementing the TnT MVP using an agentic SDLC workflow.*
