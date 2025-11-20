---
name: drag-drop-builder
description: Implement drag and drop with dnd-kit, react-beautiful-dnd. Sortable lists, drag between containers, file upload. Keywords - drag and drop, dnd kit, sortable list, react beautiful dnd, draggable, droppable, file drag drop
---

# Drag and Drop Builder

## When to Use This Skill

Activate when:
- Building sortable lists (reorder items)
- Drag and drop between containers (Kanban boards)
- File upload with drag and drop
- Building visual editors or dashboards
- Creating interactive UI components

## What This Skill Does

Implements drag and drop with:
- Sortable lists (reorder items)
- Multi-container drag and drop (Kanban)
- Touch support (mobile)
- Smooth animations
- Accessibility (keyboard navigation)
- File drag and drop upload

## Supported Technologies

**React**:
- dnd-kit (recommended - modern, performant)
- react-beautiful-dnd (simple, deprecated)
- react-dnd (powerful but complex)

**Vue 3**:
- @vueuse/integrations (Sortable.js)
- vuedraggable-next

## Example: Sortable List with dnd-kit (React)

```tsx
// components/SortableList.tsx
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

interface Item {
  id: string;
  title: string;
}

// Sortable Item Component
function SortableItem({ id, title }: Item) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center gap-3">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8h16M4 16h16"
          />
        </svg>
        <span className="font-medium">{title}</span>
      </div>
    </div>
  );
}

// Sortable List Component
export function SortableList() {
  const [items, setItems] = useState<Item[]>([
    { id: '1', title: 'Task 1' },
    { id: '2', title: 'Task 2' },
    { id: '3', title: 'Task 3' },
    { id: '4', title: 'Task 4' },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {items.map((item) => (
            <SortableItem key={item.id} {...item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
```

## Example: Kanban Board (Multi-Container)

```tsx
// components/KanbanBoard.tsx
import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DroppableColumn } from './DroppableColumn';
import { SortableTask } from './SortableTask';

interface Task {
  id: string;
  title: string;
  columnId: string;
}

interface Column {
  id: string;
  title: string;
}

export function KanbanBoard() {
  const [columns] = useState<Column[]>([
    { id: 'todo', title: 'To Do' },
    { id: 'inProgress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Task 1', columnId: 'todo' },
    { id: '2', title: 'Task 2', columnId: 'todo' },
    { id: '3', title: 'Task 3', columnId: 'inProgress' },
    { id: '4', title: 'Task 4', columnId: 'done' },
  ]);

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask) return;

    // Moving to a different column
    const overColumn = columns.find((c) => c.id === overId);
    if (overColumn) {
      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === activeId
            ? { ...task, columnId: overColumn.id }
            : task
        )
      );
    } else if (overTask && activeTask.columnId !== overTask.columnId) {
      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === activeId
            ? { ...task, columnId: overTask.columnId }
            : task
        )
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    const overTask = tasks.find((t) => t.id === over.id);

    if (activeTask && overTask && activeTask.columnId === overTask.columnId) {
      const columnTasks = tasks.filter((t) => t.columnId === activeTask.columnId);
      const oldIndex = columnTasks.findIndex((t) => t.id === active.id);
      const newIndex = columnTasks.findIndex((t) => t.id === over.id);

      const reorderedTasks = arrayMove(columnTasks, oldIndex, newIndex);
      setTasks((tasks) => [
        ...tasks.filter((t) => t.columnId !== activeTask.columnId),
        ...reorderedTasks,
      ]);
    }

    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4">
        {columns.map((column) => (
          <DroppableColumn key={column.id} id={column.id} title={column.title}>
            <SortableContext
              items={tasks.filter((t) => t.columnId === column.id)}
              strategy={verticalListSortingStrategy}
            >
              {tasks
                .filter((task) => task.columnId === column.id)
                .map((task) => (
                  <SortableTask key={task.id} {...task} />
                ))}
            </SortableContext>
          </DroppableColumn>
        ))}
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="rounded-lg bg-white p-4 shadow-lg">
            {tasks.find((t) => t.id === activeId)?.title}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
```

## Example: File Drag and Drop Upload

```tsx
// components/FileDropzone.tsx
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileWithPreview extends File {
  preview: string;
}

export function FileDropzone() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : isDragReject
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-600">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-gray-600">
              Drag and drop files here, or click to select
            </p>
            <p className="text-sm text-gray-400 mt-2">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
        )}
      </div>

      {/* File previews */}
      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={file.preview}
                alt={file.name}
                className="w-full h-32 object-cover rounded-lg"
                onLoad={() => URL.revokeObjectURL(file.preview)}
              />
              <button
                onClick={() =>
                  setFiles((files) => files.filter((_, i) => i !== index))
                }
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Example: Vue 3 Sortable List

```vue
<!-- components/SortableList.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useSortable } from '@vueuse/integrations/useSortable';

interface Item {
  id: string;
  title: string;
}

const items = ref<Item[]>([
  { id: '1', title: 'Task 1' },
  { id: '2', title: 'Task 2' },
  { id: '3', title: 'Task 3' },
]);

const listRef = ref<HTMLElement | null>(null);

useSortable(listRef, items, {
  animation: 150,
  handle: '.drag-handle',
});
</script>

<template>
  <div ref="listRef" class="space-y-2">
    <div
      v-for="item in items"
      :key="item.id"
      class="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md"
    >
      <div class="flex items-center gap-3">
        <svg
          class="drag-handle h-5 w-5 text-gray-400 cursor-grab"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 8h16M4 16h16"
          />
        </svg>
        <span class="font-medium">{{ item.title }}</span>
      </div>
    </div>
  </div>
</template>
```

## Best Practices

1. **Use dnd-kit** - Modern, performant, accessible (React)
2. **Keyboard support** - Enable keyboard navigation for accessibility
3. **Visual feedback** - Show drag state with opacity/shadows
4. **Drag handles** - Use specific handles to initiate drag
5. **Touch support** - Works on mobile devices
6. **Animations** - Smooth transitions for better UX
7. **Prevent default** - Prevent browser's default drag behavior

## Accessibility Checklist

✅ **Keyboard navigation** - Arrow keys to move items
✅ **Screen reader support** - Announce drag state
✅ **Focus management** - Focus follows dragged item
✅ **ARIA attributes** - `aria-grabbed`, `aria-dropeffect`

## Integration with Other Skills

- **state-management-setup** - Store dragged items in global state
- **api-integration-layer** - Save reordered items to backend
- **loading-states-handler** - Show loading during save

---

**Version**: 1.0.0
**Category**: Frontend Extended
**Complexity**: Medium-High
