# Agent Handoff Document

## Template Version: 1.0

---

## Handoff Metadata

| Field | Value |
|-------|-------|
| **From Agent** | {Agent Name} |
| **To Agent** | {Next Agent Name} |
| **Date** | {YYYY-MM-DD HH:MM UTC} |
| **Feature** | {Feature Name} |
| **Branch** | {Current Branch} |
| **Commit SHA** | {Latest Commit Hash} |

---

## 1. Context Summary

### 1.1 What Was Done
{Brief summary of completed work - 2-3 sentences}

### 1.2 Current State
{Describe the current state of the codebase/feature}

### 1.3 Key Files Modified/Created
```
{List of key files with brief descriptions}
```

---

## 2. Critical Information for Next Agent

### 2.1 Must-Read Documents
{Ordered list of documents the next agent MUST read before starting}

1. `{path/to/doc1}` - {why it's important}
2. `{path/to/doc2}` - {why it's important}

### 2.2 Key Decisions Made
| Decision | Rationale | Impact on Next Agent |
|----------|-----------|---------------------|
| {Decision 1} | {Why} | {How it affects their work} |
| {Decision 2} | {Why} | {How it affects their work} |

### 2.3 Assumptions Made
- {Assumption 1 and why}
- {Assumption 2 and why}

### 2.4 Technical Constraints
- {Constraint 1}
- {Constraint 2}

---

## 3. Pending Items

### 3.1 Not Started (Next Agent's Responsibility)
- [ ] {Task 1}
- [ ] {Task 2}

### 3.2 Known Issues/Blockers
| Issue | Severity | Notes |
|-------|----------|-------|
| {Issue 1} | High/Medium/Low | {Details} |

### 3.3 Technical Debt Identified
- {Debt item 1} - {Recommendation}
- {Debt item 2} - {Recommendation}

---

## 4. Environment State

### 4.1 Build Status
```
{Output of last build command or status}
```

### 4.2 Test Status
```
{Output of last test run or status}
Tests passing: X/Y
```

### 4.3 Dependencies Added/Changed
| Package | Version | Purpose |
|---------|---------|---------|
| {package} | {version} | {why added} |

### 4.4 Configuration Changes
- {Config file}: {What changed}

---

## 5. Specific Instructions for Next Agent

### 5.1 Starting Point
{Exact first steps the next agent should take}

1. {Step 1}
2. {Step 2}
3. {Step 3}

### 5.2 Commands to Run First
```bash
# Verify environment
{command 1}

# Check current state
{command 2}
```

### 5.3 What to Avoid
- {Anti-pattern or pitfall 1}
- {Anti-pattern or pitfall 2}

### 5.4 Success Criteria
{How the next agent knows they've completed their phase}

- [ ] {Criterion 1}
- [ ] {Criterion 2}

---

## 6. Reference Links

### 6.1 Internal Documentation
- `{path/to/spec}` - Feature specification
- `{path/to/adr}` - Relevant ADRs
- `{path/to/audit}` - Previous audit trail

### 6.2 External References
- {Link 1} - {Description}
- {Link 2} - {Description}

---

## 7. Rollback Information

### 7.1 Last Known Good State
- **Commit**: `{SHA}`
- **Description**: {What was working}

### 7.2 Rollback Command
```bash
git checkout {SHA}
```

---

## 8. Agent-Specific Notes

### 8.1 Patterns Established
{Coding patterns, naming conventions, or approaches established that should be followed}

### 8.2 Deviations from Plan
{Any deviations from AGENTIC-SDLC-PLAN.md and why}

### 8.3 Recommendations
{Suggestions for the next agent based on learnings}

---

**Handoff Checklist (Current Agent)**:
- [ ] All work committed with proper commit messages
- [ ] Build passes
- [ ] Tests pass (or documented why they don't)
- [ ] Audit trail updated
- [ ] This handoff document completed
- [ ] No uncommitted changes

**Acknowledgment (Next Agent)**:
- [ ] Handoff document read completely
- [ ] Must-read documents reviewed
- [ ] Environment verified
- [ ] Ready to proceed

---

*This handoff document ensures context preservation across agent transitions. The next agent should have all information needed to continue work without requiring access to the previous agent's conversation history.*
