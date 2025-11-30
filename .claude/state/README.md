# State Management Directory

This directory contains runtime state for ORCHESTRATOR-ALPHA.

## Files

| File | Purpose | Lifecycle |
|------|---------|-----------|
| `current_task.json` | Active task state | Created on task start, deleted on completion |
| `task_history.jsonl` | Completed tasks log | Append-only, persists |
| `memory_cache.json` | Cross-task knowledge | Updated incrementally |
| `loop_detected.json` | Loop detection log | Created on loop, cleared on resolution |

## State Lifecycle

```
Task Start → current_task.json created
     ↓
Execution → current_task.json updated per step
     ↓
Completion → Archived to task_history.jsonl
     ↓
Cleanup → current_task.json deleted
```

## Manual Operations

```bash
# View current task
cat .claude/state/current_task.json | jq

# Resume interrupted task
# Just ask Claude: "Resume the current task"

# Clear state (start fresh)
rm .claude/state/current_task.json

# View task history
cat .claude/state/task_history.jsonl | jq -s '.'
```
