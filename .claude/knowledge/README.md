# Central Knowledge Repository

**Purpose**: Consolidate learnings from multiple Claude Code projects (work, personal, etc.) with bidirectional sync.

**Target**: Zero knowledge loss across projects, >30% skill sharing, >50% pattern reuse.

---

## Repository Structure

```
.claude/knowledge/
├── skills/                  # Reusable skills organized by category
│   ├── generic/             # Universal skills (any stack)
│   │   ├── adaptive-meta-orchestrator/
│   │   ├── skill-builder/
│   │   └── task-decomposer/
│   ├── react/               # React-specific skills
│   ├── vue/                 # Vue-specific skills
│   ├── python/              # Python-specific skills
│   ├── go/                  # Go-specific skills
│   └── rust/                # Rust-specific skills
├── patterns/                # Best practices and patterns
│   ├── performance/         # Performance optimization patterns
│   ├── security/            # Security patterns (OWASP, secrets, etc.)
│   ├── testing/             # Testing strategies and patterns
│   └── architecture/        # Architectural patterns
├── anti-patterns/           # Common mistakes to avoid
│   ├── react/               # React-specific anti-patterns
│   ├── python/              # Python-specific anti-patterns
│   └── common/              # Universal anti-patterns
└── metadata/                # Provenance and quality tracking
    ├── provenance.json      # Which project learned what, when
    └── quality-scores.json  # Quality metrics (0-10) for each item
```

---

## Workflows

### Push (Local → Central)

**Purpose**: Export learnings from current project to central repository

**What gets pushed**:
- New skills from `.claude/skills/`
- Patterns from `AI_PRODUCT_DECISIONS.md`
- Anti-patterns from `AI_BUGS_KNOWLEDGE.md`
- Optimizations from project history

**Metadata updated**:
- Provenance: Source project, creation date, contributors
- Quality scores: Usage count, success rate, time saved, rating

**Command**:
```
/knowledge-sync push
```

**Result**: All new knowledge exported to central with full provenance tracking

---

### Pull (Central → Local)

**Purpose**: Import relevant knowledge from central to current project

**What gets pulled**:
- Generic skills (ALWAYS relevant)
- Stack-specific skills (filtered by detected stack)
- Universal patterns (performance, security, testing)
- Stack-specific patterns

**Selection**:
- User sees all relevant items with quality scores
- User selects which items to import
- Conflicts detected and resolved

**Command**:
```
/knowledge-sync pull
```

**Result**: Selected knowledge imported, immediately usable

---

### Status

**Purpose**: Show sync status (what's new, what can be pulled)

**Shows**:
- Items available to push (new learnings in current project)
- Items available to pull (relevant knowledge from central)
- Last sync timestamp
- Summary statistics (total skills, patterns, anti-patterns)

**Command**:
```
/knowledge-sync status
```

---

## Provenance Tracking

**Every knowledge item tracks**:
- **Source**: Project path that discovered this item
- **Created**: ISO timestamp when item was created
- **Contributors**: All projects that used/improved this item
- **Usage History**: Results, ratings, improvements from each project
- **Last Updated**: ISO timestamp of most recent change

**Example** (`provenance.json`):
```json
{
  "react-table-optimizer": {
    "source": "D:/Work/ProjectA",
    "created": "2025-10-15T10:30:00Z",
    "contributors": [
      "D:/Work/ProjectA",
      "D:/Personal/APIProject",
      "D:/Personal/ChartProject"
    ],
    "usageHistory": [
      {
        "project": "Work ProjectA",
        "date": "2025-10-15",
        "result": "5s → 250ms (20x improvement)",
        "rating": 10
      },
      {
        "project": "Personal APIProject",
        "date": "2025-11-01",
        "result": "3s → 180ms (16x improvement)",
        "rating": 9
      }
    ],
    "lastUpdated": "2025-11-16T14:22:00Z"
  }
}
```

**Value**: Know which project discovered what, track cross-project impact, quantify value.

---

## Quality Scoring

**Multi-factor score (0-10)**:
- **Success rate** (40%): % of successful applications
- **Usage count** (30%): How many times used (capped at 10)
- **User rating** (20%): Manual rating 1-10
- **Time saved** (10%): Average minutes saved (capped at 50)

**Formula**:
```typescript
score = (successRate / 10) * 0.4 +
        Math.min(usageCount, 10) * 0.3 +
        rating * 0.2 +
        Math.min(timesSaved / 5, 10) * 0.1
```

**Example** (`quality-scores.json`):
```json
{
  "react-table-optimizer": {
    "usageCount": 5,
    "successRate": 100,
    "timesSaved": 45,
    "projects": ["ProjectA", "Personal1", "Personal2"],
    "rating": 9.2,
    "score": 9.14
  }
}
```

**Value**: Prioritize high-quality patterns, filter out low-value items, measure impact.

---

## Conflict Resolution

**When local and central versions differ**:

**Options**:
1. **Keep local**: Preserve customizations (lose central improvements)
2. **Use central**: Get latest improvements (lose customizations)
3. **Merge both**: Combine (manual review recommended)
4. **Create variant**: Keep both as separate items (e.g., `skill-name` + `skill-name-custom`)

**Philosophy**: Never lose data, always ask user, provide clear options.

---

## Cross-Project Benefits

**Example 1: Work → Personal**
```
Work Project (React):
  Discovers: Data decimation pattern (95% render time reduction)

Personal Project (Python):
  Pulls: Same pattern! (works for Matplotlib too)
  Result: 8s → 420ms (19x improvement)
```

**Example 2: Universal Patterns**
```
Security pattern discovered in Python project:
  - SQL injection prevention with parameterized queries

Benefits ALL projects:
  - React project (API calls)
  - Go project (database layer)
  - Any project with database access
```

**Value**: Knowledge discovered in one stack often applies to others. Cross-pollination multiplies impact.

---

## Success Metrics

**Consolidation**:
- Skills in central: Track growth over time
- Skills shared: >30% (goal)
- Patterns reused: >50% (goal)
- Time saved: >100 hours/year (goal)

**Quality**:
- Average score: >8.0/10 (goal)
- Success rate: >90% (goal)
- Zero knowledge loss: 100% (mandatory)

**Cross-Project Impact**:
- Projects using shared knowledge: 100% (goal)
- Knowledge contribution rate: >1 item/week (goal)
- Cross-pollination rate: >20% (patterns from one stack used in another)

---

## Usage

**Initial Setup**:
```bash
# Repository already created at D:\PYTHON\Poneglyph\.claude\knowledge/
# Metadata files initialized (provenance.json, quality-scores.json)
```

**Push learnings from current project**:
```
/knowledge-sync push
```

**Pull relevant knowledge to current project**:
```
/knowledge-sync pull
```

**Check sync status**:
```
/knowledge-sync status
```

---

**Version**: 1.0.0
**Created**: 2025-11-18
**Purpose**: Zero knowledge loss across multiple Claude Code projects
**Coordination**: Works with `knowledge-consolidator` skill and `/knowledge-sync` command
