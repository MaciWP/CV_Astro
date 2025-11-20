---
name: mock-data-builder
description: Generate mock data for testing with Faker, MSW, factories. API mocking, test fixtures, seed data. Keywords - mock data, faker, msw, test fixtures, factory pattern, seed data, test data generation
---

# Mock Data Builder

## When to Use This Skill

Activate when:
- Generating test data for unit/integration tests
- Mocking API responses for development
- Creating seed data for databases
- Building test fixtures
- Need realistic fake data (names, emails, addresses)

## What This Skill Does

Creates mock data with:
- Realistic fake data (Faker.js, Faker Python)
- API mocking (MSW - Mock Service Worker)
- Factory pattern for test data
- Database seed data
- Consistent test fixtures

## Supported Technologies

**Frontend**:
- @faker-js/faker (realistic fake data)
- MSW (Mock Service Worker - API mocking)
- Factory pattern

**Backend**:
- Faker (Python)
- Factory Boy (Python factory pattern)
- database seed scripts

## Example: Faker.js for Test Data

```typescript
// tests/factories/userFactory.ts
import { faker } from '@faker-js/faker';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: faker.number.int({ min: 1, max: 10000 }),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    role: faker.helpers.arrayElement(['admin', 'user']),
    createdAt: faker.date.past(),
    ...overrides,
  };
}

export function createMockUsers(count: number): User[] {
  return Array.from({ length: count }, () => createMockUser());
}

// Usage in tests
import { createMockUser, createMockUsers } from './factories/userFactory';

it('displays user list', () => {
  const users = createMockUsers(5);
  render(<UserList users={users} />);

  expect(screen.getAllByRole('listitem')).toHaveLength(5);
});

it('highlights admin users', () => {
  const adminUser = createMockUser({ role: 'admin' });
  render(<UserCard user={adminUser} />);

  expect(screen.getByText('Admin')).toBeInTheDocument();
});
```

## Example: MSW (Mock Service Worker) for API Mocking

```typescript
// mocks/handlers.ts
import { http, HttpResponse } from 'msw';
import { createMockUsers } from '../tests/factories/userFactory';

export const handlers = [
  // Mock GET /api/users
  http.get('/api/users', () => {
    return HttpResponse.json({
      users: createMockUsers(10),
      total: 100,
    });
  }),

  // Mock POST /api/users
  http.post('/api/users', async ({ request }) => {
    const newUser = await request.json();
    return HttpResponse.json(
      {
        id: Math.random(),
        ...newUser,
        createdAt: new Date(),
      },
      { status: 201 }
    );
  }),

  // Mock GET /api/users/:id
  http.get('/api/users/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json(
      createMockUser({ id: Number(id) })
    );
  }),

  // Mock error response
  http.delete('/api/users/:id', () => {
    return HttpResponse.json(
      { error: 'Not authorized' },
      { status: 403 }
    );
  }),
];
```

```typescript
// mocks/browser.ts (for development)
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
```

```typescript
// mocks/server.ts (for testing)
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

```typescript
// Setup MSW in tests
// tests/setup.ts
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '../mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

```typescript
// Start MSW in development
// main.tsx
if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser');
  worker.start();
}
```

## Example: Factory Pattern for Complex Data

```typescript
// tests/factories/orderFactory.ts
import { faker } from '@faker-js/faker';
import { createMockUser } from './userFactory';
import { createMockProduct } from './productFactory';

export interface Order {
  id: number;
  user: User;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  createdAt: Date;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export function createMockOrderItem(overrides?: Partial<OrderItem>): OrderItem {
  const product = createMockProduct();
  return {
    product,
    quantity: faker.number.int({ min: 1, max: 5 }),
    price: product.price,
    ...overrides,
  };
}

export function createMockOrder(overrides?: Partial<Order>): Order {
  const items = Array.from(
    { length: faker.number.int({ min: 1, max: 5 }) },
    () => createMockOrderItem()
  );

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    id: faker.number.int({ min: 1, max: 10000 }),
    user: createMockUser(),
    items,
    total,
    status: faker.helpers.arrayElement(['pending', 'paid', 'shipped', 'delivered']),
    createdAt: faker.date.past(),
    ...overrides,
  };
}
```

## Example: Python Faker and Factory Boy

```python
# tests/factories.py
from factory import Factory, Faker, SubFactory, LazyAttribute
from factory.fuzzy import FuzzyChoice
from datetime import datetime
from models import User, Order, OrderItem, Product

class UserFactory(Factory):
    class Meta:
        model = User

    id = Faker('random_int', min=1, max=10000)
    name = Faker('name')
    email = Faker('email')
    role = FuzzyChoice(['admin', 'user'])
    created_at = Faker('past_datetime')

class ProductFactory(Factory):
    class Meta:
        model = Product

    id = Faker('random_int', min=1, max=10000)
    name = Faker('word')
    price = Faker('pydecimal', left_digits=3, right_digits=2, positive=True)
    stock = Faker('random_int', min=0, max=1000)

class OrderItemFactory(Factory):
    class Meta:
        model = OrderItem

    product = SubFactory(ProductFactory)
    quantity = Faker('random_int', min=1, max=5)

    @LazyAttribute
    def price(self):
        return self.product.price

class OrderFactory(Factory):
    class Meta:
        model = Order

    id = Faker('random_int', min=1, max=10000)
    user = SubFactory(UserFactory)
    status = FuzzyChoice(['pending', 'paid', 'shipped', 'delivered'])
    created_at = Faker('past_datetime')

    @LazyAttribute
    def total(self):
        return sum(item.price * item.quantity for item in self.items)

# Usage in tests
def test_order_total_calculation():
    order = OrderFactory.create(
        items=[
            OrderItemFactory.create(quantity=2, price=10.00),
            OrderItemFactory.create(quantity=1, price=5.00),
        ]
    )
    assert order.total == 25.00

def test_admin_user():
    admin = UserFactory.create(role='admin')
    assert admin.role == 'admin'
    assert admin.email  # Faker generated email
```

## Example: Database Seed Data

```typescript
// seeds/users.seed.ts
import { PrismaClient } from '@prisma/client';
import { createMockUsers } from '../tests/factories/userFactory';

const prisma = new PrismaClient();

async function seedUsers() {
  const users = createMockUsers(50);

  for (const user of users) {
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }

  console.log('✅ Seeded 50 users');
}

seedUsers()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

```python
# seeds/seed_users.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from tests.factories import UserFactory
from models import Base

engine = create_engine('postgresql://user:pass@localhost/db')
Session = sessionmaker(bind=engine)
session = Session()

# Create tables
Base.metadata.create_all(engine)

# Seed 50 users
users = [UserFactory.build() for _ in range(50)]
session.add_all(users)
session.commit()

print("✅ Seeded 50 users")
```

## Example: Test Fixtures (JSON)

```typescript
// tests/fixtures/users.json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "user"
  }
]
```

```typescript
// tests/utils/loadFixture.ts
import usersFixture from '../fixtures/users.json';

export function loadFixture<T>(name: string): T {
  const fixtures = {
    users: usersFixture,
  };

  return fixtures[name] as T;
}

// Usage
const users = loadFixture<User[]>('users');
```

## Common Mock Data Patterns

```typescript
// Random from array
faker.helpers.arrayElement(['admin', 'user', 'guest'])

// Random number in range
faker.number.int({ min: 1, max: 100 })

// Random date
faker.date.past() // Past date
faker.date.future() // Future date
faker.date.between({ from: '2020-01-01', to: '2025-12-31' })

// Random person
faker.person.fullName()
faker.person.firstName()
faker.person.lastName()

// Random internet
faker.internet.email()
faker.internet.userName()
faker.internet.url()
faker.internet.avatar()

// Random address
faker.location.city()
faker.location.country()
faker.location.zipCode()

// Random text
faker.lorem.sentence()
faker.lorem.paragraph()
faker.lorem.words(5)

// Random UUID
faker.string.uuid()
```

## Best Practices

1. **Factories over fixtures** - More flexible, less maintenance
2. **Realistic data** - Use Faker for names, emails, etc.
3. **Override specific fields** - Allow customization in factories
4. **Deterministic tests** - Seed Faker for reproducible tests
5. **MSW for API mocking** - Mock at network level, not fetch
6. **Separate dev and test mocks** - Different MSW setups
7. **Don't commit real data** - Use factories, not production dumps

## Integration with Other Skills

- **test-suite-generator** - Use mocks in tests
- **api-endpoint-builder** - Mock API during development
- **database-query-optimizer** - Seed data for performance testing

---

**Version**: 1.0.0
**Category**: Testing + DevOps
**Complexity**: Low-Medium
