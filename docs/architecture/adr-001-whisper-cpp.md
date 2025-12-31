# ADR-001: Use Whisper.cpp for Local Transcription

**Status**: Accepted  
**Date**: 2025-12-31  
**Deciders**: Research Agent  
**Tags**: transcription, ai, dependencies

---

## Context

The TnT MVP requires speech-to-text transcription for 9-1-1 calls. Per the PRD, we need:
- Word Error Rate (WER) ≤ 20% (goal: 17%)
- Latency < 2 seconds from speech to text display
- No external API dependencies for the MVP demo

We need to choose a transcription engine that balances accuracy, performance, and ease of integration for an MVP demonstration.

---

## Decision

Use **Whisper.cpp** (C++ port of OpenAI Whisper) for local transcription.

---

## Rationale

### Alternatives Considered

1. **Azure Speech-to-Text API**
   - Pros: High accuracy (~10% WER), managed service, minimal setup
   - Cons: Requires API keys, incurs costs, external dependency, network latency
   - Rejected because: MVP should run locally without external services

2. **Google Cloud Speech-to-Text**
   - Pros: Excellent accuracy, real-time streaming support
   - Cons: Requires API keys, costs, vendor lock-in, network dependency
   - Rejected because: Same reasons as Azure

3. **Mozilla DeepSpeech**
   - Pros: Open source, local execution
   - Cons: Project deprecated in 2021, lower accuracy than Whisper
   - Rejected because: No longer maintained

4. **Vosk**
   - Pros: Open source, fast, small models
   - Cons: Lower accuracy (WER ~15-25% depending on model)
   - Rejected because: Whisper offers better accuracy with manageable performance

### Why Whisper.cpp Wins

- **Accuracy**: OpenAI Whisper achieves WER of 5-17% on benchmarks (meets/exceeds PRD goal)
- **Local Execution**: No API keys, no network calls, complete privacy
- **Open Source**: MIT license, no vendor lock-in
- **Performance**: C++ implementation is significantly faster than Python Whisper
- **Community Support**: Active development, wide adoption
- **Multi-lingual**: Built-in support for 99 languages (future translation feature)
- **Model Flexibility**: Multiple model sizes (tiny/base/small/medium/large) to balance speed vs accuracy

---

## References

- [Whisper.cpp GitHub](https://github.com/ggerganov/whisper.cpp) - C++ port with performance optimizations
- [OpenAI Whisper Paper](https://arxiv.org/abs/2212.04356) - Original research paper with benchmarks
- [Whisper Model Comparison](https://github.com/openai/whisper#available-models-and-languages) - Model size vs accuracy tradeoffs
- [whisper-node npm package](https://www.npmjs.com/package/whisper-node) - Node.js bindings for Whisper.cpp

---

## Consequences

### Positive

- Zero external API costs for transcription
- Complete data privacy (audio never leaves local machine)
- Fast C++ performance suitable for real-time transcription
- No network latency or reliability concerns
- Future-proofed for multi-language support
- Can switch model sizes without code changes

### Negative

- Requires downloading Whisper model files (~140MB for base model)
- CPU/GPU performance dependent on user's hardware
- More complex setup than cloud API (model management)
- Need to handle model loading and memory management

### Neutral

- Will use **base model** for MVP (good balance: 140MB, ~16% WER)
- Can upgrade to larger models in production if accuracy is insufficient
- May need to add GPU acceleration (CUDA/Metal) for production

---

## Notes

- Test Agent should create tests that mock Whisper.cpp to avoid model dependency in CI
- Implementation Agent should document model download/setup in README
- Consider GPU acceleration for production (Metal on macOS, CUDA on Linux)
