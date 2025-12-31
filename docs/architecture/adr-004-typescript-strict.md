# ADR-004: Use TypeScript Strict Mode for Type Safety

**Status**: Accepted  
**Date**: 2025-12-31  
**Deciders**: Research Agent  
**Tags**: typescript, code-quality, development

---

## Context

The TnT system will be implemented primarily by AI agents following the agentic SDLC workflow. The codebase needs to be:
- Type-safe to catch errors at compile time
- AI-agent friendly (clear contracts, autocompletion)
- Refactor-safe (changes don't break unexpectedly)
- Maintainable for future human developers

We need to decide on the TypeScript configuration level and whether to enforce strict type checking.

---

## Decision

Use **TypeScript in strict mode** with `"strict": true` and additional strict flags enabled.

Configuration:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

## Rationale

### Alternatives Considered

1. **JavaScript with JSDoc**
   - Pros: No compilation step, gradual typing
   - Cons: Weak type checking, easy to skip types, poor refactoring support
   - Rejected because: Insufficient safety for AI-generated code

2. **TypeScript with `strict: false`**
   - Pros: Easier to write, fewer compiler errors
   - Cons: Allows `any` types, null/undefined bugs, implicit coercion issues
   - Rejected because: Defeats the purpose of TypeScript

3. **Flow (Facebook's type checker)**
   - Pros: Similar to TypeScript, good type inference
   - Cons: Smaller ecosystem, declining adoption, less tooling support
   - Rejected because: TypeScript is industry standard

### Why Strict TypeScript Wins

- **Compile-Time Safety**: Catches null/undefined errors before runtime
- **AI Agent-Friendly**: Clear type contracts guide AI code generation
- **Refactoring Confidence**: Type errors surface immediately when changing interfaces
- **IDE Support**: Excellent autocompletion, inline documentation (JSDo), error highlighting
- **No `any` Escape Hatch**: Forces explicit typing (critical for AI-generated code)
- **Domain Modeling**: Strong types enforce domain rules at compile time
- **Testing**: Type-safe mocks and test doubles
- **Documentation**: Types serve as inline, enforced documentation

---

## References

- [TypeScript Deep Dive - Strict Mode](https://basarat.gitbook.io/typescript/intro-1/strictnullchecks) - Comprehensive guide
- [TypeScript Handbook - Compiler Options](https://www.typescriptlang.org/tsconfig#strict) - Official docs
- [Matt Pocock - TypeScript Tips](https://www.totaltypescript.com/tips) - Advanced patterns
- ["Effective TypeScript" by Dan Vanderkam](https://effectivetypescript.com/) - Best practices book

---

## Consequences

### Positive

- **Fewer Runtime Errors**: Null checks, type mismatches caught at compile time
- **Better AI Code Generation**: Type signatures guide LLM output
- **Refactoring Safety**: Breaking changes surface immediately
- **Self-Documenting Code**: Types explain intent without comments
- **Catch Errors Early**: Failed builds prevent broken code from running
- **Better IDE Experience**: Inline errors, autocomplete, go-to-definition
- **Enforced Standards**: No `any`, no implicit types (validated in CI)

### Negative

- **Steeper Learning Curve**: More TypeScript knowledge required
- **More Verbose**: Must explicitly type function signatures, parameters
- **Slower Initial Development**: More time writing type definitions
- **Compilation Step**: Need to build before running (adds 1-2s)

### Neutral

- Will use `unknown` instead of `any` for truly dynamic types
- Will allow `as` type assertions only when necessary (minimize usage)
- Each package has own `tsconfig.json` extending `tsconfig.base.json`
- ESLint rule `@typescript-eslint/no-explicit-any` enforced

---

## Notes

- Validation Agent must verify NO `any` types in final code
- Use type guards (`typeof`, `instanceof`, custom predicates) for runtime checks
- Domain models should leverage TypeScript's structural typing
- Consider using `zod` or `io-ts` for runtime validation if needed (Phase 2)
