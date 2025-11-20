---
name: cicd-pipeline-builder
description: Create CI/CD pipelines with GitHub Actions, GitLab CI. Automated testing, building, deployment. Keywords - ci cd, github actions, gitlab ci, continuous integration, continuous deployment, automated testing, pipeline
---

# CI/CD Pipeline Builder

## When to Use This Skill

Activate when:
- Setting up automated testing on push/PR
- Need automated builds and deployments
- Want to run tests, linting, type checking
- Deploying to production automatically
- Building Docker images in CI

## What This Skill Does

Creates CI/CD pipelines with:
- Automated testing (unit, integration, E2E)
- Code quality checks (linting, type checking)
- Build and deployment
- Docker image building and pushing
- Environment-specific deployments
- Caching for faster builds

## Supported Technologies

**CI/CD Platforms**:
- GitHub Actions (most popular)
- GitLab CI/CD
- CircleCI, Travis CI

## Example: GitHub Actions (Complete Pipeline)

```yaml
# .github/workflows/ci.yml

name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '20'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # ==========================================
  # Job 1: Code Quality
  # ==========================================
  quality:
    name: Code Quality
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npm run type-check

  # ==========================================
  # Job 2: Unit Tests
  # ==========================================
  test:
    name: Unit Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit -- --coverage

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella

  # ==========================================
  # Job 3: E2E Tests
  # ==========================================
  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run database migrations
        run: npm run migrate
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/testdb

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/testdb
          REDIS_URL: redis://localhost:6379

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  # ==========================================
  # Job 4: Build Docker Image
  # ==========================================
  build:
    name: Build Docker Image
    runs-on: ubuntu-latest
    needs: [quality, test, e2e]
    if: github.ref == 'refs/heads/main'
    permissions:
      contents: read
      packages: write
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=sha,prefix={{branch}}-

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # ==========================================
  # Job 5: Deploy to Production
  # ==========================================
  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [build]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://myapp.com
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to production
        run: |
          echo "Deploying to production..."
          # Deploy script here (kubectl, AWS ECS, Vercel, etc.)
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
```

## Example: GitLab CI/CD Pipeline

```yaml
# .gitlab-ci.yml

stages:
  - quality
  - test
  - build
  - deploy

variables:
  NODE_VERSION: '20'
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: '/certs'

# Cache node_modules
cache:
  paths:
    - node_modules/
    - .npm/

# ==========================================
# Quality Stage
# ==========================================
lint:
  stage: quality
  image: node:${NODE_VERSION}-alpine
  script:
    - npm ci --cache .npm --prefer-offline
    - npm run lint

type-check:
  stage: quality
  image: node:${NODE_VERSION}-alpine
  script:
    - npm ci --cache .npm --prefer-offline
    - npm run type-check

# ==========================================
# Test Stage
# ==========================================
test:unit:
  stage: test
  image: node:${NODE_VERSION}-alpine
  script:
    - npm ci --cache .npm --prefer-offline
    - npm run test:unit -- --coverage
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
    paths:
      - coverage/

test:e2e:
  stage: test
  image: mcr.microsoft.com/playwright:v1.40.0-focal
  services:
    - postgres:15-alpine
    - redis:7-alpine
  variables:
    POSTGRES_DB: testdb
    POSTGRES_USER: test
    POSTGRES_PASSWORD: test
    DATABASE_URL: postgresql://test:test@postgres:5432/testdb
    REDIS_URL: redis://redis:6379
  script:
    - npm ci --cache .npm --prefer-offline
    - npm run migrate
    - npm run test:e2e
  artifacts:
    when: always
    paths:
      - playwright-report/
    expire_in: 30 days

# ==========================================
# Build Stage
# ==========================================
build:docker:
  stage: build
  image: docker:24-dind
  services:
    - docker:24-dind
  only:
    - main
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:latest

# ==========================================
# Deploy Stage
# ==========================================
deploy:production:
  stage: deploy
  image: alpine:latest
  only:
    - main
  environment:
    name: production
    url: https://myapp.com
  before_script:
    - apk add --no-cache curl
  script:
    - echo "Deploying to production..."
    - curl -X POST $DEPLOY_WEBHOOK_URL
```

## Example: Reusable Workflows (GitHub Actions)

```yaml
# .github/workflows/reusable-test.yml

name: Reusable Test Workflow

on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
          cache: 'npm'

      - name: Install and test
        run: |
          npm ci
          npm test
```

```yaml
# .github/workflows/main.yml

name: Main Workflow

on: [push]

jobs:
  test-node-18:
    uses: ./.github/workflows/reusable-test.yml
    with:
      node-version: '18'

  test-node-20:
    uses: ./.github/workflows/reusable-test.yml
    with:
      node-version: '20'
```

## Example: Deploy to Vercel (GitHub Actions)

```yaml
# .github/workflows/deploy.yml

name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Vercel CLI
        run: npm install -g vercel

      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Example: Semantic Release (Auto Versioning)

```yaml
# .github/workflows/release.yml

name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Fetch all history

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Semantic Release
        run: npx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Best Practices

1. **Fail fast** - Run fast checks first (linting, type check)
2. **Parallel jobs** - Run tests in parallel for speed
3. **Cache dependencies** - Cache node_modules, pip cache
4. **Matrix testing** - Test multiple Node/Python versions
5. **Environment secrets** - Never hardcode secrets
6. **Branch protection** - Require CI to pass before merge
7. **Deployment gates** - Manual approval for production

## CI/CD Pipeline Stages

```
┌─────────────┐
│   Quality   │  Lint, Type Check (1-2 min)
└──────┬──────┘
       │
┌──────▼──────┐
│   Testing   │  Unit, Integration, E2E (5-10 min)
└──────┬──────┘
       │
┌──────▼──────┐
│    Build    │  Docker Image, Assets (3-5 min)
└──────┬──────┘
       │
┌──────▼──────┐
│   Deploy    │  Production Deployment (2-3 min)
└─────────────┘

Total: ~15-20 minutes
```

## Integration with Other Skills

- **test-suite-generator** - Run tests in CI
- **dockerfile-optimizer** - Build Docker images
- **environment-config-validator** - Validate env in CI

---

**Version**: 1.0.0
**Category**: Testing + DevOps
**Complexity**: Medium-High
