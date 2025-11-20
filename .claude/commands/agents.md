---
description: List all available agents with usage examples
---

# Available Agents

List all available agents in `.claude/agents/` with descriptions and activation examples.

## Usage

```
/agents [filter]
```

### Examples

```
/agents                  # All agents
/agents bug              # Agents matching "bug"
/agents documenter       # Agents for documentation
```

---

## Output Format

```
🤖 AVAILABLE AGENTS (3 total)

═══════════════════════════════════════════════════════════════════════════════

📝 Documentation Agents
═══════════════════════════════════════════════════════════════════════════════

bug-documenter
📍 Location: .claude/agents/bug-documenter.md
📝 Description: Maintains AI_BUGS_KNOWLEDGE.md
📚 Output: AI_BUGS_KNOWLEDGE.md (bug tracking)

What it does:
• Logs bugs with symptoms, root causes, solutions
• Extracts prevention patterns
• Tracks hallucination metrics
• Searches knowledge base for similar bugs

When to use:
• After fixing a bug → Document it
• Before context cleanup → Save undocumented bugs
• Encounter error → Search if it's known

Activation:
Task(
  subagent_type='bug-documenter',
  prompt='Document auth bug: Missing token refresh caused infinite loops',
  description='Log bug to knowledge base'
)

═══════════════════════════════════════════════════════════════════════════════

decision-documenter
📍 Location: .claude/agents/decision-documenter.md
📝 Description: Maintains AI_PRODUCT_DECISIONS.md
📚 Output: AI_PRODUCT_DECISIONS.md (decisions log)

What it does:
• Documents feature specifications
• Logs design decisions (why we chose A over B)
• Records expected behavior
• Tracks acceptance criteria

When to use:
• User finalizes approach → Document decision
• New feature specified → Create spec entry
• Ambiguous behavior → Clarify and document

Activation:
Task(
  subagent_type='decision-documenter',
  prompt='Document auth decision: JWT with 15min tokens in httpOnly cookies',
  description='Log product decision'
)

═══════════════════════════════════════════════════════════════════════════════

progress-tracker
📍 Location: .claude/agents/progress-tracker.md
📝 Description: Maintains AI_PROGRESS_TRACKER.md
📚 Output: AI_PROGRESS_TRACKER.md (progress tracking)

What it does:
• Tracks feature completion (0-100%)
• Logs blockers and their impact
• Sets next priorities
• Syncs with AI_PRODUCT_DECISIONS.md

When to use:
• Feature completed → Mark as 100%
• Encounter blocker → Log it
• Sprint planning → Check next priorities
• User asks "what's the status?"

Activation:
Task(
  subagent_type='progress-tracker',
  prompt='Mark authentication complete (100%), update next priority to user profiles',
  description='Update progress tracker'
)

═══════════════════════════════════════════════════════════════════════════════

💡 HOW TO USE AGENTS

1. Activation Syntax:
   Task(subagent_type='agent-name', prompt='task description')

2. With Model Selection:
   Task(
     subagent_type='agent-name',
     prompt='task description',
     model='haiku'  # For fast tasks
   )

3. Example:
   Task(
     subagent_type='bug-documenter',
     prompt='Search for bugs related to WebSocket timeouts'
   )

═══════════════════════════════════════════════════════════════════════════════

📊 AGENT OUTPUTS

Agents maintain knowledge files:

AI_BUGS_KNOWLEDGE.md
├─ BUG-{ID}: Symptom, Root Cause, Solution, Prevention
└─ Searchable by type, severity, date

AI_PRODUCT_DECISIONS.md
├─ DECISION-{ID}: Context, Decision, Rationale, Criteria
└─ Feature specs, design choices, expected behavior

AI_PROGRESS_TRACKER.md
├─ Current Sprint: Completed, In Progress, Blocked
├─ Next Priorities: Ranked by importance
└─ Overall Completion: X%

═══════════════════════════════════════════════════════════════════════════════

🔄 WORKFLOW EXAMPLES

Example 1: Bug Fix Workflow
1. Fix bug
2. Task(subagent_type='bug-documenter', prompt='Document bug...')
3. Bug saved to AI_BUGS_KNOWLEDGE.md
4. Future sessions can search and avoid same bug

Example 2: Feature Planning
1. User decides approach
2. Task(subagent_type='decision-documenter', prompt='Document decision...')
3. Decision saved to AI_PRODUCT_DECISIONS.md
4. Implement feature
5. Task(subagent_type='progress-tracker', prompt='Mark feature complete')

Example 3: Sprint Status
User: "What's the status?"
→ Task(subagent_type='progress-tracker', prompt='Show current progress')
→ Agent reads AI_PROGRESS_TRACKER.md and reports

═══════════════════════════════════════════════════════════════════════════════

📚 MORE INFORMATION

• All agents: .claude/agents/
• Agent docs: specs-driven/04-AGENTS/
• Knowledge files: AI_*.md (root directory)

═══════════════════════════════════════════════════════════════════════════════
```

---

## Dynamic Discovery

Read from `.claude/agents/` directory:

```typescript
// Find all agents
const agentFiles = await Glob({ pattern: '.claude/agents/*.md' });

// Parse each agent
for (const file of agentFiles) {
  const content = await Read({ file_path: file });

  // Extract:
  // - name (from frontmatter or filename)
  // - description (from frontmatter)
  // - output file (AI_*.md)
  // - usage examples

  // Display formatted
}
```

---

## Filters

When filter provided, show only matching agents:

```
/agents bug
→ Shows: bug-documenter

/agents decision
→ Shows: decision-documenter

/agents progress
→ Shows: progress-tracker
```

---

**Version**: 1.0.0
**Related**: `/tools`, `/skills`, `/commands`
**Source**: `.claude/agents/` directory
**Outputs**: `AI_BUGS_KNOWLEDGE.md`, `AI_PRODUCT_DECISIONS.md`, `AI_PROGRESS_TRACKER.md`
