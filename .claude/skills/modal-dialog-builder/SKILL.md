---
name: modal-dialog-builder
description: Build accessible modal dialogs with focus management, keyboard navigation, backdrop, animations. React, Vue 3, Headless UI, Radix UI. Keywords - modal, dialog, popup, overlay, accessible modal, focus trap, keyboard navigation, headless ui
---

# Modal/Dialog Builder

## When to Use This Skill

Activate when:
- Creating modal dialogs for forms, confirmations, alerts
- Need accessible modals (focus management, ARIA, keyboard)
- Building dialogs with Headless UI or Radix UI
- Want animated transitions and backdrop
- Implementing nested modals or multi-step wizards

## What This Skill Does

Creates modal dialogs with:
- Accessibility (ARIA roles, focus trap, keyboard navigation)
- Focus management (trap focus inside modal)
- Keyboard navigation (ESC to close, Tab trap)
- Backdrop click to close
- Smooth animations (enter/exit)
- Multiple sizes and variants
- Nested modals support

## Supported Technologies

**React**:
- Headless UI (recommended - accessible by default)
- Radix UI Dialog
- React Modal
- Custom implementation

**Vue 3**:
- Headless UI Vue
- Custom implementation with Composition API

**Styling**:
- Tailwind CSS
- CSS Modules
- Styled Components

## Example: Headless UI Modal (React)

```tsx
// components/Modal.tsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  {showCloseButton && (
                    <button
                      type="button"
                      className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onClick={onClose}
                      aria-label="Close modal"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="mt-4">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

// Usage
function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Edit User"
        size="lg"
      >
        <p className="text-sm text-gray-500">
          Make changes to your profile here.
        </p>

        <form className="mt-4 space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full rounded-md border px-3 py-2"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-md border px-3 py-2"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
```

## Example: Confirmation Dialog (React)

```tsx
// components/ConfirmDialog.tsx
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
}: ConfirmDialogProps) {
  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-indigo-600 hover:bg-indigo-700',
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-gray-500">{message}</p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300"
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          className={`rounded-md px-4 py-2 text-sm font-medium text-white ${variantStyles[variant]}`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}

// Usage
<ConfirmDialog
  isOpen={isDeleteOpen}
  onClose={() => setIsDeleteOpen(false)}
  onConfirm={() => deleteUser(userId)}
  title="Delete User"
  message="Are you sure you want to delete this user? This action cannot be undone."
  confirmText="Delete"
  variant="danger"
/>
```

## Example: Vue 3 Modal (Headless UI)

```vue
<!-- components/Modal.vue -->
<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

interface Props {
  modelValue: boolean;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showCloseButton: true,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

const close = () => {
  emit('update:modelValue', false);
};
</script>

<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" @close="close" class="relative z-50">
      <!-- Backdrop -->
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/25 backdrop-blur-sm" />
      </TransitionChild>

      <!-- Modal container -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              :class="[
                'w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all',
                sizeClasses[size],
              ]"
            >
              <!-- Header -->
              <div class="flex items-start justify-between">
                <DialogTitle
                  as="h3"
                  class="text-lg font-medium leading-6 text-gray-900"
                >
                  {{ title }}
                </DialogTitle>
                <button
                  v-if="showCloseButton"
                  type="button"
                  class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  @click="close"
                  aria-label="Close modal"
                >
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>

              <!-- Content -->
              <div class="mt-4">
                <slot />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<!-- Usage -->
<script setup lang="ts">
import { ref } from 'vue';
import Modal from './components/Modal.vue';

const isOpen = ref(false);
</script>

<template>
  <button @click="isOpen = true">Open Modal</button>

  <Modal v-model="isOpen" title="Edit User" size="lg">
    <p class="text-sm text-gray-500">
      Make changes to your profile here.
    </p>

    <form class="mt-4 space-y-4" @submit.prevent="handleSubmit">
      <input
        type="text"
        placeholder="Name"
        class="w-full rounded-md border px-3 py-2"
      />
      <input
        type="email"
        placeholder="Email"
        class="w-full rounded-md border px-3 py-2"
      />

      <div class="flex justify-end gap-2">
        <button
          type="button"
          @click="isOpen = false"
          class="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Save
        </button>
      </div>
    </form>
  </Modal>
</template>
```

## Accessibility Checklist

✅ **Keyboard navigation**:
- ESC to close
- Tab trap (focus stays inside modal)
- Focus first interactive element on open
- Return focus to trigger on close

✅ **ARIA attributes**:
- `role="dialog"` or use `<dialog>` element
- `aria-modal="true"`
- `aria-labelledby` (title ID)
- `aria-describedby` (content ID)

✅ **Visual**:
- Visible focus indicators
- Sufficient color contrast
- Backdrop to dim background

## Best Practices

1. **Use Headless UI** - Accessible by default (recommended)
2. **Focus trap** - Prevent Tab from leaving modal
3. **ESC to close** - Standard keyboard interaction
4. **Backdrop click** - Close on outside click (optional)
5. **Return focus** - Return to trigger element on close
6. **Scroll lock** - Prevent body scroll when modal open
7. **Animations** - Smooth enter/exit transitions
8. **Nested modals** - Support multiple layers (z-index management)

## Common Modal Variants

**1. Alert/Notification**:
- Single "OK" button
- Auto-close after timeout

**2. Confirmation**:
- "Cancel" and "Confirm" buttons
- Variants: danger, warning, info

**3. Form**:
- Input fields
- "Cancel" and "Submit" buttons
- Validation

**4. Full-screen**:
- Large content (image viewer, video)
- Close button in corner

## Integration with Other Skills

- **form-builder-with-validation** - Forms inside modals
- **loading-states-handler** - Loading states during submission
- **toast-notification-system** - Success/error toasts after modal actions

---

**Version**: 1.0.0
**Category**: Frontend Extended
**Complexity**: Medium
