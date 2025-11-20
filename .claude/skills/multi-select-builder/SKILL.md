---
name: multi-select-builder
description: Build multi-select dropdowns with checkboxes, search, select all. Headless UI Listbox, React Select. Keywords - multi select, multiple select, select with checkboxes, searchable select, headless ui listbox, react select multi
---

# Multi-Select Builder

## When to Use This Skill

Activate when:
- Need multi-select dropdowns (select multiple options)
- Building tag/category selectors
- Creating filters with multiple selections
- Want searchable multi-select
- Need "Select All" functionality

## What This Skill Does

Creates multi-select components with:
- Multiple selection with checkboxes
- Search/filter options
- Select all / Deselect all
- Selected items as chips/tags
- Keyboard navigation
- Accessibility

## Supported Technologies

**React**:
- Headless UI Listbox (customizable)
- React Select (feature-rich)
- Downshift (headless)

**Vue 3**:
- Headless UI Vue Listbox
- Vue Multiselect

## Example: Multi-Select with Headless UI (React)

```tsx
// components/MultiSelect.tsx
import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from '@heroicons/react/20/solid';

interface Option {
  id: number;
  name: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: Option[];
  onChange: (selected: Option[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select options',
}: MultiSelectProps) {
  const handleRemove = (id: number) => {
    onChange(selected.filter((item) => item.id !== id));
  };

  return (
    <Listbox value={selected} onChange={onChange} multiple>
      <div className="relative">
        {/* Selected items as chips */}
        {selected.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {selected.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800"
              >
                {item.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item.id);
                  }}
                  className="hover:text-indigo-600"
                  type="button"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Dropdown button */}
        <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
          <span className="block truncate">
            {selected.length === 0
              ? placeholder
              : `${selected.length} selected`}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
          </span>
        </Listbox.Button>

        {/* Options dropdown */}
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {options.map((option) => (
              <Listbox.Option
                key={option.id}
                value={option}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-indigo-100' : 'text-gray-900'
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {option.name}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                        <CheckIcon className="h-5 w-5" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

// Usage
function TagSelector() {
  const [selectedTags, setSelectedTags] = useState<Option[]>([]);

  const tags: Option[] = [
    { id: 1, name: 'JavaScript' },
    { id: 2, name: 'TypeScript' },
    { id: 3, name: 'React' },
    { id: 4, name: 'Vue' },
  ];

  return (
    <MultiSelect
      options={tags}
      selected={selectedTags}
      onChange={setSelectedTags}
      placeholder="Select tags"
    />
  );
}
```

## Example: Searchable Multi-Select

```tsx
// components/SearchableMultiSelect.tsx
import { useState, useMemo } from 'react';
import { Combobox } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';

interface SearchableMultiSelectProps {
  options: Option[];
  selected: Option[];
  onChange: (selected: Option[]) => void;
  placeholder?: string;
}

export function SearchableMultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Search and select',
}: SearchableMultiSelectProps) {
  const [query, setQuery] = useState('');

  const filteredOptions = useMemo(() => {
    if (query === '') return options;
    return options.filter((option) =>
      option.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [options, query]);

  const handleSelect = (newSelected: Option[]) => {
    onChange(newSelected);
    setQuery(''); // Clear search after selection
  };

  const handleRemove = (id: number) => {
    onChange(selected.filter((item) => item.id !== id));
  };

  return (
    <Combobox value={selected} onChange={handleSelect} multiple>
      <div className="relative">
        {/* Selected chips */}
        {selected.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {selected.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800"
              >
                {item.name}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="hover:text-indigo-600"
                  type="button"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Search input */}
        <Combobox.Input
          className="w-full rounded-lg border border-gray-300 py-2 pl-3 pr-10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          onChange={(event) => setQuery(event.target.value)}
          value={query}
          placeholder={placeholder}
        />

        {/* Options dropdown */}
        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
          {filteredOptions.length === 0 && query !== '' ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
              No results found.
            </div>
          ) : (
            filteredOptions.map((option) => (
              <Combobox.Option
                key={option.id}
                value={option}
                disabled={selected.some((item) => item.id === option.id)}
                className={({ active, disabled }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    disabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : active
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-900'
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {option.name}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                        <CheckIcon className="h-5 w-5" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </div>
    </Combobox>
  );
}
```

## Example: Multi-Select with Select All

```tsx
// components/MultiSelectWithSelectAll.tsx
import { Listbox } from '@headlessui/react';

export function MultiSelectWithSelectAll({
  options,
  selected,
  onChange,
}: MultiSelectProps) {
  const handleSelectAll = () => {
    onChange(options);
  };

  const handleDeselectAll = () => {
    onChange([]);
  };

  const allSelected = selected.length === options.length;
  const someSelected = selected.length > 0 && selected.length < options.length;

  return (
    <Listbox value={selected} onChange={onChange} multiple>
      <div className="relative">
        <Listbox.Button className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left">
          <span className="block truncate">
            {selected.length === 0
              ? 'Select options'
              : allSelected
              ? 'All selected'
              : `${selected.length} selected`}
          </span>
        </Listbox.Button>

        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
          {/* Select All / Deselect All */}
          <div className="border-b border-gray-200 pb-2">
            <button
              onClick={allSelected ? handleDeselectAll : handleSelectAll}
              className="w-full px-4 py-2 text-left text-sm font-medium text-indigo-600 hover:bg-indigo-50"
              type="button"
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          {/* Options */}
          {options.map((option) => (
            <Listbox.Option
              key={option.id}
              value={option}
              className={({ active }) =>
                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                  active ? 'bg-indigo-100' : ''
                }`
              }
            >
              {({ selected }) => (
                <>
                  <span
                    className={`block truncate ${
                      selected ? 'font-medium' : 'font-normal'
                    }`}
                  >
                    {option.name}
                  </span>
                  {selected && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                      <CheckIcon className="h-5 w-5" />
                    </span>
                  )}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
```

## Example: Vue 3 Multi-Select

```vue
<!-- components/MultiSelect.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue';

interface Option {
  id: number;
  name: string;
}

const props = defineProps<{
  options: Option[];
  modelValue: Option[];
}>();

const emit = defineEmits<{
  'update:modelValue': [selected: Option[]];
}>();

const handleRemove = (id: number) => {
  const newSelected = props.modelValue.filter((item) => item.id !== id);
  emit('update:modelValue', newSelected);
};
</script>

<template>
  <Listbox
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    multiple
  >
    <div class="relative">
      <!-- Selected chips -->
      <div v-if="modelValue.length > 0" class="mb-2 flex flex-wrap gap-2">
        <span
          v-for="item in modelValue"
          :key="item.id"
          class="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800"
        >
          {{ item.name }}
          <button
            @click.stop="handleRemove(item.id)"
            class="hover:text-indigo-600"
            type="button"
          >
            ×
          </button>
        </span>
      </div>

      <!-- Dropdown button -->
      <ListboxButton
        class="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left"
      >
        <span class="block truncate">
          {{ modelValue.length === 0 ? 'Select options' : `${modelValue.length} selected` }}
        </span>
      </ListboxButton>

      <!-- Options -->
      <ListboxOptions
        class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5"
      >
        <ListboxOption
          v-for="option in options"
          :key="option.id"
          :value="option"
          v-slot="{ active, selected }"
          class="relative cursor-pointer select-none py-2 pl-10 pr-4"
          :class="active ? 'bg-indigo-100' : ''"
        >
          <span :class="selected ? 'font-medium' : 'font-normal'">
            {{ option.name }}
          </span>
          <span
            v-if="selected"
            class="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600"
          >
            ✓
          </span>
        </ListboxOption>
      </ListboxOptions>
    </div>
  </Listbox>
</template>
```

## Best Practices

1. **Show selected count** - Display "X selected" in button
2. **Remove chips** - Allow removing individual selections
3. **Search functionality** - Filter options in large lists
4. **Select all** - Provide "Select All" / "Deselect All"
5. **Keyboard navigation** - Arrow keys, Enter, Escape
6. **Max selections** - Limit number of selections if needed
7. **Accessibility** - ARIA attributes, screen reader support

## Integration with Other Skills

- **form-builder-with-validation** - Multi-select in forms
- **search-filter-builder** - Multi-select filters
- **api-integration-layer** - Send selected IDs to API

---

**Version**: 1.0.0
**Category**: Frontend Extended
**Complexity**: Medium
