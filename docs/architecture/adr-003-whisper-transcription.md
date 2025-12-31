# ADR-003: Whisper.cpp for Local Transcription

## Status
**Accepted** - 2025-12-31

## Context

The TnT MVP requires accurate speech-to-text transcription of 9-1-1 emergency calls with these constraints:

1. **No API keys**: Must run locally without cloud dependencies (constitution.md)
2. **Accuracy target**: Word Error Rate (WER) ≤ 20%, goal 17% (spec.md § 4.1)
3. **Latency target**: Transcription latency contributes to <2s end-to-end (NFR-001)
4. **Speaker identification**: Must distinguish caller vs agent
5. **Language**: English only for MVP (spec.md § 6.2 - language detection out of scope)
6. **Audio format**: Handle PCM audio from SIPREC (8kHz-48kHz, mono/stereo)

**Performance requirement**: Transcription must be fast enough to feel "real-time" (<2s from speech end to display)

## Decision

We will use **Whisper.cpp** (C++ port of OpenAI Whisper) with the **base** model for local transcription.

**Technical approach**:
- **Model**: `whisper-base` (74M parameters, ~140MB on disk)
- **Integration**: Node.js bindings via `whisper-node` npm package (or direct FFI if needed)
- **Audio preprocessing**: Resample to 16kHz mono PCM (Whisper requirement)
- **Inference**: Run on CPU initially (GPU optional for future optimization)
- **Fallback**: Mock adapter for testing/development when Whisper unavailable

### Model Selection Rationale

| Model | Size | Parameters | WER (LibriSpeech) | Speed (CPU) | Choice |
|-------|------|------------|-------------------|-------------|--------|
| tiny  | 75 MB | 39M | ~9-10% | ~4x realtime | ❌ Too inaccurate |
| **base** | **140 MB** | **74M** | **~6-7%** | **~2x realtime** | ✅ **Selected** |
| small | 466 MB | 244M | ~5% | ~1x realtime | ⚠️ Slower, marginal gain |
| medium | 1.5 GB | 769M | ~4-5% | ~0.5x realtime | ❌ Too slow |

**Rationale for `base`**:
- WER 6-7% on LibriSpeech (clean speech) → expect ~12-15% on real 9-1-1 calls (noise, stress)
- 2x realtime speed means 1 second of audio processes in ~0.5 seconds (meets latency target)
- 140MB model size is reasonable for distribution
- Good balance of accuracy vs speed

## Rationale

### Why Whisper.cpp?

**Pros**:
- ✅ **No API keys**: Runs entirely locally, no cloud dependencies
- ✅ **High accuracy**: Whisper is state-of-the-art for speech recognition (WER competitive with commercial APIs)
- ✅ **Open source**: MIT license, no vendor lock-in
- ✅ **Cross-platform**: Works on Linux, macOS, Windows
- ✅ **Fast**: C++ implementation is ~4x faster than Python Whisper
- ✅ **Multilingual**: Supports 99 languages (future-proofs for translation feature)
- ✅ **Privacy**: Audio never leaves local infrastructure

**Cons**:
- ⚠️ **CPU intensive**: Requires dedicated CPU cores (mitigated by async processing)
- ⚠️ **Model size**: 140MB download per deployment (acceptable)
- ⚠️ **Compilation**: Requires C++ build tools (mitigated by pre-built binaries)
- ⚠️ **No speaker diarization**: Must identify speakers via SIPREC metadata, not AI

### Alternatives Considered

1. **Google Cloud Speech-to-Text**
   - **Pros**: Excellent accuracy (~10% WER), speaker diarization, real-time streaming
   - **Cons**: **Requires API key** (violates constitution.md), cloud dependency, cost per minute
   - **Why not chosen**: "No API keys" is a hard constraint

2. **Vosk (Kaldi-based)**
   - **Pros**: Lightweight (~50MB models), fast, no API key
   - **Cons**: **Lower accuracy** (~15-20% WER baseline), smaller model selection, less active development
   - **Why not chosen**: Whisper.cpp achieves better accuracy with acceptable performance

3. **Mozilla DeepSpeech**
   - **Pros**: Open source, decent accuracy
   - **Cons**: **Project archived** (no longer maintained), inferior to Whisper
   - **Why not chosen**: Active maintenance matters for production systems

4. **AssemblyAI / Deepgram**
   - **Pros**: Very high accuracy (~5-7% WER), real-time streaming, easy integration
   - **Cons**: **Requires API key**, cloud dependency, recurring costs
   - **Why not chosen**: Same as Google Cloud - violates "no API key" rule

### Evidence: Whisper Accuracy Benchmarks

**LibriSpeech test-clean** (clean English speech):
- Whisper base: **6.7% WER**
- Whisper small: **5.4% WER**
- Google Cloud: **4.8% WER**

**Real-world 9-1-1 call expectations**:
- Background noise: +3-5% WER
- Speaker stress/emotion: +2-3% WER
- Audio codec artifacts: +1-2% WER
- **Expected WER**: ~13-17% (meets ≤20% target)

Source: [OpenAI Whisper Paper](https://cdn.openai.com/papers/whisper.pdf)

### Audio Preprocessing

**SIPREC audio** (from SBC):
- Format: G.711 µ-law/A-law (PCMU/PCMA)
- Sample rate: 8kHz (telephony standard)

**Whisper requirements**:
- Format: 16-bit PCM
- Sample rate: 16kHz
- Channels: Mono

**Preprocessing pipeline**:
```
RTP (G.711) → Decode to PCM → Resample 8kHz→16kHz → Feed to Whisper
```

**Implementation**: Use `libsamplerate` or FFmpeg for high-quality resampling

## Consequences

### Positive

✅ **No external dependencies**: System works offline, no cloud outages impact us  
✅ **Privacy compliance**: Audio never leaves infrastructure (critical for 9-1-1)  
✅ **Cost predictable**: No per-minute API charges  
✅ **Accuracy sufficient**: 13-17% WER meets ≤20% requirement  
✅ **Latency acceptable**: 2x realtime → 0.5s processing for 1s audio  
✅ **Future-proof**: Whisper supports 99 languages for future translation feature  

### Negative

⚠️ **CPU requirements**: Need multi-core CPU for concurrent calls (acceptable, modern servers have 8+ cores)  
⚠️ **Model updates**: Manual process to update models (vs auto-updated cloud APIs)  
⚠️ **No speaker diarization**: Whisper doesn't identify speakers - must use SIPREC participant metadata  
⚠️ **Build complexity**: Requires C++ compilation (mitigated by pre-built binaries)  

### Neutral

🔵 **Accuracy ceiling**: Won't match Google/Deepgram's 5% WER, but 13-17% is acceptable  
🔵 **GPU acceleration**: Can add CUDA/OpenCL support later for faster processing  

## References

- [Whisper.cpp GitHub](https://github.com/ggerganov/whisper.cpp)
- [OpenAI Whisper Paper](https://cdn.openai.com/papers/whisper.pdf)
- [whisper-node NPM Package](https://www.npmjs.com/package/whisper-node)
- [Whisper Model Performance Comparison](https://github.com/openai/whisper#available-models-and-languages)

## Implementation Notes

### Installation

```bash
# Install whisper-node (includes pre-built binaries)
pnpm add --filter @tnt/transcription whisper-node

# Download base model (one-time, ~140MB)
npx whisper-node download base
```

### Usage Example

```typescript
import { whisper } from 'whisper-node';

const result = await whisper('audio.wav', {
  model: 'base',
  language: 'en',
  word_timestamps: true,
});

// result: { text: "My address is 123 Main Street", segments: [...] }
```

### Mock Adapter for Development

```typescript
export class MockTranscriptionService implements TranscriptionService {
  async transcribe(audio: AudioBuffer): Promise<Transcript> {
    // Return canned response for testing
    return {
      id: uuid(),
      text: 'This is a mock transcript',
      speaker: 'caller',
      confidence: 0.95,
      timestamp: new Date(),
      isFinal: true,
    };
  }
}
```

## Validation

**Verify decision**:
```bash
# 1. Install Whisper.cpp
pnpm --filter @tnt/transcription add whisper-node

# 2. Download model
npx whisper-node download base

# 3. Test transcription
pnpm --filter @tnt/transcription test:whisper

# 4. Measure latency
time whisper-node test-audio.wav --model base
# Expected: <2s for 4s of audio (2x realtime)
```

**Success criteria**:
- ✅ Whisper.cpp compiles successfully
- ✅ Base model downloads (~140MB)
- ✅ Transcription of 1s audio completes in <1s (2x realtime)
- ✅ WER on test corpus <20%
- ✅ Mock adapter passes all tests (development fallback works)

---

**Status**: Accepted  
**Implemented**: Pending (Implementation Agent)  
**Last Reviewed**: 2025-12-31
