# Transcription Service API Documentation

## Overview

The TNT (Transcribe and Tag) system provides real-time audio transcription for emergency 911 calls with automatic keyword detection and multi-language support.

## Transcription Service API

### Base URL
```
http://localhost:3002/api
```

### POST /transcribe

Transcribes audio data and extracts emergency keywords.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "audioData": "base64-encoded-audio-data",
  "format": "wav",
  "sampleRate": 16000,
  "channels": 1,
  "language": "en"
}
```

**Parameters:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `audioData` | string | Yes | - | Base64-encoded audio data |
| `format` | string | No | "wav" | Audio format (wav, mp3, etc.) |
| `sampleRate` | number | No | 16000 | Sample rate in Hz |
| `channels` | number | No | 1 | Number of audio channels (1=mono, 2=stereo) |
| `language` | string | No | "en" | ISO 639-1 language code (en, es, fr, zh, etc.) |

#### Response

**Success (200 OK):**
```json
{
  "transcription": "Emergency at 123 Main Street, send police and ambulance immediately.",
  "keywords": [
    {
      "keyword": "emergency",
      "category": "urgency",
      "confidence": 0.95,
      "position": 0
    },
    {
      "keyword": "police",
      "category": "service_type",
      "confidence": 0.92,
      "position": 25
    },
    {
      "keyword": "ambulance",
      "category": "service_type",
      "confidence": 0.90,
      "position": 35
    }
  ],
  "metadata": {
    "language": "en",
    "duration": 3.5,
    "processingTime": 523,
    "confidence": 0.85
  }
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `transcription` | string | Full transcribed text |
| `keywords` | array | List of detected emergency keywords |
| `keywords[].keyword` | string | The detected keyword |
| `keywords[].category` | string | Keyword category (urgency, service_type, location, etc.) |
| `keywords[].confidence` | number | Detection confidence (0-1) |
| `keywords[].position` | number | Character position in transcription |
| `metadata.language` | string | Detected/specified language |
| `metadata.duration` | number | Audio duration in seconds |
| `metadata.processingTime` | number | Processing time in milliseconds |
| `metadata.confidence` | number | Overall transcription confidence (0-1) |

**Error Responses:**

```json
{
  "error": "Invalid audio data",
  "code": "INVALID_AUDIO",
  "details": "Audio data must be base64-encoded"
}
```

**Error Codes:**

| Code | Status | Description |
|------|--------|-------------|
| `INVALID_AUDIO` | 400 | Invalid or corrupted audio data |
| `UNSUPPORTED_FORMAT` | 400 | Audio format not supported |
| `AUDIO_TOO_SHORT` | 400 | Audio duration < 1 second |
| `TRANSCRIPTION_FAILED` | 500 | Whisper transcription failed |
| `SERVICE_UNAVAILABLE` | 503 | Transcription service unavailable |

## Emergency Keywords

### Categories

**Urgency:**
- emergency, urgent, help, fire, shooting, assault, robbery, accident

**Service Type:**
- police, ambulance, fire, medical, paramedic

**Location:**
- street, avenue, road, building, apartment, house, address

**Medical:**
- injured, bleeding, unconscious, heart attack, seizure, breathing

**Crime:**
- robbery, theft, assault, domestic, weapon, gun, knife

### Confidence Levels

| Range | Interpretation |
|-------|----------------|
| 0.9 - 1.0 | Very high confidence |
| 0.8 - 0.9 | High confidence |
| 0.7 - 0.8 | Medium confidence |
| 0.6 - 0.7 | Low confidence |
| < 0.6 | Very low confidence (not returned) |

## Multi-Language Support

### Supported Languages

| Language | Code | Status | Notes |
|----------|------|--------|-------|
| English | en | ✅ Fully supported | Primary language |
| Spanish | es | ✅ Fully supported | Keyword detection active |
| French | fr | ✅ Fully supported | Auto-translates to English |
| Mandarin | zh | ⚠️ Limited | Requires >1s audio duration |

### Language Detection

The service auto-detects language if not specified. For best results:
- Specify language code when known
- Ensure audio duration > 1 second
- Use clear audio with minimal background noise

### Translation

French audio is automatically translated to English by Whisper, enabling monolingual operators to understand foreign language calls.

## Usage Examples

### JavaScript/TypeScript

```typescript
async function transcribeAudio(audioBuffer: Buffer) {
  const base64Audio = audioBuffer.toString('base64');
  
  const response = await fetch('http://localhost:3002/api/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      audioData: base64Audio,
      format: 'wav',
      sampleRate: 16000,
      language: 'en'
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  
  return await response.json();
}

// Example usage
const result = await transcribeAudio(audioBuffer);
console.log('Transcription:', result.transcription);
console.log('Keywords:', result.keywords);
```

### cURL

```bash
# Create base64 audio
BASE64_AUDIO=$(base64 < audio.wav | tr -d '\n')

# Send request
curl -X POST http://localhost:3002/api/transcribe \
  -H "Content-Type: application/json" \
  -d "{
    \"audioData\": \"$BASE64_AUDIO\",
    \"format\": \"wav\",
    \"sampleRate\": 16000,
    \"language\": \"en\"
  }"
```

### Python

```python
import base64
import requests

def transcribe_audio(audio_path):
    with open(audio_path, 'rb') as f:
        audio_data = base64.b64encode(f.read()).decode('utf-8')
    
    response = requests.post('http://localhost:3002/api/transcribe', 
        json={
            'audioData': audio_data,
            'format': 'wav',
            'sampleRate': 16000,
            'language': 'en'
        })
    
    response.raise_for_status()
    return response.json()

# Example usage
result = transcribe_audio('emergency_call.wav')
print(f"Transcription: {result['transcription']}")
print(f"Keywords: {result['keywords']}")
```

## Performance

### Expected Response Times

| Audio Duration | Processing Time |
|----------------|-----------------|
| 1-5 seconds | 300-600ms |
| 5-10 seconds | 600-1200ms |
| 10-30 seconds | 1200-3000ms |

### Rate Limiting

No rate limiting currently enforced. Production deployment should implement:
- Rate limiting per IP/API key
- Concurrent request limits
- Maximum audio duration limits

## Health Check

### GET /health

Check service availability.

**Response:**
```json
{
  "status": "healthy",
  "whisper": "ready",
  "uptime": 3600
}
```

## Versioning

Current API version: **v1**

Future versions will be accessible via URL path:
- `/api/v1/transcribe`
- `/api/v2/transcribe`
