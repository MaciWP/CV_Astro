---
name: utils-builder
description: Create utility functions and helper modules with pure functions and TypeScript types. Generates formatters (time, bytes, numbers), constants (colors, event types), and chart renderers (Canvas API). Keywords - utility function, helper, format, constants, utils, formatter, pure function, chart renderer
---

# Utils Builder - Poneglyph System

Creates utility functions and helper modules following the pure function patterns from the reference project, ensuring type safety, maintainability, and reusability across the Poneglyph System.

## When to Use This Skill

This skill should be used when users want to create utility functions, formatters, constants, or helper modules that follow Poneglyph's established patterns.

### Explicit Activation Contexts

Activate when:
- User explicitly requests utility creation ("create a utility for...", "build a formatter that...")
- User wants to create formatters (time, bytes, numbers, duration)
- User wants to define constants (colors, event types, severity levels, time ranges)
- User wants to create chart renderers or Canvas API utilities
- User asks about utility function patterns

### Proactive Detection Scenarios

Auto-suggest when detecting:
- Repeated formatting logic across multiple components (3+ instances)
- Hardcoded constants scattered throughout the codebase
- Side effects in functions that should be pure
- Missing type annotations in utility functions
- Conversational patterns: "create utility", "helper function", "format", "renderer"
- Duplicate chart rendering code

---

## Mission

Generate **production-ready utility modules** with **100% pure functions**, **explicit TypeScript 5.7+ types**, **comprehensive JSDoc documentation**, and **zero side effects**. Enforce Single Responsibility Principle, prevent god objects, and ensure utilities follow Poneglyph's **formatters.ts**, **constants.ts**, and **chartRenderer.ts** patterns from the reference project.

---

## Core Patterns

### Pattern 1: Pure Functions Only

All utility functions MUST be pure: same inputs always produce same outputs, with NO side effects.

❌ **WRONG - Impure function with side effects**:
```typescript
let globalCounter = 0;

function formatNumber(value: number): string {
  globalCounter++; // ❌ Modifies external state
  console.log('Formatting:', value); // ❌ Side effect (logging)
  return value.toFixed(2);
}
```

✅ **CORRECT - Pure function**:
```typescript
/**
 * Format a number to 2 decimal places
 * @param value - The number to format
 * @returns Formatted string with 2 decimal places
 * @example formatNumber(1234.567) // "1234.57"
 */
export function formatNumber(value: number): string {
  return value.toFixed(2);
}
```

**Auto-Check**:
- [ ] Function has no side effects (no console.log, no DOM manipulation, no external state changes)?
- [ ] Same inputs always produce same outputs?
- [ ] No mutations of input parameters?
- [ ] No async operations or timers?

---

### Pattern 2: Explicit TypeScript Types

All parameters and return values MUST have explicit type annotations. Never use implicit `any`.

❌ **WRONG - Missing type annotations**:
```typescript
// ❌ No parameter types, no return type
function formatRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  return diff < 60000 ? 'just now' : 'a while ago';
}
```

✅ **CORRECT - Explicit types**:
```typescript
/**
 * Format a timestamp as relative time (e.g., "2 hours ago")
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Human-readable relative time string
 * @example formatRelativeTime(Date.now() - 60000) // "1 minute ago"
 */
export function formatRelativeTime(timestamp: number): string {
  const now: number = Date.now();
  const diff: number = now - timestamp;

  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
  return `${Math.floor(diff / 86400000)} days ago`;
}
```

**Auto-Check**:
- [ ] All function parameters have type annotations?
- [ ] Return type is explicitly declared?
- [ ] No use of `any` type (unless absolutely necessary with justification)?
- [ ] Complex types use TypeScript interfaces or types?
- [ ] TSConfig strict mode enabled and passing?

---

### Pattern 3: Single Responsibility Principle

Each utility function does ONE thing and does it well. No god functions.

❌ **WRONG - God function doing multiple things**:
```typescript
// ❌ Does formatting, validation, AND transformation
function processData(value: number | string, options?: any) {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }

  if (isNaN(value) || value < 0) {
    throw new Error('Invalid value');
  }

  if (options?.format === 'bytes') {
    return formatBytes(value);
  } else if (options?.format === 'duration') {
    return formatDuration(value);
  } else {
    return value.toFixed(2);
  }
}
```

✅ **CORRECT - Separate focused functions**:
```typescript
/**
 * Format bytes to human-readable size (e.g., "1.5 KB")
 * @param bytes - Number of bytes
 * @returns Formatted string with appropriate unit
 * @example formatBytes(1536) // "1.5 KB"
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Format milliseconds to human-readable duration (e.g., "2h 30m")
 * @param ms - Duration in milliseconds
 * @returns Formatted duration string
 * @example formatDuration(9000000) // "2h 30m"
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}
```

**Auto-Check**:
- [ ] Each function has a single, clear purpose?
- [ ] Function name clearly describes what it does (verb-first)?
- [ ] Function is under 30 lines of code?
- [ ] No nested conditionals deeper than 2 levels?

---

### Pattern 4: Individual Named Exports

Export functions individually, NOT as default exports. Makes tree-shaking easier.

❌ **WRONG - Default export or namespace export**:
```typescript
// ❌ Default export
export default {
  formatNumber,
  formatBytes,
  formatDuration
};

// ❌ Namespace export
export const Formatters = {
  formatNumber,
  formatBytes,
  formatDuration
};
```

✅ **CORRECT - Individual named exports**:
```typescript
/**
 * Format a number with thousand separators
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes: number): string {
  // Implementation
  return `${bytes} B`;
}

/**
 * Format milliseconds to duration
 */
export function formatDuration(ms: number): string {
  // Implementation
  return `${ms}ms`;
}

// Usage:
// import { formatNumber, formatBytes } from './formatters';
```

**Auto-Check**:
- [ ] All functions are exported individually with `export function`?
- [ ] No default exports?
- [ ] No object/namespace wrappers around functions?
- [ ] Imports are specific (not `import * as Utils`)?

---

### Pattern 5: Comprehensive JSDoc Comments

Every utility function MUST have JSDoc with description, parameters, return value, and example.

❌ **WRONG - Missing or incomplete JSDoc**:
```typescript
// ❌ No JSDoc at all
export function formatRelativeTime(timestamp: number): string {
  // Implementation
  return 'just now';
}

// ❌ Incomplete JSDoc
/**
 * Format time
 */
export function formatRelativeTime(timestamp: number): string {
  return 'just now';
}
```

✅ **CORRECT - Complete JSDoc**:
```typescript
/**
 * Format a Unix timestamp as relative time (e.g., "2 hours ago", "just now")
 *
 * Converts a timestamp to a human-readable relative time string.
 * Uses progressive time units: seconds, minutes, hours, days.
 *
 * @param timestamp - Unix timestamp in milliseconds (from Date.now() or .getTime())
 * @returns Human-readable relative time string
 *
 * @example
 * formatRelativeTime(Date.now() - 1000) // "just now"
 * formatRelativeTime(Date.now() - 60000) // "1 minute ago"
 * formatRelativeTime(Date.now() - 3600000) // "1 hour ago"
 * formatRelativeTime(Date.now() - 86400000) // "1 day ago"
 */
export function formatRelativeTime(timestamp: number): string {
  const now: number = Date.now();
  const diff: number = now - timestamp;

  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} minute${Math.floor(diff / 60000) === 1 ? '' : 's'} ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hour${Math.floor(diff / 3600000) === 1 ? '' : 's'} ago`;
  return `${Math.floor(diff / 86400000)} day${Math.floor(diff / 86400000) === 1 ? '' : 's'} ago`;
}
```

**Auto-Check**:
- [ ] Every exported function has JSDoc comment?
- [ ] JSDoc includes description (multi-line for complex functions)?
- [ ] All `@param` tags present with types and descriptions?
- [ ] `@returns` tag present with description?
- [ ] At least one `@example` showing usage?

---

## Anti-Patterns

### Anti-Pattern 1: Mixing Side Effects with Pure Logic

❌ **ANTI-PATTERN - Side effects in utility**:
```typescript
// ❌ Logging, DOM manipulation, API calls in utility
export function formatAndLog(value: number): string {
  console.log('Formatting value:', value); // ❌ Side effect
  document.title = `Value: ${value}`; // ❌ DOM manipulation

  fetch('/api/log', {
    method: 'POST',
    body: JSON.stringify({ value })
  }); // ❌ Network call

  return value.toFixed(2);
}
```

✅ **CORRECT - Pure function, caller handles side effects**:
```typescript
/**
 * Format a number to 2 decimal places
 * @param value - Number to format
 * @returns Formatted string
 */
export function formatNumber(value: number): string {
  return value.toFixed(2);
}

// Caller handles side effects separately:
// const formatted = formatNumber(123.456);
// console.log('Formatted:', formatted); // Side effect in component
```

**Why It Matters**: Pure functions are predictable, testable, and cacheable. Side effects make testing difficult and introduce unpredictable behavior.

---

### Anti-Pattern 2: Using Mutable Constants

❌ **ANTI-PATTERN - Mutable constants**:
```typescript
// ❌ Using 'let' or mutable objects
export let COLOR_PRIMARY = '#3b82f6'; // ❌ Can be reassigned
export const SEVERITY_LEVELS = ['debug', 'info']; // ❌ Array is mutable

// ❌ Mutable nested objects
export const CHART_CONFIG = {
  colors: {
    primary: '#3b82f6'
  }
};
// Caller can do: CHART_CONFIG.colors.primary = 'red'; ❌
```

✅ **CORRECT - Immutable constants with 'as const'**:
```typescript
/**
 * Primary color palette for Poneglyph System
 * Uses blue-based theme matching Tailwind primary-500
 */
export const COLOR_PALETTE = {
  primary: '#3b82f6',
  secondary: '#6366f1',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#0ea5e9'
} as const;

/**
 * Event severity levels in ascending order
 * Maps to PostgreSQL ENUM severity_level
 */
export const SEVERITY_LEVELS = [
  'debug',
  'info',
  'warning',
  'error',
  'critical'
] as const;

/**
 * Type-safe severity level union
 */
export type SeverityLevel = typeof SEVERITY_LEVELS[number];
```

**Why It Matters**: `as const` provides deep readonly immutability and enables literal type inference, preventing accidental mutations and improving type safety.

---

### Anti-Pattern 3: Missing Type Guards for Union Types

❌ **ANTI-PATTERN - No type guards for union types**:
```typescript
// ❌ No type narrowing
export function formatValue(value: number | string): string {
  // ❌ TypeScript error: 'value' might be string
  return value.toFixed(2);
}
```

✅ **CORRECT - Type guards with explicit checks**:
```typescript
/**
 * Format a value to 2 decimal places
 * Handles both number and numeric string inputs
 * @param value - Number or numeric string
 * @returns Formatted string or 'N/A' for invalid inputs
 * @example
 * formatValue(123.456) // "123.46"
 * formatValue("123.456") // "123.46"
 * formatValue("invalid") // "N/A"
 */
export function formatValue(value: number | string): string {
  // Type guard
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return 'N/A';
  }

  return numValue.toFixed(2);
}
```

**Why It Matters**: Type guards enable TypeScript to narrow union types, ensuring type safety and preventing runtime errors from incorrect type assumptions.

---

### Anti-Pattern 4: God Objects with Multiple Responsibilities

❌ **ANTI-PATTERN - Single object doing everything**:
```typescript
// ❌ One giant Utils object
export const Utils = {
  // Time formatting
  formatTime: (ms: number) => { /* ... */ },
  parseTime: (str: string) => { /* ... */ },

  // Number formatting
  formatNumber: (n: number) => { /* ... */ },
  parseNumber: (str: string) => { /* ... */ },

  // String manipulation
  capitalize: (str: string) => { /* ... */ },
  truncate: (str: string, len: number) => { /* ... */ },

  // Array operations
  unique: <T>(arr: T[]) => { /* ... */ },
  groupBy: <T>(arr: T[], key: keyof T) => { /* ... */ },

  // Chart rendering
  renderChart: (ctx: CanvasRenderingContext2D) => { /* ... */ }
};
```

✅ **CORRECT - Separate modules by responsibility**:
```typescript
// formatters.ts - Pure formatting functions
export function formatRelativeTime(timestamp: number): string { /* ... */ }
export function formatBytes(bytes: number): string { /* ... */ }
export function formatDuration(ms: number): string { /* ... */ }
export function formatNumber(value: number): string { /* ... */ }

// constants.ts - Immutable configuration
export const COLOR_PALETTE = { /* ... */ } as const;
export const EVENT_TYPES = [ /* ... */ ] as const;
export const SEVERITY_LEVELS = [ /* ... */ ] as const;

// chartRenderer.ts - Canvas rendering class
export class ChartRenderer {
  constructor(canvas: HTMLCanvasElement, config: ChartConfig) { /* ... */ }
  drawBars(data: ChartDataPoint[]): void { /* ... */ }
  clear(): void { /* ... */ }
}

// arrayUtils.ts - Array operations (if needed)
export function unique<T>(arr: T[]): T[] { /* ... */ }
export function groupBy<T>(arr: T[], key: keyof T): Map<T[keyof T], T[]> { /* ... */ }
```

**Why It Matters**: Separation of concerns improves maintainability, enables tree-shaking, makes testing easier, and prevents merge conflicts in team environments.

---

### Anti-Pattern 5: Unclear Function Names

❌ **ANTI-PATTERN - Vague or abbreviated names**:
```typescript
// ❌ Unclear what these do
export function proc(val: any): any { /* ... */ }
export function fmt(v: number): string { /* ... */ }
export function calc(a: number, b: number): number { /* ... */ }
export function getData(): any[] { /* ... */ }
```

✅ **CORRECT - Clear, descriptive names**:
```typescript
/**
 * Format milliseconds to human-readable duration
 */
export function formatDuration(milliseconds: number): string { /* ... */ }

/**
 * Calculate average value from array of numbers
 */
export function calculateAverage(values: number[]): number { /* ... */ }

/**
 * Convert bytes to kilobytes
 */
export function bytesToKilobytes(bytes: number): number { /* ... */ }
```

**Why It Matters**: Function names are documentation. Clear names reduce cognitive load and make code self-documenting.

---

## Validation Checklist

Before marking skill complete, verify:

### Code Quality (35 points)
- [ ] All functions are pure (no side effects, same input = same output) (10 pts)
- [ ] TypeScript strict mode enabled and all types explicit (no implicit any) (10 pts)
- [ ] Each function follows Single Responsibility Principle (under 30 lines) (10 pts)
- [ ] All exports are individual named exports (no default exports) (5 pts)

### Documentation Quality (25 points)
- [ ] Every function has comprehensive JSDoc (description, params, returns, example) (15 pts)
- [ ] JSDoc examples are runnable and demonstrate actual usage (5 pts)
- [ ] Comments explain WHY, not WHAT (code is self-documenting) (5 pts)

### Type Safety (25 points)
- [ ] All parameters have explicit type annotations (5 pts)
- [ ] All return types are explicitly declared (5 pts)
- [ ] Union types use type guards for narrowing (5 pts)
- [ ] Constants use 'as const' for deep immutability (5 pts)
- [ ] Complex types use interfaces or type aliases (5 pts)

### Module Organization (15 points)
- [ ] Utilities grouped by responsibility (formatters, constants, renderers) (5 pts)
- [ ] No god objects or multi-purpose modules (5 pts)
- [ ] Clear file naming (formatters.ts, constants.ts, chartRenderer.ts) (5 pts)

### Total: __/100

**Minimum Score**: 90/100 for production use

---

## Standard Utility Modules

### formatters.ts Structure

```typescript
/**
 * Poneglyph System - Formatter Utilities
 * Pure functions for formatting time, numbers, bytes, and durations
 * Version: 1.0.0
 * Generated: YYYY-MM-DD
 */

/**
 * Format Unix timestamp as relative time
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Human-readable relative time (e.g., "2 hours ago")
 * @example formatRelativeTime(Date.now() - 3600000) // "1 hour ago"
 */
export function formatRelativeTime(timestamp: number): string {
  // Implementation
}

/**
 * Format number with thousand separators
 * @param value - Number to format
 * @returns Formatted string (e.g., "1,234,567")
 * @example formatNumber(1234567) // "1,234,567"
 */
export function formatNumber(value: number): string {
  // Implementation
}

/**
 * Format bytes to human-readable size
 * @param bytes - Number of bytes
 * @returns Formatted string with unit (e.g., "1.5 MB")
 * @example formatBytes(1572864) // "1.5 MB"
 */
export function formatBytes(bytes: number): string {
  // Implementation
}

/**
 * Format milliseconds to duration string
 * @param ms - Duration in milliseconds
 * @returns Formatted duration (e.g., "2h 30m")
 * @example formatDuration(9000000) // "2h 30m"
 */
export function formatDuration(ms: number): string {
  // Implementation
}
```

### constants.ts Structure

```typescript
/**
 * Poneglyph System - Application Constants
 * Immutable configuration values for colors, event types, and time ranges
 * Version: 1.0.0
 * Generated: YYYY-MM-DD
 */

/**
 * Color palette for Poneglyph System
 * Matches Chart.js theme and Tailwind CSS colors
 */
export const COLOR_PALETTE = {
  primary: '#3b82f6',
  secondary: '#6366f1',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#0ea5e9',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    500: '#6b7280',
    700: '#374151',
    900: '#111827'
  }
} as const;

/**
 * Event type categories
 * Maps to backend EventTypeSchema
 */
export const EVENT_TYPES = [
  'tool_use_started',
  'tool_use_completed',
  'user_prompt_submitted',
  'agent_started',
  'agent_completed',
  'agent_stopped',
  'context_compacted',
  'subagent_stopped'
] as const;

export type EventType = typeof EVENT_TYPES[number];

/**
 * Severity levels in ascending order
 * Maps to PostgreSQL ENUM severity_level
 */
export const SEVERITY_LEVELS = [
  'debug',
  'info',
  'warning',
  'error',
  'critical'
] as const;

export type SeverityLevel = typeof SEVERITY_LEVELS[number];

/**
 * Time range options for charts and filters
 */
export const TIME_RANGES = {
  '1m': 60 * 1000,
  '3m': 3 * 60 * 1000,
  '5m': 5 * 60 * 1000,
  '10m': 10 * 60 * 1000,
  '1h': 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000
} as const;

export type TimeRangeKey = keyof typeof TIME_RANGES;
```

### chartRenderer.ts Structure

```typescript
/**
 * Poneglyph System - Canvas Chart Renderer
 * High-performance chart rendering using Canvas API
 * Version: 1.0.0
 * Generated: YYYY-MM-DD
 */

export interface ChartDimensions {
  width: number;
  height: number;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface ChartConfig {
  maxDataPoints: number;
  barWidth: number;
  animationDuration: number;
  colors: {
    primary: string;
    axis: string;
    text: string;
    glow: string;
  };
}

export interface ChartDataPoint {
  timestamp: number;
  count: number;
  eventTypes?: Record<string, number>;
  sessions?: Record<string, number>;
}

/**
 * Canvas-based chart renderer with animations and glow effects
 *
 * Handles high-performance rendering of bar charts with:
 * - Device pixel ratio scaling
 * - Gradient fills and glow effects
 * - Smooth animations with easing
 * - Interactive labels and tooltips
 *
 * @example
 * const renderer = new ChartRenderer(canvas, dimensions, config);
 * renderer.clear();
 * renderer.drawBackground();
 * renderer.drawAxes();
 * renderer.drawBars(dataPoints, maxValue);
 */
export class ChartRenderer {
  private ctx: CanvasRenderingContext2D;
  private dimensions: ChartDimensions;
  private config: ChartConfig;
  private animationId: number | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    dimensions: ChartDimensions,
    config: ChartConfig
  ) {
    // Implementation
  }

  /**
   * Clear the entire canvas
   */
  clear(): void {
    // Implementation
  }

  /**
   * Draw subtle gradient background
   */
  drawBackground(): void {
    // Implementation
  }

  /**
   * Draw X and Y axes
   */
  drawAxes(): void {
    // Implementation
  }

  /**
   * Draw bar chart with animations and glow effects
   * @param dataPoints - Array of data points to render
   * @param maxValue - Maximum value for scaling
   * @param progress - Animation progress (0 to 1)
   */
  drawBars(
    dataPoints: ChartDataPoint[],
    maxValue: number,
    progress?: number
  ): void {
    // Implementation
  }

  /**
   * Start smooth animation with easing
   * @param renderCallback - Callback invoked on each frame with progress (0-1)
   */
  animate(renderCallback: (progress: number) => void): void {
    // Implementation
  }

  /**
   * Stop ongoing animation
   */
  stopAnimation(): void {
    // Implementation
  }

  /**
   * Resize canvas and re-setup DPR scaling
   * @param dimensions - New dimensions
   */
  resize(dimensions: ChartDimensions): void {
    // Implementation
  }
}

/**
 * Factory function to create ChartRenderer instance
 * @param canvas - Canvas element to render to
 * @param dimensions - Chart dimensions with padding
 * @param config - Chart configuration
 * @returns ChartRenderer instance
 */
export function createChartRenderer(
  canvas: HTMLCanvasElement,
  dimensions: ChartDimensions,
  config: ChartConfig
): ChartRenderer {
  return new ChartRenderer(canvas, dimensions, config);
}
```

---

## References

| Pattern | File Path | Description |
|---------|-----------|-------------|
| Pure Functions | `frontend/src/composables/useHooksMetrics.ts` | Example of composable with pure computed functions |
| Canvas Rendering | `D:\PYTHON\claude-code-hooks-multi-agent-observability-main\apps\client\src\utils\chartRenderer.ts` | Reference ChartRenderer class with Canvas API |
| Canvas Usage | `frontend/src/components/LivePulseChart.vue` | Example of Canvas rendering in Vue component |
| TypeScript Strict | `frontend/tsconfig.json` | strict: true configuration |
| Named Exports | `frontend/src/composables/useWebSocket.ts` | Individual export pattern |
| JSDoc Style | `frontend/src/composables/useHooksMetrics.ts` | Comprehensive JSDoc comments |
| Constants Pattern | `frontend/src/composables/useHooksMetrics.ts:HOOK_MAPPINGS` | Immutable constant arrays |

---

## Usage Example

### Creating formatters.ts

**User Request**: "Create a formatters utility with time, bytes, and number formatting"

**Skill Output**:

```typescript
/**
 * Poneglyph System - Formatter Utilities
 * Pure functions for formatting time, numbers, bytes, and durations
 * Version: 1.0.0
 * Generated: 2025-11-13
 */

/**
 * Format Unix timestamp as relative time (e.g., "2 hours ago")
 *
 * Converts millisecond timestamps to human-readable relative time.
 * Progressive time units: seconds → minutes → hours → days.
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Human-readable relative time string
 * @example
 * formatRelativeTime(Date.now() - 1000) // "just now"
 * formatRelativeTime(Date.now() - 60000) // "1 minute ago"
 * formatRelativeTime(Date.now() - 3600000) // "1 hour ago"
 */
export function formatRelativeTime(timestamp: number): string {
  const now: number = Date.now();
  const diff: number = now - timestamp;

  if (diff < 60000) return 'just now';

  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }

  const hours = Math.floor(diff / 3600000);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }

  const days = Math.floor(diff / 86400000);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

/**
 * Format number with thousand separators (e.g., "1,234,567")
 *
 * Uses browser's locale formatting for proper number display.
 *
 * @param value - Number to format
 * @returns Formatted string with thousand separators
 * @example
 * formatNumber(1234567) // "1,234,567"
 * formatNumber(1234.56) // "1,234.56"
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

/**
 * Format bytes to human-readable size (e.g., "1.5 MB")
 *
 * Converts byte values to appropriate units (B, KB, MB, GB, TB).
 * Uses binary units (1024) not decimal (1000).
 *
 * @param bytes - Number of bytes
 * @returns Formatted string with unit
 * @example
 * formatBytes(0) // "0 B"
 * formatBytes(1536) // "1.5 KB"
 * formatBytes(1572864) // "1.5 MB"
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Format milliseconds to human-readable duration (e.g., "2h 30m")
 *
 * Converts millisecond durations to hours/minutes/seconds format.
 * Shows most significant two units only.
 *
 * @param ms - Duration in milliseconds
 * @returns Formatted duration string
 * @example
 * formatDuration(1000) // "1s"
 * formatDuration(90000) // "1m 30s"
 * formatDuration(9000000) // "2h 30m"
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }

  return `${seconds}s`;
}
```

**Validation**:
- ✅ All functions are pure (no side effects)
- ✅ Explicit TypeScript types for all parameters and returns
- ✅ Each function has single responsibility
- ✅ Individual named exports
- ✅ Comprehensive JSDoc with examples
- ✅ TypeScript strict mode compatible

---

## Success Criteria

After using this skill:
- ✅ Utilities are production-ready with zero side effects
- ✅ 100% type safety with TypeScript strict mode
- ✅ Every function has comprehensive JSDoc with examples
- ✅ Utilities follow Single Responsibility Principle
- ✅ Code is testable, cacheable, and tree-shakeable
- ✅ Follows Poneglyph patterns from reference project
- ✅ Can be imported and used immediately

---

**Skill Version**: 1.0.0
**Project**: Poneglyph System
**Stack**: TypeScript 5.7+ + Canvas API
**Patterns**: Pure functions, Explicit types, SRP, Named exports, JSDoc
**References**: chartRenderer.ts (observability-main), useHooksMetrics.ts, LivePulseChart.vue
