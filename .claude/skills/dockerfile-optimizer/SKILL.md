---
name: dockerfile-optimizer
description: Create optimized Dockerfiles with multi-stage builds, layer caching, security best practices. Docker, Docker Compose. Keywords - dockerfile, docker optimization, multi stage build, docker best practices, container, image size, docker compose
---

# Dockerfile Optimizer

## When to Use This Skill

Activate when:
- Creating Docker images for applications
- Need to reduce image size
- Want faster Docker builds
- Implementing multi-stage builds
- Setting up Docker Compose

## What This Skill Does

Creates optimized Dockerfiles with:
- Multi-stage builds (reduce image size)
- Layer caching optimization
- Minimal base images (Alpine)
- Security best practices (non-root user)
- Health checks
- .dockerignore for faster builds

## Supported Technologies

**Base Images**:
- Node/Bun: `node:alpine`, `oven/bun:alpine`
- Python: `python:alpine`, `python:slim`
- Multi-stage: Builder + Runtime

## Example: Optimized Node.js Dockerfile (Multi-Stage)

```dockerfile
# Dockerfile (Node.js + TypeScript)

# ==========================================
# Stage 1: Dependencies
# ==========================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies (layer cached)
RUN npm ci --only=production && \
    npm cache clean --force

# ==========================================
# Stage 2: Builder
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# ==========================================
# Stage 3: Runtime
# ==========================================
FROM node:20-alpine AS runtime

# Install dumb-init (proper signal handling)
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy build output from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --chown=nodejs:nodejs package.json ./

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "dist/index.js"]
```

## Example: Python Dockerfile (Multi-Stage)

```dockerfile
# Dockerfile (Python + FastAPI)

# ==========================================
# Stage 1: Builder
# ==========================================
FROM python:3.11-slim AS builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir --user -r requirements.txt

# ==========================================
# Stage 2: Runtime
# ==========================================
FROM python:3.11-slim AS runtime

# Create non-root user
RUN useradd -m -u 1001 appuser

WORKDIR /app

# Copy Python dependencies from builder
COPY --from=builder --chown=appuser:appuser /root/.local /home/appuser/.local

# Copy application code
COPY --chown=appuser:appuser . .

# Update PATH for user-installed packages
ENV PATH=/home/appuser/.local/bin:$PATH

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:8000/health').raise_for_status()"

# Start application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Example: Bun Dockerfile

```dockerfile
# Dockerfile (Bun + TypeScript)

# ==========================================
# Stage 1: Dependencies
# ==========================================
FROM oven/bun:1-alpine AS deps

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile --production

# ==========================================
# Stage 2: Builder
# ==========================================
FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# ==========================================
# Stage 3: Runtime
# ==========================================
FROM oven/bun:1-alpine AS runtime

RUN addgroup -g 1001 -S bun && \
    adduser -S bun -u 1001

WORKDIR /app

COPY --from=deps --chown=bun:bun /app/node_modules ./node_modules
COPY --from=builder --chown=bun:bun /app/dist ./dist
COPY --chown=bun:bun package.json ./

USER bun

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD bun -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["bun", "run", "dist/index.js"]
```

## Example: .dockerignore

```gitignore
# .dockerignore

# Version control
.git
.gitignore

# Dependencies (will be installed in container)
node_modules
venv
__pycache__

# Development files
.env
.env.local
.env.*.local

# Build output (will be built in container)
dist
build
*.log

# IDE
.vscode
.idea
*.swp

# Tests
tests
*.test.ts
*.spec.ts
coverage

# Documentation
README.md
docs
*.md

# CI/CD
.github
.gitlab-ci.yml
Jenkinsfile
```

## Example: Docker Compose (Development)

```yaml
# docker-compose.yml

version: '3.9'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: development  # Use development stage
    ports:
      - '3000:3000'
    volumes:
      - .:/app  # Mount source code for hot reload
      - /app/node_modules  # Don't override node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    command: npm run dev

  db:
    image: postgres:15-alpine
    ports:
      - '5432:5432'
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U user']
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

volumes:
  postgres_data:
  redis_data:
```

## Best Practices

1. **Multi-stage builds** - Separate builder and runtime
2. **Alpine images** - Smaller base images (~5MB vs 900MB)
3. **Layer caching** - Copy package files first, then source
4. **Non-root user** - Security best practice
5. **Health checks** - Docker can restart unhealthy containers
6. **.dockerignore** - Faster builds, smaller context
7. **Minimal dependencies** - Only install what's needed

## Image Size Comparison

| Approach | Image Size |
|----------|------------|
| node:20 (full) | ~950 MB |
| node:20-slim | ~250 MB |
| node:20-alpine | ~180 MB |
| node:20-alpine (multi-stage) | **~100 MB** ✅ |

## Security Best Practices

```dockerfile
# ✅ GOOD: Security best practices

# Use specific version (not latest)
FROM node:20-alpine

# Create non-root user
RUN adduser -D appuser
USER appuser

# Don't run as root
# Don't expose unnecessary ports
# Don't include secrets in image
# Scan for vulnerabilities: docker scan myimage
```

## Example: Development vs Production Dockerfile

```dockerfile
# Dockerfile

# ==========================================
# Development Stage
# ==========================================
FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install  # Include devDependencies

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]

# ==========================================
# Production Stage
# ==========================================
FROM node:20-alpine AS production

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build
RUN npm run build

# Create non-root user
RUN adduser -D appuser
USER appuser

EXPOSE 3000
CMD ["node", "dist/index.js"]
```

```bash
# Build development image
docker build --target development -t myapp:dev .

# Build production image
docker build --target production -t myapp:prod .
```

## Integration with Other Skills

- **api-endpoint-builder** - Dockerize APIs
- **health-check-builder** - Add health checks to Dockerfile
- **environment-config-validator** - Validate env in container

---

**Version**: 1.0.0
**Category**: Testing + DevOps
**Complexity**: Medium
