---
name: code-analyzer
description: Systematic code analysis for quality, security, and performance. Detect code smells, complexity, vulnerabilities, and maintainability issues. Keywords - code analysis, analyze code, code quality, code review, static analysis, code metrics, complexity analysis, code smell detection
version: 1.0.0
---

# Code Analyzer Skill

Analyze code for quality, security vulnerabilities, performance issues, and maintainability.

## Analysis Checklist

### Security
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] No hardcoded credentials
- [ ] Proper input validation
- [ ] Secure authentication/authorization
- [ ] No command injection risks

### Performance
- [ ] No N+1 query problems
- [ ] Efficient algorithms (time/space complexity)
- [ ] Proper caching where needed
- [ ] No memory leaks
- [ ] Optimized database queries

### Code Quality
- [ ] Clear, descriptive naming
- [ ] Functions < 50 lines
- [ ] Low cyclomatic complexity (< 10)
- [ ] DRY principle followed
- [ ] Proper error handling
- [ ] Good documentation

### Maintainability
- [ ] Consistent code style
- [ ] Type hints/annotations
- [ ] No dead code
- [ ] Clear file organization
- [ ] Test coverage > 80%

## Common Issues

### Critical
- SQL injection
- Hardcoded secrets
- Missing authentication
- Command injection

### High
- N+1 queries
- Missing error handling
- Security misconfigurations
- Performance bottlenecks

### Medium
- Code duplication
- Long functions
- Missing tests
- Poor documentation

### Low
- Naming conventions
- Code formatting
- Minor optimizations
- TODO comments

Use this for comprehensive code reviews!
