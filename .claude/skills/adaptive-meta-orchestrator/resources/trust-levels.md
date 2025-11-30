# User Trust Levels - Orchestrator v3.7

> Reference: `.claude/config/orchestrator-settings.json` → `features.userTrustLevels`
> State: `.claude/state/user-trust.json`

## Purpose

Adapt orchestrator autonomy based on user's demonstrated trust and preferences. Higher trust = more autonomous execution.

---

## 5 Trust Levels

| Level | Name | Description | Auto-Execute | Confirmations |
|-------|------|-------------|--------------|---------------|
| **1** | New/Cautious | First interactions, cautious user | Limited | All actions |
| **2** | Learning | Some history, building trust | Basic | Destructive, Production, Security |
| **3** | Comfortable | Regular user, positive history | Most | Production, Security |
| **4** | Experienced | Power user, rare rollbacks | Almost all | Production only |
| **5** | Expert/Trusting | Full trust, "hazlo tú" | Everything | None |

---

## Autonomy Matrix

### Level 1: New/Cautious User

```yaml
auto_execute: false
max_complexity_auto: 10
require_confirmation:
  - all

behavior:
  - Explain every step before executing
  - Ask for confirmation on all changes
  - Provide detailed explanations
  - Never auto-commit

example_prompt:
  "Voy a crear un archivo `Hero.astro`. ¿Procedo?"
```

### Level 2: Learning User (Default)

```yaml
auto_execute: true
max_complexity_auto: 30
require_confirmation:
  - destructive (delete, overwrite)
  - production (deploy, release)
  - security (auth, secrets, permissions)

behavior:
  - Auto-execute simple tasks
  - Explain complex decisions
  - Ask on risky operations
  - Summarize changes after completion

example_prompt:
  Simple: Auto-create component (no ask)
  Risky: "Este cambio afecta la autenticación. ¿Procedo?"
```

### Level 3: Comfortable User

```yaml
auto_execute: true
max_complexity_auto: 50
require_confirmation:
  - production (deploy, release)
  - security (auth changes, new permissions)

behavior:
  - Auto-execute most tasks
  - Brief notifications only
  - Ask on production/security
  - Learn from corrections

example_prompt:
  Most: Auto-execute with brief summary
  Production: "¿Despliego a producción?"
```

### Level 4: Experienced User

```yaml
auto_execute: true
max_complexity_auto: 70
require_confirmation:
  - production (deploy only)

behavior:
  - Execute autonomously
  - Minimal interruptions
  - Only confirm deployments
  - Trust user's judgment

example_prompt:
  Almost all: Auto-execute silently
  Deploy: "Ready to deploy. Confirm?"
```

### Level 5: Expert/Trusting User

```yaml
auto_execute: true
max_complexity_auto: 100
require_confirmation: []

behavior:
  - Full autonomy
  - No confirmations
  - Execute and report
  - "Hazlo tú" mode

example_prompt:
  Everything: Auto-execute and report results
  User said: "Confío en ti, hazlo"
```

---

## Trust Signals

### Positive Signals (Increase Trust)

```yaml
signals:
  - "Confío en ti" / "Trust you" → +0.5 level
  - "Hazlo" / "Do it" → +0.2 level
  - Accepted suggestion without changes → +0.1 level
  - No rollbacks in 10 interactions → +0.3 level
  - Explicit: "Sube el trust level" → +1 level

max_increase_per_session: 1 level
```

### Negative Signals (Decrease Trust)

```yaml
signals:
  - "No" / "Para" / "Stop" → -0.3 level
  - "Mal" / "Wrong" / "Incorrecto" → -0.2 level
  - Rollback requested → -0.5 level
  - Multiple corrections in sequence → -0.3 level
  - Explicit: "Pregunta antes" → -1 level

max_decrease_per_session: 2 levels
```

---

## Trust Calculation

```python
def calculate_trust_adjustment(metrics):
    base = 0

    # Acceptance rate (0-100%)
    if metrics.acceptance_rate > 0.9:
        base += 0.3
    elif metrics.acceptance_rate < 0.5:
        base -= 0.3

    # Rollback rate (0-100%)
    if metrics.rollback_rate > 0.1:
        base -= 0.5
    elif metrics.rollback_rate == 0:
        base += 0.2

    # Explicit signals
    base += metrics.trust_signals * 0.5
    base -= metrics.distrust_signals * 0.3

    # Interaction history
    if metrics.successful_tasks > 20 and metrics.failed_tasks < 2:
        base += 0.3

    # Clamp to valid range
    return max(-2, min(1, base))
```

---

## Integration with Orchestrator

### Phase 1 (Evaluation)

```yaml
action: Check current trust level
impact:
  - Adjust complexity thresholds
  - Set confirmation requirements
  - Configure verbosity
```

### Phase 4 (Planning)

```yaml
action: Apply trust-based autonomy
impact:
  - Level 1-2: Present plan and wait for approval
  - Level 3-4: Present plan, proceed unless stopped
  - Level 5: Execute plan, report results
```

### Phase 5 (Execution)

```yaml
action: Respect confirmation requirements
impact:
  - Pause for confirmations per trust level
  - Auto-execute allowed operations
```

### Phase 7 (Consolidation)

```yaml
action: Update trust metrics
impact:
  - Record acceptance/rollback
  - Detect trust signals
  - Adjust trust level
```

---

## Agent: trust-manager

Dedicated agent for trust management:

```yaml
invocation: Task(subagent_type: 'trust-manager')
responsibilities:
  - Calculate trust adjustments
  - Detect trust signals in user messages
  - Update user-trust.json
  - Recommend autonomy settings
```

---

## User Preferences

Users can set explicit preferences in `.claude/state/user-trust.json`:

```json
{
  "preferences": {
    "alwaysAskFor": ["delete", "deploy", "production", "secrets"],
    "neverAskFor": ["format", "lint", "minor_edit"],
    "verbosity": "concise",
    "language": "es"
  }
}
```

These override trust level defaults.

---

## Commands

```
/trust status     → Show current trust level and metrics
/trust level N    → Manually set trust level (1-5)
/trust reset      → Reset to default (level 2)
```

---

## Privacy

Trust data is:
- Stored locally only (`.claude/state/`)
- Never sent to external services
- User can reset anytime
- Deleted on `/trust reset`

---

*Part of Orchestrator v3.7 - User Trust Levels Module*
