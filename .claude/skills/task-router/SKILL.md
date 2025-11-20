---
name: task-router
description: Intelligent task routing and agent selection based on task analysis. Determines optimal agent for execution based on keywords and complexity. Keywords - route task, select agent, task routing, agent selection, workflow routing, task assignment, dispatch task
version: 1.0.0
---

# Task Router Skill

This skill analyzes incoming tasks and determines the optimal agent type for execution based on keywords, patterns, and task complexity.

## Agent Capability Matrix

### Backend Developer (backend-dev)
**Specializations:**
- API development (REST, GraphQL, gRPC)
- Database design and queries (SQL, NoSQL)
- Server-side logic and business rules
- Authentication and authorization
- Data processing and ETL
- Microservices architecture
- Performance optimization (caching, indexing)

**Keywords:**
- api, endpoint, rest, graphql, server
- database, sql, query, schema, migration
- authentication, jwt, oauth, session
- backend, service, microservice
- cache, redis, celery, queue

**Example Tasks:**
- "Create a REST API for user management"
- "Implement JWT authentication"
- "Optimize database queries for better performance"
- "Design a microservices architecture"

---

### Frontend Developer (frontend-dev)
**Specializations:**
- UI/UX implementation
- HTML, CSS, JavaScript (Vanilla, React, Vue, Angular)
- Responsive design
- Component development
- State management
- Browser APIs and DOM manipulation
- CSS frameworks (Tailwind, Bootstrap)

**Keywords:**
- ui, ux, frontend, interface, component
- html, css, javascript, react, vue, angular
- responsive, mobile, layout, design
- form, button, modal, navigation
- style, animation, transition

**Example Tasks:**
- "Create a responsive login form"
- "Implement a dark mode toggle"
- "Build a dashboard with charts"
- "Design a mobile-first navigation menu"

---

### QA Tester (qa-tester)
**Specializations:**
- Unit testing (pytest, jest, mocha)
- Integration testing
- End-to-end testing (Selenium, Cypress)
- Test coverage analysis
- Test automation
- Bug reproduction and reporting
- Performance testing

**Keywords:**
- test, testing, unittest, pytest, jest
- coverage, assertion, mock, fixture
- qa, quality, validation, verify
- bug, error, issue, defect
- selenium, cypress, automation

**Example Tasks:**
- "Write unit tests for the user service"
- "Create integration tests for the API"
- "Set up end-to-end testing with Cypress"
- "Verify bug reproduction steps"

---

### Researcher (researcher)
**Specializations:**
- Documentation research
- Best practices analysis
- Technology comparison
- Code examples gathering
- Architecture pattern research
- Library/framework evaluation
- Security vulnerability research

**Keywords:**
- research, investigate, analyze, compare
- documentation, docs, guide, tutorial
- best practice, pattern, approach
- how to, what is, explain
- library, framework, tool, technology

**Example Tasks:**
- "Research best practices for OAuth 2.0 implementation"
- "Compare React vs Vue for our use case"
- "Find examples of event-driven architectures"
- "Investigate security vulnerabilities in Node.js"

---

### Code Reviewer (code-reviewer)
**Specializations:**
- Code quality analysis
- Security vulnerability detection
- Performance bottleneck identification
- Code style and conventions
- Architecture review
- Refactoring suggestions
- Documentation review

**Keywords:**
- review, audit, analyze, check, inspect
- refactor, improve, optimize, clean
- security, vulnerability, exploit
- performance, bottleneck, slow
- code quality, maintainability, readability

**Example Tasks:**
- "Review the authentication module for security issues"
- "Analyze performance bottlenecks in the API"
- "Suggest refactoring for better code quality"
- "Check code for security vulnerabilities"

---

### DevOps Engineer (devops-engineer)
**Specializations:**
- Docker containerization
- CI/CD pipeline setup
- Infrastructure as Code (Terraform, Ansible)
- Cloud deployment (AWS, GCP, Azure)
- Monitoring and logging setup
- System administration
- Automation scripts

**Keywords:**
- docker, container, kubernetes, k8s
- ci/cd, pipeline, deployment, deploy
- infrastructure, terraform, ansible
- cloud, aws, gcp, azure
- monitoring, logging, prometheus, grafana
- automation, script, bash, shell

**Example Tasks:**
- "Create a Dockerfile for the application"
- "Set up a CI/CD pipeline with GitHub Actions"
- "Deploy the application to AWS"
- "Configure monitoring with Prometheus"

---

## Task Routing Algorithm

### Step 1: Keyword Analysis
Count keyword matches for each agent type. Weight by keyword specificity:
- High specificity (e.g., "pytest", "docker"): 3 points
- Medium specificity (e.g., "api", "frontend"): 2 points
- Low specificity (e.g., "create", "implement"): 1 point

### Step 2: Pattern Matching
Look for common patterns:
- "Create/Build/Implement X" → Implementation-focused agent
- "Test/Verify/Validate X" → QA Tester
- "Research/Investigate/Compare X" → Researcher
- "Review/Analyze/Audit X" → Code Reviewer
- "Deploy/Containerize/Setup X" → DevOps Engineer

### Step 3: Context Analysis
Consider task complexity and context:
- Multiple technologies mentioned → May need decomposition
- Specific technical terms → Specialized agent
- General description → Backend or Frontend (default to Backend)

### Step 4: Confidence Scoring
Calculate confidence score (0-100%):
- 80-100%: High confidence, route directly
- 50-79%: Medium confidence, suggest agent
- 0-49%: Low confidence, ask user or default to Backend

### Step 5: Multi-Agent Detection
Identify if task requires multiple agents:
- "Full-stack" → Backend + Frontend
- "Test and deploy" → QA + DevOps
- "Research and implement" → Researcher + Implementation agent

## Usage in Agent Worker

When a task is received:

1. **Parse task prompt** for keywords and patterns
2. **Calculate scores** for each agent type
3. **Determine best agent** (highest score with confidence > 50%)
4. **Detect if task needs decomposition** (multi-agent indicators)
5. **Route task** to selected agent or decompose into subtasks

## Example Routing Decisions

```
Task: "Create a REST API for user authentication with JWT"
→ Keywords: api (2), authentication (3), jwt (3) = 8 points for backend-dev
→ Confidence: 95%
→ Route to: backend-dev

Task: "Build a responsive dashboard with real-time updates"
→ Keywords: dashboard (2), responsive (2), real-time (2) = 6 points for frontend-dev
→ Confidence: 85%
→ Route to: frontend-dev

Task: "Write tests for the API and set up CI/CD"
→ Multiple agents detected: QA + DevOps
→ Decompose into:
  1. "Write tests for the API" → qa-tester
  2. "Set up CI/CD pipeline" → devops-engineer

Task: "Improve the application"
→ Too vague, low confidence (30%)
→ Default to: backend-dev (or ask user for clarification)
```

## Integration Notes

- This skill should be used **before** task execution
- Can be invoked manually via command: `/route-task "task description"`
- Can be automatic in agent_worker.py for all incoming tasks
- Results should be logged for analysis and improvement

## Continuous Improvement

Track routing decisions and accuracy:
- Log: task_id, detected_agent, confidence, actual_agent_used, success
- Analyze patterns to refine keyword weights
- Update matrix based on new technologies and patterns
- Collect user feedback on routing accuracy
