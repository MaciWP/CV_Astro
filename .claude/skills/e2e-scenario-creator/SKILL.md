---
name: e2e-scenario-creator
description: Create E2E test scenarios with Playwright, Cypress. User flows, authentication, visual regression. Keywords - e2e testing, playwright, cypress, end to end, user flows, integration testing, visual testing
---

# E2E Scenario Creator

## When to Use This Skill

Activate when:
- Testing complete user flows (login → dashboard → action)
- Need cross-browser testing
- Testing authentication flows
- Visual regression testing
- Testing critical user journeys

## What This Skill Does

Creates E2E tests with:
- Complete user flows (multi-step scenarios)
- Authentication (login, sessions, tokens)
- Form submissions and validations
- Navigation and routing
- API interactions
- Visual regression testing
- Cross-browser testing

## Supported Technologies

**E2E Frameworks**:
- Playwright (recommended - modern, fast)
- Cypress (popular, easy to use)
- Puppeteer (headless Chrome)

## Example: Playwright Basic Test

```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('user can log in with valid credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill in login form
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');

    // Click login button
    await page.getByRole('button', { name: 'Log in' }).click();

    // Wait for navigation to dashboard
    await page.waitForURL('/dashboard');

    // Verify we're logged in
    await expect(page.getByText('Welcome back!')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Log in' }).click();

    // Check error message appears
    await expect(page.getByText('Invalid email or password')).toBeVisible();

    // Still on login page
    await expect(page).toHaveURL('/login');
  });

  test('validates required fields', async ({ page }) => {
    await page.goto('/login');

    // Try to submit without filling fields
    await page.getByRole('button', { name: 'Log in' }).click();

    // Check validation errors
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });
});
```

## Example: Authenticated User Flow (Playwright)

```typescript
// tests/e2e/authenticated.spec.ts
import { test, expect } from '@playwright/test';

// Setup authenticated state before each test
test.beforeEach(async ({ page }) => {
  // Login before each test
  await page.goto('/login');
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.waitForURL('/dashboard');
});

test('user can create a new post', async ({ page }) => {
  // Navigate to create post page
  await page.getByRole('link', { name: 'New Post' }).click();
  await expect(page).toHaveURL('/posts/new');

  // Fill in post form
  await page.getByLabel('Title').fill('My Test Post');
  await page.getByLabel('Content').fill('This is a test post content.');

  // Submit form
  await page.getByRole('button', { name: 'Publish' }).click();

  // Wait for success message
  await expect(page.getByText('Post published successfully')).toBeVisible();

  // Verify redirected to post page
  await expect(page).toHaveURL(/\/posts\/\d+/);
  await expect(page.getByRole('heading', { name: 'My Test Post' })).toBeVisible();
});

test('user can edit their profile', async ({ page }) => {
  // Go to profile page
  await page.getByRole('button', { name: 'Account' }).click();
  await page.getByRole('menuitem', { name: 'Profile' }).click();

  // Edit name
  await page.getByLabel('Name').fill('Updated Name');
  await page.getByRole('button', { name: 'Save' }).click();

  // Check success
  await expect(page.getByText('Profile updated')).toBeVisible();
});
```

## Example: API Mocking in E2E Tests

```typescript
// tests/e2e/with-mocking.spec.ts
import { test, expect } from '@playwright/test';

test('handles slow API gracefully', async ({ page }) => {
  // Mock API to respond slowly
  await page.route('/api/users', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3000)); // 3s delay
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ users: [] }),
    });
  });

  await page.goto('/users');

  // Check loading state appears
  await expect(page.getByText('Loading...')).toBeVisible();

  // Wait for data to load
  await expect(page.getByText('Loading...')).not.toBeVisible({ timeout: 5000 });
});

test('handles API errors', async ({ page }) => {
  // Mock API to return error
  await page.route('/api/users', (route) => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    });
  });

  await page.goto('/users');

  // Check error message
  await expect(page.getByText('Failed to load users')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible();
});
```

## Example: Visual Regression Testing

```typescript
// tests/e2e/visual.spec.ts
import { test, expect } from '@playwright/test';

test('homepage looks correct', async ({ page }) => {
  await page.goto('/');

  // Take screenshot and compare with baseline
  await expect(page).toHaveScreenshot('homepage.png');
});

test('dashboard in light mode', async ({ page }) => {
  await page.goto('/dashboard');

  // Take full page screenshot
  await expect(page).toHaveScreenshot('dashboard-light.png', {
    fullPage: true,
  });
});

test('modal dialog appearance', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open Modal' }).click();

  // Screenshot specific element
  const modal = page.getByRole('dialog');
  await expect(modal).toHaveScreenshot('modal-dialog.png');
});
```

## Example: Cypress Test

```typescript
// cypress/e2e/login.cy.ts
describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('user can log in with valid credentials', () => {
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Check redirected to dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome back!').should('be.visible');
  });

  it('shows error for invalid credentials', () => {
    cy.get('input[name="email"]').type('user@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.contains('Invalid email or password').should('be.visible');
    cy.url().should('include', '/login');
  });
});

// Custom command for login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

// Usage
it('user can access protected page', () => {
  cy.login('user@example.com', 'password123');
  cy.visit('/settings');
  cy.contains('Settings').should('be.visible');
});
```

## Example: Multi-Step User Journey

```typescript
// tests/e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test('complete checkout flow', async ({ page }) => {
  // Step 1: Browse products
  await page.goto('/products');
  await page.getByText('iPhone 15').click();

  // Step 2: Add to cart
  await page.getByRole('button', { name: 'Add to Cart' }).click();
  await expect(page.getByText('Added to cart')).toBeVisible();

  // Step 3: Go to cart
  await page.getByRole('link', { name: 'Cart (1)' }).click();
  await expect(page).toHaveURL('/cart');
  await expect(page.getByText('iPhone 15')).toBeVisible();

  // Step 4: Proceed to checkout
  await page.getByRole('button', { name: 'Checkout' }).click();
  await expect(page).toHaveURL('/checkout');

  // Step 5: Fill shipping info
  await page.getByLabel('Full Name').fill('John Doe');
  await page.getByLabel('Address').fill('123 Main St');
  await page.getByLabel('City').fill('New York');
  await page.getByLabel('ZIP').fill('10001');

  // Step 6: Fill payment info
  await page.getByLabel('Card Number').fill('4242424242424242');
  await page.getByLabel('Expiry').fill('12/25');
  await page.getByLabel('CVC').fill('123');

  // Step 7: Place order
  await page.getByRole('button', { name: 'Place Order' }).click();

  // Step 8: Verify success
  await expect(page).toHaveURL(/\/orders\/\d+/);
  await expect(page.getByText('Order confirmed!')).toBeVisible();
  await expect(page.getByText('Order #')).toBeVisible();
});
```

## Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Best Practices

1. **Test user flows** - Complete journeys, not just pages
2. **Use data-testid** - For elements that change frequently
3. **Wait for elements** - Use `waitFor` instead of `sleep`
4. **Authenticate once** - Save auth state, reuse in tests
5. **Mock external APIs** - Don't depend on third-party services
6. **Run in parallel** - Use workers for speed
7. **Cross-browser** - Test on Chrome, Firefox, Safari
8. **Visual regression** - Screenshot critical pages

## Integration with Other Skills

- **test-suite-generator** - Combine with unit tests
- **mock-data-builder** - Mock API responses in E2E tests
- **api-endpoint-builder** - Test API endpoints

---

**Version**: 1.0.0
**Category**: Testing + DevOps
**Complexity**: Medium-High
