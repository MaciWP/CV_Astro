# Code Review - Comprehensive Example

**Complete before/after transformation**

---

## ❌ BEFORE (Score: 22/100)

```
Review this code
```

**Score Breakdown**:
- Clarity: 5/25 (action verb "Review", but no criteria)
- Context: 0/25 (no code, no file, no review standards)
- Structure: 0/20
- Techniques: 0/15
- Actionability: 2/15 (can't review without code)

---

## ✅ AFTER (Score: 95/100)

```xml
<task>Comprehensive security and performance code review of AuthenticationMiddleware</task>

<context>
  <file>src/middleware/auth_middleware.js</file>
  <code>
    ```javascript
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');

    async function authMiddleware(req, res, next) {
      const token = req.header('Authorization')?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
          throw new Error('User not found');
        }

        req.user = user;
        next();
      } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
      }
    }

    module.exports = authMiddleware;
    ```
  </code>
  <review_criteria>
    - **Security**: JWT validation, injection prevention, secret management, timing attacks
    - **Performance**: Database query optimization, caching opportunities, async/await best practices
    - **Error Handling**: HTTP status codes (RFC 7231), error logging, user-friendly messages
    - **Testing**: Unit test coverage, edge cases, mock patterns
    - **Best Practices**: Express middleware conventions, ESLint compliance, code clarity
  </review_criteria>
  <tech_stack>Node.js 18, Express.js 4.18, jsonwebtoken 9.0, MongoDB (Mongoose), ESLint (Airbnb config)</tech_stack>
  <security_requirements>
    - OWASP Top 10 compliance
    - JWT best practices (no secrets in code, expiry validation)
    - Rate limiting integration ready
    - Audit logging for auth failures
  </security_requirements>
</context>

<instructions>
Step 1: EXTRACT QUOTES of concerning code sections
Identify security vulnerabilities, performance bottlenecks, error handling issues, and testing gaps.

Step 2: ANALYZE each quote against review criteria
Categorize by severity: Critical | High | Medium | Low

Step 3: PROVIDE FIXES with before/after code examples
Show exact line changes with explanations

Step 4: SUGGEST TESTS
Provide unit test examples for discovered issues
</instructions>

<output_format>
<extracted_quotes>
  <quote line="5" severity="high" category="security">
    const token = req.header('Authorization')?.replace('Bearer ', '');
  </quote>
  <quote line="11-12" severity="critical" category="security">
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
  </quote>
  <quote line="19" severity="medium" category="error-handling">
    res.status(401).json({ error: 'Invalid token' });
  </quote>
</extracted_quotes>

<issues>
  <critical>
    <issue>
      <title>Missing JWT expiry validation</title>
      <location>Line 11</location>
      <description>jwt.verify() doesn't check token expiration if 'exp' claim is missing. Allows expired tokens.</description>
      <impact>Security: Compromised tokens remain valid indefinitely</impact>
      <fix>
        ```javascript
        // ❌ BEFORE
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ AFTER
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
          algorithms: ['HS256'], // Prevent 'none' algorithm attack
          maxAge: '7d',          // Enforce expiry even if 'exp' missing
        });

        // Explicit expiry check
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          throw new jwt.TokenExpiredError('Token expired', new Date(decoded.exp * 1000));
        }
        ```
      </fix>
    </issue>

    <issue>
      <title>Secrets in environment variables (production risk)</title>
      <location>Line 11</location>
      <description>JWT_SECRET in .env is weak for production. Should use key management service.</description>
      <impact>Security: If .env leaks, all tokens compromised</impact>
      <fix>
        ```javascript
        // Recommended: AWS Secrets Manager, HashiCorp Vault, or Azure Key Vault
        const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

        let jwtSecret;

        async function loadSecret() {
          const client = new SecretsManagerClient({ region: 'us-east-1' });
          const response = await client.send(new GetSecretValueCommand({
            SecretId: 'prod/jwt-secret',
          }));
          jwtSecret = response.SecretString;
        }

        // Call loadSecret() on app startup
        ```
      </fix>
    </issue>
  </critical>

  <high>
    <issue>
      <title>N+1 database query on every request</title>
      <location>Line 12</location>
      <description>User.findById() runs on EVERY authenticated request. No caching.</description>
      <impact>Performance: 50-100ms latency per request, database load</impact>
      <fix>
        ```javascript
        // Use Redis caching with 5-minute TTL
        const redis = require('redis').createClient();

        async function authMiddleware(req, res, next) {
          // ... token extraction ...

          const decoded = jwt.verify(token, jwtSecret, { algorithms: ['HS256'], maxAge: '7d' });

          // ✅ Check cache first
          const cachedUser = await redis.get(`user:${decoded.id}`);
          if (cachedUser) {
            req.user = JSON.parse(cachedUser);
            return next();
          }

          // Cache miss - query database
          const user = await User.findById(decoded.id);
          if (!user) {
            throw new Error('User not found');
          }

          // ✅ Cache for 5 minutes
          await redis.setex(`user:${decoded.id}`, 300, JSON.stringify(user));

          req.user = user;
          next();
        }
        ```
        **Performance improvement**: 50-100ms → 2-5ms (20x faster)
      </fix>
    </issue>

    <issue>
      <title>Timing attack vulnerability in error responses</title>
      <location>Lines 8-9, 19</location>
      <description>Different error messages ("No token" vs "Invalid token") leak information about token existence.</description>
      <impact>Security: Attacker can enumerate valid tokens</impact>
      <fix>
        ```javascript
        // ❌ BEFORE - Information leak
        if (!token) {
          return res.status(401).json({ error: 'No token provided' });
        }
        // ... later ...
        res.status(401).json({ error: 'Invalid token' });

        // ✅ AFTER - Generic message
        const GENERIC_AUTH_ERROR = 'Authentication required';

        if (!token) {
          return res.status(401).json({ error: GENERIC_AUTH_ERROR });
        }
        // ... later ...
        res.status(401).json({ error: GENERIC_AUTH_ERROR });
        ```
      </fix>
    </issue>
  </high>

  <medium>
    <issue>
      <title>No audit logging for auth failures</title>
      <location>Line 19</location>
      <description>Failed authentication attempts not logged. Can't detect brute-force attacks.</description>
      <impact>Security monitoring: No visibility into attacks</impact>
      <fix>
        ```javascript
        const logger = require('./logger');

        } catch (error) {
          // ✅ Log auth failures
          logger.warn('Authentication failed', {
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            error: error.message,
            timestamp: new Date().toISOString(),
          });

          res.status(401).json({ error: GENERIC_AUTH_ERROR });
        }
        ```
      </fix>
    </issue>
  </medium>

  <low>
    <issue>
      <title>Missing JSDoc documentation</title>
      <location>Line 4</location>
      <description>Function lacks documentation for params, returns, errors</description>
      <fix>
        ```javascript
        /**
         * Express middleware for JWT-based authentication
         * @param {Object} req - Express request object
         * @param {Object} res - Express response object
         * @param {Function} next - Express next middleware function
         * @throws {Error} If token is invalid or user not found
         */
        async function authMiddleware(req, res, next) {
          // ...
        }
        ```
      </fix>
    </issue>
  </low>
</issues>

<test_recommendations>
  ```javascript
  // test/middleware/auth_middleware.test.js
  const request = require('supertest');
  const app = require('../app');
  const jwt = require('jsonwebtoken');
  const User = require('../models/User');

  describe('AuthenticationMiddleware', () => {
    describe('Critical Security Tests', () => {
      it('should reject expired tokens', async () => {
        const expiredToken = jwt.sign(
          { id: 'user123', exp: Math.floor(Date.now() / 1000) - 3600 },
          process.env.JWT_SECRET
        );

        const res = await request(app)
          .get('/api/protected')
          .set('Authorization', `Bearer ${expiredToken}`);

        expect(res.status).toBe(401);
      });

      it('should reject "none" algorithm attack', async () => {
        const maliciousToken = jwt.sign({ id: 'user123' }, '', { algorithm: 'none' });

        const res = await request(app)
          .get('/api/protected')
          .set('Authorization', `Bearer ${maliciousToken}`);

        expect(res.status).toBe(401);
      });

      it('should log failed authentication attempts', async () => {
        const logger = require('../logger');
        const spy = jest.spyOn(logger, 'warn');

        await request(app)
          .get('/api/protected')
          .set('Authorization', 'Bearer invalid_token');

        expect(spy).toHaveBeenCalledWith(expect.stringContaining('Authentication failed'));
      });
    });

    describe('Performance Tests', () => {
      it('should use cache on repeated requests', async () => {
        const redis = require('redis');
        const getSpy = jest.spyOn(redis, 'get');
        const token = jwt.sign({ id: 'user123' }, process.env.JWT_SECRET);

        // First request - cache miss
        await request(app).get('/api/protected').set('Authorization', `Bearer ${token}`);
        expect(getSpy).toHaveReturnedWith(null);

        // Second request - cache hit
        await request(app).get('/api/protected').set('Authorization', `Bearer ${token}`);
        expect(getSpy).toHaveReturnedWith(expect.any(String));
      });
    });
  });
  ```
</test_recommendations>

<summary>
  <total_issues>7</total_issues>
  <breakdown>
    <critical>2 (JWT expiry, secret management)</critical>
    <high>2 (N+1 query, timing attack)</high>
    <medium>2 (audit logging, error handling)</medium>
    <low>1 (documentation)</low>
  </breakdown>
  <recommended_actions>
    1. Fix critical issues IMMEDIATELY (expiry validation, algorithms whitelist)
    2. Implement Redis caching (20x performance gain)
    3. Add audit logging before next deployment
    4. Write security-focused unit tests
    5. Consider rate limiting middleware (express-rate-limit)
  </recommended_actions>
</summary>
</output_format>
```

**Score Breakdown**:
- Clarity: 25/25 (explicit file, review criteria, security requirements)
- Context: 25/25 (complete code, tech stack, OWASP compliance)
- Structure: 20/20 (perfect XML, quote grounding, categorized output)
- Techniques: 15/15 (quote extraction, analysis, testing recommendations)
- Actionability: 15/15 (immediately applicable fixes, before/after code, test examples)

**Improvement**: +73 points (22 → 95)

---

## 🎓 Key Takeaways

1. **Code inclusion**: Can't review without seeing the code
2. **Review criteria**: Security, performance, error handling (not generic "quality")
3. **Quote grounding**: Extract specific lines BEFORE analysis (reduces hallucination)
4. **Severity categorization**: Critical/High/Medium/Low with justification
5. **Before/after fixes**: Show exact code changes, not "improve error handling"
6. **Test recommendations**: Provide actual test code for discovered issues
