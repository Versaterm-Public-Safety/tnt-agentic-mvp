# ADR-004: SIPREC for Call Recording Integration

## Status
**Accepted** - 2025-12-31

## Context

The TnT MVP must integrate with existing 9-1-1 infrastructure to receive live call audio for transcription. The system needs:

1. **NG911/ESInet compatibility**: Must work with Next Generation 911 infrastructure
2. **SBC integration**: Session Border Controllers (SBCs) are the audio source
3. **Standards compliance**: Must use industry-standard protocols (no proprietary solutions)
4. **Multi-consumer support**: Audio must feed both TnT transcription AND existing call recording systems
5. **Participant identification**: Must know which audio stream is caller vs agent
6. **Media transport**: Real-time audio streaming with minimal latency
7. **Session management**: Handle call setup, active streaming, and teardown

**Architecture requirement**: Fan-out proxy to enable TnT and recording server to both receive audio without SBC changes.

## Decision

We will implement **SIPREC (Session Initiation Protocol for Recording)** per RFC 7865/7866 as our call recording protocol.

**Components**:
1. **@tnt/siprec**: SRS (Session Recording Server) implementation
2. **@tnt/siprec-proxy**: Fan-out proxy to forward SIPREC sessions to multiple consumers
3. **@tnt/sbc-simulator**: Mock SBC for testing (generates SIPREC sessions)

### Architecture

```
┌──────────────────┐    SIPREC    ┌──────────────────┐
│  SBC (ESInet)    │─────────────▶│  Fan-Out Proxy   │
│  (SRC - Source)  │   (existing)  │  (@tnt/siprec-   │
│                  │               │   proxy)         │
└──────────────────┘               └─────────┬────────┘
                                             │
                     ┌───────────────────────┼─────────────────────┐
                     │                       │                     │
                     ▼                       ▼                     │
            ┌────────────────┐    ┌────────────────────┐          │
            │ Recording      │    │ TnT System (SRS)   │          │
            │ Server         │    │ (@tnt/siprec)      │          │
            │ (existing)     │    │                    │          │
            └────────────────┘    └────────┬───────────┘          │
                                           │                      │
                                           ▼                      │
                                  ┌─────────────────────┐         │
                                  │ Whisper.cpp         │         │
                                  │ Transcription       │         │
                                  └────────┬────────────┘         │
                                           │                      │
                                           ▼                      │
                                  ┌─────────────────────┐         │
                                  │ WebSocket → UI      │         │
                                  └─────────────────────┘         │
                                                                  │
                                                                  │
```

### SIPREC Protocol Flow

**1. Session Initiation (SBC → Proxy)**
```
SBC sends SIPREC INVITE with:
- SDP (Session Description Protocol): Audio codec, RTP ports
- Metadata XML: Participants (caller/agent), session info
```

**2. Fan-Out (Proxy → Multiple SRS)**
```
Proxy duplicates INVITE to:
- TnT SRS (@tnt/siprec)
- Recording Server (existing infrastructure)
```

**3. Media Streaming**
```
SBC → Proxy: RTP audio packets (2 streams: caller + agent)
Proxy → TnT: Duplicate RTP packets
Proxy → Recording: Duplicate RTP packets
```

**4. Session Termination**
```
SBC sends BYE → Proxy forwards to all consumers
```

## Rationale

### Why SIPREC?

**Pros**:
- ✅ **Industry standard**: RFC 7865/7866, widely supported by SBCs (Ribbon, Oracle, Cisco)
- ✅ **NG911 compliant**: Mandated by NENA i3 standard for Next Generation 911
- ✅ **Participant metadata**: XML metadata includes caller/agent identification
- ✅ **Multi-stream**: Separate RTP streams for each participant (easy speaker identification)
- ✅ **SIP-based**: Uses existing SIP infrastructure (no new protocols)
- ✅ **Proven at scale**: Used by major PSAPs (Public Safety Answering Points)

**Cons**:
- ⚠️ **Complexity**: More complex than raw RTP capture (acceptable - standard is well-documented)
- ⚠️ **SIP stack required**: Need SIP library for INVITE/BYE handling (mitigated by existing libraries)

### Alternatives Considered

1. **Raw RTP Capture (Port Mirroring)**
   - **Pros**: Simple, no protocol overhead
   - **Cons**: **No participant metadata** (can't identify caller vs agent), requires network access, fragile to network changes
   - **Why not chosen**: Speaker identification is a hard requirement (FR-003)

2. **SIP INVITE Snooping**
   - **Pros**: Uses existing SIP signaling
   - **Cons**: **Not a standard**, requires SBC modification, fragile to SIP changes
   - **Why not chosen**: SIPREC is the standard way to do this

3. **Proprietary SBC APIs**
   - **Pros**: Vendor-specific features
   - **Cons**: **Vendor lock-in**, not NG911 compliant, requires per-vendor integration
   - **Why not chosen**: Must work with any NG911-compliant SBC

4. **MediaRecorder API (Browser)**
   - **Pros**: Simple browser API
   - **Cons**: **Client-side only**, doesn't work for ESInet audio, requires agent browser plugin
   - **Why not chosen**: Audio source is SBC, not browser

### Evidence: SIPREC Adoption

**SIPREC support in major SBCs**:
- ✅ Ribbon SBC (formerly Sonus): Full RFC 7866 support
- ✅ Oracle Enterprise SBC: SIPREC SRC and SRS modes
- ✅ Cisco Unified Border Element: SIPREC recording
- ✅ AudioCodes Mediant: Built-in SIPREC support

**NG911 compliance**:
- NENA i3 standard **requires** SIPREC for call recording (NENA-STA-010.3)

Source: [NENA i3 Standard](https://www.nena.org/page/i3_Stage3)

## Consequences

### Positive

✅ **NG911 compliant**: TnT integrates seamlessly with ESInet infrastructure  
✅ **Multi-consumer**: Fan-out proxy enables TnT + recording without SBC reconfiguration  
✅ **Speaker identification**: SIPREC metadata provides participant info (caller vs agent)  
✅ **Separate streams**: Each participant has own RTP stream (clean audio separation)  
✅ **Standards-based**: Works with any SIPREC-capable SBC (vendor-agnostic)  
✅ **Proven reliability**: SIPREC used in production by major PSAPs  

### Negative

⚠️ **Implementation complexity**: Must implement SIP stack (INVITE, 200 OK, BYE, ACK)  
⚠️ **XML parsing**: Metadata is XML (acceptable - use standard XML parsers)  
⚠️ **RTP handling**: Must demultiplex RTP streams by SSRC (Synchronization Source)  
⚠️ **Proxy SPOF**: Fan-out proxy becomes single point of failure (mitigated by monitoring + fast restart)  

### Neutral

🔵 **SBC configuration**: Requires SBC admin to configure SIPREC recording target (one-time setup)  
🔵 **Network requirements**: SIPREC requires SIP ports (5060 TCP/UDP) and RTP ports (20000-30000 UDP)  

## References

- [RFC 7865 - SIPREC Architecture](https://datatracker.ietf.org/doc/html/rfc7865)
- [RFC 7866 - SIPREC Protocol](https://datatracker.ietf.org/doc/html/rfc7866)
- [NENA i3 Standard (NG911)](https://www.nena.org/page/i3_Stage3)
- [SIP (RFC 3261)](https://datatracker.ietf.org/doc/html/rfc3261)
- [RTP (RFC 3550)](https://datatracker.ietf.org/doc/html/rfc3550)

## Implementation Notes

### SIPREC Message Example

**SIPREC INVITE** (simplified):
```sip
INVITE sip:srs@tnt.local SIP/2.0
Via: SIP/2.0/TCP sbc.example.com:5060
From: <sip:sbc@example.com>
To: <sip:srs@tnt.local>
Call-ID: siprec-abc-123
Content-Type: multipart/mixed; boundary=boundary42

--boundary42
Content-Type: application/sdp

v=0
o=- 123456 123456 IN IP4 192.168.1.100
s=SIPREC
c=IN IP4 192.168.1.100
m=audio 20000 RTP/AVP 0 8
a=rtpmap:0 PCMU/8000
a=label:1
m=audio 20002 RTP/AVP 0 8
a=rtpmap:8 PCMA/8000
a=label:2

--boundary42
Content-Type: application/rs-metadata+xml

<?xml version="1.0"?>
<recording>
  <participant participant_id="caller">
    <aor>sip:911caller@emergency.com</aor>
  </participant>
  <participant participant_id="agent">
    <aor>sip:agent@psap.local</aor>
  </participant>
  <stream stream_id="1">
    <label>1</label>
  </stream>
  <stream stream_id="2">
    <label>2</label>
  </stream>
</recording>
--boundary42--
```

### SRS Implementation (@tnt/siprec)

```typescript
import { createServer } from 'sip';

const srs = createServer({
  port: 5060,
  onInvite: (req, res) => {
    const sdp = parseSDP(req.body);
    const metadata = parseMetadata(req.body);
    
    // Map streams to participants
    const callerStream = findStream(metadata, 'caller');
    const agentStream = findStream(metadata, 'agent');
    
    // Accept session
    res.send(200, {
      headers: { 'Content-Type': 'application/sdp' },
      body: generateSDP([callerStream, agentStream])
    });
    
    // Start RTP capture
    captureRTP(callerStream.port, callerStream.ssrc);
    captureRTP(agentStream.port, agentStream.ssrc);
  }
});
```

### Fan-Out Proxy (@tnt/siprec-proxy)

```typescript
const proxy = createProxy({
  upstream: ['tnt-srs:5060', 'recording-server:5060'],
  onInvite: (invite) => {
    // Duplicate INVITE to all upstreams
    return Promise.all(
      upstreams.map(up => forward(invite, up))
    );
  },
  onRTP: (packet) => {
    // Duplicate RTP packets
    upstreams.forEach(up => send(packet, up));
  }
});
```

## Validation

**Verify decision**:
```bash
# 1. Start SBC simulator
pnpm --filter @tnt/sbc-simulator start

# 2. Start fan-out proxy
pnpm --filter @tnt/siprec-proxy dev

# 3. Start TnT SRS
pnpm --filter @tnt/siprec dev

# 4. Initiate test call
curl -X POST http://localhost:8081/simulate-call

# 5. Verify SIPREC session established
# Check logs for "SIPREC INVITE received"
# Check RTP packets arriving

# 6. Verify participant identification
# Check metadata XML parsed correctly
# Verify caller vs agent streams separated
```

**Success criteria**:
- ✅ SIPREC INVITE accepted with 200 OK
- ✅ RTP streams demultiplexed by SSRC
- ✅ Caller and agent identified from metadata
- ✅ Fan-out proxy forwards to multiple consumers
- ✅ Audio extracted and fed to transcription

---

**Status**: Accepted  
**Implemented**: Pending (Implementation Agent)  
**Last Reviewed**: 2025-12-31
