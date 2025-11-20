---
description: Load comprehensive security patterns for vulnerability detection
---

# Load Security Patterns

Load detailed security documentation for detecting and preventing vulnerabilities.

## Usage

```
/load-security
```

---

## What This Command Does

Loads **comprehensive security patterns** into context:

1. **README.md** (3.2 KB) - Overview, quick reference
2. **secret-detection.md** (8.5 KB) - Regex patterns for API keys/tokens
3. **sql-injection.md** (9.2 KB) - SQL injection detection and prevention
4. **common-vulnerabilities.md** (4.1 KB) - OWASP Top 10 checklist
5. **secure-patterns.md** (3.8 KB) - Secure coding examples

**Total**: ~29 KB of security patterns and prevention strategies

---

## When to Use

Load security patterns when:

### Security-Critical Tasks
- Implementing authentication/authorization
- Working with databases (SQL queries)
- Handling user input (forms, APIs)
- File operations with user paths
- Executing shell commands

### Security Reviews
- Performing security audit
- Code review for vulnerabilities
- Before production deployment
- After implementing new features

### Vulnerability Detection
- Scanning for API keys before commit
- Checking SQL injection risks
- Validating XSS prevention
- Reviewing access control

---

## What You'll Learn

### 1. Secret Detection (100% detection rate)

**9 Comprehensive patterns**:
- OpenAI API keys: `sk-[a-zA-Z0-9]{48}`
- GitHub tokens: `gh[opsr]_[a-zA-Z0-9]{36,255}`
- AWS keys: `AKIA[0-9A-Z]{16}`
- Google API keys, Anthropic keys, Stripe keys
- Generic passwords, bearer tokens, private keys

**Usage**: Scan before git commit

---

### 2. SQL Injection Prevention (Zero vulnerabilities)

**Vulnerable patterns**:
- String concatenation: `query = "SELECT * WHERE id = " + userId`
- Template literals: `` query = `SELECT * WHERE id = ${userId}` ``

**Secure patterns**:
- Parameterized queries: `query('SELECT * WHERE id = $1', [userId])`
- ORM/Query builders (Prisma, Drizzle, Kysely)

---

### 3. Common Vulnerabilities (OWASP Top 10)

- SQL Injection
- XSS (Cross-Site Scripting)
- Path Traversal
- Command Injection
- Insecure Deserialization
- Authentication Bypass
- Security Misconfiguration
- Sensitive Data Exposure
- Broken Access Control
- Insufficient Logging

---

### 4. Secure Coding Patterns

- Input validation (Zod schemas)
- Password hashing (bcrypt)
- JWT authentication
- Output escaping (XSS prevention)
- CSRF protection
- Rate limiting

---

## Execute Reads

This command will load all security documentation:

```typescript
// 1. Read overview
await Read({ file_path: '.claude/docs/security/README.md' });

// 2. Read secret detection patterns
await Read({ file_path: '.claude/docs/security/secret-detection.md' });

// 3. Read SQL injection prevention
await Read({ file_path: '.claude/docs/security/sql-injection.md' });

// 4. Read common vulnerabilities
await Read({ file_path: '.claude/docs/security/common-vulnerabilities.md' });

// 5. Read secure patterns
await Read({ file_path: '.claude/docs/security/secure-patterns.md' });
```

---

## Security Checklist (After Loading)

**Before committing code:**
- [ ] Scan for API keys/tokens (secret-detection patterns)
- [ ] Check SQL queries are parameterized
- [ ] Verify user inputs are validated
- [ ] Ensure outputs are escaped (XSS prevention)
- [ ] Review file paths (path traversal)

**Before deployment:**
- [ ] Run full security audit
- [ ] Check authentication/authorization
- [ ] Verify HTTPS/TLS enabled
- [ ] Review environment variables
- [ ] Test for common vulnerabilities

---

## Success Metrics

| Vulnerability | Target | Detection Method |
|--------------|--------|------------------|
| **Secrets** | 100% detection | Regex patterns |
| **SQL Injection** | 0 occurrences | Pattern scan |
| **XSS** | 0 occurrences | Output escaping check |
| **Path Traversal** | 0 occurrences | Input validation |
| **Security Incidents** | 0 | Production monitoring |

---

## Related Commands

- `/load-anti-hallucination` - Validation patterns
- `/load-context-management` - Token optimization
- `/claude-docs` - Browse all .claude/ documentation

---

**Version**: 1.0.0
**Module**: 13-SECURITY
**Documentation Size**: ~29 KB (5 files)
**Target**: Zero security incidents, 100% secret detection
**Status**: Ready to load
