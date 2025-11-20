---
name: test-suite-generator
description: Generate comprehensive test suites with unit, integration tests. Vitest, Jest, Pytest patterns. Test coverage, mocking, assertions. Keywords - testing, unit tests, integration tests, vitest, jest, pytest, test coverage, test generation
---

# Test Suite Generator

## When to Use This Skill

Activate when:
- Creating unit tests for functions/components
- Building integration tests for APIs
- Need test coverage for new features
- Setting up testing infrastructure
- Generating tests from specifications

## What This Skill Does

Generates tests with:
- Unit tests (functions, components, utilities)
- Integration tests (API endpoints, services)
- Mocking (dependencies, API calls, databases)
- Assertions and expectations
- Test coverage reports
- Test organization and structure

## Supported Technologies

**Frontend**:
- Vitest (recommended for Vite projects)
- Jest (most popular)
- React Testing Library
- Vue Test Utils

**Backend**:
- Pytest (Python)
- unittest (Python standard library)
- Supertest (Node/Bun API testing)

## Example: React Component Test (Vitest + Testing Library)

```tsx
// components/LoginForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('renders login form with email and password fields', () => {
    render(<LoginForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<LoginForm onSubmit={vi.fn()} />);

    const submitButton = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('calls onSubmit with email and password when form is valid', async () => {
    const mockOnSubmit = vi.fn();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /log in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('disables submit button while loading', () => {
    render(<LoginForm onSubmit={vi.fn()} isLoading={true} />);

    const submitButton = screen.getByRole('button', { name: /log in/i });
    expect(submitButton).toBeDisabled();
  });
});
```

## Example: API Integration Test (Supertest + Node/Bun)

```typescript
// routes/users.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { db } from '../db';

describe('Users API', () => {
  beforeAll(async () => {
    // Setup test database
    await db.migrate.latest();
  });

  afterAll(async () => {
    // Cleanup
    await db.destroy();
  });

  describe('GET /api/users', () => {
    it('returns list of users', async () => {
      const response = await request(app).get('/api/users').expect(200);

      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
    });

    it('supports pagination', async () => {
      const response = await request(app)
        .get('/api/users?page=1&limit=10')
        .expect(200);

      expect(response.body.users).toHaveLength(10);
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page', 1);
    });
  });

  describe('POST /api/users', () => {
    it('creates a new user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(userData.name);
      expect(response.body.email).toBe(userData.email);
      expect(response.body).not.toHaveProperty('password'); // Password should not be returned
    });

    it('returns 400 for invalid email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('email');
    });

    it('returns 409 for duplicate email', async () => {
      const userData = {
        name: 'Jane Doe',
        email: 'john@example.com', // Already exists
        password: 'password123',
      };

      await request(app).post('/api/users').send(userData).expect(409);
    });
  });
});
```

## Example: Python Unit Tests (Pytest)

```python
# tests/test_user_service.py
import pytest
from unittest.mock import Mock, patch
from services.user_service import UserService
from models import User

@pytest.fixture
def user_service():
    """Create UserService instance with mocked dependencies"""
    return UserService(db=Mock())

@pytest.fixture
def sample_user():
    """Create sample user for testing"""
    return User(
        id=1,
        name="John Doe",
        email="john@example.com"
    )

class TestUserService:
    def test_get_user_by_id_returns_user(self, user_service, sample_user):
        """Test getting user by ID returns correct user"""
        # Arrange
        user_service.db.query.return_value.filter.return_value.first.return_value = sample_user

        # Act
        result = user_service.get_user_by_id(1)

        # Assert
        assert result == sample_user
        user_service.db.query.assert_called_once()

    def test_get_user_by_id_returns_none_when_not_found(self, user_service):
        """Test getting non-existent user returns None"""
        # Arrange
        user_service.db.query.return_value.filter.return_value.first.return_value = None

        # Act
        result = user_service.get_user_by_id(999)

        # Assert
        assert result is None

    def test_create_user_validates_email(self, user_service):
        """Test user creation validates email format"""
        # Arrange
        invalid_data = {"name": "John", "email": "invalid-email"}

        # Act & Assert
        with pytest.raises(ValueError, match="Invalid email"):
            user_service.create_user(invalid_data)

    def test_create_user_hashes_password(self, user_service):
        """Test password is hashed before storing"""
        # Arrange
        user_data = {
            "name": "John",
            "email": "john@example.com",
            "password": "plaintext"
        }

        with patch('services.user_service.hash_password') as mock_hash:
            mock_hash.return_value = "hashed_password"

            # Act
            user_service.create_user(user_data)

            # Assert
            mock_hash.assert_called_once_with("plaintext")
```

## Example: Mocking API Calls (Vitest)

```typescript
// services/api.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchUsers, createUser } from './api';

// Mock fetch globally
global.fetch = vi.fn();

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchUsers returns user list on success', async () => {
    const mockUsers = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ];

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ users: mockUsers }),
    });

    const result = await fetchUsers();

    expect(fetch).toHaveBeenCalledWith('/api/users');
    expect(result).toEqual(mockUsers);
  });

  it('fetchUsers throws error on failure', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(fetchUsers()).rejects.toThrow('Failed to fetch users');
  });

  it('createUser sends POST request with data', async () => {
    const newUser = { name: 'John', email: 'john@example.com' };
    const createdUser = { id: 1, ...newUser };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => createdUser,
    });

    const result = await createUser(newUser);

    expect(fetch).toHaveBeenCalledWith('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    expect(result).toEqual(createdUser);
  });
});
```

## Test Coverage Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/**/types.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
  },
});
```

```python
# pytest.ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts =
    --cov=src
    --cov-report=html
    --cov-report=term
    --cov-fail-under=80
```

## Best Practices

1. **AAA Pattern** - Arrange, Act, Assert
2. **One assertion per test** - Keep tests focused
3. **Descriptive names** - Test name explains what it tests
4. **Mock external dependencies** - Database, APIs, file system
5. **Test edge cases** - Empty inputs, nulls, errors
6. **Cleanup** - Reset mocks, clear data after tests
7. **Coverage targets** - Aim for 80%+ coverage

## Test Organization

```
src/
  components/
    Button.tsx
    Button.test.tsx         # Co-located with component
  services/
    api.ts
    api.test.ts             # Co-located with service
  utils/
    validation.ts
    validation.test.ts
tests/
  integration/              # Integration tests
    api.test.ts
  e2e/                      # E2E tests
    login.spec.ts
  fixtures/                 # Test data
    users.json
  setup.ts                  # Test setup
```

## Integration with Other Skills

- **api-endpoint-builder** - Test API endpoints
- **data-validator-generator** - Test validation logic
- **form-builder-with-validation** - Test form behavior

---

**Version**: 1.0.0
**Category**: Testing + DevOps
**Complexity**: Medium
