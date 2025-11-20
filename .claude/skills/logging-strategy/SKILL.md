---
name: logging-strategy
description: Implement structured logging with context, log levels, log aggregation. Python logging, Winston, Pino. JSON logs for production. Keywords - structured logging, json logs, winston, pino, python logging, log aggregation, contextual logging
---

# Logging Strategy

## When to Use This Skill

Activate when:
- Setting up application logging
- Need structured logs (JSON) for production
- Implementing contextual logging (request ID, user ID)
- Integrating with log aggregation (ELK, Datadog, CloudWatch)
- Adding different log levels (DEBUG, INFO, WARNING, ERROR)

## What This Skill Does

Implements logging with:
- Structured logging (JSON format)
- Contextual information (request ID, user, correlation ID)
- Log levels (DEBUG, INFO, WARNING, ERROR, CRITICAL)
- Log rotation and retention
- Integration with log aggregation tools
- Performance-optimized logging

## Supported Technologies

**Python**:
- structlog (recommended)
- python-json-logger
- loguru

**Node/Bun**:
- pino (fastest, recommended)
- winston
- bunyan

**Log Aggregation**:
- ELK Stack, Datadog, CloudWatch, Grafana Loki

## Example: Structured Logging (Python/structlog)

```python
# logging_config.py
import structlog
import logging
from typing import Any

def setup_logging(log_level: str = "INFO", json_logs: bool = True):
    """Setup structured logging with structlog"""

    # Processors for all logs
    shared_processors = [
        structlog.contextvars.merge_contextvars,
        structlog.stdlib.add_log_level,
        structlog.stdlib.add_logger_name,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
    ]

    if json_logs:
        # Production: JSON logs
        shared_processors.append(structlog.processors.JSONRenderer())
    else:
        # Development: Pretty console logs
        shared_processors.append(structlog.dev.ConsoleRenderer())

    structlog.configure(
        processors=shared_processors,
        wrapper_class=structlog.stdlib.BoundLogger,
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        cache_logger_on_first_use=True,
    )

    # Configure standard logging
    logging.basicConfig(
        format="%(message)s",
        level=getattr(logging, log_level.upper()),
    )

# Initialize
setup_logging(log_level="INFO", json_logs=True)

# Get logger
logger = structlog.get_logger(__name__)

# Usage
logger.info("User logged in", user_id=123, ip="192.168.1.1")
logger.error("Database connection failed", error="Connection timeout", retry_count=3)
```

## Example: FastAPI Middleware with Request Logging

```python
# middleware/logging_middleware.py
import structlog
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
import time
import uuid

logger = structlog.get_logger(__name__)

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Generate request ID
        request_id = str(uuid.uuid4())

        # Bind context (will be included in all logs)
        structlog.contextvars.clear_contextvars()
        structlog.contextvars.bind_contextvars(
            request_id=request_id,
            method=request.method,
            path=request.url.path,
            client_ip=request.client.host
        )

        # Log request
        logger.info("Request started")

        # Process request
        start_time = time.time()
        try:
            response = await call_next(request)
            duration = time.time() - start_time

            # Log response
            logger.info(
                "Request completed",
                status_code=response.status_code,
                duration_ms=round(duration * 1000, 2)
            )

            # Add request ID to response headers
            response.headers["X-Request-ID"] = request_id
            return response

        except Exception as exc:
            duration = time.time() - start_time
            logger.error(
                "Request failed",
                error=str(exc),
                duration_ms=round(duration * 1000, 2),
                exc_info=True
            )
            raise

# Add to FastAPI app
from fastapi import FastAPI
app = FastAPI()
app.add_middleware(LoggingMiddleware)
```

## Example: Pino Logging (Node/Bun)

```typescript
// logger.ts
import pino from 'pino';

// Create logger
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  // Pretty print in development
  transport: process.env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
    },
  } : undefined,
});

// Child logger with context
export function createContextLogger(context: Record<string, any>) {
  return logger.child(context);
}

// Usage
logger.info({ userId: 123, ip: '192.168.1.1' }, 'User logged in');
logger.error({ error: 'Connection timeout', retryCount: 3 }, 'Database connection failed');

// With context
const reqLogger = createContextLogger({
  requestId: 'abc-123',
  method: 'POST',
  path: '/api/users',
});
reqLogger.info('Processing request');
```

## Example: Express/Hono Middleware

```typescript
// middleware/loggingMiddleware.ts
import { Context, Next } from 'hono';
import { logger } from '../logger';
import { randomUUID } from 'crypto';

export async function loggingMiddleware(c: Context, next: Next) {
  const requestId = randomUUID();
  const startTime = Date.now();

  // Create request-scoped logger
  const reqLogger = logger.child({
    requestId,
    method: c.req.method,
    path: c.req.path,
    ip: c.req.header('x-forwarded-for') || c.req.header('x-real-ip'),
  });

  // Store logger in context
  c.set('logger', reqLogger);

  reqLogger.info('Request started');

  try {
    await next();

    const duration = Date.now() - startTime;
    reqLogger.info({
      statusCode: c.res.status,
      durationMs: duration,
    }, 'Request completed');

  } catch (error) {
    const duration = Date.now() - startTime;
    reqLogger.error({
      error: error instanceof Error ? error.message : 'Unknown error',
      durationMs: duration,
    }, 'Request failed');
    throw error;
  }
}

// Usage in route
app.get('/users/:id', async (c) => {
  const logger = c.get('logger');
  logger.info({ userId: c.req.param('id') }, 'Fetching user');

  // Your logic here

  return c.json({ user: {...} });
});
```

## Example: Log Levels Best Practices

```python
# Different log levels
logger.debug("Cache hit", key="user:123", ttl=300)  # Development only
logger.info("User created", user_id=456, email="user@example.com")  # Important events
logger.warning("Rate limit approaching", current=95, limit=100)  # Potential issues
logger.error("Payment failed", order_id=789, error="Card declined")  # Errors
logger.critical("Database unreachable", retries_exhausted=True)  # System failures

# Structured context
with structlog.contextvars.bound_contextvars(user_id=123, tenant_id=456):
    logger.info("User action", action="update_profile")
    # All logs in this block include user_id and tenant_id
```

## Example: Log Rotation (Python)

```python
# logging_config.py with rotation
from logging.handlers import RotatingFileHandler, TimedRotatingFileHandler

def setup_file_logging(log_file: str = "app.log"):
    """Setup log rotation"""

    # Rotate by size (10MB per file, keep 5 backups)
    size_handler = RotatingFileHandler(
        log_file,
        maxBytes=10 * 1024 * 1024,  # 10MB
        backupCount=5
    )

    # Rotate daily (keep 7 days)
    time_handler = TimedRotatingFileHandler(
        log_file,
        when='midnight',
        interval=1,
        backupCount=7
    )

    # Add handlers to root logger
    logging.getLogger().addHandler(size_handler)
    logging.getLogger().addHandler(time_handler)
```

## Log Aggregation Integration

```python
# CloudWatch integration (Python)
import watchtower
import boto3

cloudwatch_handler = watchtower.CloudWatchLogHandler(
    boto3_client=boto3.client('logs', region_name='us-east-1'),
    log_group='my-app',
    stream_name='production'
)
logging.getLogger().addHandler(cloudwatch_handler)

# Datadog integration (Python)
from datadog import initialize, api
from datadog.dogstatsd import DogStatsd

statsd = DogStatsd(host='localhost', port=8125)
statsd.increment('api.requests', tags=['endpoint:users', 'method:GET'])
```

## Best Practices

1. **JSON logs in production** - Structured, machine-readable
2. **Include context** - request ID, user ID, tenant ID
3. **Use appropriate log levels**:
   - DEBUG: Verbose development info
   - INFO: Important events (user login, order placed)
   - WARNING: Potential issues (rate limit approaching)
   - ERROR: Errors that need attention
   - CRITICAL: System failures
4. **Never log secrets** - Passwords, tokens, credit cards
5. **Log performance metrics** - Duration, status code, error rate
6. **Correlation IDs** - Trace requests across services
7. **Log rotation** - Prevent disk space issues
8. **Sample high-volume logs** - 1% sampling for DEBUG logs

## Security: What NOT to Log

```python
# ❌ BAD: Logging sensitive data
logger.info("User login", email=email, password=password)  # NEVER
logger.info("Payment processed", card_number=card)  # NEVER
logger.info("API call", api_key=api_key)  # NEVER

# ✅ GOOD: Log safely
logger.info("User login", email=email, password_length=len(password))
logger.info("Payment processed", card_last4=card[-4:])
logger.info("API call", api_key_hash=hashlib.sha256(api_key.encode()).hexdigest()[:8])
```

## Integration with Other Skills

- **api-endpoint-builder** - Log API requests and responses
- **auth-flow-builder** - Log authentication events
- **webhook-handler-builder** - Log webhook events
- **background-job-scheduler** - Log job execution

## Example JSON Log Output

```json
{
  "timestamp": "2025-01-17T10:30:45.123Z",
  "level": "info",
  "logger": "api.users",
  "message": "Request completed",
  "request_id": "abc-123-def-456",
  "method": "POST",
  "path": "/api/users",
  "status_code": 201,
  "duration_ms": 45.23,
  "user_id": 789,
  "ip": "192.168.1.1"
}
```

---

**Version**: 1.0.0
**Category**: Backend Extended
**Complexity**: Medium
