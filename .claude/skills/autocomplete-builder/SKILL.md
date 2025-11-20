---
name: autocomplete-builder
description: Build autocomplete/combobox with keyboard navigation, async search, accessibility. Headless UI Combobox, Downshift. Keywords - autocomplete, combobox, typeahead, search suggestions, headless ui combobox, downshift, async autocomplete
---

# Autocomplete Builder

## When to Use This Skill

Activate when:
- Building autocomplete search inputs
- Creating comboboxes with searchable dropdowns
- Need async data loading (search as you type)
- Want keyboard navigation (arrows, Enter, Escape)
- Implementing accessible autocomplete

## What This Skill Does

Creates autocomplete components with:
- Search as you type with debouncing
- Keyboard navigation (arrows, Enter, Esc)
- Async data loading
- Highlighted matching text
- Accessibility (ARIA, screen reader support)
- Loading and empty states

## Supported Technologies

**React**:
- Headless UI Combobox (recommended)
- Downshift
- React Select
- Custom implementation

**Vue 3**:
- Headless UI Vue Combobox
- Custom implementation

## Example: Headless UI Combobox (React)

```tsx
// components/Autocomplete.tsx
import { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useDebounce } from 'use-debounce';

interface Option {
  id: number;
  name: string;
  email?: string;
}

interface AutocompleteProps {
  options: Option[];
  value: Option | null;
  onChange: (value: Option | null) => void;
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function Autocomplete({
  options,
  value,
  onChange,
  onSearch,
  isLoading = false,
  placeholder = 'Search...',
}: AutocompleteProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);

  // Trigger search when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  // Filter options locally
  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) =>
          option.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Combobox value={value} onChange={onChange}>
      <div className="relative">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-gray-300 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
          <Combobox.Input
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
            displayValue={(option: Option | null) => option?.name || ''}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
          </Combobox.Button>
        </div>

        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
          {isLoading ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
              Loading...
            </div>
          ) : filteredOptions.length === 0 && query !== '' ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
              No results found.
            </div>
          ) : (
            filteredOptions.map((option) => (
              <Combobox.Option
                key={option.id}
                value={option}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  }`
                }
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {option.name}
                    </span>
                    {option.email && (
                      <span
                        className={`block text-sm ${
                          active ? 'text-indigo-200' : 'text-gray-500'
                        }`}
                      >
                        {option.email}
                      </span>
                    )}
                    {selected && (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? 'text-white' : 'text-indigo-600'
                        }`}
                      >
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

// Usage
function UserSelector() {
  const [selectedUser, setSelectedUser] = useState<Option | null>(null);
  const [users, setUsers] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query) {
      setUsers([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/search?q=${query}`);
      const data = await response.json();
      setUsers(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Autocomplete
      options={users}
      value={selectedUser}
      onChange={setSelectedUser}
      onSearch={handleSearch}
      isLoading={isLoading}
      placeholder="Search users..."
    />
  );
}
```

## Example: Multi-Select Autocomplete

```tsx
// components/MultiSelectAutocomplete.tsx
import { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';

interface MultiSelectProps {
  options: Option[];
  selected: Option[];
  onChange: (values: Option[]) => void;
}

export function MultiSelectAutocomplete({
  options,
  selected,
  onChange,
}: MultiSelectProps) {
  const [query, setQuery] = useState('');

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) =>
          option.name.toLowerCase().includes(query.toLowerCase())
        );

  const handleSelect = (value: Option[]) => {
    onChange(value);
    setQuery('');
  };

  const handleRemove = (id: number) => {
    onChange(selected.filter((item) => item.id !== id));
  };

  return (
    <Combobox value={selected} onChange={handleSelect} multiple>
      <div className="relative">
        {/* Selected items */}
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {selected.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800"
              >
                {item.name}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="hover:text-indigo-600"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        )}

        <Combobox.Input
          className="w-full rounded-md border border-gray-300 py-2 px-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          onChange={(event) => setQuery(event.target.value)}
          value={query}
          placeholder="Search to add..."
        />

        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
          {filteredOptions.map((option) => (
            <Combobox.Option
              key={option.id}
              value={option}
              disabled={selected.some((item) => item.id === option.id)}
              className={({ active, disabled }) =>
                `relative cursor-pointer select-none py-2 px-4 ${
                  disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : active
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-900'
                }`
              }
            >
              {option.name}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  );
}
```

## Example: Highlighted Text

```tsx
// components/HighlightedText.tsx
function highlightMatch(text: string, query: string) {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-200 font-semibold">
        {part}
      </mark>
    ) : (
      <span key={index}>{part}</span>
    )
  );
}

// Usage in Combobox.Option
<span className="block truncate">
  {highlightMatch(option.name, query)}
</span>
```

## Example: Vue 3 Autocomplete

```vue
<!-- components/Autocomplete.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  ComboboxButton,
} from '@headlessui/vue';
import { useDebounceFn } from '@vueuse/core';

interface Option {
  id: number;
  name: string;
}

const props = defineProps<{
  options: Option[];
  modelValue: Option | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: Option | null];
  search: [query: string];
}>();

const query = ref('');

const debouncedSearch = useDebounceFn((value: string) => {
  emit('search', value);
}, 300);

const filteredOptions = computed(() => {
  if (query.value === '') return props.options;
  return props.options.filter((option) =>
    option.name.toLowerCase().includes(query.value.toLowerCase())
  );
});

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  query.value = value;
  debouncedSearch(value);
};
</script>

<template>
  <Combobox
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="relative">
      <ComboboxInput
        :display-value="(option: Option | null) => option?.name || ''"
        @input="handleInput"
        class="w-full rounded-md border border-gray-300 py-2 px-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        placeholder="Search..."
      />

      <ComboboxOptions
        class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5"
      >
        <div
          v-if="filteredOptions.length === 0 && query !== ''"
          class="relative cursor-default select-none py-2 px-4 text-gray-700"
        >
          No results found.
        </div>

        <ComboboxOption
          v-for="option in filteredOptions"
          :key="option.id"
          :value="option"
          v-slot="{ active, selected }"
          class="relative cursor-pointer select-none py-2 px-4"
          :class="active ? 'bg-indigo-600 text-white' : 'text-gray-900'"
        >
          <span :class="selected ? 'font-semibold' : 'font-normal'">
            {{ option.name }}
          </span>
        </ComboboxOption>
      </ComboboxOptions>
    </div>
  </Combobox>
</template>
```

## Best Practices

1. **Debounce search** - Wait 300ms before API call
2. **Keyboard navigation** - Arrow keys, Enter, Escape
3. **Loading state** - Show "Loading..." while fetching
4. **Empty state** - Show "No results" when nothing found
5. **Highlight matches** - Bold matching text
6. **Accessibility** - Use ARIA attributes (Headless UI handles this)
7. **Clear button** - Allow clearing selection
8. **Min query length** - Require 2-3 chars before search

## Accessibility Checklist

✅ **ARIA attributes** - `aria-autocomplete`, `aria-expanded`
✅ **Keyboard navigation** - Arrow keys, Enter, Escape
✅ **Screen reader** - Announce results and selection
✅ **Focus management** - Focus input on open

## Integration with Other Skills

- **api-integration-layer** - Async data loading with React Query
- **form-builder-with-validation** - Use in forms
- **search-filter-builder** - Combine with filters

---

**Version**: 1.0.0
**Category**: Frontend Extended
**Complexity**: Medium
