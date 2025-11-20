---
name: "Flutter DI Architecture"
description: "Enforces dependency injection patterns in Flutter projects using constructor injection. Auto-activates on: DI, dependency injection, service, constructor, architecture. Prevents hard-coded services, singleton abuse, static methods. Ensures testability with mock services, interface-based contracts, and Riverpod/Provider/GetIt integration. Validates constructor parameters, interface naming (I*Service), mock availability. Targets: 100% DI compliance, 0 new Singleton() calls, 0 static service methods."
---

# Flutter DI Architecture

**Auto-activates when**: Discussing dependency injection, services, constructors, or architecture in Flutter projects.

---

## 🎯 Mission

Enforce **100% dependency injection** in Flutter code for testability, maintainability, and SOLID principles compliance.

---

## 📐 Core Principles

### 1. Constructor Injection

**Rule**: All services MUST be injected via constructor, never instantiated directly.

```dart
// ❌ WRONG - Hard-coded dependency
class HomeScreen extends StatelessWidget {
  final AuthService authService = AuthService(); // Direct instantiation!

  @override
  Widget build(BuildContext context) {
    return Text(authService.currentUser.name);
  }
}

// ✅ CORRECT - Constructor injection
class HomeScreen extends StatelessWidget {
  final AuthService authService;

  const HomeScreen({
    super.key,
    required this.authService,
  });

  @override
  Widget build(BuildContext context) {
    return Text(authService.currentUser.name);
  }
}
```

**Auto-check**:
- [ ] Does widget accept services as constructor parameters?
- [ ] Are services marked `required`?
- [ ] No `new ServiceName()` or `ServiceName()` calls in widget?

---

### 2. Interface-Based Contracts

**Rule**: Depend on abstractions (IService), not concrete implementations.

```dart
// ❌ WRONG - Depends on concrete class
class HomeScreen extends StatelessWidget {
  final AuthService authService; // Concrete class

  const HomeScreen({required this.authService});
}

// ✅ CORRECT - Depends on interface
abstract class IAuthService {
  Future<User?> getCurrentUser();
  Future<void> signOut();
}

class AuthService implements IAuthService {
  @override
  Future<User?> getCurrentUser() async { /* ... */ }

  @override
  Future<void> signOut() async { /* ... */ }
}

class HomeScreen extends StatelessWidget {
  final IAuthService authService; // Interface!

  const HomeScreen({required this.authService});
}
```

**Auto-check**:
- [ ] Service parameters use interface type (I*)?
- [ ] Interface defined in separate file (services/interfaces/)?
- [ ] Implementation in services/implementations/?

---

### 3. Provider Integration (Riverpod)

**Rule**: Use Riverpod providers to supply dependencies at app root.

```dart
// ✅ CORRECT - Provider pattern
@riverpod
IAuthService authService(AuthServiceRef ref) {
  return AuthService(
    apiClient: ref.watch(apiClientProvider),
    storage: ref.watch(secureStorageProvider),
  );
}

// Usage in widget
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authService = ref.watch(authServiceProvider);
    return Text(authService.currentUser?.name ?? 'Guest');
  }
}
```

**Auto-check**:
- [ ] All services have Riverpod providers?
- [ ] Providers in lib/providers/ directory?
- [ ] Widgets use ConsumerWidget/Consumer/ref.watch()?

---

## 🚫 Anti-Patterns to PREVENT

### 1. Singleton Pattern

```dart
// ❌ ANTI-PATTERN - Singleton
class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  Future<void> signIn() { /* ... */ }
}

// Usage (not testable!)
final auth = AuthService(); // Always returns same instance
```

**Why**: Singletons create global mutable state, impossible to test, prevent mocking.

---

### 2. Static Methods for Logic

```dart
// ❌ ANTI-PATTERN - Static methods
class ValidationService {
  static bool validateEmail(String email) {
    return email.contains('@');
  }
}

// Usage (not mockable!)
if (ValidationService.validateEmail(email)) { /* ... */ }
```

**Why**: Static methods can't be mocked in tests, violate DI principles.

---

### 3. Service Locator (GetIt) Overuse

```dart
// ❌ ANTI-PATTERN - Service locator in widgets
class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final authService = GetIt.I<AuthService>(); // Hidden dependency!
    return Text(authService.currentUser.name);
  }
}
```

**Why**: Hidden dependencies, widgets not self-documenting, hard to test.

---

## 🔍 Proactive Validation Checklist

**Run automatically before approving code**:

### Critical (Must Fix)
- [ ] No `new ClassName()` service instantiation in widgets?
- [ ] No `ClassName()` factory calls in widgets?
- [ ] All services injected via constructor?
- [ ] Service parameters marked `required`?

### High Priority
- [ ] Services use interface types (I*)?
- [ ] Interfaces in services/interfaces/ folder?
- [ ] Mocks available in services/mocks/ for testing?
- [ ] Riverpod providers defined for all services?

### Medium Priority
- [ ] No singleton pattern (static _instance)?
- [ ] No static methods with business logic?
- [ ] GetIt only used at app root (not in widgets)?
- [ ] Services registered in main.dart or app_init.dart?

---

## 📚 Reference Documents

| Document | Purpose |
|----------|---------|
| `lib/services/interfaces/` | Service interface definitions |
| `lib/services/implementations/` | Concrete service implementations |
| `lib/services/mocks/` | Mock services for testing |
| `lib/providers/` | Riverpod provider definitions |
| `test/widget_test.dart` | Example DI testing patterns |

---

## 🎯 Activation Criteria

**Keywords**: "DI", "dependency injection", "service", "constructor", "architecture", "singleton", "provider", "injectable"

**Auto-suggest when**:
- User creates new StatelessWidget/StatefulWidget
- User adds service to widget
- User mentions "service", "DI", "dependency"
- User discusses testing/mocking

---

**Last Updated**: 2025-10-20
**Version**: 1.0.0
**DI Compliance Target**: 100% (0 direct instantiations in widgets)
