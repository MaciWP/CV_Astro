# Common Vulnerabilities - OWASP Top 10 Adapted

Quick reference for detecting common security vulnerabilities in code generation.

---

## 1. SQL Injection
**Detect**: String concatenation in queries
**Fix**: Use parameterized queries ($1, ?, etc.)
**See**: sql-injection.md

---

## 2. Cross-Site Scripting (XSS)
**Detect**: Unescaped user input in HTML
```typescript
// ❌ VULNERABLE
innerHTML = userInput;

// ✅ SECURE
textContent = userInput;  // Auto-escapes
// Or use framework escaping (React, Vue)
```

---

## 3. Path Traversal
**Detect**: User input in file paths
```typescript
// ❌ VULNERABLE
const file = await Read(`./uploads/${req.params.filename}`);
// Attack: ../../../etc/passwd

// ✅ SECURE
const basename = path.basename(req.params.filename);
const file = await Read(`./uploads/${basename}`);
```

---

## 4. Command Injection
**Detect**: User input in Bash commands
```typescript
// ❌ VULNERABLE
await Bash({ command: `git log ${userInput}` });

// ✅ SECURE
const allowed = ['--oneline', '--graph'];
if (!allowed.includes(userInput)) throw new Error('Invalid option');
await Bash({ command: `git log ${userInput}` });
```

---

## 5. Insecure Deserialization
**Detect**: eval(), Function(), or unsafe JSON parse
```typescript
// ❌ VULNERABLE
eval(userInput);
new Function(userInput)();

// ✅ SECURE
JSON.parse(userInput);  // Safe for data only
```

---

## 6. Authentication/Authorization Bypass
**Check**:
- [ ] Authentication required for protected routes
- [ ] Authorization checks before data access
- [ ] JWT/session validation
- [ ] Password hashing (bcrypt, argon2)

---

## 7. Security Misconfiguration
**Check**:
- [ ] HTTPS enabled in production
- [ ] Error messages don't leak sensitive info
- [ ] CORS configured properly
- [ ] Security headers set (CSP, X-Frame-Options)

---

## 8. Sensitive Data Exposure
**Check**:
- [ ] Passwords hashed (never plain text)
- [ ] API keys in environment variables
- [ ] Logs don't contain secrets
- [ ] HTTPS for sensitive data

---

## 9. Broken Access Control
**Check**:
- [ ] User can only access own data
- [ ] Admin functions protected
- [ ] Object-level permissions enforced

---

## 10. Insufficient Logging
**Implement**:
- [ ] Log authentication attempts
- [ ] Log authorization failures
- [ ] Log data access
- [ ] Log security errors

---

**Version**: 1.0.0
