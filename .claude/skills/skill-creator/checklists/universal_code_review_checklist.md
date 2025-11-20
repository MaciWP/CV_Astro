# Universal Code Review Checklist

**Purpose**: Comprehensive 45-point code review checklist for ANY tech stack (React, Flutter, FastAPI, Spring Boot, Go, etc.)

**Target**: ≥40/45 items passing before code merge

**Usage**: Run this checklist when reviewing pull requests, feature implementations, or refactoring sessions.

---

## A. Code Quality & Standards (10 items)

### Linting & Formatting
- [ ] **A1**: Linter passes with 0 errors (`eslint`, `flake8`, `flutter analyze`, `golint`)
- [ ] **A2**: Code formatted with project formatter (`prettier`, `black`, `dart format`, `gofmt`)
- [ ] **A3**: No linter suppressions without justification (`// eslint-disable`, `# noqa`, `// ignore:`)

### Naming Conventions
- [ ] **A4**: Classes/Components use PascalCase (`UserService`, `ProductCard`)
- [ ] **A5**: Functions/methods use camelCase (`getUserById`, `calculateTotal`) or snake_case (Python)
- [ ] **A6**: Constants use SCREAMING_SNAKE_CASE or lowerCamelCase (depending on language)
- [ ] **A7**: Variable names descriptive (not `x`, `temp`, `data1`)

### Code Smells
- [ ] **A8**: No magic numbers (use named constants: `const MAX_RETRIES = 3`)
- [ ] **A9**: No god classes (>300 lines) or god functions (>50 lines)
- [ ] **A10**: No deep nesting (>3 levels) - use early returns

---

## B. Architecture & Design Patterns (8 items)

### Dependency Injection
- [ ] **B1**: Services/dependencies injected via constructor (not `new` in business logic)
- [ ] **B2**: Dependencies use interface types (IUserService, IDatabase, Protocol)
- [ ] **B3**: No global singletons with mutable state

### SOLID Principles
- [ ] **B4**: Single Responsibility - each class/function has ONE clear purpose
- [ ] **B5**: Open/Closed - new features extend, don't modify existing code
- [ ] **B6**: Liskov Substitution - subclasses can replace base classes
- [ ] **B7**: Dependency Inversion - depend on abstractions, not concrete implementations

### Separation of Concerns
- [ ] **B8**: Business logic in services, NOT in UI components/controllers

---

## C. Error Handling (7 items)

### Exception Handling
- [ ] **C1**: All error-prone operations wrapped in try/catch (API calls, file I/O, parsing)
- [ ] **C2**: Errors logged with context (error message, stack trace, relevant data)
- [ ] **C3**: User-facing errors have clear messages (not "Error: undefined")

### HTTP Status Codes (APIs)
- [ ] **C4**: Client errors use 4xx codes (400, 404, 409, 422)
- [ ] **C5**: Server errors use 5xx codes (500, 503)
- [ ] **C6**: Success codes correct (200 GET, 201 POST, 204 DELETE)

### Result Types (Functional)
- [ ] **C7**: Functions return Result<T, E> or Option<T> for error handling (if applicable)

---

## D. Testing (10 items)

### Test Coverage
- [ ] **D1**: New code has ≥80% test coverage (`pytest --cov`, `jest --coverage`, `flutter test --coverage`)
- [ ] **D2**: Critical paths have 100% coverage (auth, payments, data persistence)
- [ ] **D3**: All tests pass (`npm test`, `pytest`, `flutter test`)

### Test Quality
- [ ] **D4**: Tests follow AAA pattern (Arrange-Act-Assert)
- [ ] **D5**: Test names descriptive (`test_should_create_user_when_valid_data`)
- [ ] **D6**: One logical assertion per test (not 10 asserts in one test)
- [ ] **D7**: External dependencies mocked (database, APIs, filesystem)

### Test Types
- [ ] **D8**: Unit tests for business logic (<100ms per test)
- [ ] **D9**: Integration tests for feature flows (with mocked external services)
- [ ] **D10**: Edge cases tested (null, empty, max values, invalid input)

---

## E. Security (5 items)

### Data Protection
- [ ] **E1**: No hardcoded secrets (API keys, passwords) in code
- [ ] **E2**: Sensitive data encrypted at rest and in transit (HTTPS, database encryption)
- [ ] **E3**: User input validated and sanitized (SQL injection, XSS prevention)

### Authentication & Authorization
- [ ] **E4**: Authentication required for protected endpoints/screens
- [ ] **E5**: Authorization checks present (user can only access their data)

---

## F. Performance (5 items)

### Algorithmic Efficiency
- [ ] **F1**: No O(n²) algorithms where O(n) or O(log n) possible
- [ ] **F2**: Database queries use indexes on filtered fields
- [ ] **F3**: Pagination implemented for large result sets (>100 items)

### Resource Management
- [ ] **F4**: Resources disposed properly (file handles, database connections, streams)
- [ ] **F5**: No memory leaks (event listeners removed, subscriptions cancelled)

---

## G. Documentation (5 items)

### Code Documentation
- [ ] **G1**: Public APIs have doc comments (JSDoc, docstrings, Dartdoc)
- [ ] **G2**: Complex algorithms have explanation comments
- [ ] **G3**: Function parameters and return types documented

### README/Docs
- [ ] **G4**: README updated if new features added
- [ ] **G5**: API docs updated (OpenAPI, Swagger, Postman collection)

---

## H. Database & Data (5 items)

### Schema & Queries
- [ ] **H1**: Database schema changes include migration scripts
- [ ] **H2**: Queries use prepared statements/parameterized queries (SQL injection prevention)
- [ ] **H3**: Indexes present on filtered/sorted fields

### Data Integrity
- [ ] **H4**: Foreign key constraints enforced (referential integrity)
- [ ] **H5**: Transactions used for multi-table operations (atomicity)

---

## Tech Stack Specific Checks

### React/TypeScript
- [ ] TypeScript strict mode enabled (`strict: true` in tsconfig.json)
- [ ] Components use hooks correctly (dependency arrays, no stale closures)
- [ ] Props typed with interfaces (not `any`)

### Flutter/Dart
- [ ] Widgets use `const` constructors where possible (performance)
- [ ] State management follows pattern (Riverpod, Bloc, Provider)
- [ ] No `setState` in StatelessWidget

### Python (FastAPI/Django)
- [ ] Type hints present on function signatures
- [ ] Virtual environment used (venv, poetry)
- [ ] Pydantic models for request/response validation (FastAPI)

### Spring Boot/Java
- [ ] Dependency injection via `@Autowired` or constructor injection
- [ ] Proper exception hierarchy (`@ControllerAdvice` for global handling)
- [ ] Lombok used to reduce boilerplate (`@Data`, `@Builder`)

---

## Scoring

**Calculation**:
- Total items: 45 (universal) + 3-5 (tech-specific) = ~50 items
- Passing threshold: ≥40/50 (80%)
- Target: ≥45/50 (90%)

**Priority Levels**:

| Priority | Items | Blocker? |
|----------|-------|----------|
| **Critical** | A1-A3, B1-B2, C1-C2, D1, D3, E1-E5 | Yes (cannot merge) |
| **High** | A4-A10, B3-B8, C3-C7, D2, D4-D7 | Should fix before merge |
| **Medium** | D8-D10, F1-F5, G1-G5, H1-H5 | Can merge, file follow-up issue |

---

## Usage Instructions

### When to Use
- **Pull Request Review**: Before approving PR
- **Pre-Merge**: Final check before merging to main/master
- **Refactoring**: Validate refactored code meets standards
- **Onboarding**: Teach new team members code quality expectations

### How to Use
1. Open the pull request or feature branch
2. Review code against each checklist section (A→H)
3. Mark items [ ] or [x]
4. Calculate score: (checked items / total items) × 100
5. If <80%, request changes
6. If ≥90%, approve and merge

### Common Failure Points
- **A1-A2**: Forgetting to run linter/formatter (30% fail here)
- **D1**: Insufficient test coverage (40% fail here)
- **E1**: Hardcoded secrets accidentally committed (10% fail here)
- **B1**: Services instantiated with `new` instead of DI (20% fail here)

---

## Example Review

**PR**: "Add user profile editing feature" (React + TypeScript)

**Universal Checklist**:
- A: 9/10 ⚠️ (One magic number: `setTimeout(callback, 5000)`)
- B: 8/8 ✅ (DI used, SOLID principles)
- C: 7/7 ✅ (Try/catch, error logging, clear messages)
- D: 9/10 ⚠️ (77% coverage, need 80%+)
- E: 5/5 ✅ (No secrets, input validated)
- F: 5/5 ✅ (Efficient, no leaks)
- G: 4/5 ⚠️ (Missing API docs update)
- H: N/A (no database changes)

**React-Specific**:
- TypeScript strict: ✅
- Hooks correct: ✅
- Props typed: ✅

**Score**: 47/50 = 94% ✅ **PASS**

**Minor Issues**:
- A8: Extract magic number to `const DEBOUNCE_DELAY = 5000`
- D1: Add 2 more unit tests to reach 80% coverage
- G5: Update API docs with new /users/:id/profile endpoint

**Verdict**: Approve with minor changes

---

## Automation

**Tools to Automate Checks**:

| Check | Tool | Command |
|-------|------|---------|
| **A1** Linting | ESLint, flake8, golint | `npm run lint`, `flake8 .`, `golint ./...` |
| **A2** Formatting | Prettier, black, gofmt | `npm run format`, `black .`, `gofmt -w .` |
| **D1** Coverage | Jest, pytest, coverage.py | `jest --coverage`, `pytest --cov` |
| **D3** Tests pass | npm test, pytest | `npm test`, `pytest`, `flutter test` |
| **E1** Secret detection | git-secrets, truffleHog | `git-secrets --scan`, `trufflehog .` |
| **F2** Query analysis | EXPLAIN, Django Debug Toolbar | `EXPLAIN SELECT ...` |

**CI/CD Integration**:
- Add linting/formatting checks to pre-commit hooks
- Run tests on every PR (GitHub Actions, GitLab CI)
- Block merge if tests fail or coverage <80%
- Use Danger.js or ReviewDog to automate checklist comments

---

**Last Updated**: 2025-10-20
**Version**: 1.0.0
**Checklist Items**: 45 universal + 3-5 tech-specific = ~50 total
