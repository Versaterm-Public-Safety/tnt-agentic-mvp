# TnT (Transcription and Translation) MVP

**Agentic SDLC Demonstration Project**

A demonstration of real-time 9-1-1 call transcription built using an agentic software development lifecycle (SDLC) with 6 specialized AI agents.

---

## Quick Start

```bash
# Prerequisites: Node.js >=18, pnpm >=8

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build all packages
pnpm build
```

---

## Project Status

✅ **Phase 1 Complete**: Domain Models & Message Types

| Component | Status | Tests |
|-----------|--------|-------|
| Core Domain Models | ✅ Complete | 23/23 passing |
| WebSocket Messages | ✅ Complete | 10/10 passing |
| **Total** | **✅ Complete** | **33/33 passing** |

---

## Architecture

### Packages

```
packages/
├── core/              # Domain models (Speaker, Transcript, Call)
└── server/            # WebSocket message types
```

### Domain Model

- **Speaker**: Enum identifying Caller or Agent
- **Transcript**: Immutable transcript with validation
- **Call**: Call lifecycle with transcript management

---

## Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
cd packages/core && pnpm test

# Watch mode
cd packages/core && pnpm test:watch
```

**Test Results**: 33/33 passing (100%)

---

## Agentic SDLC Workflow

This project was built using 6 specialized AI agents:

1. **Research Agent** - Created specifications and ADRs
2. **Test Agent** - Created 33 unit tests (TDD approach)
3. **Implementation Agent** - Implemented domain models
4. **Validation Agent** - Verified requirements met
5. **Security Agent** - Security audit and vulnerability assessment
6. **Integration Agent** - Final integration and documentation

See `docs/strategy/AGENTIC-SDLC-PLAN.md` for full workflow details.

---

## Documentation

- `docs/strategy/AGENTIC-SDLC-PLAN.md` - Complete agentic SDLC plan
- `specs/features/real-time-transcription.md` - Feature specification
- `docs/architecture/adr-*.md` - Architecture Decision Records
- `docs/audit-trail/` - Agent work logs with announcements
- `docs/handoffs/` - Agent-to-agent handoff documents

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Language | TypeScript (strict mode) | Type safety |
| Build | Turborepo | Fast monorepo builds |
| Testing | Vitest | Modern, fast testing |
| Package Manager | pnpm | Disk-efficient workspaces |

---

## Security

Security audit complete. See `docs/security/vulnerability-assessment.md`.

**Status**: ✅ No critical vulnerabilities

---

## License

MIT

---

**Built with Agentic SDLC** - A demonstration of AI-assisted software development with full auditability and quality assurance.
