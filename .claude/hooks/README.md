# Orchestrator Validation Hook & Event-Driven Triggers

**Purpose**: Enforce mandatory CLAUDE.md rules AND trigger proactive agents based on system events.

**Last updated**: 2025-11-23

---

## 1. Reactive Guardrails (Legacy)
Applies to: ALL messages (complex, simple, or when blocked)
- Validates against `CLAUDE.md` rules.
- Prevents hallucinated file paths.

## 2. Proactive Event Triggers (State of the Art)
The system now listens for specific events to dispatch specialized agents automatically.

| Event Trigger | Pattern / Condition | Action Agent | Priority |
|---------------|---------------------|--------------|----------|
| `on_file_change` | `src/**/*.astro` | `astro-islands-optimizer` | Low (Async) |
| `on_file_change` | `src/pages/**/*.astro` | `astro-seo-validator` | Medium |
| `on_build_failure` | `build.log` contains "Error" | `self-healing-loop` | High |
| `on_deploy_success` | Netlify deploy confirmed | `browser-autonomous-tester` | Medium |
| `on_dependency_update` | `package.json` modified | `security-auditor` | High |

## 3. Usage
These hooks are managed by the `watcher-daemon` skill. Do not modify manually unless you are updating the orchestration logic.