# ADR-001: Monorepo with Turborepo

## Status
**Accepted** - 2025-12-31

## Context

The TnT (Transcription and Translation) MVP requires managing multiple TypeScript packages with shared dependencies, coordinated builds, and efficient caching. We need a monorepo strategy that supports:

1. **Multiple packages**: @tnt/core (domain), @tnt/siprec (protocol), @tnt/transcription (AI), @tnt/server (WebSocket), @tnt/ui (React)
2. **Dependency management**: Packages depend on each other (e.g., server depends on core, transcription)
3. **Build orchestration**: Packages must build in dependency order
4. **Fast iteration**: Changes in one package shouldn't require rebuilding unaffected packages
5. **CI/CD efficiency**: Build only what changed

## Decision

We will use **Turborepo** as our monorepo build system with **pnpm** as the package manager.

**Repository structure**:
```
tnt-agentic-mvp/
├── packages/
│   ├── core/          # @tnt/core
│   ├── siprec/        # @tnt/siprec
│   ├── transcription/ # @tnt/transcription
│   ├── server/        # @tnt/server
│   └── ui/            # @tnt/ui
├── turbo.json         # Turborepo configuration
└── pnpm-workspace.yaml # pnpm workspace definition
```

**Turbo configuration** (`turbo.json`):
```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {},
    "dev": {"cache": false}
  }
}
```

## Rationale

### Why Turborepo?

**Pros**:
- **Smart caching**: Caches build outputs based on input hashing (files, environment, dependencies)
- **Dependency-aware**: Automatically builds packages in correct order using `^build` syntax
- **Fast**: Only rebuilds what changed (incremental builds)
- **Simple**: Minimal configuration compared to alternatives
- **Remote caching**: Supports Vercel remote cache (future)
- **TypeScript-friendly**: Built with TypeScript projects in mind

**Cons**:
- Newer tool (less mature than Lerna)
- Smaller ecosystem than Nx
- Limited to build orchestration (not a full framework like Nx)

### Alternatives Considered

1. **Nx**
   - **Pros**: More features (code generation, affected commands, plugin ecosystem)
   - **Cons**: More complex, steeper learning curve, heavier weight for our needs
   - **Why not chosen**: Overkill for MVP, adds unnecessary complexity

2. **Lerna**
   - **Pros**: Mature, widely adopted, proven at scale
   - **Cons**: Slower builds (no smart caching), more manual configuration, less active development
   - **Why not chosen**: Performance inferior to Turborepo, caching is critical for CI/CD

3. **pnpm workspaces only** (no build orchestration)
   - **Pros**: Simplest setup, just package management
   - **Cons**: No automatic build order, no caching, manual `turbo` equivalents
   - **Why not chosen**: Build orchestration essential for 7+ packages

### Why pnpm?

- **Fast**: Faster installs than npm/yarn (content-addressed storage)
- **Disk efficient**: Shared node_modules via symlinks
- **Strict**: Doesn't hoist dependencies (prevents phantom dependencies)
- **Workspace support**: Native workspace protocol (`workspace:*`)

## Consequences

### Positive

✅ **Fast local development**: Turborepo caches build outputs, rebuilding only changed packages  
✅ **CI/CD efficiency**: GitHub Actions can use Turbo's remote cache, speeding up builds  
✅ **Clear dependency graph**: `turbo.json` makes package relationships explicit  
✅ **Easy parallel execution**: `turbo run build --parallel` runs independent builds concurrently  
✅ **Developer experience**: Single `pnpm build`, `pnpm test` commands work across all packages  

### Negative

⚠️ **Cache invalidation complexity**: Must understand when cache is stale (turbo handles most cases)  
⚠️ **Learning curve**: Team must learn Turborepo concepts (pipelines, caching)  
⚠️ **Debugging builds**: Cached builds can hide issues (use `--force` to bypass cache)  

### Neutral

🔵 **Vendor dependency**: Relying on Vercel's Turborepo (though open-source)  
🔵 **Migration path**: If Turborepo becomes inadequate, can migrate to Nx with similar structure  

## References

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspace Guide](https://pnpm.io/workspaces)
- [Monorepo Best Practices](https://monorepo.tools/)
- [Turborepo vs Nx Comparison](https://turbo.build/repo/docs/comparisons/nx)

## Validation

**Verify decision**:
```bash
# 1. Install dependencies
pnpm install

# 2. Build all packages
pnpm build

# 3. Verify caching (second run should be instant)
pnpm build # Should output ">>> FULL TURBO" for cached packages

# 4. Change one file, rebuild
echo "// comment" >> packages/core/src/index.ts
pnpm build # Only @tnt/core and dependents rebuild
```

**Success criteria**:
- ✅ All packages build in correct order
- ✅ Cached builds complete <1 second
- ✅ Changing one package doesn't rebuild unaffected packages

---

**Status**: Accepted  
**Implemented**: 2025-12-31  
**Last Reviewed**: 2025-12-31
