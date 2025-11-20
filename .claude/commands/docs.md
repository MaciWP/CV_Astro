---
description: Browse and load available documentation from .claude/docs/
---

# Documentation Browser

Browse and load available documentation in `.claude/docs/` directory.

## Usage

```
/docs [topic]
```

### Without Arguments

Shows available documentation topics:

```
/docs
```

**Output**:
```
📚 Available Documentation

## Anti-Hallucination
Validation patterns, confidence scoring, real examples
Files: README.md, file-validation.md, function-validation.md, confidence-scoring.md, examples.md
Load: /load-anti-hallucination

## Specs-Driven Modules
21 strategic modules for enhanced workflows
Directory: specs-driven/
Topics: META-ORCHESTRATION, ANTI-HALLUCINATION, SKILLS-SYSTEM, AGENTS, etc.

---

Load specific topic:
- /docs anti-hallucination
- /docs [topic-name]

Load all anti-hallucination:
- /load-anti-hallucination
```

### With Topic Argument

Loads specific documentation:

```
/docs anti-hallucination
```

**Executes**:
1. Read `.claude/docs/anti-hallucination/README.md`
2. List available files in that directory
3. Offer to load detailed docs

**Output**:
```
📚 Anti-Hallucination Documentation

## Overview (README.md)
- Target: Reduce hallucination rate from 4.5% → <1%
- Core rules: File validation, Function validation, Ambiguity checks
- Commands: /load-anti-hallucination, /validate-claim

## Available Detailed Docs
1. file-validation.md - 3-stage validation patterns
2. function-validation.md - Grep patterns, multi-language support
3. confidence-scoring.md - Domain-adaptive thresholds
4. examples.md - 8 real cases with before/after

Load all? /load-anti-hallucination
```

## Available Topics

### 1. anti-hallucination
**Path**: `.claude/docs/anti-hallucination/`
**Files**:
- README.md - Overview and quick reference
- file-validation.md - File path validation patterns
- function-validation.md - Function existence validation
- confidence-scoring.md - Confidence calculation rules
- examples.md - Real hallucination cases prevented

**Load command**: `/load-anti-hallucination`

### 2. specs-driven (Future)
**Path**: `specs-driven/`
**Modules**: 21 strategic modules
**Topics**: META-ORCHESTRATION, SKILLS-SYSTEM, AGENTS, etc.

*Note: Can be extended with /load-specs-driven command*

### 3. patterns (Future)
**Path**: `.claude/docs/patterns/` (to be created)
**Topics**:
- error-handling.md
- testing.md
- security.md
- performance.md

## Directory Structure

```
.claude/docs/
├── anti-hallucination/
│   ├── README.md
│   ├── file-validation.md
│   ├── function-validation.md
│   ├── confidence-scoring.md
│   └── examples.md
│
└── [future topics]/
```

## Workflow Examples

### Example 1: Discover Available Docs

```
User: "/docs"

Output:
📚 Available Documentation Topics:
1. anti-hallucination - Validation patterns and confidence scoring
2. [Other topics as they're added]

Use: /docs [topic] to browse
Use: /load-[topic] to load all
```

### Example 2: Browse Specific Topic

```
User: "/docs anti-hallucination"

Output:
📚 Anti-Hallucination Documentation

[Shows README content]

Load full documentation:
/load-anti-hallucination
```

### Example 3: Quick Load

```
User: "/load-anti-hallucination"

[Executes load command directly - faster than browsing]
```

## Future Extensions

This command can be extended to support:

```
/docs patterns             # Load code patterns
/docs security             # Load security guidelines
/docs testing              # Load testing strategies
/docs performance          # Load performance patterns
```

## Integration

**From skills:**
```markdown
For available documentation, user can run: /docs
For anti-hallucination: /load-anti-hallucination
```

**From user:**
```
/docs                      # Browse all
/docs anti-hallucination   # Browse specific
/load-anti-hallucination   # Load directly
```

---

**Version**: 1.0.0
**Current Topics**: anti-hallucination
**Future Topics**: patterns, security, testing, performance
**Related**: `/load-anti-hallucination`, `/validate-claim`
