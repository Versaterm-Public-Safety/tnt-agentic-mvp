#!/bin/bash

echo "🧹 Cleaning previous implementation work..."

# Remove handoff and audit trail files (keep templates)
echo "Removing handoff documents..."
find docs/handoffs/ -name "*.md" ! -name "HANDOFF-TEMPLATE.md" -delete

echo "Removing audit trail documents..."
find docs/audit-trail/ -name "*.md" ! -name "AUDIT-TRAIL-TEMPLATE.md" -delete

# Remove feature specs and ADRs
echo "Removing feature specs..."
rm -rf specs/features/*.md 2>/dev/null || true

echo "Removing ADRs (keeping template)..."
find docs/architecture/ -name "adr-*.md" ! -name "adr-template.md" -delete

# Remove implementation packages but keep structure
echo "Removing package implementations..."
rm -rf packages/core packages/server packages/ui packages/transcription packages/siprec packages/siprec-proxy packages/sbc-simulator 2>/dev/null || true

# Recreate packages directory
mkdir -p packages

# Remove test directories
echo "Removing test directories..."
rm -rf tests/integration tests/e2e 2>/dev/null || true

# Remove turbo cache
echo "Cleaning turbo cache..."
rm -rf .turbo/cache/* 2>/dev/null || true

# Clean node_modules build artifacts
echo "Cleaning build artifacts..."
find . -name ".turbo" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name "dist" -type d -path "*/packages/*" -exec rm -rf {} + 2>/dev/null || true

echo "✅ Clean complete. Ready for fresh agent execution."
