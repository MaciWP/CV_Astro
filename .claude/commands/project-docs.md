---
description: Show all project documentation (excluding .claude/)
---

# Project Documentation Browser

Browse all documentation in the project directory (excluding `.claude/` internal docs).

## Usage

```
/project-docs [filter]
```

### Examples

```
/project-docs                   # All project documentation
/project-docs specs             # Filter by keyword
/project-docs AI_               # Show AI knowledge files
```

---

## What This Command Does

1. **Scans project directory** for documentation files
2. **Excludes `.claude/` directory** (use `/claude-docs` for that)
3. **Categorizes by type**:
   - 📋 Root Documentation (README.md, CLAUDE.md, etc.)
   - 🧠 AI Knowledge (AI_*.md files)
   - 📐 Specifications (specs-driven/)
   - 📚 Other Documentation
4. **Shows file sizes** and descriptions
5. **Filters by keyword** if provided

---

## Output Format

```
═══════════════════════════════════════════════════════════════════════════════
📂 PROJECT DOCUMENTATION (excluding .claude/)
═══════════════════════════════════════════════════════════════════════════════

📋 Root Documentation - 4 files
═══════════════════════════════════════════════════════════════════════════════

CLAUDE.md (12.3 KB)
→ Project instructions for Claude Code (ALWAYS LOADED)

README.md (8.5 KB)
→ Project overview, setup instructions, architecture

IMPLEMENTATION_STATUS.md (5.2 KB)
→ Implementation status of all 21 modules

CONTRIBUTING.md (3.1 KB)
→ Contribution guidelines

═══════════════════════════════════════════════════════════════════════════════

🧠 AI Knowledge Base - 3 files
═══════════════════════════════════════════════════════════════════════════════

AI_BUGS_KNOWLEDGE.md (15.7 KB)
→ Bug database: symptoms, root causes, solutions, prevention
→ Maintained by: bug-documenter agent
→ Last Updated: 2025-11-17

AI_PRODUCT_DECISIONS.md (12.4 KB)
→ Product decisions: feature specs, design choices, architecture
→ Maintained by: decision-documenter agent
→ Last Updated: 2025-11-17

AI_PROGRESS_TRACKER.md (8.9 KB)
→ Progress tracking: completion %, blockers, next priorities
→ Maintained by: progress-tracker agent
→ Last Updated: 2025-11-17

═══════════════════════════════════════════════════════════════════════════════

📐 Specifications (specs-driven/) - 21 modules
═══════════════════════════════════════════════════════════════════════════════

Module Structure (each has QUESTIONS.md + SPEC.md + examples/):

✅ Completed (4 modules):
1. 01-META-ORCHESTRATION/ (25.3 KB)
   → Adaptive meta-orchestrator, workflow coordination

2. 02-SKILLS-SYSTEM/ (18.7 KB)
   → 9 universal skills (analyzers, builders, routers)

3. 03-ANTI-HALLUCINATION/ (42.1 KB)
   → Validation patterns, confidence scoring

4. 04-AGENTS/ (14.2 KB)
   → 3 documentation agents (bug, decision, progress)

🔄 Partial (2 modules):
5. 06-COMMANDS/ (8.3 KB)
   → Slash commands system (10 commands created)

6. 21-KNOWLEDGE-CONSOLIDATION/ (6.5 KB)
   → Cross-project learning patterns

⏳ Pending (15 modules):
7. 08-CONTEXT-MANAGEMENT/ (12.1 KB)
   → Token optimization, relevance filtering

8. 11-PARALLELIZATION/ (9.8 KB)
   → Parallel tool execution patterns

[... continue for all 21 modules ...]

═══════════════════════════════════════════════════════════════════════════════

📚 Other Documentation - Files in subdirectories
═══════════════════════════════════════════════════════════════════════════════

docs/
├─ architecture.md (7.2 KB) - System architecture overview
├─ deployment.md (4.8 KB) - Deployment guides
└─ api-reference.md (15.3 KB) - API documentation

guides/
├─ getting-started.md (3.5 KB) - Quick start guide
└─ best-practices.md (6.1 KB) - Development best practices

═══════════════════════════════════════════════════════════════════════════════

📊 STATISTICS

Total Files: 52
Total Size: 287.4 KB
Categories:
• Root Documentation: 4 files (29.1 KB)
• AI Knowledge: 3 files (37.0 KB)
• Specifications: 21 modules (185.2 KB)
• Other Documentation: 24 files (36.1 KB)

═══════════════════════════════════════════════════════════════════════════════

💡 TIP: Use filters to narrow down results

/project-docs AI_           → Show only AI knowledge files
/project-docs specs         → Show only specification files
/project-docs ANTI          → Find anti-hallucination docs
/project-docs 08            → Find module 08 (CONTEXT-MANAGEMENT)

═══════════════════════════════════════════════════════════════════════════════
```

---

## Implementation

Execute these steps:

1. **Scan project directory (excluding .claude/)**:
```typescript
// Root docs
const rootDocs = await Glob({ pattern: '*.md' });

// AI Knowledge files
const aiKnowledge = await Glob({ pattern: 'AI_*.md' });

// Specifications
const specs = await Glob({ pattern: 'specs-driven/**/*.md' });

// Other docs (subdirectories, excluding .claude/)
const otherDocs = await Glob({ pattern: '{docs,guides}/**/*.md' });

// Exclude .claude/ directory
const allFiles = [...rootDocs, ...aiKnowledge, ...specs, ...otherDocs]
  .filter(f => !f.startsWith('.claude/'));
```

2. **Read file metadata**:
```typescript
for (const file of allFiles) {
  const content = await Read({ file_path: file, limit: 20 });

  // Extract description from frontmatter or first paragraph
  const description = extractDescription(content);

  // Get file size
  const stats = await getFileStats(file);

  files.push({
    path: file,
    size: stats.size,
    modified: stats.mtime,
    description
  });
}
```

3. **Categorize**:
```typescript
const categorized = {
  root: files.filter(f => f.path.match(/^[^\/]+\.md$/)),
  aiKnowledge: files.filter(f => f.path.startsWith('AI_')),
  specs: files.filter(f => f.path.startsWith('specs-driven/')),
  other: files.filter(f => !['root', 'aiKnowledge', 'specs'].some(cat =>
    categorized[cat]?.includes(f)
  ))
};
```

4. **Format by category**:
```typescript
// Root Documentation
console.log('📋 Root Documentation');
for (const file of categorized.root) {
  console.log(`${file.path} (${formatSize(file.size)})`);
  console.log(`→ ${file.description}`);
}

// AI Knowledge Base
console.log('\n🧠 AI Knowledge Base');
for (const file of categorized.aiKnowledge) {
  console.log(`${file.path} (${formatSize(file.size)})`);
  console.log(`→ ${file.description}`);

  // Extract maintainer from content
  const maintainer = extractMaintainer(file);
  if (maintainer) {
    console.log(`→ Maintained by: ${maintainer}`);
  }
}

// Specifications
console.log('\n📐 Specifications (specs-driven/)');
const modules = groupByModule(categorized.specs);

for (const [module, files] of Object.entries(modules)) {
  const status = detectModuleStatus(module);
  console.log(`${status} ${module}/ (${totalSize(files)})`);

  // Extract module description
  const specFile = files.find(f => f.path.endsWith('SPEC.md'));
  if (specFile) {
    console.log(`   → ${specFile.description}`);
  }
}
```

5. **Apply filter**:
```typescript
if (filter) {
  allFiles = allFiles.filter(f =>
    f.path.toLowerCase().includes(filter.toLowerCase()) ||
    f.description.toLowerCase().includes(filter.toLowerCase())
  );
}
```

---

## Use Cases

### Browse All Project Docs
```
/project-docs
→ See all documentation in project (excluding .claude/)
```

### Find AI Knowledge Files
```
/project-docs AI_
→ Shows: AI_BUGS_KNOWLEDGE.md, AI_PRODUCT_DECISIONS.md, AI_PROGRESS_TRACKER.md
```

### Find Specific Module
```
/project-docs 08-CONTEXT
→ Shows: specs-driven/08-CONTEXT-MANAGEMENT/SPEC.md, QUESTIONS.md, examples/
```

### Search by Keyword
```
/project-docs anti-hallucination
→ Shows all files mentioning anti-hallucination
```

---

## AI Knowledge Files (Special Attention)

### AI_BUGS_KNOWLEDGE.md
- **Purpose**: Bug database with symptoms, root causes, solutions, prevention patterns
- **Maintained by**: `bug-documenter` agent
- **When to use**: Before fixing bugs (search for similar issues), after fixing bugs (document solution)

### AI_PRODUCT_DECISIONS.md
- **Purpose**: Product decisions, feature specs, design choices, architecture
- **Maintained by**: `decision-documenter` agent
- **When to use**: During feature planning, when making architectural decisions

### AI_PROGRESS_TRACKER.md
- **Purpose**: Progress tracking, completion percentages, blockers, next priorities
- **Maintained by**: `progress-tracker` agent
- **When to use**: Sprint planning, status updates, identifying blockers

---

## Specifications (specs-driven/)

**21 Strategic Modules** for making Claude Code the best programmer:

1. **00-FOUNDATION** - Claude Code capabilities (reference)
2. **01-META-ORCHESTRATION** - ✅ Complete
3. **02-SKILLS-SYSTEM** - ✅ Complete
4. **03-ANTI-HALLUCINATION** - ✅ Complete
5. **04-AGENTS** - ✅ Complete
6. **05-MCP-SERVERS** - ⏸️ Paused
7. **06-COMMANDS** - 🔄 Partial
8. **08-CONTEXT-MANAGEMENT** - ⏳ Pending (NEXT)
9. **11-PARALLELIZATION** - ⏳ Pending
10. **12-PERFORMANCE** - ⏳ Pending
... (21 total)

See `IMPLEMENTATION_STATUS.md` for full status.

---

## Related Commands

- `/claude-docs` - Browse `.claude/` internal documentation
- `/docs [topic]` - Browse specific documentation topic
- `/tools` - Show all available tools
- `/skills` - List all skills
- `/agents` - List all agents

---

**Version**: 1.0.0
**Related**: `/claude-docs`, `/docs`, `/tools`
**Output**: Categorized listing of all project documentation (excluding `.claude/`)
**Filter**: Optional keyword filter
**Scope**: Root docs, AI Knowledge, Specifications, Other docs
