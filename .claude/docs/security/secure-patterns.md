# Secure Coding Patterns

Common secure patterns for code generation.

---

## Input Validation

```typescript
import { z } from 'zod';

// ✅ Always validate user input
const schema = z.object({
  email: z.string().email().max(255),
  age: z.number().int().min(0).max(150),
  role: z.enum(['user', 'admin'])
});

const validated = schema.parse(userInput);
```

---

## Password Hashing

```typescript
import bcrypt from 'bcrypt';

// ✅ Hash passwords (NEVER store plain text)
const hash = await bcrypt.hash(password, 10);

// ✅ Verify passwords
const valid = await bcrypt.compare(password, hash);
```

---

## JWT Authentication

```typescript
import jwt from 'jsonwebtoken';

// ✅ Sign tokens
const token = jwt.sign(
  { userId, email },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// ✅ Verify tokens
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

---

## Output Escaping (XSS Prevention)

```typescript
// ✅ Use framework escaping (React)
<div>{userInput}</div>  // Auto-escaped

// ✅ Use textContent (vanilla JS)
element.textContent = userInput;

// ❌ NEVER use innerHTML with user input
element.innerHTML = userInput;  // XSS risk
```

---

## CSRF Protection

```typescript
// ✅ Use CSRF tokens
app.use(csrf());

app.post('/api/transfer', (req, res) => {
  // Token validated automatically
});
```

---

## Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// ✅ Prevent brute force
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 min
  max: 100  // 100 requests
});

app.use('/api/', limiter);
```

---

**Version**: 1.0.0
