# ADR-003: Use Turborepo for Monorepo Management

**Status**: Accepted  
**Date**: 2025-12-31  
**Deciders**: Research Agent  
**Tags**: build, tooling, architecture

---

## Context

The TnT system consists of multiple packages:
- `@tnt/core` - Domain models
- `@tnt/transcription` - Whisper integration
- `@tnt/server` - WebSocket server
- `@tnt/ui` - React frontend

We need a build system that:
- Enables code sharing between packages
- Provides fast incremental builds
- Supports parallel task execution
- Has good AI agent compatibility (clear command structure)
- Keeps all code in a single git repository (auditability)

---

## Decision

Use **Turborepo** with **pnpm workspaces** for monorepo management.

---

## Rationale

### Alternatives Considered

1. **Nx**
   - Pros: Comprehensive, powerful code generation, great caching
   - Cons: Complex configuration, steep learning curve, heavyweight for small project
   - Rejected because: Too much complexity for 4-7 packages

2. **Lerna**
   - Pros: Pioneer in monorepo space, well-known
   - Cons: In maintenance mode (2022), slower than modern alternatives
   - Rejected because: Not actively developed, slower builds

3. **Rush**
   - Pros: Enterprise-grade, excellent for large monorepos
   - Cons: Complex setup, heavy tooling, designed for 100+ packages
   - Rejected because: Overkill for small MVP

4. **Plain npm/yarn workspaces**
   - Pros: Simple, no additional tools
   - Cons: No caching, no parallel execution, manual task orchestration
   - Rejected because: Slow builds, poor dev experience

### Why Turborepo Wins

- **Fast**: Incremental builds with intelligent caching (30-70% faster)
- **Simple**: Minimal configuration (~20 lines in turbo.json)
- **Parallel Execution**: Runs tasks across packages in parallel
- **Remote Caching**: Can enable cloud cache for CI (future)
- **Clear Task Pipeline**: Declarative dependency graph (test → build → deploy)
- **AI-Friendly**: Simple commands (`turbo run build`, `turbo run test`)
- **Single Git History**: All code in one repo (critical for agent audit trail)
- **Active Development**: Backed by Vercel, rapidly improving
- **Excellent DX**: Fast, predictable, easy to debug

---

## References

- [Turborepo Documentation](https://turbo.build/repo/docs) - Official docs
- [Turborepo Handbook](https://turbo.build/repo/docs/handbook) - Best practices
- [Why Turborepo](https://turbo.build/repo/docs/core-concepts/monorepos/why-turborepo) - Comparison with alternatives
- [Vercel Turborepo Benchmark](https://turbo.build/blog/turbo-1-0-0#benchmarks) - Performance data

---

## Consequences

### Positive

- Fast incremental builds (only rebuild changed packages)
- Automatic task orchestration (dependencies run first)
- Clear command structure for agents (`pnpm build`, `pnpm test`, `pnpm lint`)
- Single source of truth (one package.json, one tsconfig.base.json)
- Easier code sharing between packages
- Consistent tooling across all packages
- Simple CI setup (one command runs everything)
- Excellent for auditability (all changes in one commit history)

### Negative

- Another tool to learn (vs plain npm)
- Requires `turbo.json` configuration
- Caching can occasionally cause issues (rare, easy to clear)

### Neutral

- Will use pnpm for package manager (fast, disk-efficient)
- Can migrate to Nx later if project grows significantly
- Remote caching disabled for MVP (can enable in CI later)

---

## Notes

- `turbo.json` defines task pipeline: `build` depends on `^build` (dependency builds first)
- Each package has own `package.json` with scripts
- Root `package.json` has workspace-level scripts
- See `AGENTIC-SDLC-PLAN.md` section 2 for directory structure
