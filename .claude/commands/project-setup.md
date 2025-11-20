# /project-setup - Automatic Claude Code Setup for New Projects

Automate Claude Code configuration for any project with stack detection, skill generation, and CLAUDE.md creation.

**Target**: Complete setup in <5 minutes

---

## What This Does

1. **Detects project stack** (React, Python, Go, Vue, etc.)
2. **Generates project-specific skills** from templates
3. **Imports generic skills** from central repository
4. **Creates adapted CLAUDE.md** with stack best practices
5. **Validates setup** and generates report

---

## Usage

```
/project-setup [options]
```

**Options**:
- No args: Interactive setup (recommended)
- `--stack <stack>`: Manual stack specification
- `--quick`: Essential skills only (fast setup)
- `--full`: Import all relevant skills
- `--dry-run`: Preview without making changes

---

## Examples

**Interactive setup** (recommended):
```
/project-setup
```
→ Detects stack, asks confirmation, imports skills, creates CLAUDE.md

**Quick setup for React**:
```
/project-setup --stack react --quick
```
→ React essentials only (<2 min)

**Full Python setup**:
```
/project-setup --stack python --full
```
→ All Python skills + patterns

**Preview mode**:
```
/project-setup --dry-run
```
→ Shows what would be created without writing files

---

## What Gets Created

**.claude/** structure:
```
.claude/
├── skills/
│   ├── adaptive-meta-orchestrator/  (Generic - REQUIRED)
│   ├── skill-builder/                (Generic)
│   ├── task-decomposer/              (Generic)
│   ├── code-analyzer/                (Generic)
│   ├── security-auditor/             (Generic)
│   └── [stack-specific skills]/       (React, Python, etc.)
├── commands/
│   ├── quick-component.md            (React)
│   ├── quick-endpoint.md             (Python)
│   └── [stack commands]/
└── agents/
    └── [project agents]/
```

**CLAUDE.md**:
- META-ORCHESTRATOR section (mandatory)
- Project context (stack, phase)
- Available skills list
- Slash commands
- Stack-specific best practices
- Performance targets

---

## Stack Detection

**Automatic detection** from:
- `package.json` → React, Vue, Node.js
- `requirements.txt` / `pyproject.toml` → Python
- `go.mod` → Go
- `Cargo.toml` → Rust
- `pom.xml` / `build.gradle` → Java

**Confidence scoring**:
- 95%+ → Auto-proceed
- <95% → Ask user confirmation

---

## Anti-Hallucination & Questions

**When setup asks**:
| Situation | Question |
|-----------|----------|
| Stack uncertain (<95% confidence) | "Is this stack correct?" |
| Existing .claude/ found | "Merge, backup, or skip?" |
| Monorepo detected | "Which packages to configure?" |
| Skill selection | "Import all or select specific?" |
| CLAUDE.md review | "Review before writing?" |

**Philosophy**: Questions prevent misconfigurations. When in doubt, ASK.

---

## Success Criteria

**Speed**:
- Stack detection: <1s
- Skill generation: <3 min
- CLAUDE.md creation: <5s
- Total: <5 min

**Quality**:
- Stack detection accuracy: >95%
- All skills working: 100%
- CLAUDE.md valid: Pass validation
- First task completion: <5 min after setup

---

## Implementation

Executes skill: `project-setup-wizard`

See: `.claude/skills/project-setup-wizard/SKILL.md`
