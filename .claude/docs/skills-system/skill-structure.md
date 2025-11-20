# Skill Structure

This document defines the standard structure for all skills in the system.

## File Structure

```
.claude/skills/
└── [skill-name]/
    ├── SKILL.md          # Main skill file (required)
    └── resources/        # Optional resources (examples, templates)
        ├── examples/
        └── templates/
```

## SKILL.md Template

```markdown
---
name: skill-name
description: Brief description (1-2 sentences) with activation keywords. Use specific terms users would search for. Keywords - keyword1, keyword2, keyword3, keyword4, keyword5
---

# Skill Title

## When to Use This Skill

Activate when:
- Specific use case 1
- Specific use case 2
- Specific use case 3
- Specific use case 4

## What This Skill Does

[2-3 sentences describing what the skill provides]

Creates/Implements/Generates [output] with:
- Feature 1
- Feature 2
- Feature 3
- Feature 4

## Supported Technologies

**Category 1**:
- Technology A (version/note)
- Technology B (recommended)
- Technology C

**Category 2**:
- Technology D
- Technology E

## Example: [Primary Framework]

\`\`\`[language]
// Component/Module/Class name
// Brief description

[Complete, working code example]
// 30-50 lines of production-ready code
// Include comments explaining key concepts
// Show best practices inline
\`\`\`

\`\`\`[language]
// Usage example
[Show how to use the above code]
\`\`\`

## Example: [Secondary Framework]

\`\`\`[language]
[Alternative implementation for different framework]
\`\`\`

## Example: [Advanced Pattern]

\`\`\`[language]
[More complex example showing advanced usage]
\`\`\`

## Best Practices

1. **Practice 1** - Detailed explanation
2. **Practice 2** - Detailed explanation
3. **Practice 3** - Detailed explanation
4. **Practice 4** - Detailed explanation

## Common Pitfalls

\`\`\`[language]
// ❌ BAD: Anti-pattern explanation
[Bad code example]

// ✅ GOOD: Correct pattern explanation
[Good code example]
\`\`\`

## Integration with Other Skills

- **skill-name-1** - How they work together
- **skill-name-2** - How they work together
- **skill-name-3** - How they work together

---

**Version**: 1.0.0
**Category**: [Backend|Frontend|Testing|DevOps|System]
**Complexity**: [Low|Medium|High]
\`\`\`

## Section Details

### 1. Frontmatter (Required)

```yaml
---
name: skill-name
description: One-sentence description. Keywords - kw1, kw2, kw3
---
```

**Fields**:
- **name**: kebab-case identifier (matches directory name)
- **description**: 1-2 sentences + keywords list
  - First part: What the skill does
  - Keywords: 8-12 terms for activation

**Keyword Selection**:
```yaml
# ✅ GOOD: Specific, searchable terms
description: Build accessible modal dialogs with focus management. Keywords - modal, dialog, popup, overlay, accessible modal, focus trap

# ❌ BAD: Vague, generic terms
description: UI components. Keywords - component, ui, interface
```

### 2. When to Use This Skill (Required)

```markdown
## When to Use This Skill

Activate when:
- Creating [specific feature]
- Need [specific capability]
- Building [specific component]
- Implementing [specific pattern]
```

**Guidelines**:
- Use "Activate when:" prefix
- Be specific (not "building a form" but "building a login form with validation")
- List 4-6 concrete use cases
- Use action verbs (Creating, Building, Implementing, Need)

### 3. What This Skill Does (Required)

```markdown
## What This Skill Does

[1-2 sentences overview]

Creates/Generates/Implements [output] with:
- Key feature 1
- Key feature 2
- Key feature 3
- Key feature 4
```

**Guidelines**:
- Start with action verb (Creates, Generates, Implements, Builds)
- Bullet list of 4-6 key capabilities
- Be concrete about deliverables

### 4. Supported Technologies (Required)

```markdown
## Supported Technologies

**React**:
- Technology A (recommended)
- Technology B (alternative)

**Vue 3**:
- Technology C
- Technology D

**Python**:
- Technology E
- Technology F
```

**Guidelines**:
- Group by framework/language
- Mark recommended options
- Include version numbers if important
- Order by popularity/recommendation

### 5. Examples (Required: 2-3 minimum)

```markdown
## Example: [Framework/Pattern Name]

\`\`\`[language]
// Filename: component/file.ext
// Description of what this example shows

[30-50 lines of production-ready code]
// Key concept explanation
// Best practice note
\`\`\`

\`\`\`[language]
// Usage example
[5-10 lines showing how to use above code]
\`\`\`
```

**Example Quality Checklist**:
- ✅ Complete (can copy-paste and run)
- ✅ Production-ready (includes error handling, types)
- ✅ Commented (explains non-obvious parts)
- ✅ Best practices (shows recommended approach)
- ✅ Realistic (solves real-world problem)

**Code Size Guidelines**:
- Primary example: 30-50 lines
- Secondary example: 20-40 lines
- Usage example: 5-10 lines
- Total code per skill: 200-400 lines

### 6. Best Practices (Required)

```markdown
## Best Practices

1. **Practice Title** - Explanation (1-2 sentences)
2. **Practice Title** - Explanation
3. **Practice Title** - Explanation
```

**Guidelines**:
- List 4-7 practices
- Bold the title, explain in text
- Include security, performance, accessibility where relevant
- Reference industry standards (OWASP, WCAG, etc.)

### 7. Common Pitfalls (Recommended)

```markdown
## Common Pitfalls

\`\`\`[language]
// ❌ BAD: Why this is wrong
[Anti-pattern code]

// ✅ GOOD: Why this is right
[Correct pattern code]
\`\`\`
```

**Guidelines**:
- Show 2-3 common mistakes
- Always provide both bad and good examples
- Explain *why* it's wrong/right

### 8. Integration with Other Skills (Recommended)

```markdown
## Integration with Other Skills

- **skill-name-1** - How they complement each other
- **skill-name-2** - Typical workflow together
- **skill-name-3** - Common combination
```

**Guidelines**:
- List 3-5 related skills
- Explain the relationship (not just list names)
- Show how they're used together

### 9. Footer (Required)

```markdown
---

**Version**: 1.0.0
**Category**: Backend|Frontend|Testing|DevOps|System
**Complexity**: Low|Medium|High
```

**Complexity Guide**:
- **Low**: Simple patterns, minimal dependencies (config-validator)
- **Medium**: Standard complexity, multiple patterns (api-endpoint-builder)
- **High**: Complex workflows, multiple technologies (cicd-pipeline-builder)

## Content Guidelines

### Length

- **Target**: 3-8KB (300-800 lines)
- **Minimum**: 2KB (must include 2 examples)
- **Maximum**: 10KB (split if larger)

### Tone

- ✅ Direct, technical, prescriptive
- ✅ Production-focused (not tutorial-style)
- ✅ Assume intermediate knowledge
- ❌ No fluff or filler content

### Code Quality

All code examples must:
1. **Compile/run** without errors
2. **Include types** (TypeScript, Python type hints)
3. **Handle errors** appropriately
4. **Follow conventions** of the framework
5. **Be production-ready** (not just demos)

### Language

- Use present tense ("Creates" not "Will create")
- Use active voice ("Run tests" not "Tests should be run")
- Be specific ("Use React Hook Form" not "Use a form library")

## Optional Sections

### Advanced Patterns

```markdown
## Advanced: [Pattern Name]

\`\`\`[language]
[Complex example for power users]
\`\`\`
```

Use for: Complex patterns not needed by all users

### Configuration

```markdown
## Configuration

\`\`\`[language]
// Config file example
\`\`\`
```

Use for: Tools requiring setup files

### Comparison Tables

```markdown
## Pattern Comparison

| Pattern | Use Case | Pros | Cons |
|---------|----------|------|------|
| A | Use case A | ... | ... |
| B | Use case B | ... | ... |
```

Use for: Multiple approaches to same problem

## Versioning

Use semantic versioning:
- **1.0.0**: Initial release
- **1.1.0**: Added examples, no breaking changes
- **2.0.0**: Changed API, breaking changes

## Changelog

Add changelog at bottom for updates:

```markdown
## Changelog

### 1.1.0 (2025-01-20)
- Added Vue 3 example
- Updated React example to use hooks

### 1.0.0 (2025-01-15)
- Initial release
```

## Validation Checklist

Before creating a skill, verify:

- [ ] File in correct location (`.claude/skills/[name]/SKILL.md`)
- [ ] Frontmatter complete (name, description, keywords)
- [ ] "When to Use" section with 4+ use cases
- [ ] "What This Does" section with clear description
- [ ] "Supported Technologies" section with categorized list
- [ ] At least 2 complete code examples
- [ ] "Best Practices" section with 4+ practices
- [ ] "Integration" section with 3+ related skills
- [ ] Footer with version, category, complexity
- [ ] All code examples tested and working
- [ ] Keywords trigger activation correctly
- [ ] Size between 3-8KB

---

**Last Updated**: 2025-01-17
**Version**: 1.0.0
