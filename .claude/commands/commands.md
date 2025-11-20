---
description: List all available slash commands with usage examples
---

# Available Commands

List all available slash commands in `.claude/commands/` with descriptions and usage examples.

## Usage

```
/commands [category]
```

### Examples

```
/commands                    # All commands
/commands discovery          # Discovery commands
/commands anti-hallucination # Anti-hallucination commands
```

---

## Output Format

```
⚡ AVAILABLE COMMANDS (10 total)

═══════════════════════════════════════════════════════════════════════════════

🔍 Discovery & Navigation
═══════════════════════════════════════════════════════════════════════════════

/tools [category]
Show all available tools (skills, agents, commands, MCP servers)
Usage: /tools           → Show all
       /tools skills    → Show only skills
       /tools agents    → Show only agents

/skills [filter]
List all available skills with activation examples
Usage: /skills          → All skills
       /skills builder  → Skills matching "builder"

/agents [filter]
List all available agents with usage examples
Usage: /agents          → All agents
       /agents bug      → Agents matching "bug"

/commands [category]
List all available commands (this command)
Usage: /commands                 → All commands
       /commands discovery       → Discovery commands

/docs [topic]
Browse available documentation in .claude/docs/
Usage: /docs                     → List all topics
       /docs anti-hallucination  → Browse anti-hallucination docs

═══════════════════════════════════════════════════════════════════════════════

🛡️ Anti-Hallucination & Validation
═══════════════════════════════════════════════════════════════════════════════

/load-anti-hallucination
Load comprehensive anti-hallucination validation patterns
When to use: Complex tasks requiring detailed validation
Output: Loads 5 documentation files (~42 KB)
Documentation: .claude/docs/anti-hallucination/

/validate-claim <file-path> [function-name] [domain]
Validate specific file path or function claim before using it
Usage: /validate-claim src/auth.ts
       /validate-claim src/auth.ts validateJWT backend
Output: File status, function status, confidence score, action recommendation

═══════════════════════════════════════════════════════════════════════════════

🐛 Debugging & Development
═══════════════════════════════════════════════════════════════════════════════

/quick-debug
Fast debugging workflow
Usage: /quick-debug
When to use: Quick debugging sessions

═══════════════════════════════════════════════════════════════════════════════

💡 HOW TO USE COMMANDS

1. Basic Usage:
   Type /command-name in chat

2. With Arguments:
   /validate-claim src/auth.ts validateJWT

3. From Skills/Agents:
   SlashCommand('/load-anti-hallucination')

4. Chaining:
   /docs
   [See available topics]
   /load-anti-hallucination
   [Loads full documentation]

═══════════════════════════════════════════════════════════════════════════════

📊 COMMAND CATEGORIES

Discovery (5 commands):
• /tools, /skills, /agents, /commands, /docs
→ Help you find what's available

Anti-Hallucination (2 commands):
• /load-anti-hallucination, /validate-claim
→ Prevent false claims about files/functions

Debugging (1 command):
• /quick-debug
→ Fast debugging workflows

Development (Future):
• /test-generate, /refactor, /security-scan
→ Code quality and automation

═══════════════════════════════════════════════════════════════════════════════

🔗 COMMAND RELATIONSHIPS

Discovery Flow:
/tools                  → See everything
  ↓
/skills [filter]        → Explore skills in detail
/agents [filter]        → Explore agents in detail
/commands [category]    → Explore commands in detail
  ↓
/docs [topic]           → Read documentation

Anti-Hallucination Flow:
Read CLAUDE.md          → Core rules (always loaded)
  ↓
/load-anti-hallucination → Load detailed patterns (when needed)
  ↓
/validate-claim         → Validate specific claim

═══════════════════════════════════════════════════════════════════════════════

📚 CREATING NEW COMMANDS

Commands are Markdown files in .claude/commands/

Structure:
---
description: Short description
---

# Command Name

[Content with instructions for Claude]

Example:
.claude/commands/my-command.md
→ Accessible as /my-command

See: specs-driven/06-COMMANDS/ for command patterns

═══════════════════════════════════════════════════════════════════════════════

🎯 MOST USEFUL COMMANDS

For Discovery:
• /tools        → Find all available resources
• /skills       → Learn how to activate skills
• /commands     → See this list again

For Development:
• /load-anti-hallucination → Load validation patterns
• /validate-claim          → Validate before claiming
• /quick-debug             → Fast debugging

═══════════════════════════════════════════════════════════════════════════════
```

---

## Dynamic Discovery

Read from `.claude/commands/` directory:

```typescript
// Find all command files
const commandFiles = await Glob({ pattern: '.claude/commands/*.md' });

// Parse each command
for (const file of commandFiles) {
  const content = await Read({ file_path: file, limit: 20 });

  // Extract:
  // - name (from filename: /command-name.md → /command-name)
  // - description (from YAML frontmatter)
  // - category (infer from content or frontmatter)

  // Display formatted by category
}
```

---

## Categories

Auto-detect category from command content/frontmatter:

- **discovery**: tools, skills, agents, commands, docs
- **anti-hallucination**: load-anti-hallucination, validate-claim
- **debugging**: quick-debug
- **development**: (future commands)
- **testing**: (future commands)
- **security**: (future commands)

---

## Filter Examples

```
/commands discovery
→ Shows: /tools, /skills, /agents, /commands, /docs

/commands anti-hallucination
→ Shows: /load-anti-hallucination, /validate-claim

/commands debug
→ Shows: /quick-debug
```

---

**Version**: 1.0.0
**Related**: `/tools`, `/skills`, `/agents`, `/docs`
**Source**: `.claude/commands/` directory
**Extensible**: Add new .md files to create new commands
