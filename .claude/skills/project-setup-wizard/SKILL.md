---
name: project-setup-wizard
description: |
  This skill should be used when analyzing an existing project to automatically generate
  personalized skills, agents, commands, and documentation based on detected patterns and needs.

  AUTO-ACTIVATES for: project setup, analyze project, setup claude code, personalize claude,
  auto-generate tools, detect project needs, bootstrap project.

  PROVIDES: Deep project analysis (code patterns, architecture, domain detection),
  automatic skill generation (personalized for THIS project's patterns),
  automatic agent generation (for recurring tasks), automatic command generation (for workflows),
  custom CLAUDE.md (with project-specific context and best practices).

  ANALYZES: Code patterns (repetitive endpoints, components, queries), project structure
  (architecture, layers, modules), dependencies (frameworks, libraries), recurring tasks
  (what developers do repeatedly), domain detection (invoicing, e-commerce, analytics, etc.).

  GENERATES: Personalized skills (e.g., "invoice-endpoint-builder" for invoicing project),
  task-specific agents (e.g., "report-query-optimizer"), workflow commands
  (e.g., "/new-invoice-endpoint"), custom documentation (CLAUDE.md with project context).

  TARGET: 80%+ pattern detection accuracy, 5-10 personalized tools generated, <10 min analysis.
---

# Project Setup Wizard - Automatic Personalized Tool Generation

Analyzes existing projects to automatically generate personalized skills, agents, commands, and documentation based on detected patterns and specific needs.

## When to Use This Skill

This skill should be used when:
- Setting up Claude Code for an existing project
- User wants personalized tools for their specific project
- Project has repetitive patterns that could be automated
- User wants to maximize Claude Code's value for their domain
- Onboarding Claude Code to a legacy or complex codebase

### Explicit Activation Contexts

Activate when:
- User runs `/project-setup` command
- User asks "analyze this project and create tools for it"
- User wants "personalized Claude Code setup"
- User says "make Claude Code work better for MY project"

### Proactive Detection Scenarios

Auto-suggest when detecting:
- Project with significant codebase (>100 files)
- Repetitive code patterns (3+ similar files)
- Complex domain logic (invoicing, payments, analytics, etc.)
- User manually doing same task 3+ times

---

## Mission

Analyze **ANY project** (React, Python, Go, etc.) with **80%+ pattern detection accuracy**, automatically generate **5-10 personalized tools** (skills/agents/commands), and create **custom documentation** in **<10 minutes**.

---

## Core Patterns

### Pattern 1: Deep Project Analysis (Multi-Layer Inspection)

Analyze project at multiple levels to understand what it does and how it works.

❌ **WRONG - Superficial analysis**:
```typescript
// Only check package.json
const stack = fs.existsSync('package.json') ? 'React' : 'Unknown';
// Doesn't understand WHAT the project does or HOW it works
```

✅ **CORRECT - Multi-layer analysis**:
```typescript
interface ProjectAnalysis {
  // Layer 1: Tech Stack
  stack: {
    primary: string;           // React, Python, Go, etc.
    frameworks: string[];      // FastAPI, Django, Gin, etc.
    databases: string[];       // PostgreSQL, MongoDB, Redis
    tools: string[];           // Docker, Kubernetes, etc.
  };

  // Layer 2: Architecture
  architecture: {
    type: string;              // MVC, Layered, Microservices, Monolith
    layers: string[];          // API, Business Logic, Data Access
    modules: ModuleInfo[];     // Identified modules/features
  };

  // Layer 3: Domain Detection
  domain: {
    type: string;              // E-commerce, Invoicing, Analytics, CRM, etc.
    confidence: number;        // 0-100
    evidence: string[];        // Files/patterns that indicate domain
  };

  // Layer 4: Code Patterns
  patterns: {
    repetitive: RepetitivePattern[];   // Same code 3+ times
    complex: ComplexPattern[];         // High cyclomatic complexity
    automatable: AutomatableTask[];    // Tasks that could be automated
  };

  // Layer 5: Needs Detection
  needs: {
    skills: SkillNeed[];       // Skills that should be generated
    agents: AgentNeed[];       // Agents that should be generated
    commands: CommandNeed[];   // Commands that should be generated
  };
}

async function analyzeProject(projectPath: string): Promise<ProjectAnalysis> {
  console.log('🔍 Analyzing project (multi-layer)...');

  // Layer 1: Detect tech stack
  const stack = await detectTechStack(projectPath);

  // Layer 2: Analyze architecture
  const architecture = await analyzeArchitecture(projectPath, stack);

  // Layer 3: Detect domain
  const domain = await detectDomain(projectPath, architecture);

  // Layer 4: Find code patterns
  const patterns = await findCodePatterns(projectPath, stack);

  // Layer 5: Detect needs
  const needs = await detectNeeds(patterns, domain, architecture);

  return { stack, architecture, domain, patterns, needs };
}

// Example: Analyze invoicing system
async function detectDomain(projectPath: string, arch: Architecture): Promise<DomainInfo> {
  const evidence: string[] = [];
  let domainType = 'Unknown';
  let confidence = 0;

  // Read file names and content samples
  const files = await Glob('**/*.{ts,py,go,rs,java}', { path: projectPath });

  // Domain indicators
  const domainKeywords = {
    'Invoicing': ['invoice', 'billing', 'payment', 'receipt', 'tax'],
    'E-commerce': ['product', 'cart', 'checkout', 'order', 'inventory'],
    'Analytics': ['metric', 'dashboard', 'report', 'chart', 'visualization'],
    'CRM': ['customer', 'lead', 'contact', 'pipeline', 'opportunity'],
    'Auth': ['user', 'login', 'register', 'token', 'permission']
  };

  // Count keyword occurrences
  const domainScores: Record<string, number> = {};

  for (const file of files) {
    const filename = file.toLowerCase();
    const content = await Read(file);

    for (const [domain, keywords] of Object.entries(domainKeywords)) {
      let score = 0;

      for (const keyword of keywords) {
        if (filename.includes(keyword)) {
          score += 5;  // Filename match = strong signal
          evidence.push(`File: ${file} (contains "${keyword}")`);
        }

        const matches = (content.match(new RegExp(keyword, 'gi')) || []).length;
        score += matches;

        if (matches > 5) {
          evidence.push(`File: ${file} (${matches} occurrences of "${keyword}")`);
        }
      }

      domainScores[domain] = (domainScores[domain] || 0) + score;
    }
  }

  // Determine dominant domain
  const sorted = Object.entries(domainScores).sort((a, b) => b[1] - a[1]);

  if (sorted.length > 0 && sorted[0][1] > 10) {
    domainType = sorted[0][0];
    confidence = Math.min(95, sorted[0][1]);  // Cap at 95%
  }

  return { type: domainType, confidence, evidence: evidence.slice(0, 5) };
}
```

**Auto-Check**:
- [ ] Tech stack detected (not just guessed)?
- [ ] Architecture type identified (MVC, Layered, etc.)?
- [ ] Domain detected with evidence (not assumption)?
- [ ] Code patterns found (repetitive, complex, automatable)?
- [ ] Needs extracted from analysis (not hardcoded)?

---

### Pattern 2: Repetitive Pattern Detection (Find What to Automate)

Detect repetitive code patterns that could be automated with skills/commands.

❌ **WRONG - No pattern detection**:
```typescript
// Generate generic skills without analyzing project
await generateSkill('api-endpoint-builder');  // May not be relevant
```

✅ **CORRECT - Detect actual repetitive patterns**:
```typescript
interface RepetitivePattern {
  type: string;              // 'endpoint', 'component', 'query', 'validation'
  occurrences: number;       // How many times pattern appears
  files: string[];           // Files where pattern appears
  template: string;          // Common structure
  variability: string[];     // What changes between occurrences
  automatable: boolean;      // Can this be automated?
  confidence: number;        // 0-100
}

async function findCodePatterns(projectPath: string, stack: TechStack): Promise<CodePatterns> {
  const patterns: RepetitivePattern[] = [];

  // Example: Detect repetitive API endpoints (Python/FastAPI)
  if (stack.frameworks.includes('FastAPI')) {
    const endpointPattern = await detectRepetitiveEndpoints(projectPath);
    patterns.push(...endpointPattern);
  }

  // Example: Detect repetitive React components
  if (stack.primary === 'React') {
    const componentPattern = await detectRepetitiveComponents(projectPath);
    patterns.push(...componentPattern);
  }

  // Example: Detect repetitive database queries
  if (stack.databases.length > 0) {
    const queryPattern = await detectRepetitiveQueries(projectPath);
    patterns.push(...queryPattern);
  }

  return { repetitive: patterns, complex: [], automatable: [] };
}

// Example: Detect repetitive FastAPI endpoints
async function detectRepetitiveEndpoints(projectPath: string): Promise<RepetitivePattern[]> {
  const patterns: RepetitivePattern[] = [];

  // Find all API route files
  const apiFiles = await Grep('@router\\.', { glob: '**/*.py', output_mode: 'files_with_matches' });

  if (apiFiles.length < 3) return patterns;  // Need 3+ to detect pattern

  // Analyze endpoint structure
  const endpoints: EndpointInfo[] = [];

  for (const file of apiFiles) {
    const content = await Read(file);

    // Extract endpoints
    const matches = content.match(/@router\.(get|post|put|delete)\("([^"]+)"\)/g) || [];

    for (const match of matches) {
      const [_, method, path] = match.match(/@router\.(\w+)\("([^"]+)"\)/) || [];

      endpoints.push({
        file,
        method,
        path,
        hasValidation: content.includes('Pydantic') || content.includes('BaseModel'),
        hasAuth: content.includes('Depends(get_current_user)'),
        hasDB: content.includes('Session') || content.includes('db.')
      });
    }
  }

  // Detect patterns: e.g., all endpoints follow same structure
  const commonStructure = {
    validation: endpoints.filter(e => e.hasValidation).length / endpoints.length,
    auth: endpoints.filter(e => e.hasAuth).length / endpoints.length,
    db: endpoints.filter(e => e.hasDB).length / endpoints.length
  };

  // If 70%+ endpoints follow same pattern → it's automatable
  if (commonStructure.validation > 0.7 && commonStructure.db > 0.7) {
    patterns.push({
      type: 'fastapi-endpoint',
      occurrences: endpoints.length,
      files: apiFiles,
      template: `
@router.post("/resource")
async def create_resource(
    data: ResourceSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validation (Pydantic)
    # Authorization check
    # Database operation
    # Return response
      `.trim(),
      variability: ['resource name', 'schema', 'business logic'],
      automatable: true,
      confidence: Math.round(commonStructure.validation * 100)
    });
  }

  return patterns;
}
```

**Auto-Check**:
- [ ] Patterns detected from actual code (not assumed)?
- [ ] Minimum 3 occurrences to confirm pattern?
- [ ] Template extracted from common structure?
- [ ] Variability identified (what changes)?
- [ ] Automatable flag based on confidence >70%?

---

### Pattern 3: Automatic Skill Generation (Personalized for Project)

Generate skills based on detected patterns, NOT generic templates.

❌ **WRONG - Generic skill**:
```markdown
# API Endpoint Builder

Creates generic REST API endpoints.
```

✅ **CORRECT - Personalized skill based on analysis**:
```typescript
async function generatePersonalizedSkill(pattern: RepetitivePattern, domain: DomainInfo): Promise<Skill> {
  // Skill name based on domain + pattern
  const skillName = `${domain.type.toLowerCase()}-${pattern.type}-builder`;

  // Example: "invoicing-fastapi-endpoint-builder" (NOT generic "endpoint-builder")

  const skillContent = `
---
name: ${skillName}
description: |
  This skill should be used when creating ${pattern.type} endpoints for ${domain.type} domain
  in this project. Auto-generates endpoints following detected project patterns.

  DETECTED PATTERN: ${pattern.occurrences} similar endpoints with:
  - Pydantic validation (${pattern.template.includes('Pydantic') ? 'YES' : 'NO'})
  - Authentication (${pattern.template.includes('Depends') ? 'YES' : 'NO'})
  - Database access (${pattern.template.includes('Session') ? 'YES' : 'NO'})

  GENERATES: Complete endpoint following project conventions.
---

# ${capitalize(skillName.replace(/-/g, ' '))}

**Project**: ${domain.type} System
**Pattern**: Detected from ${pattern.files.length} files

## Mission

Generate ${pattern.type} endpoints for **${domain.type} domain** following **this project's detected patterns** with **${pattern.confidence}% confidence**.

## Core Patterns

### Pattern 1: ${domain.type} Endpoint Structure

Based on analysis of ${pattern.occurrences} existing endpoints.

✅ **PROJECT TEMPLATE**:
\`\`\`python
${pattern.template}
\`\`\`

**Variability** (what you customize):
${pattern.variability.map(v => `- ${v}`).join('\n')}

**Auto-Check**:
- [ ] Follows project's Pydantic schema pattern?
- [ ] Uses project's authentication (Depends(get_current_user))?
- [ ] Uses project's database session (Session = Depends(get_db))?
- [ ] Returns project's standard response format?

### Pattern 2: ${domain.type} Business Logic

Detected domain-specific patterns:
${domain.evidence.map(e => `- ${e}`).join('\n')}

## Examples from THIS Project

${await generateExamplesFromProject(pattern.files.slice(0, 2))}

## Success Criteria

- ✅ Endpoint follows detected project patterns (${pattern.confidence}% match)
- ✅ Uses project's existing schemas/models
- ✅ Implements ${domain.type}-specific business logic
- ✅ Passes project's validation/auth checks

---

**Skill Version**: 1.0.0 (Auto-generated)
**Project**: ${domain.type} System
**Pattern Confidence**: ${pattern.confidence}%
**Based on**: ${pattern.occurrences} analyzed endpoints
`;

  return {
    name: skillName,
    content: skillContent,
    path: `.claude/skills/${skillName}/SKILL.md`,
    confidence: pattern.confidence
  };
}

async function generateExamplesFromProject(files: string[]): Promise<string> {
  let examples = '';

  for (const file of files) {
    const content = await Read(file);
    const excerpt = content.split('\n').slice(0, 30).join('\n');  // First 30 lines

    examples += `
**Example from** \`${file}\`:
\`\`\`python
${excerpt}
\`\`\`

`;
  }

  return examples;
}
```

**Auto-Check**:
- [ ] Skill name includes domain (not generic)?
- [ ] Skill description mentions detected pattern?
- [ ] Template extracted from THIS project's code?
- [ ] Examples taken from THIS project's files?
- [ ] Confidence score based on analysis?

---

### Pattern 4: Automatic Agent Generation (For Recurring Tasks)

Generate agents for tasks developers do repeatedly in THIS project.

❌ **WRONG - Generic agent**:
```markdown
# Code Reviewer

Reviews code for quality.
```

✅ **CORRECT - Task-specific agent based on project**:
```typescript
interface AgentNeed {
  name: string;
  purpose: string;
  trigger: string;           // When should this agent activate?
  tools: string[];           // What tools does it need?
  examples: string[];        // Real examples from project
  confidence: number;
}

async function detectAgentNeeds(patterns: CodePatterns, domain: DomainInfo): Promise<AgentNeed[]> {
  const needs: AgentNeed[] = [];

  // Example: Detect need for query optimizer
  const complexQueries = patterns.complex.filter(p => p.type === 'database-query');

  if (complexQueries.length >= 3) {
    needs.push({
      name: `${domain.type.toLowerCase()}-query-optimizer`,
      purpose: `Optimize complex database queries for ${domain.type} reports`,
      trigger: 'When user creates/modifies database query for reports',
      tools: ['Read', 'Edit', 'Bash (EXPLAIN ANALYZE)', 'Grep'],
      examples: complexQueries.map(q => q.files[0]),
      confidence: 85
    });
  }

  // Example: Detect need for validation generator
  const validationPatterns = patterns.repetitive.filter(p => p.type === 'validation');

  if (validationPatterns.length >= 5) {
    needs.push({
      name: `${domain.type.toLowerCase()}-validation-generator`,
      purpose: `Generate Pydantic validators for ${domain.type} schemas`,
      trigger: 'When user creates new schema/model',
      tools: ['Read', 'Write', 'Grep'],
      examples: validationPatterns.map(v => v.files[0]),
      confidence: 90
    });
  }

  return needs;
}

async function generateAgent(need: AgentNeed, domain: DomainInfo): Promise<Agent> {
  const agentContent = `
# ${capitalize(need.name.replace(/-/g, ' '))}

**Purpose**: ${need.purpose}
**Project**: ${domain.type} System
**Auto-Activation**: ${need.trigger}

## Mission

${need.purpose} with **${need.confidence}% confidence** based on detected project patterns.

## When to Use

**Activate when**:
- ${need.trigger}
- User explicitly requests "${need.name}"

**Detected from**:
${need.examples.map(ex => `- ${ex}`).join('\n')}

## Workflow

1. **Analyze**: Read existing ${domain.type} queries/schemas
2. **Detect patterns**: Find common structures
3. **Optimize/Generate**: Apply project-specific improvements
4. **Validate**: Ensure compatibility with project conventions

## Tools Used

${need.tools.map(t => `- ${t}`).join('\n')}

## Success Criteria

- ✅ Follows project's detected patterns
- ✅ Compatible with existing ${domain.type} code
- ✅ Improves performance/quality measurably

---

**Agent Version**: 1.0.0 (Auto-generated)
**Confidence**: ${need.confidence}%
`;

  return {
    name: need.name,
    content: agentContent,
    path: `.claude/agents/${need.name}.md`,
    confidence: need.confidence
  };
}
```

**Auto-Check**:
- [ ] Agent purpose specific to project domain?
- [ ] Trigger based on actual recurring tasks?
- [ ] Tools selected for detected needs?
- [ ] Examples from THIS project's code?

---

### Pattern 5: Automatic Command Generation (For Workflows)

Generate slash commands for common workflows in THIS project.

❌ **WRONG - Generic command**:
```markdown
# /new-component

Creates a new component.
```

✅ **CORRECT - Domain-specific workflow command**:
```typescript
interface CommandNeed {
  name: string;
  workflow: string[];        // Steps in workflow
  trigger: string;
  skill: string;             // Which skill executes this?
  confidence: number;
}

async function detectCommandNeeds(needs: ProjectNeeds, domain: DomainInfo): Promise<CommandNeed[]> {
  const commands: CommandNeed[] = [];

  // If we generated a skill for invoicing endpoints, create command for it
  const invoiceSkill = needs.skills.find(s => s.type === 'fastapi-endpoint' && domain.type === 'Invoicing');

  if (invoiceSkill) {
    commands.push({
      name: `/new-invoice-endpoint`,
      workflow: [
        'Ask user for resource name (invoice, payment, receipt, etc.)',
        'Generate Pydantic schema',
        'Generate FastAPI endpoint with validation + auth + DB',
        'Generate tests',
        'Update router registration'
      ],
      trigger: 'User wants to create new invoicing endpoint',
      skill: invoiceSkill.name,
      confidence: invoiceSkill.confidence
    });
  }

  return commands;
}

async function generateCommand(need: CommandNeed, domain: DomainInfo): Promise<Command> {
  const commandContent = `
# ${need.name} - ${domain.type} Endpoint Creator

**Purpose**: Complete workflow for creating ${domain.type} endpoints in THIS project

**Executes**: \`${need.skill}\` skill

---

## What This Does

${need.workflow.map((step, i) => `${i + 1}. ${step}`).join('\n')}

---

## Usage

\`\`\`
${need.name} <resource-name>
\`\`\`

**Example**:
\`\`\`
${need.name} payment
\`\`\`

→ Creates:
- \`schemas/payment.py\` (Pydantic model)
- \`routes/payment.py\` (FastAPI endpoints)
- \`tests/test_payment.py\` (Test suite)
- Updates \`main.py\` (Router registration)

---

## Implementation

Executes skill: \`${need.skill}\`

See: \`.claude/skills/${need.skill}/SKILL.md\`

---

**Command Version**: 1.0.0 (Auto-generated)
**Project**: ${domain.type} System
**Confidence**: ${need.confidence}%
`;

  return {
    name: need.name,
    content: commandContent,
    path: `.claude/commands${need.name}.md`,
    confidence: need.confidence
  };
}
```

**Auto-Check**:
- [ ] Command name reflects domain workflow?
- [ ] Workflow steps specific to THIS project?
- [ ] Links to auto-generated skill?
- [ ] Examples use project's actual resources?

---

### Pattern 6: Custom CLAUDE.md Generation (Project Context)

Generate CLAUDE.md with THIS project's context, NOT generic instructions.

❌ **WRONG - Generic CLAUDE.md**:
```markdown
# Project Instructions

Use Claude Code for this project.
```

✅ **CORRECT - Project-specific CLAUDE.md**:
```typescript
async function generateCustomCLAUDEmd(analysis: ProjectAnalysis): Promise<string> {
  const { stack, architecture, domain, patterns, needs } = analysis;

  return `
# Claude Code Enhancement System - ${domain.type} System

## 🚨 MANDATORY FIRST ACTION - NO EXCEPTIONS 🚨

BEFORE analyzing user's message → EXECUTE: Task: adaptive-meta-orchestrator

## 🎯 PROJECT CONTEXT

**Domain**: ${domain.type} (${domain.confidence}% confidence)
**Stack**: ${stack.primary} + ${stack.frameworks.join(', ')}
**Database**: ${stack.databases.join(', ')}
**Architecture**: ${architecture.type}

**What This Project Does**:
${domain.evidence.map(e => `- ${e}`).join('\n')}

**Detected Patterns**:
- ${patterns.repetitive.length} repetitive patterns (automatable)
- ${patterns.complex.length} complex areas (need optimization)
- ${patterns.automatable.length} workflows (can be automated)

## 🛠️ PERSONALIZED TOOLS (Auto-Generated)

**Skills** (${needs.skills.length}):
${needs.skills.map(s => `- \`${s.name}\` - ${s.purpose} (${s.confidence}% confidence)`).join('\n')}

**Agents** (${needs.agents.length}):
${needs.agents.map(a => `- \`${a.name}\` - ${a.purpose}`).join('\n')}

**Commands** (${needs.commands.length}):
${needs.commands.map(c => `- \`${c.name}\` - ${c.workflow[0]}`).join('\n')}

## 🎯 ${domain.type.toUpperCase()} BEST PRACTICES

**Detected from ${patterns.repetitive.length} analyzed files**:

${generateDomainBestPractices(domain, patterns)}

## 📊 PERFORMANCE TARGETS

${generatePerformanceTargets(domain, stack)}

## 🛡️ SECURITY PATTERNS

${generateSecurityPatterns(domain, stack)}

## 🛡️ ANTI-HALLUCINATION (CRITICAL)

**Mandatory Rules**:
1. **Files**: Glob FIRST → then claim
2. **Functions**: Grep FIRST → then claim
3. **Ambiguity**: AskUserQuestion FIRST → then execute
4. **Confidence <70%**: ASK, don't assume
5. **Verification**: After claiming → READ/GREP to confirm

## ✅ SUCCESS CRITERIA

**Performance**: 2-5x speedup (routine tasks)
**Quality**: Zero linting errors, tests pass
**Domain**: Follows ${domain.type} best practices
**Patterns**: Uses detected project patterns (${patterns.repetitive.length} identified)

---

**System Version**: 1.0.0 (Auto-generated for ${domain.type})
**Analysis Date**: ${new Date().toISOString()}
**Pattern Confidence**: ${Math.round(patterns.repetitive.reduce((sum, p) => sum + p.confidence, 0) / patterns.repetitive.length)}%
`;
}

function generateDomainBestPractices(domain: DomainInfo, patterns: CodePatterns): string {
  // Generate practices based on actual detected patterns
  const practices: string[] = [];

  if (domain.type === 'Invoicing') {
    practices.push(
      '1. **All invoice endpoints use Pydantic validation** (detected in 90% of endpoints)',
      '2. **Tax calculations isolated in business logic layer** (detected pattern)',
      '3. **Payment status transitions tracked in audit table** (detected pattern)',
      '4. **Invoice PDFs generated asynchronously** (detected background tasks)',
      '5. **Currency conversions use centralized service** (detected pattern)'
    );
  }

  // Fallback: Generic practices
  if (practices.length === 0) {
    practices.push(
      `1. Follow ${domain.type}-specific domain logic patterns`,
      '2. Use detected validation patterns',
      '3. Maintain consistency with existing code',
      '4. Apply detected architectural patterns',
      '5. Follow project conventions (detected from analysis)'
    );
  }

  return practices.join('\n');
}
```

**Auto-Check**:
- [ ] CLAUDE.md mentions project's domain?
- [ ] Lists auto-generated tools (not generic)?
- [ ] Best practices extracted from analyzed code?
- [ ] Performance targets specific to domain?
- [ ] Analysis confidence score included?

---

## Anti-Patterns

### Anti-Pattern 1: Generating Generic Tools Without Analysis

❌ **ANTI-PATTERN**:
```typescript
// Generate generic skills without analyzing project
await generateSkill('component-builder');
await generateSkill('api-builder');
await generateSkill('test-generator');
// None of these are specific to THIS project
```

✅ **CORRECT**:
```typescript
// 1. Analyze project FIRST
const analysis = await analyzeProject(projectPath);

// 2. Generate ONLY what's relevant
for (const skillNeed of analysis.needs.skills) {
  if (skillNeed.confidence >= 70) {  // Only high-confidence needs
    await generatePersonalizedSkill(skillNeed, analysis.domain);
  }
}

// Result: 3 highly-relevant skills instead of 10 generic ones
```

**Why It Matters**: Generic tools don't provide value. Personalized tools based on actual analysis are immediately useful.

---

### Anti-Pattern 2: Ignoring Domain Context

❌ **ANTI-PATTERN**:
```typescript
// Generate skills without domain context
const skillName = 'endpoint-builder';  // Generic
```

✅ **CORRECT**:
```typescript
// Include domain in skill name and content
const skillName = `${domain.type.toLowerCase()}-${pattern.type}-builder`;
// Example: "invoicing-fastapi-endpoint-builder"
// Developer immediately knows: "This is for MY invoicing system"
```

**Why It Matters**: Domain context makes tools discoverable and obviously relevant to developers.

---

### Anti-Pattern 3: No Validation of Generated Tools

❌ **ANTI-PATTERN**:
```typescript
// Generate 10 skills and assume they're all useful
for (const skill of skills) {
  await writeFile(skill.path, skill.content);
}
console.log("Generated 10 skills!");  // But are they useful?
```

✅ **CORRECT**:
```typescript
// Present findings to user BEFORE generating
const answer = await AskUserQuestion({
  questions: [{
    question: `I detected ${needs.skills.length} skills, ${needs.agents.length} agents, and ${needs.commands.length} commands. Generate all?`,
    header: 'Tool Generation',
    multiSelect: true,
    options: [
      ...needs.skills.map(s => ({
        label: s.name,
        description: `${s.purpose} (${s.confidence}% confidence, ${s.occurrences} patterns detected)`
      })),
      ...needs.agents.map(a => ({
        label: a.name,
        description: `${a.purpose} (${a.confidence}% confidence)`
      }))
    ]
  }]
});

// Generate only what user approved
const approvedSkills = needs.skills.filter(s => answer.includes(s.name));
for (const skill of approvedSkills) {
  await generatePersonalizedSkill(skill, domain);
}
```

**Why It Matters**: User should review and approve generated tools. Not all detected patterns are worth automating.

---

## Validation Checklist

Before marking skill complete, verify:

### Project Analysis (30 points)
- [ ] Tech stack detected accurately (5 pts)
- [ ] Architecture type identified (MVC, Layered, etc.) (5 pts)
- [ ] Domain detected with evidence (not guessed) (10 pts)
- [ ] Code patterns found (3+ repetitive patterns) (10 pts)

### Tool Generation (40 points)
- [ ] Skills personalized for THIS project (not generic) (15 pts)
- [ ] Agents generated for recurring tasks (10 pts)
- [ ] Commands generated for workflows (10 pts)
- [ ] All tools include project context (domain, examples) (5 pts)

### Quality (30 points)
- [ ] Confidence scores >70% for all generated tools (10 pts)
- [ ] Examples taken from THIS project's code (10 pts)
- [ ] User validated generated tools before creation (10 pts)

### Total: __/100

**Minimum Score**: 85/100 for production use

---

## References

| Pattern | File Path | Description |
|---------|-----------|-------------|
| Project Analysis | `specs-driven/20-PROJECT-SETUP/SPEC.md` | Deep analysis workflow |
| Skill Generation | `.claude/skills/skill-builder/SKILL.md` | Skill creation patterns |
| Agent Generation | `.claude/agents/` | Agent examples |
| Command Generation | `.claude/commands/` | Command examples |

---

## Success Criteria

After using this skill:

- ✅ Project analyzed at multiple layers (stack, architecture, domain, patterns)
- ✅ Domain detected with 80%+ confidence
- ✅ 5-10 personalized tools generated (skills/agents/commands)
- ✅ Tools based on detected patterns (not generic)
- ✅ CLAUDE.md customized with project context
- ✅ User validated generated tools
- ✅ Analysis completed in <10 minutes
- ✅ Tools immediately usable for THIS project

---

**Skill Version**: 2.0.0 (Corrected - Personalized Generation)
**Purpose**: Analyze project → Generate personalized tools
**Target**: 80%+ pattern detection, 5-10 tools, <10 min
**Tools Used**: Read, Write, Glob, Grep, TodoWrite, AskUserQuestion
**Coordination**: Works with `/project-setup` command
