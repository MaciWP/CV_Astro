# Skills System Documentation

## Overview

The Skills System is a modular architecture that provides specialized capabilities to Claude Code through reusable, composable skills. Each skill is a focused capability that can be activated when needed, providing domain-specific knowledge and patterns.

## What is a Skill?

A skill is a self-contained capability that:
- **Activates automatically** based on keywords in the description
- **Maintains context** throughout the conversation
- **Provides specialized knowledge** for specific domains (backend, frontend, testing, devops)
- **Uses progressive disclosure** (~100 tokens metadata, expands to ~5KB when activated)

## Skill vs Agent vs Command

| Feature | Skill | Agent | Command |
|---------|-------|-------|---------|
| **Activation** | Automatic (keywords) | Manual (Task tool) | Manual (/command) |
| **Context** | Maintains full context | Separate context | Expands in-place |
| **Lifetime** | Session-long | Single execution | Single execution |
| **Use Case** | Ongoing guidance | Isolated tasks | Quick actions |

**When to use each**:
- **Skill**: Ongoing work requiring context (e.g., building a form with validation)
- **Agent**: Isolated task without context (e.g., security audit of specific file)
- **Command**: Quick action or load documentation (e.g., /load-security)

## Skill Categories

### Backend (15 skills)
**Core** (5):
- api-endpoint-builder - REST/GraphQL API endpoints
- database-query-optimizer - Query optimization, N+1 prevention
- data-validator-generator - Pydantic/Zod validation
- auth-flow-builder - JWT/session authentication
- background-job-scheduler - Celery/BullMQ async tasks

**Extended** (10):
- api-client-generator - OpenAPI client generation
- webhook-handler-builder - Webhook security and idempotency
- rate-limiter-implementer - Token bucket, sliding window
- orm-query-builder - SQLAlchemy/Prisma patterns
- message-queue-handler - Redis Streams, RabbitMQ, Kafka
- cache-strategy-builder - Redis caching patterns
- email-template-builder - MJML responsive emails
- logging-strategy - Structured logging (structlog, pino)
- config-validator - Pydantic/Zod environment validation
- health-check-builder - Kubernetes health probes

### Frontend (18 skills)
**Core** (8):
- form-builder-with-validation - React Hook Form, VeeValidate
- table-datagrid-builder - TanStack Table with sorting/filtering
- state-management-setup - Pinia, Redux Toolkit, Zustand
- api-integration-layer - TanStack Query, SWR
- loading-states-handler - Skeletons, Suspense, Error Boundaries
- toast-notification-system - react-hot-toast, vue-toastification
- theme-dark-mode-setup - Dark mode with system detection
- file-upload-ui - Drag-drop with react-dropzone

**Extended** (10):
- modal-dialog-builder - Headless UI accessible modals
- navigation-routing-setup - React Router, Vue Router
- infinite-scroll-builder - TanStack Query infinite scroll
- drag-drop-builder - dnd-kit sortable lists and Kanban
- search-filter-builder - Debounced search with filters
- autocomplete-builder - Headless UI Combobox with async
- date-picker-setup - react-datepicker, date ranges
- multi-select-builder - Searchable multi-select
- chart-graph-builder - Recharts, Chart.js visualizations
- error-boundary-creator - React Error Boundaries

### Testing + DevOps (6 skills)
- test-suite-generator - Vitest, Jest, Pytest patterns
- mock-data-builder - Faker.js, MSW, Factory Boy
- e2e-scenario-creator - Playwright, Cypress E2E tests
- environment-config-validator - Zod env validation
- dockerfile-optimizer - Multi-stage Docker builds
- cicd-pipeline-builder - GitHub Actions, GitLab CI

### System (10 skills)
- adaptive-meta-orchestrator - Master orchestrator (always active)
- skill-builder - Create new skills
- task-decomposer - Break complex tasks into subtasks
- task-router - Route tasks to optimal agents
- code-analyzer - Code quality analysis
- orchestrator-observability - Performance monitoring
- security-auditor - Vulnerability detection
- spec-architect-agent - Spec-driven development
- utils-builder - Utility function generation
- persistent-memory - Cross-session knowledge

**Total: 49 skills**

## Skill Activation

Skills activate automatically when their keywords appear in the conversation:

```typescript
// Example: This request activates "form-builder-with-validation"
User: "I need to create a login form with email and password validation"

// Keywords detected: "form", "validation", "login"
// Skill activates and provides:
// - React Hook Form patterns
// - Zod validation schemas
// - Accessibility best practices
// - Error handling
```

## Skill Structure

```markdown
---
name: skill-name
description: Brief description with KEYWORDS. Keywords - keyword1, keyword2, keyword3
---

# Skill Title

## When to Use This Skill
- Use case 1
- Use case 2

## What This Skill Does
- Capability 1
- Capability 2

## Supported Technologies
**Category**:
- Technology 1
- Technology 2

## Example: [Technology]
\`\`\`[language]
// Code example
\`\`\`

## Best Practices
1. Practice 1
2. Practice 2

## Integration with Other Skills
- skill-name-1 - Integration description
- skill-name-2 - Integration description

---

**Version**: 1.0.0
**Category**: Category Name
**Complexity**: Low|Medium|High
```

## Creating a New Skill

### 1. Use skill-builder

```typescript
// Activate skill-builder to generate a new skill
Task({
  subagent_type: 'skill-builder',
  prompt: 'Create a skill for [capability] that handles [use case]'
});
```

### 2. Manual Creation

1. **Create directory**: `.claude/skills/[skill-name]/`
2. **Create SKILL.md** with standard structure
3. **Add activation keywords** in description
4. **Provide code examples** for main frameworks
5. **Document integrations** with other skills
6. **Test activation** by using keywords in conversation

### 3. Skill Naming Convention

- Use kebab-case: `api-endpoint-builder`
- Be descriptive: `multi-select-builder` not `select`
- Use action verbs: `builder`, `generator`, `creator`, `implementer`

## Skill Best Practices

### Content Guidelines

1. **Start with "When to Use"** - Clear activation criteria
2. **Multiple examples** - Show 2-3 frameworks (React, Vue, Python)
3. **Code over prose** - Prefer working code examples
4. **Best practices** - Include security, performance, accessibility
5. **Integration** - Reference related skills
6. **Complexity** - Mark as Low, Medium, or High

### Size Guidelines

- **Target**: 3-8KB per skill (~300-800 lines)
- **Minimum**: Include at least 2 code examples
- **Maximum**: Don't exceed 10KB (split into multiple skills)

### Activation Keywords

Include 8-12 keywords in description:
```yaml
description: Build accessible modal dialogs with focus management, keyboard navigation, backdrop, animations. React, Vue 3, Headless UI, Radix UI. Keywords - modal, dialog, popup, overlay, accessible modal, focus trap, keyboard navigation, headless ui
```

## Progressive Disclosure

Skills use progressive disclosure to minimize token usage:

**Phase 1: Metadata (Always loaded)**
```yaml
---
name: api-endpoint-builder
description: Generate REST/GraphQL API endpoints... Keywords - api, rest, graphql
---
```
~100 tokens per skill × 49 skills = **~5KB overhead**

**Phase 2: Full Content (Loaded when activated)**
```markdown
# API Endpoint Builder

## When to Use This Skill
...

[Full content ~5KB]
```

**Result**: Only activated skills consume significant tokens.

## Skill Discovery

Users can discover skills through:

1. **Natural activation** - Use relevant keywords
2. **/skills command** - List all available skills
3. **CLAUDE.md** - Available Resources section
4. **This documentation** - Complete catalog

## Performance Metrics

- **Activation time**: <50ms (keyword matching)
- **Token overhead**: ~100 tokens per skill when not activated
- **Speedup**: 2-10x compared to manual implementation
- **Quality**: Production-ready patterns and best practices

## Skill Lifecycle

```
┌─────────────┐
│   Created   │  skill-builder or manual creation
└──────┬──────┘
       │
┌──────▼──────┐
│  Available  │  Listed in system, waiting for activation
└──────┬──────┘
       │
┌──────▼──────┐
│  Activated  │  Keywords matched, content loaded
└──────┬──────┘
       │
┌──────▼──────┐
│   In Use    │  Providing guidance throughout session
└──────┬──────┘
       │
┌──────▼──────┐
│  Complete   │  Task finished, remains available
└─────────────┘
```

## Maintenance

### Adding a New Skill

1. Create skill in `.claude/skills/[name]/SKILL.md`
2. Update CLAUDE.md "Available Resources" section
3. Test activation with keywords
4. Document in this README

### Updating a Skill

1. Edit `.claude/skills/[name]/SKILL.md`
2. Increment version number
3. Add changelog comment at bottom
4. Test activation still works

### Deprecating a Skill

1. Add deprecation notice at top of SKILL.md
2. Suggest replacement skill
3. Keep file for 3 months before removal

## Examples

### Example 1: Multi-Skill Workflow

```typescript
// User: "I need to build a user management dashboard with authentication,
// a data table, and form validation"

// Activated skills:
// 1. auth-flow-builder - JWT authentication
// 2. table-datagrid-builder - User list with TanStack Table
// 3. form-builder-with-validation - User creation form
// 4. modal-dialog-builder - Edit user modal
// 5. toast-notification-system - Success/error notifications

// All skills work together to provide comprehensive guidance
```

### Example 2: Backend API Development

```typescript
// User: "Create a REST API for a blog with posts, comments, and users"

// Activated skills:
// 1. api-endpoint-builder - REST endpoints
// 2. database-query-optimizer - Prevent N+1 queries
// 3. data-validator-generator - Request validation
// 4. orm-query-builder - SQLAlchemy patterns
// 5. logging-strategy - Structured logging
// 6. health-check-builder - /health endpoint
```

## See Also

- [Skill Creation Guide](./skill-creation-guide.md) - Detailed guide for creating skills
- [Skill Structure](./skill-structure.md) - Template and structure details
- [Available Skills](./available-skills.md) - Complete catalog with examples
- [Agents Documentation](../agents/README.md) - Comparison with agents
- [Commands Documentation](../commands/README.md) - Comparison with commands

---

**Last Updated**: 2025-01-17
**Version**: 1.0.0
**Total Skills**: 49
