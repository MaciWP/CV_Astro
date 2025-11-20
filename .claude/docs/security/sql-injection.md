# SQL Injection - Detection and Prevention

**Goal**: Prevent SQL injection vulnerabilities through parameterized queries and input validation.

**Target**: Zero SQL injection vulnerabilities in generated code.

---

## Vulnerable Patterns (DETECT THESE)

### 1. String Concatenation
```typescript
// ❌ VULNERABLE - String concatenation
const query = `SELECT * FROM users WHERE id = ${userId}`;
const query = "SELECT * FROM users WHERE email = '" + userEmail + "'";
```

**Why vulnerable**: User input directly embedded in SQL string
**Attack example**: `userId = "1 OR 1=1--"` → Returns all users

---

### 2. Template Literals with Variables
```typescript
// ❌ VULNERABLE - Template literal
const query = `SELECT * FROM users WHERE name = '${userName}'`;
```

**Why vulnerable**: No escaping of special characters
**Attack example**: `userName = "'; DROP TABLE users; --"` → Deletes table

---

### 3. String Interpolation
```typescript
// ❌ VULNERABLE - String interpolation
const query = `INSERT INTO logs (message) VALUES ('${logMessage}')`;
```

**Why vulnerable**: Unescaped quotes
**Attack example**: `logMessage = "test'); DELETE FROM logs; --"`

---

## Detection Patterns (Regex)

```typescript
const SQL_INJECTION_PATTERNS = [
  // String concatenation in query
  /\b(query|sql|execute)\s*=\s*['"`][^'"]*\s*\+\s*/gi,

  // Template literals with ${...}
  /\b(query|sql|execute)\s*=\s*`[^`]*\$\{[^}]+\}/gi,

  // Direct variable insertion
  /(WHERE|SET|VALUES|FROM)\s+[^'"]*\$\{/gi,

  // String concatenation with quotes
  /['"][^'"]*['"]\s*\+\s*[a-zA-Z]/gi,
];

function detectSQLInjection(code: string): Vulnerability[] {
  const vulnerabilities = [];

  for (const pattern of SQL_INJECTION_PATTERNS) {
    let match;
    while ((match = pattern.exec(code)) !== null) {
      vulnerabilities.push({
        type: 'SQL_INJECTION_RISK',
        pattern: pattern.source,
        location: match.index,
        context: match[0],
        severity: 'HIGH'
      });
    }
  }

  return vulnerabilities;
}
```

---

## Secure Patterns (USE THESE)

### ✅ Parameterized Queries (PostgreSQL)
```typescript
// ✅ SECURE - Parameterized with $1, $2, ...
const result = await db.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);

const result = await db.query(
  'SELECT * FROM users WHERE email = $1 AND status = $2',
  [userEmail, status]
);
```

**Why secure**: Database treats parameters as DATA, not CODE

---

### ✅ Named Parameters (Better Readability)
```typescript
// ✅ SECURE - Named parameters
const result = await db.query(
  'SELECT * FROM users WHERE email = :email AND role = :role',
  { email: userEmail, role: userRole }
);
```

---

### ✅ ORM/Query Builder
```typescript
// ✅ SECURE - Prisma ORM
const user = await prisma.user.findUnique({
  where: { id: userId }
});

// ✅ SECURE - Drizzle ORM
const users = await db.select()
  .from(usersTable)
  .where(eq(usersTable.id, userId));

// ✅ SECURE - Kysely
const users = await db
  .selectFrom('users')
  .where('id', '=', userId)
  .execute();
```

**Why secure**: ORM handles parameterization automatically

---

## Technology-Specific Examples

### PostgreSQL (node-postgres)
```typescript
// ❌ VULNERABLE
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ SECURE
const query = 'SELECT * FROM users WHERE id = $1';
const result = await client.query(query, [userId]);
```

---

### MySQL (mysql2)
```typescript
// ❌ VULNERABLE
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ SECURE
const query = 'SELECT * FROM users WHERE id = ?';
const [rows] = await connection.execute(query, [userId]);
```

---

### SQLite (better-sqlite3)
```typescript
// ❌ VULNERABLE
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ SECURE
const query = 'SELECT * FROM users WHERE id = ?';
const result = db.prepare(query).get(userId);
```

---

### MongoDB (NOT SQL, but still needs care)
```typescript
// ❌ VULNERABLE - NoSQL injection
const user = await db.collection('users').findOne({
  username: req.body.username
});
// Attack: { "username": { "$ne": null } } → Returns first user

// ✅ SECURE - Validate input
const username = z.string().min(3).max(50).parse(req.body.username);
const user = await db.collection('users').findOne({ username });
```

---

## Common Mistakes

### Mistake 1: Escaping Instead of Parameterizing
```typescript
// ❌ STILL VULNERABLE - Manual escaping
const escaped = userId.replace(/'/g, "''");
const query = `SELECT * FROM users WHERE id = '${escaped}'`;

// ✅ SECURE - Use parameterized queries
const query = 'SELECT * FROM users WHERE id = $1';
const result = await db.query(query, [userId]);
```

**Why**: Manual escaping is error-prone, misses edge cases

---

### Mistake 2: Parameterizing Values but Not Identifiers
```typescript
// ❌ VULNERABLE - Table name not parameterized
const table = userInput;  // Could be "users; DROP TABLE users; --"
const query = `SELECT * FROM ${table} WHERE id = $1`;

// ✅ SECURE - Whitelist table names
const ALLOWED_TABLES = ['users', 'posts', 'comments'];
if (!ALLOWED_TABLES.includes(table)) {
  throw new Error('Invalid table name');
}
const query = `SELECT * FROM ${table} WHERE id = $1`;
```

**Note**: SQL doesn't support parameterized identifiers (table/column names)
**Solution**: Use whitelist validation

---

### Mistake 3: Building WHERE Clauses Dynamically
```typescript
// ❌ VULNERABLE - Dynamic WHERE clause
let where = "1=1";
if (userName) where += ` AND name = '${userName}'`;
if (userEmail) where += ` AND email = '${userEmail}'`;
const query = `SELECT * FROM users WHERE ${where}`;

// ✅ SECURE - Build with parameters
const conditions = [];
const params = [];
let paramIndex = 1;

if (userName) {
  conditions.push(`name = $${paramIndex++}`);
  params.push(userName);
}
if (userEmail) {
  conditions.push(`email = $${paramIndex++}`);
  params.push(userEmail);
}

const where = conditions.length > 0 ? conditions.join(' AND ') : '1=1';
const query = `SELECT * FROM users WHERE ${where}`;
const result = await db.query(query, params);
```

---

## Input Validation (Defense in Depth)

**Parameterized queries are the PRIMARY defense, but add validation too:**

```typescript
import { z } from 'zod';

// Validate before using in query
const userIdSchema = z.number().int().positive();
const userId = userIdSchema.parse(req.params.id);

const emailSchema = z.string().email().max(255);
const email = emailSchema.parse(req.body.email);

// Now safe to use (even with parameterized queries)
const result = await db.query(
  'SELECT * FROM users WHERE id = $1 AND email = $2',
  [userId, email]
);
```

**Why**: Catches invalid data before it reaches database

---

## Testing for SQL Injection

### Manual Test Inputs
```typescript
const TEST_INPUTS = [
  "1 OR 1=1",
  "1'; DROP TABLE users; --",
  "1' UNION SELECT * FROM admin_users--",
  "1' AND '1'='1",
  "'; DELETE FROM logs; --"
];

// Test each input
for (const malicious of TEST_INPUTS) {
  try {
    const result = await getUserById(malicious);
    console.error(`❌ VULNERABLE: Accepted malicious input: ${malicious}`);
  } catch (error) {
    console.log(`✅ SAFE: Rejected malicious input: ${malicious}`);
  }
}
```

---

## Success Criteria

| Check | Target |
|-------|--------|
| **Parameterized queries** | 100% of database operations |
| **String concatenation** | 0 occurrences in SQL code |
| **Input validation** | 100% of user inputs |
| **Test coverage** | All endpoints tested with malicious inputs |

---

## Quick Checklist

**Before committing database code:**
- [ ] All queries use parameterized syntax ($1, ?, etc.)
- [ ] NO string concatenation in queries
- [ ] NO template literals with ${...} in queries
- [ ] Table/column names validated against whitelist
- [ ] User inputs validated with Zod/schema
- [ ] Tested with malicious inputs

---

**Version**: 1.0.0
**Target**: Zero SQL injection vulnerabilities
**Status**: Ready for use
