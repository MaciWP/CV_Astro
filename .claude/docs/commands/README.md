# Commands System - How It Works

**Purpose**: Quick shortcuts for common tasks via slash commands

**Current Status**: 17 commands operational, simple and effective

---

## How Commands Work

### 1. Command Discovery

**Type `/` in chat** to discover available commands.

All commands are stored in `.claude/commands/*.md` files.

### 2. Command Execution

**Claude invokes commands using the `SlashCommand` tool:**

```typescript
// When user types: /load-security
SlashCommand({ command: "/load-security" })

// The command expands to a prompt (from .claude/commands/load-security.md)
// Claude then executes the instructions in that file
```

**Key point**: Commands are **prompt expansions**, not code execution.

### 3. Command Categories

We have **4 main categories**:

#### A. Discovery Commands (6)
Show what's available in the project:
- `/tools` - All tools (skills, agents, commands, MCPs)
- `/skills` - List all skills with descriptions
- `/agents` - List all agents
- `/commands` - List all commands
- `/claude-docs` - Browse .claude/ documentation
- `/project-docs` - Browse project documentation

#### B. Load Commands (7)
Load detailed documentation into context:
- `/load-anti-hallucination` - Validation patterns
- `/load-context-management` - Token optimization
- `/load-security` - Security patterns
- `/load-testing-strategy` - Test generation
- `/load-refactoring-patterns` - Code quality
- `/load-user-experience` - UX patterns
- `/load-self-improvement` - Proactive suggestions
- `/load-toon-format` - TOON syntax

#### C. Validation Commands (1)
- `/validate-claim <file> [func]` - Verify file/function exists

#### D. Debugging Commands (1)
- `/quick-debug` - Fast debugging workflow

---

## Command File Structure

All commands follow this structure:

```markdown
---
description: Brief one-line description
---

# Command Title

Longer description of what the command does.

## Usage

```
/command [arguments]
```

## [Additional Sections]

Varies by command type...
```

### Required Elements

1. **Frontmatter** with `description:`
2. **Title** (# heading)
3. **Usage** section with examples

### Optional Elements (depending on command type)

- **What This Command Does** - For load commands
- **When to Use** - Scenarios for using
- **Output Format** - For discovery commands
- **Success Metrics** - Expected outcomes
- **Examples** - Real usage examples

---

## How to Use Commands

### As a User

**Type `/` and command name:**
```
/tools
/load-security
/validate-claim src/auth.ts
```

### As Claude

**Use the `SlashCommand` tool:**
```typescript
// User requests anti-hallucination patterns
await SlashCommand({ command: "/load-anti-hallucination" });

// Wait for <command-message> confirmation
// Then execute the loaded instructions
```

**Important**: Don't invoke commands already running. Check for `<command-message>` first.

---

## When to Create New Commands

Create a new command when:

### ✅ Good Reasons

1. **Repeated Request** (3+ times)
   - Same documentation loaded frequently
   - Same workflow executed repeatedly
   - Pattern detected by self-improvement module

2. **Quick Shortcut** for complex task
   - Multi-step process → single command
   - Common debugging workflow
   - Frequent documentation lookup

3. **Category Completion**
   - New module created → add `/load-module` command
   - New documentation type → add discovery command

### ❌ Bad Reasons

1. **One-time use** - Just do it manually
2. **Too specific** - Only works for one file/project
3. **Duplicates existing** - Check existing commands first
4. **Needs code** - Commands are prompts, not executables

---

## Commands vs Skills vs Agents

**When to use each:**

| Feature | Command | Skill | Agent |
|---------|---------|-------|-------|
| **Purpose** | Quick shortcut | Reusable workflow | Specialized task |
| **Invocation** | `/command` | `Skill(name)` | `Task(agent)` |
| **Complexity** | Simple | Medium | Complex |
| **Context** | Always loaded | Loaded on demand | Autonomous |
| **Example** | `/tools` | `code-analyzer` | `bug-documenter` |

**Rule of thumb:**
- Command: <5 steps, frequently used
- Skill: Multi-step workflow, conditional logic
- Agent: Autonomous, multi-tool, decision-making

---

## Current Commands (17)

### Discovery (6)
```
/tools [category]         → All tools
/skills [filter]          → Skills list
/agents [filter]          → Agents list
/commands [category]      → Commands list
/claude-docs [filter]     → .claude/ docs
/project-docs [filter]    → Project docs
```

### Load Modules (7)
```
/load-anti-hallucination  → Validation patterns
/load-context-management  → Token optimization
/load-security            → Security patterns
/load-testing-strategy    → Test generation
/load-refactoring-patterns → Code quality
/load-user-experience     → UX patterns
/load-self-improvement    → Proactive suggestions
/load-toon-format         → TOON syntax
```

### Utilities (3)
```
/docs [topic]             → Browse docs
/validate-claim <file>    → Verify existence
/quick-debug              → Fast debugging
```

---

## Command Limitations

**What commands CAN'T do** (by design):

1. **No code execution** - Commands are prompts, not scripts
2. **No SQLite history** - No persistent logging (would need infrastructure)
3. **No chaining** - Can't do `/test && /fix` (would need parser)
4. **No aliases** - No `.claude/commands/aliases.json` (would need resolver)
5. **No validation** - No type checking or param validation (would need schema)
6. **No analytics** - No usage tracking (would need database)

**Why these limitations?**
- Commands work **without any code infrastructure**
- Simple markdown files = portable, git-trackable, easy to maintain
- Advanced features would require backend services (out of scope)

**This is intentional** - keeping commands simple and maintainable.

---

## Success Metrics

| Metric | Target | Status |
|--------|--------|--------|
| **Command count** | 15-20 | ✅ 17 |
| **Discoverability** | 90%+ | ✅ `/tools` command |
| **Format consistency** | 100% | ✅ All follow patterns |
| **Usage frequency** | High | ✅ Used regularly |

---

## Related Documentation

- **Best Practices**: `.claude/docs/commands/best-practices.md` - How to create good commands
- **CLAUDE.md**: Commands banner showing all available commands
- **SPEC**: `specs-driven/06-COMMANDS/SPEC.md` - Full vision (advanced features)

---

**Version**: 1.0.0 (Simple Implementation)
**Status**: Operational (17 commands working)
**Approach**: Markdown-based prompts (no code infrastructure)
