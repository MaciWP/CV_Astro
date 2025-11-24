---
name: watcher-daemon
description: Always-on background process that monitors file system events and triggers specialized agents for hyper-automation.
version: 1.0.0
tags: [automation, monitoring, event-driven]
---

# Watcher Daemon

## Overview
Runs a background process to watch file system events and trigger specialized agents. This is the "Nervous System" of the hyper-automated environment.

## Triggers & Actions

| Event | Pattern | Action Agent | Priority |
|-------|---------|--------------|----------|
| Change | `src/components/*.astro` | `astro-islands-optimizer` | Low (Async) |
| Change | `src/pages/*.astro` | `astro-seo-validator` | Medium |
| Error | `build.log` | `error-analyzer` | High |
| Timer | `0 0 * * *` (Daily) | `dependency-updater` | Low |

## Execution Steps

### 1. Start Monitoring
```bash
# Start the python watcher script (mock command for agent)
python .claude/scripts/watcher.py --start
```

### 2. Event Dispatch
When an event is detected:
1. Log event to `.gemini/events.log`
2. Check `adaptive-meta-orchestrator` for routing rules
3. Dispatch specialized agent if confidence > 0.8

## Self-Correction
If an action fails, the Watcher triggers the `meta-orchestrator` with the error context.

## Limitations
- Requires active terminal session or background process permission.
- High frequency changes (e.g., `npm install`) are debounced.
