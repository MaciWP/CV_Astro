---
description: Show all available tools (skills, agents, commands, MCP servers)
---

# Available Tools

Display all available tools, skills, agents, commands, and MCP servers in the project.

## Usage

```
/tools [category]
```

### Without Arguments

Shows everything available:

```
/tools
```

### With Category

Shows specific category:

```
/tools skills     # Show only skills
/tools agents     # Show only agents
/tools commands   # Show only commands
/tools mcp        # Show only MCP servers
```

---

## Output Format

When you run `/tools`, display:

```
═══════════════════════════════════════════════════════════════════════════════
🛠️  AVAILABLE TOOLS
═══════════════════════════════════════════════════════════════════════════════

## 🎯 SKILLS (9 available)

1. adaptive-meta-orchestrator ⭐ (CRITICAL - Always activate first)
   Master orchestrator, coordinates all workflows
   Activation: Skill(adaptive-meta-orchestrator)

2. skill-builder
   Create new skills based on patterns
   Activation: Skill(skill-builder)

3. task-decomposer
   Break complex tasks into subtasks
   Activation: Skill(task-decomposer)

4. task-router
   Route tasks to optimal agents
   Activation: Skill(task-router)

5. code-analyzer
   Code quality and complexity analysis
   Activation: Skill(code-analyzer)

6. security-auditor
   Security vulnerability detection
   Activation: Skill(security-auditor)

7. orchestrator-observability
   Performance monitoring and metrics
   Activation: Skill(orchestrator-observability)

8. spec-architect-agent
   Spec-driven development
   Activation: Skill(spec-architect-agent)

9. utils-builder
   Utility function generation
   Activation: Skill(utils-builder)

---

## 🤖 AGENTS (3 available)

1. bug-documenter
   Maintains AI_BUGS_KNOWLEDGE.md
   Documents bugs, root causes, solutions, prevention patterns
   Activation: Task(subagent_type='bug-documenter', prompt='...')

2. decision-documenter
   Maintains AI_PRODUCT_DECISIONS.md
   Documents feature specs, design decisions, architecture
   Activation: Task(subagent_type='decision-documenter', prompt='...')

3. progress-tracker
   Maintains AI_PROGRESS_TRACKER.md
   Tracks feature completion, blockers, priorities
   Activation: Task(subagent_type='progress-tracker', prompt='...')

---

## ⚡ COMMANDS (7 available)

📚 Documentation & Discovery:
1. /docs [topic]              - Browse available documentation
2. /tools [category]          - Show all available tools (this command)
3. /skills                    - List all skills
4. /agents                    - List all agents
5. /commands                  - List all commands

🛡️ Anti-Hallucination:
6. /load-anti-hallucination   - Load validation patterns
7. /validate-claim <file> [func] - Validate specific claim

🐛 Debugging:
8. /quick-debug               - Fast debugging workflow

---

## 🔌 MCP SERVERS (2 available)

1. ide (mcp__ide__*)
   VS Code integration - diagnostics, code execution
   Tools: getDiagnostics, executeCode

2. (Other MCP servers if installed)
   Check .claude/mcp-servers/ for available servers

═══════════════════════════════════════════════════════════════════════════════

💡 TIP: Use specific commands for details:
   /skills     - More details on skills
   /agents     - More details on agents
   /commands   - More details on commands
   /docs       - Browse documentation

═══════════════════════════════════════════════════════════════════════════════
```

---

## Implementation

### Detect Available Resources

**Skills** (read `.claude/skills/` directory):
```typescript
const skills = await Glob({ pattern: '.claude/skills/**/SKILL.md' });
// Parse each SKILL.md to get name and description
```

**Agents** (read `.claude/agents/` directory):
```typescript
const agents = await Glob({ pattern: '.claude/agents/*.md' });
// Parse each agent file for name and description
```

**Commands** (read `.claude/commands/` directory):
```typescript
const commands = await Glob({ pattern: '.claude/commands/*.md' });
// Parse YAML frontmatter for description
```

**MCP Servers** (check if available):
```typescript
// List available mcp__* tools
// Check .claude/mcp-servers/ if directory exists
```

---

## Category-Specific Output

### `/tools skills`

```
🎯 SKILLS (9 available)

Master Orchestration:
• adaptive-meta-orchestrator ⭐ - Always activate first
  Coordinates all workflows, auto-detects stack

Decomposition & Routing:
• task-decomposer - Break complex tasks into subtasks
• task-router - Route tasks to optimal agents

Analysis & Quality:
• code-analyzer - Code quality and complexity analysis
• security-auditor - Security vulnerability detection

Builders:
• skill-builder - Create new skills
• utils-builder - Generate utility functions
• spec-architect-agent - Spec-driven development

Monitoring:
• orchestrator-observability - Performance metrics

Activation: Skill(name)
Example: Skill(adaptive-meta-orchestrator)
```

### `/tools agents`

```
🤖 AGENTS (3 available)

Documentation Agents:
• bug-documenter - AI_BUGS_KNOWLEDGE.md
  Logs bugs, root causes, solutions, prevention patterns

• decision-documenter - AI_PRODUCT_DECISIONS.md
  Logs feature specs, design decisions, architecture

• progress-tracker - AI_PROGRESS_TRACKER.md
  Tracks completion %, blockers, priorities

Activation: Task(subagent_type='agent-name', prompt='task description')
Example: Task(subagent_type='bug-documenter', prompt='Document auth bug')
```

### `/tools commands`

```
⚡ COMMANDS (7 available)

Documentation:
/docs [topic]              - Browse documentation
/load-anti-hallucination   - Load validation patterns

Discovery:
/tools [category]          - Show all tools
/skills                    - List skills
/agents                    - List agents
/commands                  - List commands

Validation:
/validate-claim <file>     - Validate file/function claim

Debugging:
/quick-debug               - Fast debugging

Usage: Type /command-name in chat
Example: /load-anti-hallucination
```

---

## When to Use

**For Claude (me)**:
- When I forget what skills are available
- Before suggesting a workflow (check if skill exists)
- When user asks "what can you do?"

**For User**:
- Discover available tools
- Learn how to activate skills/agents
- See all commands at a glance

---

## Integration with CLAUDE.md

This command complements the "Available Resources" section in CLAUDE.md by providing:
- Dynamic discovery (reads actual files)
- Usage examples
- Category filtering

---

**Version**: 1.0.0
**Related**: `/skills`, `/agents`, `/commands`, `/docs`
**Auto-discovery**: Reads .claude/ directories dynamically
