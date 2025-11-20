---
name: knowledge-consolidator
description: |
  This skill should be used when reading documentation from multiple Claude Code projects
  to extract knowledge, detect duplicates, unify best practices, and consolidate experience.

  AUTO-ACTIVATES for: knowledge sync, consolidate learning, unify knowledge, read multi-project,
  extract knowledge, detect duplicates, best practices, cross-project experience.

  PROVIDES: Multi-project documentation reading (AI_PRODUCT_DECISIONS.md, AI_BUGS_KNOWLEDGE.md, specs/),
  knowledge extraction (decisions, bugs, patterns, anti-patterns), duplicate detection
  (same problem in 3+ projects → unify), best practice validation (3+ confirmations → validated),
  experience consolidation (unified knowledge base), automatic propagation (to new projects).

  READS: AI_PRODUCT_DECISIONS.md, AI_BUGS_KNOWLEDGE.md, AI_PROGRESS_TRACKER.md, specs/,
  CLAUDE.md from multiple projects. Extracts architectural decisions, resolved bugs,
  discovered patterns, anti-patterns avoided.

  UNIFIES: Same bug found in 3 projects → single anti-pattern document.
  Same pattern found in 5 projects → validated best practice.
  Experience from all projects → consolidated knowledge base.

  TARGET: Zero knowledge loss, 100% duplicate detection, >3 projects for validation.
---

# Knowledge Consolidator - Cross-Project Experience Unification

Reads documentation from multiple Claude Code projects, extracts knowledge, detects duplicates, and unifies best practices into consolidated experience base.

## When to Use This Skill

This skill should be used when:
- User runs `/knowledge-sync` command
- User wants to learn from multiple projects
- New project needs best practices from existing projects
- User wants to avoid repeating same mistakes across projects
- Consolidating experience from work + personal projects

### Explicit Activation Contexts

Activate when:
- User runs `/knowledge-sync` (reads all projects)
- User asks "what have I learned across all projects?"
- User wants "consolidated best practices"
- Setting up new project (import validated knowledge)

### Proactive Detection Scenarios

Auto-suggest when detecting:
- Same bug appears in current project that was solved in another project
- Pattern discovered that was already validated in 3+ projects
- User about to make mistake that was documented in another project
- New project starts (suggest importing consolidated knowledge)

---

## Mission

Read documentation from **MULTIPLE projects** (work + personal), extract **all knowledge** (decisions, bugs, patterns), detect **100% duplicates**, unify into **consolidated knowledge base**, validate **best practices** (3+ confirmations).

---

## Core Patterns

### Pattern 1: Multi-Project Documentation Reading

Read documentation files from all projects to extract knowledge.

❌ **WRONG - Single project reading**:
```typescript
// Only read current project
const decisions = await Read('AI_PRODUCT_DECISIONS.md');
// Ignores all other projects' learnings
```

✅ **CORRECT - Multi-project reading**:
```typescript
interface ProjectDocumentation {
  projectPath: string;
  projectName: string;
  decisions: DecisionDocument | null;
  bugs: BugDocument | null;
  progress: ProgressDocument | null;
  specs: SpecDocument[];
  claude: CLAUDEmdDocument | null;
}

async function readAllProjectsDocumentation(projectsDirectory: string): Promise<ProjectDocumentation[]> {
  const allProjects: ProjectDocumentation[] = [];

  // List all project directories
  const projectPaths = await findAllProjects(projectsDirectory);

  console.log(`📚 Found ${projectPaths.length} projects to analyze`);

  for (const projectPath of projectPaths) {
    const projectName = projectPath.split(/[\\/]/).pop() || 'Unknown';

    console.log(`📖 Reading documentation from: ${projectName}`);

    // Read AI_PRODUCT_DECISIONS.md
    let decisions: DecisionDocument | null = null;
    const decisionsPath = `${projectPath}/AI_PRODUCT_DECISIONS.md`;

    if (await fileExists(decisionsPath)) {
      const content = await Read(decisionsPath);
      decisions = await parseDecisions(content, projectName);
    }

    // Read AI_BUGS_KNOWLEDGE.md
    let bugs: BugDocument | null = null;
    const bugsPath = `${projectPath}/AI_BUGS_KNOWLEDGE.md`;

    if (await fileExists(bugsPath)) {
      const content = await Read(bugsPath);
      bugs = await parseBugs(content, projectName);
    }

    // Read AI_PROGRESS_TRACKER.md
    let progress: ProgressDocument | null = null;
    const progressPath = `${projectPath}/AI_PROGRESS_TRACKER.md`;

    if (await fileExists(progressPath)) {
      const content = await Read(progressPath);
      progress = await parseProgress(content, projectName);
    }

    // Read specs/ directory
    const specs: SpecDocument[] = [];
    const specsPath = `${projectPath}/specs-driven/`;

    if (await directoryExists(specsPath)) {
      const specFiles = await Glob(`${specsPath}**/SPEC.md`);

      for (const specFile of specFiles) {
        const content = await Read(specFile);
        specs.push(await parseSpec(content, projectName, specFile));
      }
    }

    // Read CLAUDE.md
    let claude: CLAUDEmdDocument | null = null;
    const claudePath = `${projectPath}/CLAUDE.md`;

    if (await fileExists(claudePath)) {
      const content = await Read(claudePath);
      claude = await parseCLAUDEmd(content, projectName);
    }

    allProjects.push({
      projectPath,
      projectName,
      decisions,
      bugs,
      progress,
      specs,
      claude
    });
  }

  console.log(`✅ Read documentation from ${allProjects.length} projects`);

  return allProjects;
}

// Find all projects (directories with .claude/ or CLAUDE.md)
async function findAllProjects(baseDir: string): Promise<string[]> {
  const projects: string[] = [];

  // Search for directories with CLAUDE.md
  const claudeFiles = await Bash({ command: `find "${baseDir}" -name "CLAUDE.md" -type f` });
  const paths = claudeFiles.split('\n').filter(p => p.trim());

  for (const path of paths) {
    const projectPath = path.replace('/CLAUDE.md', '').replace('\\CLAUDE.md', '');
    projects.push(projectPath);
  }

  return projects;
}
```

**Auto-Check**:
- [ ] All projects in directory found (not just current)?
- [ ] All documentation types read (decisions, bugs, specs)?
- [ ] Missing files handled gracefully (not failed)?
- [ ] Project name extracted for provenance?

---

### Pattern 2: Knowledge Extraction (From Each Project)

Extract structured knowledge from each project's documentation.

❌ **WRONG - Raw text only**:
```typescript
// Just read raw text
const content = await Read('AI_BUGS_KNOWLEDGE.md');
// No structure, can't detect duplicates
```

✅ **CORRECT - Structured extraction**:
```typescript
interface ExtractedKnowledge {
  decisions: ArchitecturalDecision[];
  bugs: ResolvedBug[];
  patterns: DiscoveredPattern[];
  antiPatterns: AvoidedAntiPattern[];
  optimizations: PerformanceOptimization[];
}

// Extract from AI_PRODUCT_DECISIONS.md
async function parseDecisions(content: string, projectName: string): Promise<DecisionDocument> {
  const decisions: ArchitecturalDecision[] = [];

  // Extract decisions (format: ## Decision: ...)
  const decisionRegex = /## Decision: ([^\n]+)\n+([\s\S]+?)(?=\n## Decision:|\n##|\Z)/g;
  let match;

  while ((match = decisionRegex.exec(content)) !== null) {
    const title = match[1].trim();
    const body = match[2].trim();

    // Extract key information
    const decision: ArchitecturalDecision = {
      title,
      description: body.split('\n\n')[0],  // First paragraph
      rationale: extractSection(body, 'Rationale') || extractSection(body, 'Why'),
      alternatives: extractSection(body, 'Alternatives') || extractSection(body, 'Options'),
      impact: extractSection(body, 'Impact') || extractSection(body, 'Results'),
      project: projectName,
      date: extractDate(body) || 'Unknown',
      stack: extractStack(body),
      domain: extractDomain(body)
    };

    decisions.push(decision);
  }

  return { decisions };
}

// Extract from AI_BUGS_KNOWLEDGE.md
async function parseBugs(content: string, projectName: string): Promise<BugDocument> {
  const bugs: ResolvedBug[] = [];

  // Extract bugs (format: ### Bug: ...)
  const bugRegex = /### Bug: ([^\n]+)\n+([\s\S]+?)(?=\n### Bug:|\n##|\Z)/g;
  let match;

  while ((match = bugRegex.exec(content)) !== null) {
    const title = match[1].trim();
    const body = match[2].trim();

    const bug: ResolvedBug = {
      title,
      symptom: extractSection(body, 'Symptom') || extractSection(body, 'Error'),
      rootCause: extractSection(body, 'Root Cause') || extractSection(body, 'Cause'),
      solution: extractSection(body, 'Solution') || extractSection(body, 'Fix'),
      prevention: extractSection(body, 'Prevention') || extractSection(body, 'How to Avoid'),
      project: projectName,
      date: extractDate(body) || 'Unknown',
      stack: extractStack(body),
      severity: extractSeverity(body)
    };

    bugs.push(bug);
  }

  return { bugs };
}

// Helper: Extract section from markdown
function extractSection(markdown: string, sectionName: string): string | null {
  // Try various formats: **Section:**, ## Section, - Section:
  const patterns = [
    new RegExp(`\\*\\*${sectionName}\\*\\*:?\\s*([^\\n]+(?:\\n(?!\\*\\*|##|-)[^\\n]+)*)`, 'i'),
    new RegExp(`##+ ${sectionName}\\n+([\\s\\S]+?)(?=\\n##|\\Z)`, 'i'),
    new RegExp(`- ${sectionName}:?\\s*([^\\n]+)`, 'i')
  ];

  for (const pattern of patterns) {
    const match = markdown.match(pattern);
    if (match) return match[1].trim();
  }

  return null;
}

// Extract stack (React, Python, etc.)
function extractStack(text: string): string[] {
  const stacks: string[] = [];
  const stackKeywords = ['React', 'Vue', 'Python', 'FastAPI', 'Go', 'Rust', 'TypeScript', 'Node.js'];

  for (const keyword of stackKeywords) {
    if (text.includes(keyword)) {
      stacks.push(keyword);
    }
  }

  return stacks;
}
```

**Auto-Check**:
- [ ] Decisions extracted with structure (title, rationale, impact)?
- [ ] Bugs extracted with root cause + solution?
- [ ] Stack detected from content?
- [ ] Provenance tracked (project name, date)?

---

### Pattern 3: Duplicate Detection (Cross-Project)

Detect when multiple projects encountered the same bug/pattern/decision.

❌ **WRONG - No duplicate detection**:
```typescript
// Just collect all bugs from all projects
const allBugs = [...project1.bugs, ...project2.bugs, ...project3.bugs];
// Same bug appears 3 times (waste)
```

✅ **CORRECT - Detect and group duplicates**:
```typescript
interface DuplicateGroup {
  type: 'bug' | 'pattern' | 'decision';
  canonical: string;             // Canonical name/title
  occurrences: number;           // How many projects found this
  projects: string[];            // Which projects
  instances: KnowledgeItem[];    // All instances
  confidence: number;            // 0-100 (similarity score)
}

async function detectDuplicates(allKnowledge: ExtractedKnowledge[]): Promise<DuplicateGroup[]> {
  const duplicates: DuplicateGroup[] = [];

  // Detect duplicate bugs
  const allBugs = allKnowledge.flatMap(k => k.bugs);
  const bugGroups = await groupSimilarItems(allBugs, 'bug');
  duplicates.push(...bugGroups);

  // Detect duplicate patterns
  const allPatterns = allKnowledge.flatMap(k => k.patterns);
  const patternGroups = await groupSimilarItems(allPatterns, 'pattern');
  duplicates.push(...patternGroups);

  // Detect duplicate decisions
  const allDecisions = allKnowledge.flatMap(k => k.decisions);
  const decisionGroups = await groupSimilarItems(allDecisions, 'decision');
  duplicates.push(...decisionGroups);

  // Filter: Only groups with 2+ occurrences (duplicates)
  return duplicates.filter(g => g.occurrences >= 2);
}

// Group similar items using text similarity
async function groupSimilarItems(items: KnowledgeItem[], type: string): Promise<DuplicateGroup[]> {
  const groups: DuplicateGroup[] = [];

  for (const item of items) {
    // Check if item belongs to existing group
    let grouped = false;

    for (const group of groups) {
      const similarity = calculateSimilarity(item.title, group.canonical);

      // If >80% similar → same group
      if (similarity > 0.80) {
        group.instances.push(item);
        group.occurrences++;
        group.projects.push(item.project);
        grouped = true;
        break;
      }
    }

    // If not grouped → create new group
    if (!grouped) {
      groups.push({
        type,
        canonical: item.title,
        occurrences: 1,
        projects: [item.project],
        instances: [item],
        confidence: 100
      });
    }
  }

  return groups;
}

// Calculate text similarity (Jaccard index)
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));

  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

// Example result:
// {
//   type: 'bug',
//   canonical: 'useEffect for derived state causes double render',
//   occurrences: 3,
//   projects: ['ProjectA', 'ProjectB', 'ProjectC'],
//   instances: [bugFromA, bugFromB, bugFromC],
//   confidence: 85
// }
```

**Auto-Check**:
- [ ] Duplicates detected across projects (not within)?
- [ ] Similarity threshold >80% for grouping?
- [ ] Multiple instances grouped together?
- [ ] Confidence score based on similarity?

---

### Pattern 4: Knowledge Unification (Create Consolidated Docs)

Unify duplicates into single consolidated documents with provenance.

❌ **WRONG - Keep all duplicates**:
```markdown
## Bug: useEffect derived state (from ProjectA)
...

## Bug: useEffect causes double render (from ProjectB)
...

## Bug: derived state useEffect problem (from ProjectC)
...

(3 separate entries for same bug)
```

✅ **CORRECT - Unify into single entry**:
```typescript
async function unifyKnowledge(duplicates: DuplicateGroup[]): Promise<UnifiedKnowledge> {
  const unified: UnifiedKnowledge = {
    bugs: [],
    patterns: [],
    decisions: []
  };

  for (const group of duplicates) {
    if (group.type === 'bug' && group.occurrences >= 2) {
      const unifiedBug = await unifyBugGroup(group);
      unified.bugs.push(unifiedBug);
    } else if (group.type === 'pattern' && group.occurrences >= 3) {
      // Patterns need 3+ confirmations to be "validated"
      const unifiedPattern = await unifyPatternGroup(group);
      unified.patterns.push(unifiedPattern);
    } else if (group.type === 'decision' && group.occurrences >= 2) {
      const unifiedDecision = await unifyDecisionGroup(group);
      unified.decisions.push(unifiedDecision);
    }
  }

  return unified;
}

async function unifyBugGroup(group: DuplicateGroup): Promise<UnifiedBug> {
  // Merge information from all instances
  const allSymptoms = group.instances.map(i => i.symptom).filter(Boolean);
  const allRootCauses = group.instances.map(i => i.rootCause).filter(Boolean);
  const allSolutions = group.instances.map(i => i.solution).filter(Boolean);
  const allPreventions = group.instances.map(i => i.prevention).filter(Boolean);

  // Select best (most detailed) versions
  const bestSymptom = allSymptoms.reduce((best, curr) => curr.length > best.length ? curr : best, '');
  const bestRootCause = allRootCauses.reduce((best, curr) => curr.length > best.length ? curr : best, '');
  const bestSolution = allSolutions.reduce((best, curr) => curr.length > best.length ? curr : best, '');
  const bestPrevention = allPreventions.reduce((best, curr) => curr.length > best.length ? curr : best, '');

  return {
    title: group.canonical,
    symptom: bestSymptom,
    rootCause: bestRootCause,
    solution: bestSolution,
    prevention: bestPrevention,
    validated: true,
    validation: {
      occurrences: group.occurrences,
      projects: group.projects,
      confidence: group.confidence,
      firstReported: Math.min(...group.instances.map(i => new Date(i.date).getTime())),
      lastReported: Math.max(...group.instances.map(i => new Date(i.date).getTime()))
    },
    stacks: [...new Set(group.instances.flatMap(i => i.stack))],
    severity: getMostSevere(group.instances.map(i => i.severity))
  };
}

// Generate markdown for unified bug
function generateUnifiedBugMarkdown(bug: UnifiedBug): string {
  return `
### ${bug.title}

**✅ VALIDATED** (${bug.validation.occurrences} projects confirmed)

**Symptom**:
${bug.symptom}

**Root Cause**:
${bug.rootCause}

**Solution**:
${bug.solution}

**Prevention**:
${bug.prevention}

**Stacks Affected**: ${bug.stacks.join(', ')}
**Severity**: ${bug.severity}
**Validated By**: ${bug.validation.projects.join(', ')}
**Confidence**: ${bug.validation.confidence}%

---
`;
}
```

**Auto-Check**:
- [ ] Duplicates merged into single entry?
- [ ] Best version selected (most detailed)?
- [ ] Validation info included (occurrences, projects)?
- [ ] Provenance tracked (which projects confirmed)?

---

### Pattern 5: Best Practice Validation (3+ Confirmations)

Mark patterns as "validated best practices" when 3+ projects confirm.

❌ **WRONG - Single project = best practice**:
```markdown
## Pattern: Data Decimation

Found in 1 project.
Recommended as best practice.  (WRONG - not validated)
```

✅ **CORRECT - Require 3+ confirmations**:
```typescript
interface BestPractice {
  title: string;
  description: string;
  validation: {
    confirmed: boolean;        // true if 3+ projects
    occurrences: number;
    projects: string[];
    successRate: number;       // % of successful applications
    averageImprovement: string; // e.g., "5x speedup"
  };
  applicability: string[];     // Stacks where applicable
  examples: Example[];         // Real examples from projects
}

async function validateBestPractices(patterns: UnifiedPattern[]): Promise<BestPractice[]> {
  const bestPractices: BestPractice[] = [];

  for (const pattern of patterns) {
    // Require 3+ confirmations for "best practice" status
    if (pattern.validation.occurrences >= 3) {
      // Calculate success rate
      const successfulUses = pattern.instances.filter(i => i.result?.includes('improvement')).length;
      const successRate = (successfulUses / pattern.instances.length) * 100;

      // Extract improvements
      const improvements = pattern.instances
        .map(i => extractImprovement(i.result))
        .filter(Boolean);

      const averageImprovement = improvements.length > 0
        ? `${Math.round(improvements.reduce((sum, i) => sum + i, 0) / improvements.length)}x improvement`
        : 'Significant improvement';

      bestPractices.push({
        title: pattern.title,
        description: pattern.description,
        validation: {
          confirmed: true,
          occurrences: pattern.validation.occurrences,
          projects: pattern.validation.projects,
          successRate,
          averageImprovement
        },
        applicability: pattern.stacks,
        examples: pattern.instances.map(i => ({
          project: i.project,
          result: i.result,
          date: i.date
        }))
      });
    }
  }

  return bestPractices;
}

// Generate markdown for validated best practice
function generateBestPracticeMarkdown(practice: BestPractice): string {
  return `
## ✅ ${practice.title}

**Status**: VALIDATED BEST PRACTICE
**Confirmed By**: ${practice.validation.occurrences} projects (${practice.validation.projects.join(', ')})
**Success Rate**: ${practice.validation.successRate}%
**Average Improvement**: ${practice.validation.averageImprovement}

${practice.description}

**Applicable To**: ${practice.applicability.join(', ')}

**Real Examples**:

${practice.examples.map(ex => `
### ${ex.project}
- Date: ${ex.date}
- Result: ${ex.result}
`).join('\n')}

---
`;
}

// Example: Data decimation pattern validated by 3 projects
// {
//   title: "Data decimation for large charts (10k+ points)",
//   validation: {
//     confirmed: true,
//     occurrences: 3,
//     projects: ['ProjectA', 'Personal1', 'Personal2'],
//     successRate: 100,
//     averageImprovement: '16x improvement'
//   },
//   applicability: ['React', 'Python', 'Any (charts)']
// }
```

**Auto-Check**:
- [ ] Best practice requires 3+ confirmations?
- [ ] Success rate calculated from actual results?
- [ ] Average improvement quantified?
- [ ] Applicability to stacks identified?
- [ ] Real examples from projects included?

---

### Pattern 6: Automatic Propagation to New Projects

When new project detected, automatically import consolidated knowledge.

❌ **WRONG - Manual import**:
```typescript
// User must manually import knowledge for each new project
```

✅ **CORRECT - Automatic propagation**:
```typescript
async function propagateKnowledgeToProject(
  projectPath: string,
  unifiedKnowledge: UnifiedKnowledge
): Promise<PropagationReport> {
  console.log(`🚀 Propagating consolidated knowledge to: ${projectPath}`);

  // 1. Detect project stack
  const stack = await detectStack(projectPath);

  // 2. Filter relevant knowledge
  const relevantBugs = unifiedKnowledge.bugs.filter(bug =>
    bug.stacks.some(s => stack.frameworks.includes(s) || stack.primary === s) ||
    bug.stacks.includes('Any')  // Universal bugs
  );

  const relevantPatterns = unifiedKnowledge.patterns.filter(pattern =>
    pattern.stacks.some(s => stack.frameworks.includes(s) || stack.primary === s) ||
    pattern.stacks.includes('Any')  // Universal patterns
  );

  // 3. Generate preventive documentation
  const preventiveDoc = generatePreventiveDocumentation(relevantBugs, relevantPatterns, stack);

  // 4. Write to project
  const preventiveDocsPath = `${projectPath}/.claude/docs/preventive-knowledge.md`;
  await writeFile(preventiveDocsPath, preventiveDoc);

  // 5. Update CLAUDE.md with references
  await updateCLAUDEmdWithKnowledge(projectPath, relevantBugs.length, relevantPatterns.length);

  return {
    bugsImported: relevantBugs.length,
    patternsImported: relevantPatterns.length,
    bestPracticesImported: relevantPatterns.filter(p => p.validation.confirmed).length
  };
}

function generatePreventiveDocumentation(
  bugs: UnifiedBug[],
  patterns: UnifiedPattern[],
  stack: TechStack
): string {
  return `
# Preventive Knowledge - Consolidated from ${bugs.length + patterns.length} Cross-Project Learnings

**Your Stack**: ${stack.primary} + ${stack.frameworks.join(', ')}

**This document contains validated knowledge from multiple projects to help you avoid common mistakes.**

---

## 🐛 Bugs to Avoid (${bugs.length} validated)

${bugs.map(bug => `
### ❌ ${bug.title}

**How to Recognize**: ${bug.symptom}
**Why It Happens**: ${bug.rootCause}
**How to Fix**: ${bug.solution}
**How to Prevent**: ${bug.prevention}

**Validated By**: ${bug.validation.projects.join(', ')} (${bug.validation.occurrences} projects)

---
`).join('\n')}

## ✅ Best Practices (${patterns.filter(p => p.validation.confirmed).length} validated)

${patterns.filter(p => p.validation.confirmed).map(pattern => `
### ✅ ${pattern.title}

${pattern.description}

**Success Rate**: ${pattern.validation.successRate}%
**Average Improvement**: ${pattern.validation.averageImprovement}
**Validated By**: ${pattern.validation.projects.join(', ')}

**Examples**:
${pattern.instances.slice(0, 2).map(ex => `- ${ex.project}: ${ex.result}`).join('\n')}

---
`).join('\n')}

---

**This knowledge was automatically consolidated from multiple projects. Use it to avoid reinventing solutions and repeating mistakes.**
`;
}
```

**Auto-Check**:
- [ ] Knowledge filtered by stack relevance?
- [ ] Preventive documentation generated?
- [ ] Bugs and patterns included?
- [ ] Validation info preserved?
- [ ] Automatically propagated to new projects?

---

## Anti-Patterns

### Anti-Pattern 1: No Duplicate Detection

❌ **ANTI-PATTERN**:
```typescript
// Just collect all knowledge without detecting duplicates
const allBugs = [...project1.bugs, ...project2.bugs, ...project3.bugs];
await saveBugs(allBugs);  // Same bug 3 times (waste)
```

✅ **CORRECT**:
```typescript
// Detect duplicates FIRST
const duplicates = await detectDuplicates([project1, project2, project3]);

// Unify duplicates
const unifiedBugs = await unifyBugGroups(duplicates.filter(d => d.type === 'bug'));

// Save unified version (1 entry instead of 3)
await saveUnifiedBugs(unifiedBugs);
```

**Why It Matters**: Without duplicate detection, knowledge base becomes bloated with repeated information. Unification makes knowledge actionable.

---

### Anti-Pattern 2: Single Project = Best Practice

❌ **ANTI-PATTERN**:
```markdown
## Pattern: Use Redis for caching

Found in 1 project. Recommended as best practice.
```

✅ **CORRECT**:
```markdown
## Pattern: Use Redis for caching

**Status**: PATTERN (not yet validated)
**Confirmations**: 1 project
**Note**: Requires 3+ confirmations for "best practice" status

---

## ✅ Pattern: Data decimation for charts

**Status**: VALIDATED BEST PRACTICE
**Confirmations**: 5 projects (ProjectA, Personal1, Personal2, Work1, Work2)
**Success Rate**: 100%
**Average Improvement**: 16x speedup
```

**Why It Matters**: Best practices need multiple confirmations. Single-project patterns may be project-specific, not universal.

---

### Anti-Pattern 3: Losing Provenance

❌ **ANTI-PATTERN**:
```markdown
## Bug: useEffect derived state causes double render

**Solution**: Use useMemo instead

(No info about which projects found this, when, or how many times)
```

✅ **CORRECT**:
```markdown
## Bug: useEffect derived state causes double render

**Solution**: Use useMemo instead

**Validated By**:
- ProjectA (React) - 2025-10-15 - Fixed in 3 components
- ProjectB (React) - 2025-11-01 - Prevented double renders
- ProjectC (React) - 2025-11-12 - 40% performance improvement

**Confidence**: 95% (3 confirmations, 100% success rate)
```

**Why It Matters**: Provenance shows validation strength. "3 projects confirmed" is more trustworthy than unattributed advice.

---

## Validation Checklist

Before marking skill complete, verify:

### Documentation Reading (25 points)
- [ ] All projects found and read (10 pts)
- [ ] All doc types read (decisions, bugs, specs) (10 pts)
- [ ] Missing files handled gracefully (5 pts)

### Knowledge Extraction (25 points)
- [ ] Structured extraction (not raw text) (10 pts)
- [ ] Provenance tracked (project, date) (10 pts)
- [ ] Stack detected from content (5 pts)

### Duplicate Detection (25 points)
- [ ] Duplicates detected across projects (10 pts)
- [ ] Similarity threshold >80% (10 pts)
- [ ] Grouped correctly (5 pts)

### Unification (25 points)
- [ ] Duplicates merged into single entries (10 pts)
- [ ] Best practices require 3+ confirmations (10 pts)
- [ ] Provenance preserved in unified docs (5 pts)

### Total: __/100

**Minimum Score**: 85/100 for production use

---

## References

| Pattern | File Path | Description |
|---------|-----------|-------------|
| Knowledge Consolidation | `specs-driven/21-KNOWLEDGE-CONSOLIDATION/SPEC.md` | Multi-project reading workflow |
| Duplicate Detection | `specs-driven/21-KNOWLEDGE-CONSOLIDATION/SPEC.md` | Similarity algorithms |
| Best Practice Validation | `specs-driven/21-KNOWLEDGE-CONSOLIDATION/SPEC.md` | 3+ confirmation requirement |

---

## Success Criteria

After using this skill:

- ✅ Documentation read from ALL projects (not just current)
- ✅ Knowledge extracted with structure (decisions, bugs, patterns)
- ✅ Duplicates detected (100% detection rate)
- ✅ Knowledge unified (1 entry instead of 3+)
- ✅ Best practices validated (3+ confirmations)
- ✅ Provenance preserved (which projects, when, results)
- ✅ Automatically propagated to new projects
- ✅ Zero knowledge loss across projects

---

**Skill Version**: 2.0.0 (Corrected - Multi-Project Unification)
**Purpose**: Read multi-project docs → Extract → Detect duplicates → Unify → Validate
**Target**: 100% duplicate detection, 3+ confirmations for best practices
**Tools Used**: Read, Write, Glob, Grep, Bash, TodoWrite
**Coordination**: Works with `/knowledge-sync` command
