# TnT (Transcription and Translation) Constitution

## Core Principles

### I. Specification-Driven Development
Specifications are the single source of truth. Code follows specs, not the other way around. Every feature starts with `/speckit.specify` before any implementation. Changes to requirements trigger spec updates first.

### II. Test-First Development (NON-NEGOTIABLE)
TDD is mandatory: Tests written → Tests fail → Then implement. Red-Green-Refactor cycle strictly enforced. No PR merges without passing tests. Tests exist for all domain logic.

### III. Type Safety First
TypeScript strict mode required. No `any` types allowed. Explicit return types for public functions. Proper null/undefined handling with type guards.

### IV. Library-First Architecture
Every feature starts as a standalone library. Libraries must be self-contained and independently testable. Clear separation: `@tnt/core` for domain, infrastructure in separate packages.

### V. Security by Design
All external input validated at boundaries. No `eval()`, `Function()`, or dynamic code execution. No secrets in code - use environment variables. Regular security audits required.

## Technology Stack

**Language/Version**: TypeScript 5.x with strict mode  
**Primary Dependencies**: ws (WebSocket), vitest (testing), turborepo (build)  
**Storage**: In-memory for MVP (no database required)  
**Testing**: Vitest with AAA pattern  
**Target Platform**: Node.js 20+ server, Modern browsers  
**Performance Goals**: Transcription display < 2 seconds, WebSocket < 100ms overhead

## Development Workflow

### Spec-Kit Commands

| Phase | Command | Purpose |
|-------|---------|---------|
| 1 | `/speckit.constitution` | Establish project principles (this file) |
| 2 | `/speckit.specify` | Create feature specification |
| 3 | `/speckit.clarify` | Resolve ambiguities (optional) |
| 4 | `/speckit.plan` | Technical architecture decisions |
| 5 | `/speckit.tasks` | Generate implementation task list |
| 6 | `/speckit.implement` | Execute implementation |

### Project Structure

```
/
├── constitution.md          # This file - project principles
├── spec.md                  # Product specification (PRD)
├── specs/                   # Feature specifications
│   └── [feature-name]/
│       ├── spec.md          # Feature spec (/speckit.specify)
│       ├── plan.md          # Implementation plan (/speckit.plan)
│       └── tasks.md         # Task list (/speckit.tasks)
├── packages/
│   ├── core/                # @tnt/core - Domain logic
│   └── server/              # @tnt/server - WebSocket server
└── .specify/                # Spec-kit templates and scripts
```

### Quality Gates

| Gate | Check | Required |
|------|-------|----------|
| Type Safety | `tsc --noEmit` | ✅ All files pass |
| Tests | `pnpm test` | ✅ All tests pass |
| Lint | `pnpm lint` | ✅ No errors |
| Build | `pnpm build` | ✅ Successful |

## Governance

- Constitution supersedes all other practices
- Amendments require documentation and justification
- All PRs must verify constitution compliance
- Use `/speckit.clarify` when requirements are ambiguous

**Version**: 1.0.0 | **Ratified**: 2025-12-31 | **Last Amended**: 2025-12-31
