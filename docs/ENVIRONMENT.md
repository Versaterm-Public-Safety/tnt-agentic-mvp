# TNT Environment Variables Guide

## Overview

This guide documents all environment variables used in the TNT (Transcribe and Tag) system across all services.

## Quick Start

### Development (`.env.development`)

```bash
# Node Environment
NODE_ENV=development

# SIPREC Proxy
SIPREC_PORT=5060
SIPREC_HOST=0.0.0.0
WS_PORT=3001

# Transcription Service
WHISPER_MODEL=base
WHISPER_MODELS_PATH=./models
API_PORT=3002
TEMP_DIR=/tmp/tnt-audio

# UI
VITE_WS_URL=ws://localhost:3001
VITE_API_URL=http://localhost:3002

# Logging
LOG_LEVEL=debug
```

### Production (`.env.production`)

```bash
# Node Environment
NODE_ENV=production

# SIPREC Proxy
SIPREC_PORT=5060
SIPREC_HOST=0.0.0.0
WS_PORT=3001
SIPREC_TLS_ENABLED=true
SIPREC_CERT_PATH=/etc/tnt/certs/siprec.crt
SIPREC_KEY_PATH=/etc/tnt/certs/siprec.key

# Transcription Service
WHISPER_MODEL=base
WHISPER_MODELS_PATH=/var/lib/tnt/models
API_PORT=3002
TEMP_DIR=/var/tmp/tnt-audio
MAX_CONCURRENT_TRANSCRIPTIONS=10
TRANSCRIPTION_TIMEOUT_MS=30000

# UI
VITE_WS_URL=wss://your-domain.com/ws
VITE_API_URL=https://your-domain.com/api

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
LOG_OUTPUT=/var/log/tnt

# Security
ENABLE_CORS=false
ALLOWED_ORIGINS=https://your-domain.com
API_KEY_REQUIRED=true
API_KEYS=key1,key2,key3

# Performance
MAX_MEMORY_MB=2048
WORKER_THREADS=4
```

## Variable Reference

### Global Variables

| Variable | Default | Description | Required |
|----------|---------|-------------|----------|
| `NODE_ENV` | `development` | Runtime environment (development, production, test) | Yes |
| `LOG_LEVEL` | `info` | Logging level (debug, info, warn, error) | No |
| `LOG_FORMAT` | `text` | Log format (text, json) | No |

### SIPREC Proxy Variables

| Variable | Default | Description | Required |
|----------|---------|-------------|----------|
| `SIPREC_PORT` | `5060` | SIP SIPREC listening port | Yes |
| `SIPREC_HOST` | `0.0.0.0` | Bind address for SIPREC server | No |
| `WS_PORT` | `3001` | WebSocket port for audio streaming | Yes |
| `SIPREC_TLS_ENABLED` | `false` | Enable TLS for SIPREC connections | No |
| `SIPREC_CERT_PATH` | - | Path to TLS certificate | If TLS enabled |
| `SIPREC_KEY_PATH` | - | Path to TLS private key | If TLS enabled |
| `MAX_SESSIONS` | `100` | Maximum concurrent SIPREC sessions | No |

### Transcription Service Variables

| Variable | Default | Description | Required |
|----------|---------|-------------|----------|
| `WHISPER_MODEL` | `base` | Whisper model (tiny, base, small, medium, large) | No |
| `WHISPER_MODELS_PATH` | `./models` | Directory for Whisper model files | No |
| `API_PORT` | `3002` | HTTP API listening port | Yes |
| `TEMP_DIR` | `/tmp` | Temporary directory for audio files | No |
| `MAX_CONCURRENT_TRANSCRIPTIONS` | `5` | Max parallel transcription jobs | No |
| `TRANSCRIPTION_TIMEOUT_MS` | `30000` | Timeout for single transcription (ms) | No |
| `WORKER_THREADS` | `2` | Number of worker threads | No |

### UI Variables (Build-time)

| Variable | Default | Description | Required |
|----------|---------|-------------|----------|
| `VITE_WS_URL` | `ws://localhost:3001` | WebSocket endpoint URL | Yes |
| `VITE_API_URL` | `http://localhost:3002` | API endpoint URL | Yes |
| `VITE_APP_TITLE` | `TNT Dashboard` | Application title | No |
| `VITE_ENABLE_DEV_TOOLS` | `true` | Enable React DevTools | No |

### Security Variables

| Variable | Default | Description | Required |
|----------|---------|-------------|----------|
| `ENABLE_CORS` | `true` | Enable CORS middleware | No |
| `ALLOWED_ORIGINS` | `*` | Comma-separated allowed origins | If CORS enabled |
| `API_KEY_REQUIRED` | `false` | Require API key for requests | No |
| `API_KEYS` | - | Comma-separated valid API keys | If API key required |
| `RATE_LIMIT_ENABLED` | `false` | Enable rate limiting | No |
| `RATE_LIMIT_MAX` | `100` | Max requests per window | No |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window (15 min) | No |

### Performance Variables

| Variable | Default | Description | Required |
|----------|---------|-------------|----------|
| `MAX_MEMORY_MB` | `1024` | Maximum memory per process (MB) | No |
| `CLUSTER_INSTANCES` | `1` | Number of cluster instances | No |
| `ENABLE_METRICS` | `false` | Enable Prometheus metrics | No |
| `METRICS_PORT` | `9090` | Prometheus metrics port | If metrics enabled |

## Docker Environment

When using Docker Compose, environment variables can be set in a `.env` file:

```bash
# Copy example file
cp .env.example .env

# Edit with your values
nano .env
```

Docker Compose will automatically load variables from `.env` file.

## PM2 Environment

For PM2 deployments, set environment variables in `ecosystem.config.js`:

```javascript
{
  env_production: {
    NODE_ENV: 'production',
    WHISPER_MODEL: 'base',
    API_PORT: 3002,
    // ... other variables
  }
}
```

## Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use secrets management** - Consider HashiCorp Vault, AWS Secrets Manager
3. **Rotate API keys regularly** - Especially in production
4. **Use TLS in production** - Always encrypt SIPREC and WebSocket connections
5. **Restrict CORS origins** - Never use `*` in production

## Validation

The system validates critical environment variables on startup and will fail fast if required variables are missing or invalid.

## Example Files

### `.env.example`

```bash
# Copy this file to .env and customize

NODE_ENV=development
SIPREC_PORT=5060
WS_PORT=3001
WHISPER_MODEL=base
API_PORT=3002
VITE_WS_URL=ws://localhost:3001
VITE_API_URL=http://localhost:3002
LOG_LEVEL=debug
```

---

**Security Note**: This is a reference guide. Actual production values should be stored securely and never committed to version control.
