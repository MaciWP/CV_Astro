# /load-project - Load Project-Specific Context

**Purpose**: Load comprehensive knowledge, rules, and patterns for a specific project from `.claude/projects/`.

**When to use**: When starting work on a project-specific task (binora-backend, etc.) or when you need deep context about a project's architecture, rules, and patterns.

---

## Usage

```bash
/load-project <project-name>
```

**Examples**:
```bash
/load-project binora          # Load binora-backend context
/load-project myproject       # Load myproject context
```

---

## What Gets Loaded

For project `binora`, loads from `.claude/projects/binora/`:

1. **README.md** - Project overview and guide
2. **CLAUDE.md** - Original project-specific CLAUDE.md
3. **core/*.md** - All core documentation files:
   - `architecture.md` - Architecture patterns
   - `forbidden.md` - Critical violations to avoid
   - `testing.md` - Testing requirements
   - `code-style.md` - Code style guide
   - `pr-review-checklist.md` - PR review standards
   - `workflows.md` - Common workflows
4. **knowledge/*.md** - Generated knowledge and analysis (optional, summary only)

---

## Output Format

Generates a comprehensive but token-efficient summary:

```markdown
# 📋 PROJECT CONTEXT LOADED: {project-name}

## Overview
[Summary from README.md]

## Critical Rules
[Key rules from forbidden.md]

## Architecture
[Architecture summary from architecture.md]

## Testing Requirements
[Testing standards from testing.md]

## Code Style
[Style guide from code-style.md]

## Available Project-Specific Tools
**Skills**: [List of {project}-* skills]
**Agents**: [List of {project}-* agents]
**Commands**: [List of {project}-* commands]

## Quick Reference
- Full docs: .claude/projects/{project}/
- Core rules: .claude/projects/{project}/core/
- Knowledge base: .claude/projects/{project}/knowledge/
```

---

## Implementation

This command executes the following workflow:

1. **Validate project exists**: Check if `.claude/projects/{project-name}/` exists
2. **Read README.md**: Load project overview
3. **Load CLAUDE.md**: If exists, load project-specific instructions
4. **Scan core/**: Read all `.md` files in core/ directory
5. **Extract key info**: Parse and summarize:
   - Critical rules (from forbidden.md)
   - Architecture patterns (from architecture.md)
   - Testing requirements (from testing.md)
   - Code style (from code-style.md)
6. **List available tools**: Find all skills/agents/commands with `{project}-` prefix
7. **Generate summary**: Create token-efficient executive summary
8. **Load into context**: Present to Claude for the session

---

## Token Optimization

**Approach**: Load full content but present summarized view
- Full files: Available via Read tool if details needed
- Summary: Key points only (80% token reduction)
- On-demand: "For full details, use: Read .claude/projects/binora/core/architecture.md"

**Estimated token usage**:
- Summary: ~1,500 tokens
- Full load: ~8,000 tokens (if all files read)

---

## Auto-Loading

**Skills can auto-trigger this command** via YAML frontmatter:

```yaml
---
name: binora-multi-tenant-guardian
activation:
  keywords: [binora, multi-tenant]
  auto_load_project: binora  # ← Auto-triggers /load-project binora
---
```

---

## Error Handling

**Project not found**:
```
❌ Project 'xyz' not found.
   Available projects: binora
   Location: .claude/projects/
```

**Missing files** (graceful degradation):
```
⚠️ Project 'binora' loaded with warnings:
   ✅ README.md
   ✅ core/architecture.md
   ❌ core/workflows.md (not found, skipped)
```

---

## Examples

### Example 1: Load Binora Context

```bash
User: /load-project binora

Claude:
# 📋 PROJECT CONTEXT LOADED: binora

## Overview
Binora Backend - Multi-tenant Django 5.0 + DRF 3.14 application.
Critical: Transparent tenant isolation via middleware.

## Critical Rules (FORBIDDEN)
❌ NEVER manually filter by tenant_id or company_id
   → Middleware handles all tenant filtering automatically
❌ NEVER put business logic in Views/Serializers
   → ALL business logic goes in Services
❌ NEVER use Mock() directly
   → Always use mocker.Mock()

## Architecture
**Pattern**: Views → Services → Models
- Views: HTTP only (no business logic)
- Services: ALL business logic, dependency injection
- Models: Data structure only

**Multi-Tenant**:
- Main Service (TENANT=None): Sees all data
- Tenant Services (TENANT=subdomain): Sees only tenant data
- Same codebase, different environment variable

## Testing Requirements
- 100% coverage per file (MANDATORY)
- AAA pattern (Arrange, Act, Assert)
- Naming: test_<action>_<context>_<expected>
- mocker.Mock() only (never Mock() directly)

## Code Style
- Type hints REQUIRED on all functions
- YOLO comments: Only non-obvious code
- English only in comments
- Query optimization: select_related, prefetch_related, order_by

## Available Project-Specific Tools
**Skills**: binora-multi-tenant-guardian, binora-prompt-engineer, binora-meta-orchestrator
**Agents**: binora-multi-tenant-enforcer, binora-deployment-checker, binora-pre-commit-guardian
**Commands**: binora-check-tenant, binora-setup-tenant

## Quick Reference
Full docs: .claude/projects/binora/
For details: Read .claude/projects/binora/core/forbidden.md

✅ Context loaded. Ready to work on binora-backend with full knowledge.
```

### Example 2: Work on Multi-Tenant Feature

```bash
User: Implement asset filtering with tenant isolation

Claude: [Auto-detects "tenant" keyword]
[Automatically loads: /load-project binora]

I'll implement asset filtering following binora's multi-tenant architecture:

1. ✅ No manual tenant_id filtering (middleware handles it)
2. ✅ Business logic in AssetService
3. ✅ ViewSet delegates to service
4. ✅ 100% test coverage with AAA pattern

Let me start...
```

---

## Success Criteria

After running `/load-project binora`:
- ✅ I know all critical rules (forbidden patterns)
- ✅ I understand the architecture (3-layer, multi-tenant)
- ✅ I know testing requirements (100% coverage, AAA)
- ✅ I know code style (type hints, YOLO comments)
- ✅ I can reference full docs on-demand
- ✅ I'm ready to work with project-specific context

---

**Target**: <2 seconds to load, <1,500 tokens summary, 100% accuracy
**Version**: 1.0.0
**Last Updated**: 2024-11-18