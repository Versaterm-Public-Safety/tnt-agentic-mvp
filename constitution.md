# Technical Constitution

**Project**: TnT (Transcription and Translation) MVP  
**Purpose**: Define non-negotiable technical principles for all contributors (human and AI)  
**Authority**: All code must comply with this constitution

---

## 1. Type Safety and Language

### 1.1 TypeScript Strict Mode
**Rule**: All code MUST use TypeScript with `strict: true`

**Rationale**: Type safety catches errors at compile time, provides self-documenting code, and enables better AI code generation.

**Enforcement**:
- ❌ FORBIDDEN: `any` types
- ❌ FORBIDDEN: `@ts-ignore` without justification
- ✅ REQUIRED: Explicit return types for public functions
- ✅ REQUIRED: Proper null/undefined handling

**Example**:
```typescript
// ❌ BAD
function process(data: any): any {
  return data.value;
}

// ✅ GOOD
function process(data: { value: string }): string {
  return data.value;
}
```

---

## 2. Testing Principles

### 2.1 Test-Driven Development (TDD)
**Rule**: Tests MUST be written before implementation

**Rationale**: TDD ensures requirements are understood before coding, provides regression safety, and creates executable specifications.

**Enforcement**:
- ✅ REQUIRED: Tests exist for all domain logic
- ✅ REQUIRED: Tests pass before merging
- ✅ REQUIRED: AAA pattern (Arrange-Act-Assert)
- ✅ REQUIRED: Behavior testing (not implementation details)

### 2.2 Test Isolation
**Rule**: Tests MUST be independent and deterministic

**Rationale**: Isolated tests prevent cascading failures and enable parallel execution.

**Enforcement**:
- ❌ FORBIDDEN: Shared mutable state between tests
- ❌ FORBIDDEN: Tests that depend on execution order
- ✅ REQUIRED: Each test can run independently
- ✅ REQUIRED: Mocking only at architectural boundaries

---

## 3. Code Quality

### 3.1 Clean Code Principles
**Rule**: Code MUST follow Robert C. Martin's Clean Code principles

**Enforcement**:
- ✅ REQUIRED: Meaningful, intention-revealing names
- ✅ REQUIRED: Functions do one thing (SRP)
- ✅ REQUIRED: Functions are small (<20 lines preferred)
- ❌ FORBIDDEN: Side effects in pure functions
- ❌ FORBIDDEN: Magic numbers (use named constants)

### 3.2 DRY (Don't Repeat Yourself)
**Rule**: No code duplication

**Enforcement**:
- ❌ FORBIDDEN: Copy-paste code
- ✅ REQUIRED: Extract common logic to functions
- ✅ REQUIRED: Use composition over inheritance

### 3.3 Immutability
**Rule**: Domain entities SHOULD be immutable where appropriate

**Rationale**: Immutability prevents accidental modification, enables safe concurrency, and simplifies reasoning about state.

**Enforcement**:
- ✅ PREFERRED: `readonly` properties
- ✅ PREFERRED: Pure functions (no mutation)
- ✅ ALLOWED: Mutable state for lifecycle management (e.g., Call status)

---

## 4. Security

### 4.1 Input Validation
**Rule**: ALL external input MUST be validated

**Enforcement**:
- ✅ REQUIRED: Validation at system boundaries
- ✅ REQUIRED: Type guards for runtime checks
- ❌ FORBIDDEN: Trusting client input

### 4.2 No Dynamic Code Execution
**Rule**: NEVER use `eval()`, `Function()`, or `new Function()`

**Rationale**: Dynamic code execution is a critical security vulnerability.

**Enforcement**:
- ❌ FORBIDDEN: `eval()`
- ❌ FORBIDDEN: `Function()` constructor
- ❌ FORBIDDEN: Executing untrusted code

### 4.3 No Secrets in Code
**Rule**: Secrets MUST NOT be committed to version control

**Enforcement**:
- ❌ FORBIDDEN: API keys, passwords, tokens in code
- ✅ REQUIRED: Environment variables for secrets
- ✅ REQUIRED: `.gitignore` for sensitive files

---

## 5. Architecture

### 5.1 Separation of Concerns
**Rule**: Clear boundaries between layers

**Enforcement**:
- ✅ REQUIRED: Domain logic in `@tnt/core`
- ✅ REQUIRED: Infrastructure in separate packages
- ❌ FORBIDDEN: Business logic in UI components
- ❌ FORBIDDEN: Direct database access from UI

### 5.2 Package Independence
**Rule**: Packages MUST have minimal coupling

**Enforcement**:
- ✅ ALLOWED: `@tnt/server` depends on `@tnt/core`
- ❌ FORBIDDEN: Circular dependencies
- ✅ REQUIRED: Clear, documented interfaces

### 5.3 RFC Compliance
**Rule**: Follow RFC standards for protocols

**Enforcement**:
- ✅ REQUIRED: WebSocket (RFC 6455) compliance
- ✅ REQUIRED: SIPREC (RFC 7866) compliance (when implemented)
- ✅ REQUIRED: SIP (RFC 3261) compliance (when implemented)

---

## 6. Documentation

### 6.1 Specification-Driven
**Rule**: Specifications are the single source of truth

**Enforcement**:
- ✅ REQUIRED: Every feature has a spec in `specs/features/`
- ✅ REQUIRED: Specs updated before code changes
- ✅ REQUIRED: Traceability from code → spec → PRD

### 6.2 Architecture Decision Records (ADRs)
**Rule**: All significant decisions MUST be documented

**Enforcement**:
- ✅ REQUIRED: ADR for major technical choices
- ✅ REQUIRED: Rationale and alternatives considered
- ✅ REQUIRED: External references (RFCs, books, articles)

### 6.3 Auditability
**Rule**: All work MUST be traceable

**Enforcement**:
- ✅ REQUIRED: Audit trail for each agent
- ✅ REQUIRED: Handoff documents between agents
- ✅ REQUIRED: Git commits with `[agent-name]` prefix

---

## 7. Dependencies

### 7.1 Minimal Dependencies
**Rule**: Only add dependencies when justified

**Rationale**: Each dependency is a security and maintenance risk.

**Enforcement**:
- ✅ REQUIRED: Justify new dependencies in ADR
- ✅ REQUIRED: Regular security audits (`pnpm audit`)
- ❌ FORBIDDEN: Abandoned or unmaintained packages

### 7.2 Pinned Versions
**Rule**: Lock dependency versions

**Enforcement**:
- ✅ REQUIRED: `pnpm-lock.yaml` committed
- ✅ REQUIRED: Exact versions in `package.json` for production deps

---

## 8. Git and Commits

### 8.1 Commit Messages
**Rule**: Commits MUST follow conventional commit format

**Format**: `[agent-name] type: description`

**Types**: `feat`, `fix`, `test`, `docs`, `refactor`, `security`, `chore`

**Example**: `[implementation-agent] feat: implement Transcript class with validation`

### 8.2 Atomic Commits
**Rule**: Each commit SHOULD represent one logical change

**Enforcement**:
- ✅ PREFERRED: Small, focused commits
- ❌ DISCOURAGED: Giant commits with unrelated changes

---

## 9. Performance

### 9.1 Latency Targets
**Rule**: Meet performance requirements from PRD

**Enforcement**:
- ✅ REQUIRED: Transcription display < 2 seconds (PRD 4.1 AC-3)
- ✅ REQUIRED: WebSocket transport < 100ms overhead
- ✅ REQUIRED: UI render < 100ms

### 9.2 Build Performance
**Rule**: Fast, incremental builds

**Enforcement**:
- ✅ REQUIRED: Turborepo caching enabled
- ✅ REQUIRED: Build time < 3 seconds (full rebuild)

---

## 10. AI Agent Compatibility

### 10.1 Clear Specifications
**Rule**: Specs MUST be unambiguous and AI-consumable

**Enforcement**:
- ✅ REQUIRED: Structured markdown
- ✅ REQUIRED: Explicit acceptance criteria
- ✅ REQUIRED: Examples where helpful
- ❌ FORBIDDEN: Vague or ambiguous requirements

### 10.2 Context Preservation
**Rule**: All context MUST be preserved in handoff documents

**Enforcement**:
- ✅ REQUIRED: Handoff document for each agent transition
- ✅ REQUIRED: No information loss between agents
- ✅ REQUIRED: Complete audit trail

---

## Enforcement

**Validation**: Validation Agent checks constitution compliance  
**CI/CD**: Automated checks for type safety, tests, linting  
**Review**: Human review for final approval

**Exceptions**: Any deviation from this constitution MUST:
1. Be documented in an ADR
2. Include justification and alternatives considered
3. Be approved by project lead (or in this case, explicitly noted in audit trail)

---

**Last Updated**: 2025-12-31  
**Authority**: All agents and contributors  
**Scope**: Entire TnT project
