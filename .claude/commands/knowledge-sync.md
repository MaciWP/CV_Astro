# /knowledge-sync - Consolidate Learnings Across Projects

Unify learnings from multiple Claude Code projects (work, personal, etc.) into central knowledge base with bidirectional sync.

**Target**: Zero knowledge loss across projects

---

## What This Does

**Push** (local → central):
1. Extract new skills from `.claude/skills/`
2. Extract patterns from `AI_PRODUCT_DECISIONS.md`
3. Extract anti-patterns from `AI_BUGS_KNOWLEDGE.md`
4. Export to central repository with provenance

**Pull** (central → local):
1. Detect current project stack
2. Find relevant skills/patterns from central
3. Present options with quality scores
4. Import selected knowledge

---

## Usage

```
/knowledge-sync [push|pull|status]
```

**Commands**:
- `push`: Export learnings to central
- `pull`: Import knowledge from central
- `status`: Show sync status
- No args: Interactive (asks push/pull/both)

---

## Examples

**Push learnings to central**:
```
/knowledge-sync push
```
→ Exports new skills, patterns, anti-patterns

**Pull relevant knowledge**:
```
/knowledge-sync pull
```
→ Imports React skills if React project

**Check sync status**:
```
/knowledge-sync status
```
→ Shows: 3 skills to push, 5 available to pull

**Interactive mode**:
```
/knowledge-sync
```
→ Asks: "Push learnings, pull knowledge, or both?"

---

## Central Repository Structure

```
D:\PYTHON\Poneglyph\.claude\knowledge/
├── skills/
│   ├── generic/
│   │   ├── adaptive-meta-orchestrator/
│   │   ├── skill-builder/
│   │   └── task-decomposer/
│   ├── react/
│   │   ├── react-table-optimizer/
│   │   └── react-hooks-optimizer/
│   ├── python/
│   │   ├── python-api-builder/
│   │   └── python-async-validator/
│   └── vue/
│       └── composable-creator/
├── patterns/
│   ├── performance/
│   │   ├── pattern-virtualization.md
│   │   └── pattern-data-decimation.md
│   ├── security/
│   ├── testing/
│   └── architecture/
├── anti-patterns/
│   ├── react/
│   │   └── antipattern-useeffect-derived.md
│   ├── python/
│   │   └── antipattern-raw-sql.md
│   └── common/
└── metadata/
    ├── provenance.json          (Which project learned what)
    └── quality-scores.json       (Quality metrics 0-10)
```

---

## Provenance Tracking

**Every knowledge item tracks**:
- Source project name
- Creation date
- Author/contributor
- Usage statistics
- Quality score (0-10)

**Example**:
```json
{
  "react-table-optimizer": {
    "source": "Proyecto Trabajo",
    "created": "2025-11-15",
    "contributors": ["ProjectA", "ProjectB"],
    "usageCount": 5,
    "successRate": 100,
    "timesSaved": 45,
    "rating": 9.2,
    "score": 9.14
  }
}
```

---

## Quality Scoring

**Multi-factor score** (0-10):
- **Success rate** (40%): % of successful applications
- **Usage count** (30%): How many times used
- **User rating** (20%): Manual rating 1-10
- **Time saved** (10%): Average minutes saved

**Example**:
```
react-table-optimizer:
  - Usage: 5 times
  - Success: 100% (5/5)
  - Rating: 9.2/10
  - Time saved: 45 min avg
  → Quality Score: 9.14/10
```

---

## Conflict Resolution

**When local & central versions differ**:

Ask user:
- **Keep local**: Preserve customizations (lose central improvements)
- **Use central**: Get latest improvements (lose customizations)
- **Merge both**: Combine (manual review)
- **Create variant**: Keep both as separate skills

**Philosophy**: Never lose data, always ask user

---

## Cross-Project Benefits

**Work project** (React) learns pattern → **Personal project** (Python) benefits:
```
Work Project A discovers:
  - Pattern: Data decimation for charts (95% render time reduction)

Personal Project B pulls:
  - Same pattern! (works for Python + Matplotlib too)
  - Result: 8s → 420ms (19x improvement)
```

**Universal patterns** benefit ALL projects:
- Error handling strategies
- Performance optimization patterns
- Security best practices
- Testing approaches

---

## Success Metrics

**Consolidation**:
- Skills in central: Track growth
- Skills shared: >30%
- Patterns reused: >50%
- Time saved: >100 hours/year

**Quality**:
- Average score: >8.0/10
- Success rate: >90%
- Zero knowledge loss: 100%

---

## Implementation

Executes skill: `knowledge-consolidator`

See: `.claude/skills/knowledge-consolidator/SKILL.md`
