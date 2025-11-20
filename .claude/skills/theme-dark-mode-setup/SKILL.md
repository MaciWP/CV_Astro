---
name: theme-dark-mode-setup
description: |
  This skill sets up dark mode / theme switching with persistence and system preference detection.
  Supports React (Context API, use-dark-mode), Vue 3 (Composition API), Tailwind CSS, CSS variables.
  Creates theme provider, toggle component, localStorage persistence, system preference detection (prefers-color-scheme).
  Activate when user says "dark mode", "theme switcher", "light/dark toggle", or needs theme switching.
  Output: Complete theme system with toggle, persistence, system detection, and smooth transitions.
---

# Theme/Dark Mode Setup

> **Purpose**: Set up dark mode with persistence and system preference detection

---

## When to Use

- ✅ Add dark mode to application
- ✅ Theme switcher (light/dark/auto)
- ✅ Persist user preference
- ✅ User says: "dark mode", "theme switcher", "light/dark"

---

## React + Tailwind CSS

```tsx
// contexts/ThemeContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'system';
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('theme', theme);

    // Get actual theme
    const root = window.document.documentElement;

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      setActualTheme(systemTheme);
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      setActualTheme(theme);
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      const systemTheme = e.matches ? 'dark' : 'light';
      setActualTheme(systemTheme);
      document.documentElement.classList.toggle('dark', e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

**Theme Toggle Component**:
```tsx
// components/ThemeToggle.tsx
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded ${
          theme === 'light' ? 'bg-white dark:bg-gray-700 shadow' : ''
        }`}
        title="Light mode"
      >
        <Sun className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded ${
          theme === 'dark' ? 'bg-white dark:bg-gray-700 shadow' : ''
        }`}
        title="Dark mode"
      >
        <Moon className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded ${
          theme === 'system' ? 'bg-white dark:bg-gray-700 shadow' : ''
        }`}
        title="System preference"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
}
```

**Usage**:
```tsx
// App.tsx
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <header className="p-4 flex justify-between items-center">
          <h1>My App</h1>
          <ThemeToggle />
        </header>

        <main className="p-4">
          <p>This text changes color based on theme!</p>
        </main>
      </div>
    </ThemeProvider>
  );
}
```

**Tailwind Config**:
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3b82f6',
          dark: '#60a5fa'
        }
      }
    }
  }
};
```

---

## Vue 3 Composition API

```typescript
// composables/useTheme.ts
import { ref, watch, onMounted } from 'vue';

type Theme = 'light' | 'dark' | 'system';

const theme = ref<Theme>('system');
const actualTheme = ref<'light' | 'dark'>('light');

export function useTheme() {
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  const updateActualTheme = () => {
    const root = document.documentElement;

    if (theme.value === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      actualTheme.value = systemTheme;
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      actualTheme.value = theme.value;
      root.classList.toggle('dark', theme.value === 'dark');
    }
  };

  watch(theme, updateActualTheme);

  onMounted(() => {
    // Load from localStorage
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) {
      theme.value = saved;
    }

    updateActualTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateActualTheme);
  });

  return {
    theme,
    actualTheme,
    setTheme
  };
}
```

**Theme Toggle Component**:
```vue
<script setup lang="ts">
import { useTheme } from '@/composables/useTheme';

const { theme, setTheme } = useTheme();
</script>

<template>
  <div class="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
    <button
      @click="setTheme('light')"
      :class="['p-2 rounded', theme === 'light' ? 'bg-white shadow' : '']"
    >
      ☀️
    </button>

    <button
      @click="setTheme('dark')"
      :class="['p-2 rounded', theme === 'dark' ? 'bg-white shadow' : '']"
    >
      🌙
    </button>

    <button
      @click="setTheme('system')"
      :class="['p-2 rounded', theme === 'system' ? 'bg-white shadow' : '']"
    >
      💻
    </button>
  </div>
</template>
```

---

**Skill Version**: 1.0.0
**Technologies**: React (Context API), Vue 3, Tailwind CSS, CSS variables
**Output**: Dark mode system with toggle, persistence, system detection, smooth transitions
