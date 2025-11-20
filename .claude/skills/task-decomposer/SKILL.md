---
name: task-decomposer
description: Break down complex tasks into manageable subtasks with clear dependencies. Analyze task complexity and create execution plan. Keywords - break down task, decompose, subtasks, task breakdown, split task, divide task, task planning, task dependencies
version: 1.0.0
---

# Task Decomposer Skill

This skill analyzes complex tasks and decomposes them into smaller, manageable subtasks that can be executed sequentially or in parallel by specialized agents.

## When to Decompose

Decompose tasks when they exhibit these characteristics:

### Complexity Indicators
- **Multiple technologies**: Task mentions 3+ different technologies
- **Multiple phases**: Task has clear stages (design → implement → test → deploy)
- **Multiple agents**: Task requires expertise from different specialized agents
- **Large scope**: Task description is >200 words or mentions "full", "complete", "entire"
- **Ambiguous requirements**: Task needs clarification or research first

### Decomposition Triggers
```
✅ Decompose:
- "Build a full-stack e-commerce application"
- "Implement user authentication, database, and frontend"
- "Research best practices, then implement OAuth 2.0"
- "Create API, write tests, deploy to production"

❌ Don't Decompose:
- "Fix bug in login function"
- "Add validation to email field"
- "Write unit tests for user service"
- "Update documentation for API endpoint"
```

## Decomposition Strategies

### 1. Sequential Decomposition
Tasks that must be done in order, where each depends on the previous:

```
Original: "Research, implement, and deploy OAuth 2.0"

Subtasks:
1. [researcher] Research OAuth 2.0 best practices and libraries
2. [backend-dev] Implement OAuth 2.0 based on research findings
3. [qa-tester] Write tests for OAuth implementation
4. [devops-engineer] Deploy OAuth service to production

Dependencies: 1 → 2 → 3 → 4
```

### 2. Parallel Decomposition
Independent tasks that can be done simultaneously:

```
Original: "Improve application performance and add new features"

Subtasks:
1. [code-reviewer] Analyze performance bottlenecks
2. [backend-dev] Implement new API endpoints
3. [frontend-dev] Create new UI components

Dependencies: None (parallel execution)
```

### 3. Layered Decomposition
Tasks organized by architectural layers:

```
Original: "Build user management system"

Subtasks:
1. [backend-dev] Design database schema for users
2. [backend-dev] Create user API endpoints (CRUD)
3. [frontend-dev] Build user management UI
4. [qa-tester] Write integration tests
5. [devops-engineer] Set up database migrations

Dependencies:
- 2 depends on 1
- 3 depends on 2
- 4 depends on 2,3
- 5 can run parallel with 2
```

### 4. Feature-Based Decomposition
Decompose by features or user stories:

```
Original: "Add authentication to the application"

Subtasks:
1. [backend-dev] Implement user registration
2. [backend-dev] Implement user login
3. [backend-dev] Implement password reset
4. [frontend-dev] Create login/signup forms
5. [qa-tester] Test authentication flow

Dependencies:
- 4 depends on 1,2
- 5 depends on 1,2,3,4
```

## Decomposition Template

For each subtask, provide:

```markdown
## Subtask {n}: {Title}

**Agent**: {agent-type}
**Priority**: {1-10}
**Estimated Duration**: {short/medium/long}
**Dependencies**: {list of subtask IDs or "None"}

**Description**:
{Detailed description of what needs to be done}

**Acceptance Criteria**:
- [ ] {Specific, measurable criterion 1}
- [ ] {Specific, measurable criterion 2}
- [ ] {Specific, measurable criterion 3}

**Input Requirements**:
- {What's needed to start this task}

**Output Deliverables**:
- {What will be produced}

**Notes**:
{Any additional context or considerations}
```

## Complexity Assessment

Calculate task complexity score (1-100):

### Factors:
- **Scope** (0-25): Lines of code, files affected, features added
- **Technical Difficulty** (0-25): New technologies, complex algorithms, integrations
- **Dependencies** (0-25): Number of external systems, services, or APIs
- **Risk** (0-25): Production impact, data sensitivity, security concerns

### Complexity Thresholds:
- **0-25**: Simple (single task, no decomposition)
- **26-50**: Moderate (consider decomposition if >2 agents needed)
- **51-75**: Complex (decompose into 3-5 subtasks)
- **76-100**: Very Complex (decompose into 5-10+ subtasks, may need planning phase)

## Example Decompositions

### Example 1: E-commerce Application

```
Original Task: "Build a complete e-commerce application with user auth, product catalog, shopping cart, and payment processing"

Complexity Score: 95 (Very Complex)

Decomposition:
├── Phase 1: Foundation
│   ├── 1.1 [backend-dev] Design database schema (users, products, orders)
│   ├── 1.2 [backend-dev] Set up project structure and dependencies
│   └── 1.3 [devops-engineer] Configure development environment
│
├── Phase 2: Authentication
│   ├── 2.1 [researcher] Research best auth practices for e-commerce
│   ├── 2.2 [backend-dev] Implement user registration and login
│   ├── 2.3 [frontend-dev] Create login/signup UI
│   └── 2.4 [qa-tester] Test authentication flow
│
├── Phase 3: Product Catalog
│   ├── 3.1 [backend-dev] Create product CRUD APIs
│   ├── 3.2 [frontend-dev] Build product listing page
│   ├── 3.3 [frontend-dev] Build product detail page
│   └── 3.4 [qa-tester] Test product catalog functionality
│
├── Phase 4: Shopping Cart
│   ├── 4.1 [backend-dev] Implement cart API (add, remove, update)
│   ├── 4.2 [frontend-dev] Build cart UI and checkout flow
│   └── 4.3 [qa-tester] Test cart operations
│
├── Phase 5: Payment Processing
│   ├── 5.1 [researcher] Research payment gateway options (Stripe, PayPal)
│   ├── 5.2 [backend-dev] Integrate payment gateway
│   ├── 5.3 [frontend-dev] Create payment UI
│   ├── 5.4 [qa-tester] Test payment flow (including edge cases)
│   └── 5.5 [code-reviewer] Security audit for payment handling
│
└── Phase 6: Deployment
    ├── 6.1 [devops-engineer] Create Docker containers
    ├── 6.2 [devops-engineer] Set up CI/CD pipeline
    ├── 6.3 [devops-engineer] Deploy to staging
    ├── 6.4 [qa-tester] Perform end-to-end testing
    └── 6.5 [devops-engineer] Deploy to production

Total Subtasks: 25
Estimated Duration: 4-6 weeks
```

### Example 2: API Performance Optimization

```
Original Task: "Optimize API performance - it's too slow"

Complexity Score: 45 (Moderate)

Decomposition:
1. [code-reviewer] Analyze API performance bottlenecks
   - Profile API endpoints
   - Identify slow queries
   - Review caching strategy
   Dependencies: None

2. [backend-dev] Optimize database queries
   - Add missing indexes
   - Rewrite N+1 queries
   - Implement query caching
   Dependencies: 1 (needs analysis first)

3. [backend-dev] Implement caching layer
   - Set up Redis
   - Cache frequently accessed data
   - Implement cache invalidation
   Dependencies: 1

4. [qa-tester] Performance testing
   - Load testing with current vs optimized
   - Verify improvement metrics
   - Test cache invalidation
   Dependencies: 2, 3

5. [devops-engineer] Deploy optimizations
   - Deploy Redis to production
   - Update application with optimizations
   - Monitor performance metrics
   Dependencies: 4

Total Subtasks: 5
Estimated Duration: 1-2 weeks
```

## Anti-Patterns (Avoid These)

### ❌ Over-Decomposition
Don't break simple tasks into too many pieces:
```
Bad: "Add button to UI"
→ 1. Research button best practices
→ 2. Design button
→ 3. Implement button
→ 4. Test button
→ 5. Document button

Good: "Add button to UI" (single task for frontend-dev)
```

### ❌ Unclear Dependencies
Always specify dependencies clearly:
```
Bad: "These all need to be done in some order"

Good:
- Task 2 depends on Task 1
- Task 3 depends on Task 1
- Task 4 depends on Task 2, 3
```

### ❌ Missing Context
Each subtask should be self-contained:
```
Bad: "Implement the thing we discussed"

Good: "Implement user authentication using JWT tokens,
       storing users in PostgreSQL, with bcrypt password hashing"
```

## Integration with Task Router

1. **Detect complex tasks** using complexity score
2. **Decompose** if score > 50 or multiple agents needed
3. **Route each subtask** to appropriate agent
4. **Track dependencies** in task metadata
5. **Execute** in correct order (sequential or parallel)

## Metadata Format

For decomposed tasks, store in task metadata:
```json
{
  "is_decomposed": true,
  "parent_task_id": "original-task-id",
  "subtasks": [
    {
      "id": "subtask-1-id",
      "title": "...",
      "agent": "backend-dev",
      "status": "completed",
      "dependencies": []
    },
    {
      "id": "subtask-2-id",
      "title": "...",
      "agent": "frontend-dev",
      "status": "in_progress",
      "dependencies": ["subtask-1-id"]
    }
  ]
}
```

## Usage Guidelines

1. **Always ask** if task is unclear or too vague
2. **Prefer simpler decompositions** over complex ones
3. **Consider parallelization** where possible
4. **Document dependencies** explicitly
5. **Include acceptance criteria** for each subtask
6. **Estimate durations** realistically
7. **Review decomposition** before executing

## Benefits of Decomposition

✅ **Clarity**: Each subtask has clear scope and goals
✅ **Parallelization**: Independent tasks can run simultaneously
✅ **Specialization**: Right expert for each subtask
✅ **Progress Tracking**: See completion of each piece
✅ **Risk Reduction**: Smaller tasks = less risk per task
✅ **Maintainability**: Easier to understand and modify
✅ **Reusability**: Subtasks can be templates for similar work

This skill is essential for handling complex, multi-faceted tasks efficiently!
