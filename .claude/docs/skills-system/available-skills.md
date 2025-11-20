# Available Skills Catalog

Complete catalog of all 49 skills in the system.

## Quick Reference

| Category | Count | Skills |
|----------|-------|--------|
| **Backend Core** | 5 | api-endpoint-builder, database-query-optimizer, data-validator-generator, auth-flow-builder, background-job-scheduler |
| **Backend Extended** | 10 | api-client-generator, webhook-handler-builder, rate-limiter-implementer, orm-query-builder, message-queue-handler, cache-strategy-builder, email-template-builder, logging-strategy, config-validator, health-check-builder |
| **Frontend Core** | 8 | form-builder-with-validation, table-datagrid-builder, state-management-setup, api-integration-layer, loading-states-handler, toast-notification-system, theme-dark-mode-setup, file-upload-ui |
| **Frontend Extended** | 10 | modal-dialog-builder, navigation-routing-setup, infinite-scroll-builder, drag-drop-builder, search-filter-builder, autocomplete-builder, date-picker-setup, multi-select-builder, chart-graph-builder, error-boundary-creator |
| **Testing + DevOps** | 6 | test-suite-generator, mock-data-builder, e2e-scenario-creator, environment-config-validator, dockerfile-optimizer, cicd-pipeline-builder |
| **System** | 10 | adaptive-meta-orchestrator, skill-builder, task-decomposer, task-router, code-analyzer, orchestrator-observability, security-auditor, spec-architect-agent, utils-builder, persistent-memory |

**Total**: 49 skills

---

## Backend Skills (15)

### api-endpoint-builder

**Category**: Backend Core | **Complexity**: Medium

Generate REST/GraphQL API endpoints with FastAPI, Hono, Express. Auto-generates validation, error handling, OpenAPI docs.

**Keywords**: api, rest, graphql, endpoint, fastapi, hono, express, route handler

**Frameworks**: FastAPI (Python), Hono (Bun), Express (Node)

**Use Cases**:
- Creating CRUD endpoints
- Building RESTful APIs
- GraphQL resolvers
- Request/response validation

---

### database-query-optimizer

**Category**: Backend Core | **Complexity**: Medium

Fix N+1 queries, add indexes, optimize database performance with SQLAlchemy, Prisma, TypeORM.

**Keywords**: n+1 query, eager loading, database optimization, index, query performance, sqlalchemy, prisma

**Frameworks**: SQLAlchemy, Prisma, TypeORM, PostgreSQL

**Use Cases**:
- Fixing N+1 query problems
- Adding database indexes
- Query performance analysis
- Eager loading optimization

---

### data-validator-generator

**Category**: Backend Core | **Complexity**: Low-Medium

Generate type-safe validators with Pydantic (Python) and Zod (TypeScript). Request/response validation, custom validators.

**Keywords**: validation, pydantic, zod, schema, type checking, request validation

**Frameworks**: Pydantic, Zod, Yup

**Use Cases**:
- API request validation
- Form data validation
- Environment variable validation
- Database model validation

---

### auth-flow-builder

**Category**: Backend Core | **Complexity**: Medium-High

Implement JWT/session authentication with FastAPI, Express. Includes login, registration, password reset, token refresh.

**Keywords**: authentication, jwt, session, login, auth flow, oauth, password reset

**Frameworks**: FastAPI, Express, Passport.js

**Use Cases**:
- User authentication system
- JWT token generation
- Password hashing and verification
- OAuth integration

---

### background-job-scheduler

**Category**: Backend Core | **Complexity**: Medium

Schedule async tasks with Celery (Python), BullMQ (Node/Bun). Retry logic, cron jobs, priority queues.

**Keywords**: celery, bullmq, background job, async task, queue, redis queue, cron

**Frameworks**: Celery, BullMQ, Redis

**Use Cases**:
- Email sending (async)
- Image processing
- Report generation
- Scheduled tasks (cron)

---

### api-client-generator

**Category**: Backend Extended | **Complexity**: Medium

Generate type-safe API clients from OpenAPI/Swagger specs. Auto-generates request/response types.

**Keywords**: api client, openapi, swagger, type generation, sdk, rest client

**Frameworks**: openapi-typescript, openapi-generator

**Use Cases**:
- SDK generation from API specs
- Type-safe HTTP clients
- API integration

---

### webhook-handler-builder

**Category**: Backend Extended | **Complexity**: Medium-High

Build secure webhook handlers with HMAC signature verification, idempotency, retry logic. Stripe, GitHub, Shopify.

**Keywords**: webhook, hmac, signature verification, idempotency, stripe webhook, github webhook

**Frameworks**: FastAPI, Express, Hono

**Use Cases**:
- Payment webhooks (Stripe)
- Git webhooks (GitHub/GitLab)
- Third-party integrations

---

### rate-limiter-implementer

**Category**: Backend Extended | **Complexity**: Medium

Implement rate limiting with token bucket, sliding window algorithms. Redis-based distributed rate limiting.

**Keywords**: rate limiting, throttling, token bucket, sliding window, redis, api protection

**Frameworks**: Redis, FastAPI, Express

**Use Cases**:
- API rate limiting
- DDoS prevention
- Authentication endpoint protection

---

### orm-query-builder

**Category**: Backend Extended | **Complexity**: Medium

Build optimized ORM queries with eager loading, filtering, pagination. SQLAlchemy, Prisma, TypeORM patterns.

**Keywords**: orm, sqlalchemy, prisma, typeorm, eager loading, query optimization

**Frameworks**: SQLAlchemy, Prisma, TypeORM

**Use Cases**:
- Complex database queries
- Eager loading relationships
- Query performance optimization

---

### message-queue-handler

**Category**: Backend Extended | **Complexity**: High

Handle messages from Redis Streams, RabbitMQ, Kafka. Retry logic, dead letter queues, concurrent processing.

**Keywords**: message queue, redis streams, rabbitmq, kafka, consumer, event driven

**Frameworks**: Redis Streams, RabbitMQ, Kafka

**Use Cases**:
- Event-driven architecture
- Microservices communication
- High-throughput message processing

---

### cache-strategy-builder

**Category**: Backend Extended | **Complexity**: Medium

Implement Redis caching patterns: cache-aside, write-through, cache warming. TTL management, invalidation.

**Keywords**: redis cache, caching strategy, cache invalidation, cache aside, write through

**Frameworks**: Redis, ioredis

**Use Cases**:
- API response caching
- Database query caching
- Session storage

---

### email-template-builder

**Category**: Backend Extended | **Complexity**: Medium

Build responsive HTML email templates with MJML, Jinja2, Handlebars. SendGrid, Mailgun, AWS SES integration.

**Keywords**: email template, mjml, html email, responsive email, sendgrid, transactional email

**Frameworks**: MJML, Jinja2, Handlebars

**Use Cases**:
- Welcome emails
- Password reset emails
- Receipts and invoices

---

### logging-strategy

**Category**: Backend Extended | **Complexity**: Medium

Structured logging with JSON format, contextual info (request ID, user ID). Pino, structlog, Winston.

**Keywords**: structured logging, json logs, winston, pino, python logging, log aggregation

**Frameworks**: structlog, pino, winston

**Use Cases**:
- Application logging
- Request/response logging
- Error tracking

---

### config-validator

**Category**: Backend Extended | **Complexity**: Low-Medium

Validate configuration and environment variables with Pydantic Settings, Zod. Type-safe config loading.

**Keywords**: env validation, config validation, pydantic settings, zod config, environment variables

**Frameworks**: Pydantic Settings, Zod

**Use Cases**:
- Environment variable validation
- Application config loading
- Fail-fast on invalid config

---

### health-check-builder

**Category**: Backend Extended | **Complexity**: Low-Medium

Create health check endpoints for Kubernetes liveness/readiness probes. Check database, Redis, external APIs.

**Keywords**: health check, liveness probe, readiness probe, kubernetes, monitoring, healthz

**Frameworks**: FastAPI, Express, Kubernetes

**Use Cases**:
- Kubernetes health probes
- Monitoring endpoints
- Dependency checking

---

## Frontend Skills (18)

### form-builder-with-validation

**Category**: Frontend Core | **Complexity**: Medium

Build forms with validation using React Hook Form, VeeValidate (Vue 3). Zod schemas, error handling, accessibility.

**Keywords**: form, validation, react hook form, veevalidate, zod, form validation, accessibility

**Frameworks**: React Hook Form, VeeValidate, Zod

**Use Cases**:
- Login/registration forms
- Data entry forms
- Multi-step forms

---

### table-datagrid-builder

**Category**: Frontend Core | **Complexity**: Medium

Build data tables with TanStack Table. Sorting, filtering, pagination, row actions, CSV export.

**Keywords**: table, datagrid, tanstack table, sorting, filtering, pagination, data table

**Frameworks**: TanStack Table, AG Grid

**Use Cases**:
- Admin dashboards
- Data management interfaces
- Report displays

---

### state-management-setup

**Category**: Frontend Core | **Complexity**: Medium

Setup global state management with Pinia (Vue 3), Redux Toolkit, Zustand. TypeScript types, persistence.

**Keywords**: state management, pinia, redux, zustand, global state, store

**Frameworks**: Pinia, Redux Toolkit, Zustand

**Use Cases**:
- User authentication state
- Shopping cart state
- App-wide settings

---

### api-integration-layer

**Category**: Frontend Core | **Complexity**: Medium

Integrate APIs with TanStack Query, SWR. Caching, optimistic updates, automatic retries.

**Keywords**: tanstack query, react query, swr, api integration, caching, data fetching

**Frameworks**: TanStack Query, SWR, Axios

**Use Cases**:
- REST API integration
- Data caching
- Optimistic UI updates

---

### loading-states-handler

**Category**: Frontend Core | **Complexity**: Low-Medium

Handle loading states with skeletons, Suspense, Error Boundaries. Smooth UX during async operations.

**Keywords**: loading state, skeleton, suspense, error boundary, loading spinner

**Frameworks**: React Suspense, Vue Suspense

**Use Cases**:
- Async data loading
- Form submissions
- Page transitions

---

### toast-notification-system

**Category**: Frontend Core | **Complexity**: Low

Display toast notifications with react-hot-toast, vue-toastification. Success, error, warning, info types.

**Keywords**: toast, notification, alert, snackbar, react hot toast, vue toastification

**Frameworks**: react-hot-toast, vue-toastification

**Use Cases**:
- Success/error messages
- User feedback
- Temporary alerts

---

### theme-dark-mode-setup

**Category**: Frontend Core | **Complexity**: Low-Medium

Implement dark mode with system preference detection. Tailwind CSS dark mode, localStorage persistence.

**Keywords**: dark mode, theme, light dark toggle, tailwind dark mode, system preference

**Frameworks**: Tailwind CSS, CSS variables

**Use Cases**:
- Light/dark theme toggle
- System preference detection
- Theme persistence

---

### file-upload-ui

**Category**: Frontend Core | **Complexity**: Medium

Build file upload UI with drag-drop, preview, progress bars. react-dropzone, validation (size/type).

**Keywords**: file upload, drag drop, dropzone, file preview, upload progress

**Frameworks**: react-dropzone, Vue drag-drop

**Use Cases**:
- Image uploads
- Document uploads
- Drag-and-drop interfaces

---

### modal-dialog-builder

**Category**: Frontend Extended | **Complexity**: Medium

Build accessible modals with Headless UI. Focus management, keyboard navigation, animations.

**Keywords**: modal, dialog, popup, overlay, headless ui, focus trap, keyboard navigation

**Frameworks**: Headless UI, Radix UI

**Use Cases**:
- Confirmation dialogs
- Form modals
- Image viewers

---

### navigation-routing-setup

**Category**: Frontend Extended | **Complexity**: Medium

Setup routing with React Router, Vue Router. Protected routes, nested routes, breadcrumbs.

**Keywords**: routing, navigation, react router, vue router, protected routes, nested routes

**Frameworks**: React Router, Vue Router

**Use Cases**:
- SPA routing
- Protected routes (auth required)
- Nested layouts

---

### infinite-scroll-builder

**Category**: Frontend Extended | **Complexity**: Medium

Implement infinite scroll with TanStack Query, Intersection Observer. Virtual scrolling for large lists.

**Keywords**: infinite scroll, lazy loading, pagination, intersection observer, virtual scroll

**Frameworks**: TanStack Query, react-virtual

**Use Cases**:
- Social media feeds
- Product catalogs
- Large data lists

---

### drag-drop-builder

**Category**: Frontend Extended | **Complexity**: Medium-High

Implement drag-and-drop with dnd-kit. Sortable lists, Kanban boards, touch support.

**Keywords**: drag and drop, dnd kit, sortable, draggable, kanban, reorder

**Frameworks**: dnd-kit, react-beautiful-dnd

**Use Cases**:
- Sortable lists
- Kanban boards
- Dashboard builders

---

### search-filter-builder

**Category**: Frontend Extended | **Complexity**: Medium

Build search with debounce and multi-select filters. URL state sync, filter chips.

**Keywords**: search, filter, debounce, multi filter, faceted search, filter chips

**Frameworks**: use-debounce, TanStack Table

**Use Cases**:
- Product search
- Data table filters
- Advanced search interfaces

---

### autocomplete-builder

**Category**: Frontend Extended | **Complexity**: Medium

Build autocomplete with Headless UI Combobox. Async search, keyboard navigation, highlighted matches.

**Keywords**: autocomplete, combobox, typeahead, search suggestions, headless ui combobox

**Frameworks**: Headless UI, Downshift

**Use Cases**:
- Search inputs
- Tag selection
- User mentions

---

### date-picker-setup

**Category**: Frontend Extended | **Complexity**: Low-Medium

Setup date pickers with react-datepicker. Date ranges, time picker, timezone support.

**Keywords**: date picker, calendar, date range, time picker, react datepicker

**Frameworks**: react-datepicker, @vuepic/vue-datepicker

**Use Cases**:
- Booking forms
- Date range selection
- Scheduling interfaces

---

### multi-select-builder

**Category**: Frontend Extended | **Complexity**: Medium

Build multi-select dropdowns with Headless UI. Search, select all, selected chips.

**Keywords**: multi select, multiple select, checkbox select, searchable select, headless ui listbox

**Frameworks**: Headless UI, React Select

**Use Cases**:
- Tag selection
- Filter selection
- Permission assignment

---

### chart-graph-builder

**Category**: Frontend Extended | **Complexity**: Medium

Build charts with Recharts, Chart.js. Line, bar, pie charts, real-time data visualization.

**Keywords**: chart, graph, data visualization, recharts, chart js, line chart, bar chart

**Frameworks**: Recharts, Chart.js

**Use Cases**:
- Analytics dashboards
- Data visualization
- Real-time monitoring

---

### error-boundary-creator

**Category**: Frontend Extended | **Complexity**: Medium

Create error boundaries for React. Fallback UI, error logging to Sentry, error recovery.

**Keywords**: error boundary, error handling, react error, fallback ui, sentry

**Frameworks**: React (class components), react-error-boundary

**Use Cases**:
- Prevent app crashes
- Graceful error handling
- Error logging

---

## Testing + DevOps Skills (6)

### test-suite-generator

**Category**: Testing | **Complexity**: Medium

Generate test suites with Vitest, Jest, Pytest. Unit tests, integration tests, mocking, assertions.

**Keywords**: testing, unit tests, integration tests, vitest, jest, pytest, test coverage

**Frameworks**: Vitest, Jest, Pytest

**Use Cases**:
- Component testing
- API endpoint testing
- Function testing

---

### mock-data-builder

**Category**: Testing | **Complexity**: Low-Medium

Generate mock data with Faker.js, MSW. Factory pattern, API mocking, test fixtures.

**Keywords**: mock data, faker, msw, test fixtures, factory pattern, seed data

**Frameworks**: Faker.js, MSW, Factory Boy

**Use Cases**:
- Test data generation
- API mocking during development
- Database seeding

---

### e2e-scenario-creator

**Category**: Testing | **Complexity**: Medium-High

Create E2E tests with Playwright, Cypress. User flows, authentication, visual regression.

**Keywords**: e2e testing, playwright, cypress, end to end, user flows, visual testing

**Frameworks**: Playwright, Cypress

**Use Cases**:
- Complete user journeys
- Authentication flows
- Cross-browser testing

---

### environment-config-validator

**Category**: DevOps | **Complexity**: Low-Medium

Validate .env files with Zod, envalid. Check required variables, type validation, generate .env.example.

**Keywords**: env validation, dotenv, environment variables, config validation, zod

**Frameworks**: Zod, envalid, Pydantic Settings

**Use Cases**:
- Startup validation
- CI/CD environment checks
- Config documentation

---

### dockerfile-optimizer

**Category**: DevOps | **Complexity**: Medium

Create optimized Dockerfiles with multi-stage builds. Alpine images, layer caching, security.

**Keywords**: dockerfile, docker optimization, multi stage build, alpine, container, image size

**Frameworks**: Docker, Docker Compose

**Use Cases**:
- Production Docker images
- Development environments
- CI/CD build optimization

---

### cicd-pipeline-builder

**Category**: DevOps | **Complexity**: Medium-High

Create CI/CD pipelines with GitHub Actions, GitLab CI. Automated testing, building, deployment.

**Keywords**: ci cd, github actions, gitlab ci, continuous integration, deployment, pipeline

**Frameworks**: GitHub Actions, GitLab CI

**Use Cases**:
- Automated testing
- Docker image building
- Production deployment

---

## System Skills (10)

### adaptive-meta-orchestrator

**Category**: System | **Complexity**: High

Master orchestrator that analyzes, routes, and executes workflows. Auto-detects project context and coordinates specialist agents.

**Keywords**: orchestrator, workflow, task routing, meta orchestration

**Always Active**: Yes (REQUIRED for all workflows)

---

### skill-builder

**Category**: System | **Complexity**: Medium

Create new skills based on patterns and requirements. Auto-generates skill structure with examples.

**Keywords**: create skill, skill generation, new skill

---

### task-decomposer

**Category**: System | **Complexity**: Medium

Break complex tasks into manageable subtasks with clear dependencies.

**Keywords**: task breakdown, decompose, subtasks, planning

---

### task-router

**Category**: System | **Complexity**: Medium

Intelligent routing of tasks to optimal agents based on task analysis.

**Keywords**: task routing, agent selection, workflow routing

---

### code-analyzer

**Category**: System | **Complexity**: Medium

Systematic code analysis for quality, security, and performance issues.

**Keywords**: code analysis, code quality, code review, static analysis

---

### orchestrator-observability

**Category**: System | **Complexity**: Medium

Monitor orchestrator performance, track metrics, detect bottlenecks.

**Keywords**: monitoring, metrics, performance, observability

---

### security-auditor

**Category**: System | **Complexity**: High

Detect security vulnerabilities: SQL injection, XSS, secrets, authentication issues.

**Keywords**: security, vulnerability, sql injection, xss, secrets

---

### spec-architect-agent

**Category**: System | **Complexity**: High

Spec-driven development with Given-When-Then (BDD) specifications.

**Keywords**: specification, bdd, given when then, spec driven

---

### utils-builder

**Category**: System | **Complexity**: Low-Medium

Generate utility functions for common tasks (validation, formatting, etc.).

**Keywords**: utility, helper, util function, common functions

---

### persistent-memory

**Category**: System | **Complexity**: Medium

Cross-session knowledge retention with MCP memory server.

**Keywords**: memory, persistence, knowledge graph, cross session

---

## Usage Tips

### Finding Skills

1. **By keyword**: Use natural language, skills activate automatically
2. **By category**: Browse Backend, Frontend, Testing, DevOps, System
3. **By framework**: Search for specific technologies (React, Vue, Python)
4. **By use case**: Think about what you're building

### Combining Skills

Many tasks benefit from multiple skills working together:

```typescript
// Example: Building a user dashboard
// Activated skills:
// 1. auth-flow-builder - Authentication
// 2. table-datagrid-builder - User list
// 3. form-builder-with-validation - User creation
// 4. modal-dialog-builder - Edit user modal
// 5. toast-notification-system - Notifications
// 6. api-integration-layer - API calls
```

### Skill Activation

Skills activate automatically when you use their keywords:

```
✅ "I need to add pagination to my table"
   → Activates: table-datagrid-builder, pagination patterns

✅ "Build a login form with JWT authentication"
   → Activates: form-builder-with-validation, auth-flow-builder

✅ "Setup CI/CD with GitHub Actions"
   → Activates: cicd-pipeline-builder
```

---

**Last Updated**: 2025-01-17
**Total Skills**: 49
**Version**: 1.0.0
