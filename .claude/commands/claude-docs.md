---
description: Show all documentation in .claude/ directory
---

# Claude Documentation Browser

Browse all documentation, skills, agents, and commands in the `.claude/` directory.

## Usage

```
/claude-docs [filter]
```

### Examples

```
/claude-docs                    # All .claude/ documentation
/claude-docs anti-hallucination # Filter by keyword
/claude-docs skills             # Only skills
```

---

## What This Command Does

1. **Scans `.claude/` directory** for all markdown files
2. **Categorizes by type**:
   - 📚 Documentation (`.claude/docs/`)
   - 🎯 Skills (`.claude/skills/`)
   - 🤖 Agents (`.claude/agents/`)
   - ⚡ Commands (`.claude/commands/`)
3. **Shows file sizes** and last modified dates
4. **Filters by keyword** if provided

---

## Output Format

```
═══════════════════════════════════════════════════════════════════════════════
📚 CLAUDE DOCUMENTATION (.claude/)
═══════════════════════════════════════════════════════════════════════════════

📚 Documentation (.claude/docs/) - 5 topics
═══════════════════════════════════════════════════════════════════════════════

anti-hallucination/
├─ README.md (4.4 KB) - Overview of anti-hallucination system
├─ file-validation.md (7.5 KB) - 3-stage file validation patterns
├─ function-validation.md (9.4 KB) - Function existence validation
├─ confidence-scoring.md (10.3 KB) - Confidence thresholds
└─ examples.md (10.7 KB) - Real before/after examples

context-management/
├─ README.md (3.2 KB) - Context optimization overview
├─ token-optimization.md (8.1 KB) - Token reduction strategies
└─ relevance-filtering.md (6.8 KB) - Semantic filtering patterns

═══════════════════════════════════════════════════════════════════════════════

🎯 Skills (.claude/skills/) - 9 skills
═══════════════════════════════════════════════════════════════════════════════

1. adaptive-meta-orchestrator/ (CRITICAL)
   └─ SKILL.md (15.2 KB) - Master orchestrator

2. code-analyzer/
   └─ SKILL.md (8.4 KB) - Code quality analysis

3. security-auditor/
   └─ SKILL.md (9.1 KB) - Vulnerability detection

[... continue for all skills ...]

═══════════════════════════════════════════════════════════════════════════════

🤖 Agents (.claude/agents/) - 3 agents
═══════════════════════════════════════════════════════════════════════════════

1. bug-documenter.md (4.2 KB)
   → Maintains AI_BUGS_KNOWLEDGE.md

2. decision-documenter.md (3.8 KB)
   → Maintains AI_PRODUCT_DECISIONS.md

3. progress-tracker.md (4.1 KB)
   → Maintains AI_PROGRESS_TRACKER.md

═══════════════════════════════════════════════════════════════════════════════

⚡ Commands (.claude/commands/) - 10 commands
═══════════════════════════════════════════════════════════════════════════════

Discovery:
• tools.md (6.2 KB) - /tools [category]
• skills.md (4.8 KB) - /skills [filter]
• agents.md (5.1 KB) - /agents [filter]
• commands.md (7.3 KB) - /commands [category]
• docs.md (3.2 KB) - /docs [topic]

Anti-Hallucination:
• load-anti-hallucination.md (2.1 KB) - /load-anti-hallucination
• validate-claim.md (4.5 KB) - /validate-claim <file> [func]

Debugging:
• quick-debug.md (3.7 KB) - /quick-debug

Documentation:
• claude-docs.md (THIS FILE) - /claude-docs [filter]
• project-docs.md (TBD) - /project-docs [filter]

═══════════════════════════════════════════════════════════════════════════════

📊 STATISTICS

Total Files: 42
Total Size: 185.3 KB
Categories:
• Documentation: 12 files (52.1 KB)
• Skills: 9 files (78.4 KB)
• Agents: 3 files (12.1 KB)
• Commands: 10 files (42.7 KB)

═══════════════════════════════════════════════════════════════════════════════
```

---

## Implementation

Execute these steps:

1. **Scan directories**:
```typescript
const docs = await Glob({ pattern: '.claude/docs/**/*.md' });
const skills = await Glob({ pattern: '.claude/skills/**/SKILL.md' });
const agents = await Glob({ pattern: '.claude/agents/*.md' });
const commands = await Glob({ pattern: '.claude/commands/*.md' });
```

2. **Read file metadata**:
```typescript
for (const file of allFiles) {
  const stats = await getFileStats(file);
  const firstLines = await Read({ file_path: file, limit: 10 });

  // Extract description from frontmatter or first heading
  const description = extractDescription(firstLines);

  files.push({
    path: file,
    size: stats.size,
    modified: stats.mtime,
    description
  });
}
```

3. **Categorize and format**:
```typescript
const categorized = {
  docs: files.filter(f => f.path.startsWith('.claude/docs/')),
  skills: files.filter(f => f.path.includes('/skills/')),
  agents: files.filter(f => f.path.includes('/agents/')),
  commands: files.filter(f => f.path.includes('/commands/'))
};

// Format by category
for (const [category, items] of Object.entries(categorized)) {
  console.log(`\n${categoryIcon[category]} ${categoryName[category]}`);

  for (const item of items) {
    console.log(`${item.path} (${formatSize(item.size)}) - ${item.description}`);
  }
}
```

4. **Apply filter if provided**:
```typescript
if (filter) {
  allFiles = allFiles.filter(f =>
    f.path.includes(filter) ||
    f.description.toLowerCase().includes(filter.toLowerCase())
  );
}
```

---

## Use Cases

### Browse All Documentation
```
/claude-docs
→ See everything in .claude/ directory
```

### Find Anti-Hallucination Docs
```
/claude-docs anti-hallucination
→ Shows only anti-hallucination related files
```

### List All Skills
```
/claude-docs skills
→ Shows only skill files with descriptions
```

### Find Commands
```
/claude-docs commands
→ Shows all available slash commands
```

---

## Related Commands

- `/project-docs` - Browse project documentation (outside `.claude/`)
- `/docs [topic]` - Browse specific documentation topic
- `/tools` - Show all available tools
- `/skills` - List all skills with activation examples
- `/agents` - List all agents with usage examples
- `/commands` - List all commands

---

**Version**: 1.0.0
**Related**: `/project-docs`, `/docs`, `/tools`
**Output**: Categorized listing of all `.claude/` documentation
**Filter**: Optional keyword filter
