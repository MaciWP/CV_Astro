# Security - Overview

**Goal**: Prevent security vulnerabilities through pattern detection and secure coding guidelines.

**Target**: Zero security incidents, 100% secret detection, secure code by default.

---

## The Problem

**Common security vulnerabilities in generated code:**
- **Secrets committed** (API keys, tokens, passwords)
- **SQL injection** (string concatenation in queries)
- **XSS vulnerabilities** (unescaped user input)
- **Path traversal** (accessing files outside project)
- **Command injection** (unsanitized command arguments)

**Impact**: Data breaches, unauthorized access, system compromise

---

## The Solution

**Security pattern detection and prevention:**

1. **Secret Detection** - Scan for API keys before commits
2. **SQL Injection Prevention** - Use parameterized queries
3. **Input Validation** - Sanitize all user inputs
4. **Common Vulnerabilities** - Check OWASP Top 10
5. **Secure Patterns** - Follow security best practices

**Result**: Secure code by default, vulnerabilities caught before deployment

---

## Quick Reference

### Core Security Rules

1. **NEVER commit secrets** - Check for API keys/tokens before git commit
2. **Use parameterized queries** - NO string concatenation in SQL
3. **Validate all inputs** - Sanitize user data before use
4. **Escape outputs** - Prevent XSS when rendering

### When to Load Full Documentation

**Use `/load-security` when:**
- Implementing authentication/authorization
- Working with databases (SQL queries)
- Handling user input (forms, APIs)
- Performing security review/audit
- Deploying to production

---

## Documentation Structure

1. **README.md** (this file) - Overview and quick reference
2. **secret-detection.md** - Regex patterns for detecting secrets
3. **sql-injection.md** - SQL injection patterns and prevention
4. **common-vulnerabilities.md** - OWASP Top 10 adapted for Claude Code
5. **secure-patterns.md** - Secure coding examples

---

## Security Checklist

**Before committing code:**
- [ ] Scan for API keys/tokens (use patterns from secret-detection.md)
- [ ] Check SQL queries are parameterized
- [ ] Verify user inputs are validated
- [ ] Ensure outputs are escaped (prevent XSS)
- [ ] Review file paths (prevent traversal)

**Before deployment:**
- [ ] Run security audit (load-security command)
- [ ] Check authentication/authorization
- [ ] Verify HTTPS/TLS enabled
- [ ] Review environment variables (.env not committed)
- [ ] Test for common vulnerabilities

---

## Common Patterns

### ✅ GOOD: Parameterized Query
```typescript
// Safe - parameters separated
const user = await db.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);
```

### ❌ BAD: String Concatenation
```typescript
// Vulnerable to SQL injection
const user = await db.query(
  `SELECT * FROM users WHERE id = ${userId}`
);
```

### ✅ GOOD: Input Validation
```typescript
// Validate before use
const email = z.string().email().parse(userInput);
```

### ❌ BAD: No Validation
```typescript
// Direct use without validation
const email = userInput;  // Could be anything
```

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **Secret Detection** | 100% | Regex pattern matches |
| **SQL Injection** | 0 occurrences | Pattern detection |
| **XSS Vulnerabilities** | 0 occurrences | Output escaping check |
| **Security Incidents** | 0 | Production monitoring |

---

## Related Documentation

- **secret-detection.md** - API key patterns (OpenAI, GitHub, AWS, etc.)
- **sql-injection.md** - Unsafe SQL patterns and solutions
- **common-vulnerabilities.md** - OWASP Top 10 checklist
- **secure-patterns.md** - Secure code examples

---

**Version**: 1.0.0
**Module**: 13-SECURITY
**Status**: Ready for implementation
**Estimated Impact**: Zero security incidents, 100% secret detection
