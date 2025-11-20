---
description: List all available skills with usage examples
---

# Available Skills

List all available skills in `.claude/skills/` with descriptions and activation examples.

## Usage

```
/skills [filter]
```

### Examples

```
/skills                  # All skills
/skills orchestrator     # Skills matching "orchestrator"
/skills analysis         # Skills for analysis tasks
```

---

## Output Format

```
🎯 AVAILABLE SKILLS (9 total)

═══════════════════════════════════════════════════════════════════════════════

⭐ CRITICAL (Always Use)
═══════════════════════════════════════════════════════════════════════════════

adaptive-meta-orchestrator
📍 Location: .claude/skills/adaptive-meta-orchestrator/SKILL.md
📝 Description: Master orchestrator that coordinates ALL workflows
🎯 When to use: ALWAYS - First action on every user message
⚡ Activation: Skill(adaptive-meta-orchestrator)
🔗 See: CLAUDE.md line 21 for mandatory activation rule

═══════════════════════════════════════════════════════════════════════════════

📋 Task Management
═══════════════════════════════════════════════════════════════════════════════

task-decomposer
📍 Location: .claude/skills/task-decomposer/SKILL.md
📝 Description: Break complex tasks into manageable subtasks
🎯 When to use: Complex multi-step tasks
⚡ Activation: Skill(task-decomposer)

task-router
📍 Location: .claude/skills/task-router/SKILL.md
📝 Description: Route tasks to optimal agents based on keywords
🎯 When to use: When multiple agents could handle a task
⚡ Activation: Skill(task-router)

═══════════════════════════════════════════════════════════════════════════════

🔍 Analysis & Quality
═══════════════════════════════════════════════════════════════════════════════

code-analyzer
📍 Location: .claude/skills/code-analyzer/SKILL.md
📝 Description: Analyze code quality, complexity, and patterns
🎯 When to use: Code reviews, refactoring decisions
⚡ Activation: Skill(code-analyzer)

security-auditor
📍 Location: .claude/skills/security-auditor/SKILL.md
📝 Description: Detect security vulnerabilities (XSS, SQL injection, etc.)
🎯 When to use: Security reviews, production deployments
⚡ Activation: Skill(security-auditor)

═══════════════════════════════════════════════════════════════════════════════

🏗️ Builders
═══════════════════════════════════════════════════════════════════════════════

skill-builder
📍 Location: .claude/skills/skill-builder/SKILL.md
📝 Description: Create new skills based on patterns
🎯 When to use: Need a new specialized skill
⚡ Activation: Skill(skill-builder)

utils-builder
📍 Location: .claude/skills/utils-builder/SKILL.md
📝 Description: Generate utility functions
🎯 When to use: Need reusable helper functions
⚡ Activation: Skill(utils-builder)

spec-architect-agent
📍 Location: .claude/skills/spec-architect-agent/SKILL.md
📝 Description: Spec-driven development and architecture
🎯 When to use: Designing new features, writing specs
⚡ Activation: Skill(spec-architect-agent)

═══════════════════════════════════════════════════════════════════════════════

📊 Monitoring
═══════════════════════════════════════════════════════════════════════════════

orchestrator-observability
📍 Location: .claude/skills/orchestrator-observability/SKILL.md
📝 Description: Monitor performance metrics and bottlenecks
🎯 When to use: Performance analysis, optimization tracking
⚡ Activation: Skill(orchestrator-observability)

═══════════════════════════════════════════════════════════════════════════════

💡 HOW TO USE SKILLS

1. Activation Syntax:
   Skill(skill-name)

2. Example:
   Skill(code-analyzer)

3. From Skills/Agents:
   await Skill({ skill: 'task-decomposer' })

4. Multiple Skills (parallel):
   Skill(code-analyzer)
   Skill(security-auditor)

═══════════════════════════════════════════════════════════════════════════════

📚 MORE INFORMATION

• All skills: .claude/skills/
• Orchestrator docs: specs-driven/01-META-ORCHESTRATION/
• Create new skill: Skill(skill-builder)

═══════════════════════════════════════════════════════════════════════════════
```

---

## Dynamic Discovery

Read from `.claude/skills/` directory:

```typescript
// Find all skills
const skillFiles = await Glob({ pattern: '.claude/skills/**/SKILL.md' });

// Parse each skill
for (const file of skillFiles) {
  const content = await Read({ file_path: file });

  // Extract:
  // - name (from frontmatter or directory name)
  // - description (from frontmatter)
  // - activation pattern

  // Display formatted
}
```

---

## Filters

When filter provided, show only matching skills:

```
/skills orchestrator
→ Shows: adaptive-meta-orchestrator, orchestrator-observability

/skills builder
→ Shows: skill-builder, utils-builder

/skills analysis
→ Shows: code-analyzer
```

---

**Version**: 1.0.0
**Related**: `/tools`, `/agents`, `/commands`
**Source**: `.claude/skills/` directory
