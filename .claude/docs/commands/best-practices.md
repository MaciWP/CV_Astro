# Commands - Best Practices

**Goal**: Create clear, useful, maintainable slash commands

**Key Principle**: Commands are **prompt expansions**, keep them simple

---

## Golden Rules

### Rule 1: One Command = One Clear Purpose

```markdown
✅ GOOD: /load-security
Purpose: Load security documentation

❌ BAD: /load-everything-security-and-testing
Purpose: Too broad, confusing
```

**Why**: Users should know exactly what a command does from its name.

### Rule 2: Follow Established Patterns

We have **2 main command patterns**:

#### Pattern A: Discovery Commands
```markdown
---
description: Show/list/browse [what]
---

# Title

## Usage
/command [optional-filter]

## Output Format
[Describe what user sees]

## When to Use
[Scenarios]
```

**Examples**: `/tools`, `/skills`, `/agents`

#### Pattern B: Load Commands
```markdown
---
description: Load [module] documentation/patterns
---

# Load [Module] [Patterns/Documentation]

## Usage
/load-module

## What This Command Does
[List files loaded + sizes]

## When to Use
[Scenarios for loading]

## What You'll Learn
[Key concepts overview]

## Execute Reads
[Show Read() calls]

## Success Metrics (Target)
[Expected outcomes]
```

**Examples**: `/load-security`, `/load-testing-strategy`

### Rule 3: Clear, Actionable Descriptions

```markdown
✅ GOOD:
description: Load security patterns for vulnerability detection

❌ BAD:
description: Security stuff
```

**Description checklist**:
- [ ] Verb-based (Load, Show, Browse, Validate)
- [ ] Specific (what exactly it does)
- [ ] <80 characters (fits in one line)

### Rule 4: Provide Examples

```markdown
## Usage

```
/validate-claim src/auth.ts
/validate-claim src/auth.ts validateUser
/validate-claim src/services/*.ts  # Wildcard support
```
```

**Why**: Users learn by example, show 2-3 use cases.

---

## File Naming Conventions

### Discovery Commands
```
tools.md           # Show tools
skills.md          # List skills
agents.md          # List agents
commands.md        # List commands
```

### Load Commands
```
load-security.md
load-testing-strategy.md
load-anti-hallucination.md
```

**Pattern**: `load-[module-name].md` (kebab-case)

### Utility Commands
```
quick-debug.md
validate-claim.md
```

**Pattern**: `[action]-[object].md` (kebab-case)

---

## Command Structure Template

### For Discovery Commands

```markdown
---
description: [Verb] [what] (e.g., Show all available tools)
---

# [Command Name]

Brief description of what this command does.

## Usage

```
/command [optional-args]
```

### Examples

```
/command              # Default behavior
/command filter       # With filter
```

## Output Format

Describe what the user will see when they run this command.

## When to Use

- Scenario 1
- Scenario 2
- Scenario 3

---

**Version**: 1.0.0
**Category**: [discovery/utility/debugging]
```

### For Load Commands

```markdown
---
description: Load [module] [patterns/documentation] for [purpose]
---

# Load [Module] [Patterns/Documentation]

Longer description explaining what gets loaded and why.

## Usage

```
/load-module
```

---

## What This Command Does

Loads **[concept]** into context:

1. **file1.md** (X KB) - Description
2. **file2.md** (Y KB) - Description

**Total**: ~Z KB of [topic] documentation

---

## When to Use

Load [module] when:

### Category 1
- Scenario A
- Scenario B

### Category 2
- Scenario C
- Scenario D

---

## What You'll Learn

### 1. Concept A

Brief explanation with example.

### 2. Concept B

Brief explanation with example.

---

## Execute Reads

This command will load all [module] documentation:

```typescript
// 1. Read overview
await Read({ file_path: '.claude/docs/module/README.md' });

// 2. Read specific patterns
await Read({ file_path: '.claude/docs/module/patterns.md' });
```

---

## Success Metrics (Target)

| Metric | Target | Source |
|--------|--------|--------|
| **Metric 1** | Value | How measured |
| **Metric 2** | Value | How measured |

---

## Quick Start

**After loading, [action]:**

1. **Concept A**: Example usage
2. **Concept B**: Example usage

---

## Related Commands

- `/other-command` - Description
- `/related-command` - Description

---

**Version**: 1.0.0
**Module**: [MODULE-NAME]
**Documentation Size**: ~X KB
**Target**: [goal]
**Status**: Ready to load
```

---

## Content Guidelines

### 1. Be Concise

```markdown
✅ GOOD (3 lines):
Loads security patterns for detecting vulnerabilities:
- Secret detection (9 regex patterns)
- SQL injection prevention
- OWASP Top 10 checklist

❌ BAD (20 lines):
This command is designed to help you load comprehensive
security patterns that will assist you in detecting and
preventing various types of vulnerabilities including but
not limited to... [continues for paragraphs]
```

### 2. Use Structured Lists

```markdown
✅ GOOD:
## When to Use

### Security-Critical Tasks
- Implementing authentication
- Working with databases
- Handling user input

❌ BAD:
## When to Use

You should use this command when you are implementing authentication or working with databases or handling user input or...
```

### 3. Provide Concrete Examples

```markdown
✅ GOOD:
```toon
tests[3	]{name	passed	failed}:
  login	12	0
  signup	8	1
```

❌ BAD:
TOON format uses brackets and tabs to represent data
```

### 4. Include Metrics When Applicable

```markdown
✅ GOOD:
**Token savings**: 48% (125 → 65 tokens)

❌ BAD:
Saves lots of tokens
```

---

## Testing Your Command

### Manual Test Checklist

1. **Frontmatter valid**:
   ```markdown
   ---
   description: Clear one-line description
   ---
   ```

2. **Title clear** (H1):
   ```markdown
   # Load Security Patterns
   ```

3. **Usage section** with examples:
   ```markdown
   ## Usage
   /command [args]
   ```

4. **Content organized**:
   - Headings (##, ###)
   - Lists (-, 1.)
   - Code blocks (```)

5. **No broken links** to other docs

6. **Consistent with pattern** (Discovery or Load)

### Test Execution

```bash
# 1. Invoke command
/your-command

# 2. Check for <command-message>
<command-message>your-command is running...</command-message>

# 3. Verify expanded prompt makes sense
# 4. Execute instructions successfully
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Missing Frontmatter

```markdown
# Load Security  ← Missing frontmatter!

Loads security patterns...
```

**Fix**: Always include `---\ndescription: ...\n---`

### ❌ Mistake 2: Vague Descriptions

```markdown
---
description: Security command
---
```

**Fix**: Be specific: `Load security patterns for vulnerability detection`

### ❌ Mistake 3: No Examples

```markdown
## Usage
/validate-claim
```

**Fix**: Show 2-3 concrete examples with different arguments

### ❌ Mistake 4: Inconsistent Format

```markdown
# Load Security

Loads security stuff.

The end.
```

**Fix**: Follow the template (What This Command Does, When to Use, etc.)

### ❌ Mistake 5: Too Much Content

```markdown
## What You'll Learn

[50 paragraphs of security theory]
```

**Fix**: Be concise, link to docs for details

---

## When to Create vs Expand Existing

### Create New Command When:

✅ **Different purpose**
- `/load-security` (security patterns)
- `/load-testing-strategy` (test patterns)
→ Separate concerns

✅ **Different user intent**
- `/tools` (show everything)
- `/skills` (skills only)
→ Different filters

✅ **Frequent usage** (3+ times)
- Pattern detected
- Common workflow
→ Deserves shortcut

### Expand Existing Command When:

✅ **Same purpose, more content**
- `/load-security` → add new vulnerability pattern
→ Update existing

✅ **Same category, new item**
- `/tools` → new skill added
→ Command auto-discovers

---

## Maintenance

### Regular Reviews

**Monthly**: Review command usage
- Which commands are unused? (consider deprecating)
- Which patterns are repeated? (create new command)
- Are descriptions still accurate?

**After New Module**: Add `/load-module` command if needed

**After Documentation Update**: Update related commands

---

## Success Checklist

Before committing your new command:

- [ ] Frontmatter with clear description
- [ ] Follows Discovery or Load pattern
- [ ] Usage section with 2-3 examples
- [ ] Concise, structured content
- [ ] No broken references
- [ ] Tested manually (invoked successfully)
- [ ] Added to CLAUDE.md commands banner (if important)
- [ ] Updated commands list count

---

## Examples of Good Commands

### Example 1: Discovery Command

`.claude/commands/tools.md` - Shows all available tools

**Why it's good**:
- Clear name and description
- Optional category filter
- Structured output format
- Examples provided

### Example 2: Load Command

`.claude/commands/load-security.md` - Loads security patterns

**Why it's good**:
- Lists all files loaded (with sizes)
- Clear "When to Use" scenarios
- Success metrics defined
- Related commands linked

### Example 3: Utility Command

`.claude/commands/validate-claim.md` - Validates file/function exists

**Why it's good**:
- Solves specific problem (anti-hallucination)
- Clear usage with positional args
- Multiple examples
- Integration with anti-hallucination module

---

**Version**: 1.0.0
**Purpose**: Guide for creating high-quality slash commands
**Status**: Operational (based on 17 existing commands)
