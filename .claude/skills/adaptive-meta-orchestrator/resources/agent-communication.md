# Agent Communication Protocol - Orchestrator v3.7

> Reference: `.claude/config/orchestrator-settings.json` → `agentCommunication`

## Purpose

Define how agents communicate, share context, and coordinate during multi-agent workflows.

---

## 3 Communication Protocols

### 1. Handoff Protocol

**When**: Sequential execution, Agent A → Agent B

```yaml
pattern: "I finished X, here's context for Y"

structure:
  from_agent: "task-lister"
  to_agent: "task-decomposer"
  handoff_type: "sequential"
  context:
    summary: "Listed 5 high-level tasks"
    output_ref: "phase3a_output"
    tokens_used: 450
    key_findings:
      - "Task T1: Create model (complexity: 15)"
      - "Task T2: Create endpoint (complexity: 25)"
    next_action: "Decompose these tasks into subtasks"
  state_snapshot: "workflow_state.json"
```

**Example Flow**:
```
task-lister (Phase 3a)
    │
    │ Handoff: {tasks: [...], dependencies: {...}}
    ↓
task-decomposer (Phase 3b)
    │
    │ Handoff: {subtasks: [...], execution_plan: {...}}
    ↓
plan-iterator (Phase 4)
```

### 2. Broadcast Protocol

**When**: Parallel execution, share info with multiple agents

```yaml
pattern: "All agents need to know X"

structure:
  from: "orchestrator"
  to: ["all_active_agents"]
  broadcast_type: "context_update"
  message:
    type: "user_preference_change"
    content: "User prefers Spanish responses"
    priority: "high"
    action_required: false
```

**Example Flow**:
```
orchestrator
    │
    ├──→ agent-1: "User prefers concise responses"
    ├──→ agent-2: "User prefers concise responses"
    └──→ agent-3: "User prefers concise responses"
```

**Broadcast Types**:
- `context_update`: New context all agents should know
- `priority_change`: User indicated urgency
- `abort_signal`: Stop current work
- `checkpoint_reached`: Phase completed

### 3. Query Protocol

**When**: Agent needs info from another agent

```yaml
pattern: "Agent A asks Agent B for specific info"

structure:
  from: "frontend-expert"
  to: "backend-expert"
  query_type: "request"
  query:
    question: "What's the API endpoint schema for /users?"
    context: "Building frontend form"
    urgency: "medium"
    expected_format: "OpenAPI schema"

response:
  from: "backend-expert"
  to: "frontend-expert"
  query_type: "response"
  answer:
    schema: {...}
    additional_info: "Auth required"
```

**Example Flow**:
```
frontend-expert                    backend-expert
      │                                  │
      │─── Query: "API schema?" ────────→│
      │                                  │
      │←── Response: {schema: ...} ──────│
      │                                  │
      ↓
  Continue work with schema
```

---

## Shared State

Agents share state via `.claude/state/shared-context.json`:

```json
{
  "taskId": "task_abc123",
  "currentPhase": 5,
  "sharedContext": {
    "objective": "Implement user authentication",
    "keyDecisions": [
      {"decision": "Use JWT", "by": "backend-expert", "timestamp": "..."}
    ],
    "artifacts": [
      {"type": "file", "path": "src/auth/jwt.ts", "by": "backend-expert"}
    ],
    "blockers": [],
    "notes": []
  },
  "agentStates": {
    "backend-expert": {"status": "completed", "output_ref": "..."},
    "frontend-expert": {"status": "in_progress", "current_task": "..."}
  }
}
```

---

## Context Compression

For efficient handoffs, compress context to <500 tokens:

### Compression Strategy

```yaml
full_context: ~3000 tokens
compressed_context: ~400 tokens

compression_rules:
  - Keep: objective, key findings, next action
  - Summarize: detailed analysis → bullet points
  - Reference: large outputs → file paths or output IDs
  - Remove: intermediate reasoning, verbose explanations
```

### Agent: context-compressor

```yaml
invocation: Task(subagent_type: 'context-compressor')
input: Full phase output (~3000 tokens)
output: Compressed summary (<500 tokens) with expandable refs

example_output:
  summary: "Created 5 tasks with dependencies T2→T1, T3→T1"
  key_points:
    - "T1: Model creation (15 complexity)"
    - "T2: API endpoint (25 complexity)"
  refs:
    full_task_list: "phase3a_output.json"
    dependency_graph: "phase3a_deps.json"
  expandable:
    - "T1 details: [expand:T1]"
    - "Full analysis: [expand:full]"
```

---

## Protocol Selection

| Scenario | Protocol | Reason |
|----------|----------|--------|
| Phase 3a → 3b | Handoff | Sequential dependency |
| Phase 5 parallel agents | Broadcast | All need same context |
| Frontend needs API schema | Query | Specific info request |
| User preference change | Broadcast | All agents affected |
| Error in one agent | Handoff | Pass to error handler |

---

## Communication Rules

### Rule 1: Minimize Context Transfer
```
✓ Transfer only what next agent needs
✗ Don't transfer entire conversation
```

### Rule 2: Reference Large Outputs
```
✓ "See phase3_output.json for task list"
✗ Embed 2000 tokens of task list
```

### Rule 3: Explicit Dependencies
```
✓ "Requires: T1 model to be created first"
✗ Assume agent knows dependencies
```

### Rule 4: Clear Handoff Points
```
✓ "Phase 3a complete. Handing off to Phase 3b."
✗ Silently transition
```

---

## Error Handling

When communication fails:

```yaml
error_types:
  - timeout: Agent didn't respond in 30s
  - invalid_response: Response doesn't match schema
  - missing_context: Required context not provided

recovery:
  timeout:
    - Retry once
    - If fails: Skip agent, use fallback
  invalid_response:
    - Request clarification
    - If fails: Use partial response
  missing_context:
    - Request from previous agent
    - If fails: Reconstruct from state files
```

---

## Logging

All communications logged to `.claude/state/decisions.jsonl`:

```json
{
  "timestamp": "2025-01-29T10:30:00Z",
  "type": "agent_communication",
  "protocol": "handoff",
  "from": "task-lister",
  "to": "task-decomposer",
  "tokensTransferred": 450,
  "compressionRatio": 0.15,
  "success": true
}
```

---

## Configuration

In `.claude/config/orchestrator-settings.json`:

```json
{
  "agentCommunication": {
    "protocols": ["handoff", "broadcast", "query"],
    "sharedStateEnabled": true,
    "contextCompression": true,
    "maxContextTokens": 500,
    "timeoutMs": 30000
  }
}
```

---

*Part of Orchestrator v3.7 - Agent Communication Protocol*
