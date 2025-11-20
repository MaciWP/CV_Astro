---
name: health-check-builder
description: Create health check endpoints for Kubernetes, Docker, monitoring. Check database, Redis, external APIs. Liveness and readiness probes. Keywords - health check, liveness probe, readiness probe, kubernetes health, monitoring, healthz, docker healthcheck
---

# Health Check Builder

## When to Use This Skill

Activate when:
- Deploying to Kubernetes/Docker
- Need liveness and readiness probes
- Setting up monitoring (Datadog, New Relic, Prometheus)
- Want to check dependencies (database, Redis, APIs)
- Building resilient microservices

## What This Skill Does

Creates health check endpoints with:
- Liveness probe (is container alive?)
- Readiness probe (is container ready to serve traffic?)
- Dependency checks (database, Redis, external APIs)
- Graceful degradation (partial health)
- Response time tracking
- JSON response format

## Supported Technologies

**Frameworks**:
- FastAPI, Flask (Python)
- Express, Hono, Fastify (Node/Bun)

**Container Platforms**:
- Kubernetes (liveness/readiness probes)
- Docker (HEALTHCHECK instruction)

**Monitoring**:
- Prometheus, Datadog, CloudWatch

## Example: FastAPI Health Checks

```python
# routes/health.py
from fastapi import APIRouter, Response, status
from typing import Dict, Any
from datetime import datetime
import asyncio

router = APIRouter()

class HealthChecker:
    def __init__(self):
        self.start_time = datetime.utcnow()

    async def check_database(self) -> Dict[str, Any]:
        """Check database connectivity"""
        try:
            # Simple query to verify connection
            await db.execute("SELECT 1")
            return {"status": "healthy", "latency_ms": 5}
        except Exception as e:
            return {"status": "unhealthy", "error": str(e)}

    async def check_redis(self) -> Dict[str, Any]:
        """Check Redis connectivity"""
        try:
            await redis.ping()
            return {"status": "healthy", "latency_ms": 2}
        except Exception as e:
            return {"status": "unhealthy", "error": str(e)}

    async def check_external_api(self, api_url: str) -> Dict[str, Any]:
        """Check external API availability"""
        try:
            response = await httpx.get(api_url, timeout=5)
            if response.status_code == 200:
                return {"status": "healthy"}
            return {"status": "degraded", "status_code": response.status_code}
        except Exception as e:
            return {"status": "unhealthy", "error": str(e)}

health_checker = HealthChecker()

@router.get("/health/live")
async def liveness_probe():
    """
    Liveness probe - Check if application is alive
    Kubernetes uses this to restart container if unhealthy

    Returns 200 if alive, 503 if dead
    """
    # Simple check - is the app responding?
    return {
        "status": "alive",
        "timestamp": datetime.utcnow().isoformat(),
        "uptime_seconds": (datetime.utcnow() - health_checker.start_time).total_seconds()
    }

@router.get("/health/ready")
async def readiness_probe():
    """
    Readiness probe - Check if application is ready to serve traffic
    Kubernetes uses this to add/remove container from service

    Returns 200 if ready, 503 if not ready
    """
    checks = {
        "database": await health_checker.check_database(),
        "redis": await health_checker.check_redis(),
    }

    # Determine overall status
    all_healthy = all(check["status"] == "healthy" for check in checks.values())

    status_code = status.HTTP_200_OK if all_healthy else status.HTTP_503_SERVICE_UNAVAILABLE

    return Response(
        content={
            "status": "ready" if all_healthy else "not_ready",
            "checks": checks,
            "timestamp": datetime.utcnow().isoformat()
        },
        status_code=status_code
    )

@router.get("/health")
async def full_health_check():
    """
    Detailed health check with all dependencies
    Use for monitoring dashboards
    """
    checks = await asyncio.gather(
        health_checker.check_database(),
        health_checker.check_redis(),
        health_checker.check_external_api("https://api.external.com/health"),
        return_exceptions=True
    )

    database_check, redis_check, api_check = checks

    # Calculate overall status
    all_checks = [database_check, redis_check, api_check]
    healthy_count = sum(1 for c in all_checks if c.get("status") == "healthy")

    if healthy_count == len(all_checks):
        overall_status = "healthy"
        status_code = status.HTTP_200_OK
    elif healthy_count > 0:
        overall_status = "degraded"  # Partial functionality
        status_code = status.HTTP_200_OK
    else:
        overall_status = "unhealthy"
        status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    return Response(
        content={
            "status": overall_status,
            "uptime_seconds": (datetime.utcnow() - health_checker.start_time).total_seconds(),
            "checks": {
                "database": database_check,
                "redis": redis_check,
                "external_api": api_check
            },
            "timestamp": datetime.utcnow().isoformat()
        },
        status_code=status_code
    )
```

## Example: Kubernetes Deployment with Health Checks

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: myapp
        image: myapp:latest
        ports:
        - containerPort: 8000

        # Liveness probe - Restart container if fails
        livenessProbe:
          httpGet:
            path: /health/live
            port: 8000
          initialDelaySeconds: 10  # Wait 10s before first check
          periodSeconds: 30         # Check every 30s
          timeoutSeconds: 5         # Timeout after 5s
          failureThreshold: 3       # Restart after 3 failures

        # Readiness probe - Remove from service if fails
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8000
          initialDelaySeconds: 5    # Wait 5s before first check
          periodSeconds: 10         # Check every 10s
          timeoutSeconds: 3         # Timeout after 3s
          failureThreshold: 3       # Remove after 3 failures

        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

## Example: Docker Healthcheck

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY . .
RUN pip install -r requirements.txt

# Health check - Docker will restart if unhealthy
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/health/live || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Example: Node/Bun Health Checks (Hono)

```typescript
// routes/health.ts
import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const app = new Hono();
const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL);

const startTime = Date.now();

interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  latencyMs?: number;
  error?: string;
}

async function checkDatabase(): Promise<HealthCheck> {
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    return {
      status: 'healthy',
      latencyMs: Date.now() - start
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function checkRedis(): Promise<HealthCheck> {
  try {
    const start = Date.now();
    await redis.ping();
    return {
      status: 'healthy',
      latencyMs: Date.now() - start
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Liveness probe
app.get('/health/live', (c) => {
  return c.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000)
  });
});

// Readiness probe
app.get('/health/ready', async (c) => {
  const [databaseCheck, redisCheck] = await Promise.all([
    checkDatabase(),
    checkRedis()
  ]);

  const isReady =
    databaseCheck.status === 'healthy' &&
    redisCheck.status === 'healthy';

  return c.json({
    status: isReady ? 'ready' : 'not_ready',
    checks: {
      database: databaseCheck,
      redis: redisCheck
    },
    timestamp: new Date().toISOString()
  }, isReady ? 200 : 503);
});

// Full health check
app.get('/health', async (c) => {
  const [databaseCheck, redisCheck] = await Promise.all([
    checkDatabase(),
    checkRedis()
  ]);

  const checks = [databaseCheck, redisCheck];
  const healthyCount = checks.filter(c => c.status === 'healthy').length;

  let overallStatus: 'healthy' | 'degraded' | 'unhealthy';
  if (healthyCount === checks.length) {
    overallStatus = 'healthy';
  } else if (healthyCount > 0) {
    overallStatus = 'degraded';
  } else {
    overallStatus = 'unhealthy';
  }

  return c.json({
    status: overallStatus,
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    checks: {
      database: databaseCheck,
      redis: redisCheck
    },
    timestamp: new Date().toISOString()
  }, overallStatus === 'unhealthy' ? 503 : 200);
});

export default app;
```

## Best Practices

1. **Separate liveness and readiness** - Different purposes
   - Liveness: Is app alive? (restart if fails)
   - Readiness: Can it serve traffic? (remove from LB if fails)

2. **Fast checks** - Should respond in <1s (set timeout)

3. **Graceful degradation** - Return 200 even if some dependencies are down
   - Status: "degraded" if partial functionality

4. **Don't check external APIs in liveness** - Only in readiness/full health

5. **Include latency** - Track response times for dependencies

6. **Set appropriate timeouts** - Prevent hanging checks

7. **Use consistent format** - JSON with status, checks, timestamp

## Health Check Response Format

```json
{
  "status": "healthy",
  "uptimeSeconds": 3600,
  "checks": {
    "database": {
      "status": "healthy",
      "latencyMs": 5
    },
    "redis": {
      "status": "healthy",
      "latencyMs": 2
    },
    "external_api": {
      "status": "degraded",
      "statusCode": 503
    }
  },
  "timestamp": "2025-01-17T10:30:45.123Z"
}
```

## Prometheus Metrics Integration

```python
# Add Prometheus metrics
from prometheus_client import Counter, Histogram, generate_latest

health_check_total = Counter('health_check_total', 'Total health checks', ['endpoint', 'status'])
health_check_duration = Histogram('health_check_duration_seconds', 'Health check duration', ['check'])

@router.get("/metrics")
async def metrics():
    return Response(content=generate_latest(), media_type="text/plain")
```

## Integration with Other Skills

- **api-endpoint-builder** - Add health endpoints to API
- **database-query-optimizer** - Check database connectivity
- **cache-strategy-builder** - Check Redis connectivity
- **logging-strategy** - Log health check failures

---

**Version**: 1.0.0
**Category**: Backend Extended
**Complexity**: Low-Medium
