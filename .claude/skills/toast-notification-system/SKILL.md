---
name: toast-notification-system
description: |
  This skill creates toast/snackbar notification systems with animations and auto-dismiss.
  Supports React (react-hot-toast, Sonner), Vue 3 (vue-toastification), with success/error/warning/info types, positions, animations.
  Generates toast provider, toast functions, custom toast components, animations, accessibility (ARIA live regions).
  Activate when user says "toast notification", "show message", "success notification", "error toast", or needs feedback messages.
  Output: Complete toast system with provider, toast functions, animations, accessibility, and custom styles.
---

# Toast/Notification System

> **Purpose**: Create toast notifications with animations and auto-dismiss

---

## When to Use

- ✅ Show success/error messages
- ✅ User feedback (saved, deleted, error occurred)
- ✅ User says: "toast", "notification", "show message", "success toast"

---

## React Hot Toast

```tsx
// App.tsx
import { Toaster, toast } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff'
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff'
            }
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff'
            }
          }
        }}
      />

      <YourApp />
    </>
  );
}
```

**Usage**:
```tsx
import { toast } from 'react-hot-toast';

function UserForm() {
  const handleSubmit = async (data: any) => {
    try {
      await createUser(data);

      toast.success('User created successfully!', {
        duration: 3000,
        position: 'top-right'
      });
    } catch (error) {
      toast.error(`Failed to create user: ${error.message}`, {
        duration: 5000
      });
    }
  };

  // Custom toast with action
  const handleDelete = (id: number) => {
    toast((t) => (
      <div>
        <p>Are you sure you want to delete this user?</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              deleteUser(id);
              toast.dismiss(t.id);
              toast.success('User deleted');
            }}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: Infinity // Don't auto-dismiss
    });
  };

  return (
    <button onClick={() => toast.success('Hello!')}>
      Show Toast
    </button>
  );
}
```

---

## Vue 3 Toast

```typescript
// main.ts
import { createApp } from 'vue';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);

app.use(Toast, {
  position: 'top-right',
  timeout: 4000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6
});

app.mount('#app');
```

**Usage in Component**:
```vue
<script setup lang="ts">
import { useToast } from 'vue-toastification';

const toast = useToast();

async function handleSubmit() {
  try {
    await createUser(data);
    toast.success('User created successfully!');
  } catch (error) {
    toast.error(`Failed: ${error.message}`);
  }
}

function showCustomToast() {
  toast.info('Processing...', {
    timeout: 2000,
    icon: '⏳'
  });
}
</script>

<template>
  <button @click="toast.success('Hello!')">
    Show Toast
  </button>
</template>
```

---

**Skill Version**: 1.0.0
**Technologies**: React (react-hot-toast, Sonner), Vue 3 (vue-toastification)
**Output**: Toast system with success/error/warning/info, animations, auto-dismiss
