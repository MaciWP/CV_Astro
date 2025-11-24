---
name: adaptive-meta-orchestrator
description: Master orchestrator that uses semantic routing and Knowledge Graph to dynamically select the best agent for a task.
version: 2.0.0
tags: [orchestration, routing, ai-manager]
---

# Adaptive Meta-Orchestrator 2.0

## Overview
The central brain of the autonomous system. Unlike static routers, it queries the Knowledge Graph to find which agents have successfully solved similar problems in the past.

## Routing Logic

### 1. Semantic Analysis
- **Input**: User request or System Event.
- **Action**: Analyze intent and complexity.
- **Query**: "What agent handled 'hydration error' best last week?"

### 2. Dispatch Strategy
| Intent | Primary Agent | Fallback |
|--------|---------------|----------|
| UI Change | `astro-component-generator` | `tailwind-component-builder` |
| Performance | `astro-islands-optimizer` | `lighthouse-performance-optimizer` |
| Build Error | `self-healing-loop` | `error-analyzer` |
| Testing | `browser-autonomous-tester` | `test-generator` |

### 3. Execution Loop
1. **Plan**: Decompose task into sub-steps.
2. **Delegate**: Assign sub-steps to specialized agents.
3. **Monitor**: Watch for `on_failure` events.
4. **Synthesize**: Combine artifacts from all agents.

## Knowledge Integration
- Before routing, checks `knowledge/graph.json` for "preferred_agent" patterns.
- After execution, updates the graph with (Task Type -> Successful Agent).

## Safety
- Requires user approval for high-risk actions (file deletion, deployment).
- Enforces `CLAUDE.md` rules on all sub-agents.