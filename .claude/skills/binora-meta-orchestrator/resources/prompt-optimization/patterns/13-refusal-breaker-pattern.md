## 6.13 Refusal Breaker Pattern

**When to Use**: Request seems blocked/impossible, but there's a valid workaround or alternative.

**Pattern Structure**:
1. **Acknowledge** constraint/blocker
2. **Explain** why direct approach won't work
3. **Propose** alternative that achieves similar goal
4. **Warn** of trade-offs if applicable

**Example**:
```
User: "Make the app work offline without any network"

⛔ CONSTRAINT ACKNOWLEDGED

Direct request: "Make app work offline"
Blocker: Premium subscription verification requires network check

Why it won't work:
- FreemiumService.isPremium() queries remote server for subscription status
- Without network, cannot verify premium status
- Risk: User could fake premium by disabling network

ALTERNATIVE APPROACH:

1. **Cached Premium Status** (Recommended)
   - Cache premium status in Isar for 24 hours
   - Offline: Use cached status
   - Online: Refresh cache, sync with server
   - Trade-off: 24h window where cancelled subscription still works offline
   - Implementation: Add `premiumStatusCachedAt` to UserPreferences

2. **Offline Mode with Degraded Features**
   - Full offline access for basic features (match entry, scoring)
   - Premium features disabled offline (CSV export, statistics)
   - Trade-off: Reduced functionality offline
   - Implementation: Check network status before premium features

3. **Local-Only Premium (Not Recommended)**
   - Store premium flag locally, no server verification
   - Trade-off: Easily bypassed, potential revenue loss
   - Implementation: Simple but insecure

RECOMMENDATION: Approach 1 (Cached Premium Status)
Balances offline functionality with security. 24h cache window is industry-standard (see Spotify, Netflix).

Proceed with Approach 1, or discuss different trade-offs?
```

**Impact**: Turns "no" into "yes, but...", maintains solution-oriented approach.

---

