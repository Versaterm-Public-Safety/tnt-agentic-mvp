# {Agent Name} Audit Trail

<!--
INSTRUCTIONS FOR AGENTS:
1. Copy this template to: docs/audit-trail/{date}-{agent}-{feature}.md
2. Fill in all sections as you work
3. Log EVERY significant action in the Activity Log
4. Complete the startup announcement FIRST
5. Complete the completion announcement LAST
-->

## Metadata

| Field | Value |
|-------|-------|
| **Date** | {YYYY-MM-DD} |
| **Agent** | {Agent Name} |
| **Feature** | {Feature Name} |
| **Branch** | {branch name} |
| **Start Time** | {ISO 8601 timestamp} |
| **End Time** | {ISO 8601 timestamp} |
| **Duration** | {elapsed time} |
| **Status** | {SUCCESS / PARTIAL / BLOCKED} |
| **Previous Agent** | {agent name or "None"} |
| **Next Agent** | {agent name or "Human Review"} |

---

## 🚀 Agent Startup

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

**Objectives for this session:**
1. {Primary objective}
2. {Secondary objective}
3. {Additional objectives...}

---

## 📋 Environment Verification

| Check | Status | Details |
|-------|--------|---------|
| Git status | {✅ clean / ⚠️ dirty} | {details if dirty} |
| Build status | {✅ pass / ❌ fail} | {error if fail} |
| Test status | {✅ X/Y passing / ❌ failures} | {failing tests if any} |
| Node version | {version} | |
| pnpm version | {version} | |
| Dependencies | {✅ up to date / ⚠️ outdated} | |

**Commands run:**
```bash
git status
pnpm build
pnpm test
node --version
pnpm --version
```

---

## 📥 Handoff Acknowledgment

<!--Skip this section if first agent (Research Agent)-->

| Field | Value |
|-------|-------|
| **From Agent** | {previous agent name} |
| **Handoff Document** | {path} |
| **Read Completely** | {Yes/No} |

**Key items from handoff:**
1. {Important item 1}
2. {Important item 2}
3. {Important item 3}

**Blockers identified in handoff:**
- {Blocker 1 or "None identified"}

**Questions/Clarifications needed:**
- {Question 1 or "None"}

---

## 📝 Activity Log

<!--
Log EVERY significant action here in chronological order.
Use the action types: FILE_CREATE, FILE_MODIFY, FILE_DELETE, TEST_RUN, 
BUILD_RUN, DECISION, ISSUE_FOUND, ISSUE_RESOLVED, BLOCKED, ESCALATE
-->

### {timestamp} - {ACTION_TYPE}
- **Action**: {what was done}
- **Files**: {files affected, or "N/A"}
- **Result**: {success / failure / partial}
- **Notes**: {any relevant details}

---

### {timestamp} - {ACTION_TYPE}
- **Action**: {what was done}
- **Files**: {files affected, or "N/A"}
- **Result**: {success / failure / partial}
- **Notes**: {any relevant details}

---

<!--Add more activity entries as needed-->

---

## 🔍 Decisions Made

<!--Document all technical decisions with rationale-->

| # | Decision | Rationale | Alternatives Considered |
|---|----------|-----------|------------------------|
| 1 | {decision} | {why} | {what else was considered} |
| 2 | {decision} | {why} | {what else was considered} |

---

## ⚠️ Issues Encountered

<!--Document all issues, whether resolved or not-->

### Issue 1: {title}
- **Severity**: {High / Medium / Low}
- **Description**: {what happened}
- **Root Cause**: {why it happened, if known}
- **Resolution**: {how it was fixed, or "Unresolved - escalated"}
- **Time Spent**: {duration}

### Issue 2: {title}
- **Severity**: {High / Medium / Low}
- **Description**: {what happened}
- **Root Cause**: {why it happened, if known}
- **Resolution**: {how it was fixed, or "Unresolved - escalated"}
- **Time Spent**: {duration}

---

## 📊 Work Summary

### Files Changed
| Action | Count | Files |
|--------|-------|-------|
| Created | {n} | {file1, file2, ...} |
| Modified | {n} | {file1, file2, ...} |
| Deleted | {n} | {file1, file2, ...} |

### Test Results
| Metric | Value |
|--------|-------|
| Tests Added | {n} |
| Tests Modified | {n} |
| Tests Passing | {X/Y} |
| Test Coverage | {%} (if applicable) |

### Quality Metrics
| Metric | Value |
|--------|-------|
| Decisions Made | {n} |
| Issues Found | {n} |
| Issues Resolved | {n} |
| Issues Escalated | {n} |
| Blockers Encountered | {n} |

---

## ✅ Agent Completion

```
═══════════════════════════════════════════════════════════════
✅ {AGENT_NAME} COMPLETE
═══════════════════════════════════════════════════════════════
Duration: {elapsed time}
Status: {SUCCESS / PARTIAL / BLOCKED}
Files Changed: {count}
Tests: {passing}/{total}
Next: {next agent name}
Handoff: {handoff document path}
═══════════════════════════════════════════════════════════════
```

### Completion Checklist
- [ ] All assigned tasks completed
- [ ] Build passes
- [ ] Tests pass (or failures documented)
- [ ] All decisions documented
- [ ] All issues documented
- [ ] Activity log complete
- [ ] Handoff document created
- [ ] Commits made with proper prefix

### Handoff Document Created
- **Path**: `docs/handoffs/{date}-{from}-to-{to}.md`
- **Created**: {timestamp}

---

## 📎 Attachments & References

### Internal Documents Referenced
- {path/to/doc1} - {why referenced}
- {path/to/doc2} - {why referenced}

### External Resources Used
- {URL} - {what it was used for}
- {URL} - {what it was used for}

### Related Commits
| SHA | Message |
|-----|---------|
| {sha} | {commit message} |
| {sha} | {commit message} |

---

## 🔄 Recommendations for Next Agent

1. {Recommendation 1}
2. {Recommendation 2}
3. {Recommendation 3}

---

*Audit trail completed by {Agent Name} at {timestamp}*
