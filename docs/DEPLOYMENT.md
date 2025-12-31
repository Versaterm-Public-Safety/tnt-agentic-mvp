# TNT Deployment Guide

## Prerequisites

### System Requirements

**Minimum:**
- OS: macOS, Linux, or Windows with WSL2
- CPU: 4 cores
- RAM: 8 GB
- Disk: 5 GB free space
- Node.js: 20.x or later
- pnpm: 9.x or later

**Recommended:**
- CPU: 8+ cores
- RAM: 16 GB
- SSD storage

### Software Dependencies

```bash
# Node.js 20.x
node --version  # Should output v20.x.x

# pnpm 9.x
pnpm --version  # Should output 9.x.x

# Git
git --version
```

### Install pnpm (if not installed)

```bash
# macOS/Linux
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Windows
iwr https://get.pnpm.io/install.ps1 -useb | iex

# Verify installation
pnpm --version
```

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/Versaterm-Public-Safety/tnt-agentic-mvp.git
cd tnt-agentic-mvp
```

### 2. Install Dependencies

```bash
# Install all dependencies for monorepo
pnpm install

# This will:
# - Install Node dependencies
# - Download Whisper base model (141MB)
# - Build all packages
# - Run post-install setup
```

**Note:** The first install downloads the Whisper AI model file (141MB), which may take several minutes depending on your connection speed.

### 3. Verify Installation

```bash
# Build all packages
pnpm build

# Run tests
pnpm test

# You should see: "81 tests passing"
```

## Configuration

### Environment Variables

Create `.env` files in each package directory as needed:

#### Transcription Service (.env)

```bash
# packages/transcription/.env

# Server Configuration
PORT=3002
HOST=0.0.0.0

# Whisper Configuration
WHISPER_MODEL=base  # base, small, medium, large
WHISPER_LANGUAGE=auto  # auto, en, es, fr, zh

# Performance
MAX_AUDIO_DURATION=300  # seconds
CHUNK_SIZE=5  # seconds
CONCURRENT_REQUESTS=10

# Logging
LOG_LEVEL=info  # debug, info, warn, error
```

#### SIPREC Proxy (.env)

```bash
# packages/siprec-proxy/.env

# SIP Configuration
SIP_PORT=5060
SIP_HOST=0.0.0.0

# WebSocket Configuration
WS_PORT=3001
WS_HOST=0.0.0.0

# Transcription Service
TRANSCRIPTION_URL=http://localhost:3002

# Audio Buffering
BUFFER_SIZE=5000  # ms
CHUNK_DURATION=3000  # ms

# Logging
LOG_LEVEL=info
```

#### UI Dashboard (.env)

```bash
# packages/ui/.env

# API Endpoints
VITE_TRANSCRIPTION_WS=ws://localhost:3002
VITE_SIPREC_WS=ws://localhost:3001

# UI Configuration
VITE_MAX_CALLS_DISPLAY=50
VITE_AUTO_SCROLL=true

# Development
VITE_DEV_PORT=5173
```

## Running the System

### Development Mode

Start all services in development mode with hot-reload:

```bash
# From project root
pnpm dev
```

This starts:
- Transcription Service on http://localhost:3002
- SIPREC Proxy on port 5060 (SIP) and ws://localhost:3001 (WebSocket)
- UI Dashboard on http://localhost:5173

**Verify Services:**

```bash
# Check transcription service
curl http://localhost:3002/health

# Expected: {"status":"healthy","whisper":"ready","uptime":...}
```

### Production Mode

#### 1. Build All Packages

```bash
pnpm build
```

#### 2. Start Services

```bash
# Start transcription service
cd packages/transcription
pnpm start

# Start SIPREC proxy (in new terminal)
cd packages/siprec-proxy
pnpm start

# Start UI (in new terminal)
cd packages/ui
pnpm preview  # or pnpm start
```

### Using Process Manager (Recommended for Production)

#### PM2 Setup

```bash
# Install PM2
npm install -g pm2

# Start all services
pm2 start ecosystem.config.js

# View logs
pm2 logs

# Monitor
pm2 monit

# Stop all
pm2 stop all

# Restart all
pm2 restart all
```

#### ecosystem.config.js

Create this file in project root:

```javascript
module.exports = {
  apps: [
    {
      name: 'tnt-transcription',
      cwd: './packages/transcription',
      script: 'pnpm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      }
    },
    {
      name: 'tnt-siprec-proxy',
      cwd: './packages/siprec-proxy',
      script: 'pnpm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        SIP_PORT: 5060,
        WS_PORT: 3001
      }
    },
    {
      name: 'tnt-ui',
      cwd: './packages/ui',
      script: 'pnpm',
      args: 'preview',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
```

## Docker Deployment

### Build Docker Images

```bash
# Build all images
docker-compose build

# Or build individual services
docker build -t tnt-transcription -f packages/transcription/Dockerfile .
docker build -t tnt-siprec-proxy -f packages/siprec-proxy/Dockerfile .
docker build -t tnt-ui -f packages/ui/Dockerfile .
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  transcription:
    build:
      context: .
      dockerfile: packages/transcription/Dockerfile
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
      - PORT=3002
      - WHISPER_MODEL=base
    volumes:
      - whisper-models:/app/node_modules/whisper-node/lib/whisper.cpp/models
    restart: unless-stopped

  siprec-proxy:
    build:
      context: .
      dockerfile: packages/siprec-proxy/Dockerfile
    ports:
      - "5060:5060/udp"
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - SIP_PORT=5060
      - WS_PORT=3001
      - TRANSCRIPTION_URL=http://transcription:3002
    depends_on:
      - transcription
    restart: unless-stopped

  ui:
    build:
      context: .
      dockerfile: packages/ui/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - VITE_TRANSCRIPTION_WS=ws://localhost:3002
      - VITE_SIPREC_WS=ws://localhost:3001
    depends_on:
      - transcription
      - siprec-proxy
    restart: unless-stopped

volumes:
  whisper-models:
```

### Run with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

## Testing the Deployment

### 1. Health Checks

```bash
# Transcription service
curl http://localhost:3002/health

# Expected: {"status":"healthy","whisper":"ready"}
```

### 2. Test Transcription

```bash
# Create test audio
echo "Hello world" | say -o test.wav

# Convert to base64
BASE64_AUDIO=$(base64 < test.wav | tr -d '\n')

# Send request
curl -X POST http://localhost:3002/api/transcribe \
  -H "Content-Type: application/json" \
  -d "{\"audioData\":\"$BASE64_AUDIO\",\"format\":\"wav\"}"
```

### 3. UI Access

Open browser to http://localhost:5173 (dev) or http://localhost:3000 (prod)

### 4. Run Full Test Suite

```bash
# From project root
pnpm test

# Expected: "81 tests passing"
```

## Monitoring

### Service Logs

**Development:**
```bash
# All services
pnpm dev

# Individual service
cd packages/transcription
pnpm dev
```

**Production (PM2):**
```bash
pm2 logs tnt-transcription
pm2 logs tnt-siprec-proxy
pm2 logs tnt-ui
```

**Production (Docker):**
```bash
docker-compose logs -f transcription
docker-compose logs -f siprec-proxy
docker-compose logs -f ui
```

### Health Monitoring

Create a monitoring script:

```bash
#!/bin/bash
# health-check.sh

TRANSCRIPTION_URL="http://localhost:3002/health"

while true; do
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $TRANSCRIPTION_URL)
  
  if [ "$RESPONSE" = "200" ]; then
    echo "$(date): ✅ Transcription service healthy"
  else
    echo "$(date): ❌ Transcription service DOWN (HTTP $RESPONSE)"
  fi
  
  sleep 60
done
```

## Troubleshooting

### Whisper Model Not Found

**Error:** `Error: Model file not found`

**Solution:**
```bash
cd packages/transcription
pnpm install --force
```

### Port Already in Use

**Error:** `EADDRINUSE: address already in use`

**Solution:**
```bash
# Find process using port
lsof -i :3002  # or :3001, :5060

# Kill process
kill -9 <PID>

# Or use different port
PORT=3003 pnpm dev
```

### Out of Memory

**Error:** `JavaScript heap out of memory`

**Solution:**
```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" pnpm dev
```

### WebSocket Connection Failed

**Error:** `WebSocket connection failed`

**Solution:**
1. Check firewall settings
2. Verify service is running: `curl http://localhost:3002/health`
3. Check CORS configuration
4. Verify WebSocket URL in UI `.env`

### Tests Failing

```bash
# Clean install
rm -rf node_modules
rm -rf packages/*/node_modules
pnpm install

# Rebuild
pnpm build

# Run tests
pnpm test
```

## Performance Tuning

### Whisper Model Selection

| Model | Size | Speed | Accuracy | Recommendation |
|-------|------|-------|----------|----------------|
| tiny | 75 MB | Fastest | Low | Development only |
| base | 141 MB | Fast | Good | **Production (MVP)** |
| small | 466 MB | Medium | Better | High-accuracy needs |
| medium | 1.5 GB | Slow | Best | Maximum accuracy |

**Change model:**
```bash
# In packages/transcription/.env
WHISPER_MODEL=small

# Reinstall to download model
cd packages/transcription
pnpm install --force
```

### Concurrent Requests

```bash
# In packages/transcription/.env
CONCURRENT_REQUESTS=20  # Increase for more load
```

### Audio Chunk Size

```bash
# In packages/siprec-proxy/.env
CHUNK_DURATION=2000  # Smaller chunks = faster, less accurate
CHUNK_DURATION=5000  # Larger chunks = slower, more accurate
```

## Security Hardening

### Production Checklist

- [ ] Change default ports
- [ ] Enable HTTPS/TLS
- [ ] Add authentication (API keys/JWT)
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Set up audit logging
- [ ] Encrypt sensitive data
- [ ] Regular security updates
- [ ] Implement CJIS compliance
- [ ] Add intrusion detection

### Example Nginx Reverse Proxy

```nginx
server {
    listen 443 ssl http2;
    server_name tnt.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location /api {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location / {
        proxy_pass http://localhost:3000;
    }
}
```

## Backup and Recovery

### Backup Strategy

```bash
# Backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/tnt-$DATE"

mkdir -p $BACKUP_DIR

# Backup configuration
cp -r .env* $BACKUP_DIR/

# Backup logs (if using file logging)
cp -r logs/ $BACKUP_DIR/

# Backup database (if applicable)
# pg_dump tnt_db > $BACKUP_DIR/database.sql

tar -czf "$BACKUP_DIR.tar.gz" $BACKUP_DIR
rm -rf $BACKUP_DIR

echo "Backup created: $BACKUP_DIR.tar.gz"
```

## Scaling

### Horizontal Scaling

Add load balancer (nginx/HAProxy) in front of multiple transcription service instances:

```
Client → Load Balancer → [Transcription 1]
                      → [Transcription 2]
                      → [Transcription N]
```

### Vertical Scaling

Increase resources for Whisper processing:

```bash
# More CPU cores for parallel processing
# More RAM for larger models
# SSD for faster model loading
```

## Support

For issues or questions:
- GitHub Issues: https://github.com/Versaterm-Public-Safety/tnt-agentic-mvp/issues
- Documentation: https://github.com/Versaterm-Public-Safety/tnt-agentic-mvp/tree/main/docs
