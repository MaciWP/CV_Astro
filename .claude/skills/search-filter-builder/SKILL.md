---
name: search-filter-builder
description: Build search and filter UI with debounce, multi-select filters, faceted search. TanStack Table filters, URL state. Keywords - search, filter, debounce, faceted search, multi filter, tanstack table filter, search box, filter chips
---

# Search/Filter Builder

## When to Use This Skill

Activate when:
- Building search boxes with debouncing
- Implementing multi-select filters
- Creating faceted search (filter by multiple criteria)
- Filter large datasets in tables or lists
- Need URL-based filters (shareable/bookmarkable)

## What This Skill Does

Creates search and filter UI with:
- Search input with debouncing
- Multi-select filters (checkboxes, dropdowns)
- Filter chips (active filters display)
- Clear all filters
- URL state synchronization
- Real-time filtering with performance optimization

## Supported Technologies

**React**:
- TanStack Table (built-in filtering)
- React Hook Form (filter forms)
- use-debounce

**Vue 3**:
- VueUse - useDebounceFn
- Pinia (filter state)

## Example: Search with Debounce (React)

```tsx
// components/SearchInput.tsx
import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid';

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function SearchInput({
  onSearch,
  placeholder = 'Search...',
  debounceMs = 300,
}: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, debounceMs);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-10 focus:border-indigo-500 focus:ring-indigo-500"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );
}
```

## Example: Multi-Select Filters

```tsx
// components/FilterPanel.tsx
import { useState } from 'react';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterPanelProps {
  categories: FilterOption[];
  statuses: FilterOption[];
  onFilterChange: (filters: { categories: string[]; statuses: string[] }) => void;
}

export function FilterPanel({
  categories,
  statuses,
  onFilterChange,
}: FilterPanelProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const handleCategoryChange = (value: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, value]
      : selectedCategories.filter((c) => c !== value);

    setSelectedCategories(newCategories);
    onFilterChange({ categories: newCategories, statuses: selectedStatuses });
  };

  const handleStatusChange = (value: string, checked: boolean) => {
    const newStatuses = checked
      ? [...selectedStatuses, value]
      : selectedStatuses.filter((s) => s !== value);

    setSelectedStatuses(newStatuses);
    onFilterChange({ categories: selectedCategories, statuses: newStatuses });
  };

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedStatuses([]);
    onFilterChange({ categories: [], statuses: [] });
  };

  return (
    <div className="space-y-6">
      {/* Filter header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filters</h3>
        {(selectedCategories.length > 0 || selectedStatuses.length > 0) && (
          <button
            onClick={clearAll}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category filters */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.value)}
                onChange={(e) =>
                  handleCategoryChange(category.value, e.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">{category.label}</span>
              {category.count !== undefined && (
                <span className="text-sm text-gray-400">({category.count})</span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Status filters */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Status</h4>
        <div className="space-y-2">
          {statuses.map((status) => (
            <label key={status.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedStatuses.includes(status.value)}
                onChange={(e) =>
                  handleStatusChange(status.value, e.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">{status.label}</span>
              {status.count !== undefined && (
                <span className="text-sm text-gray-400">({status.count})</span>
              )}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## Example: Filter Chips (Active Filters)

```tsx
// components/FilterChips.tsx
import { XMarkIcon } from '@heroicons/react/20/solid';

interface Filter {
  key: string;
  label: string;
  value: string;
}

interface FilterChipsProps {
  filters: Filter[];
  onRemove: (key: string, value: string) => void;
  onClearAll: () => void;
}

export function FilterChips({ filters, onRemove, onClearAll }: FilterChipsProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter, index) => (
        <span
          key={`${filter.key}-${filter.value}-${index}`}
          className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800"
        >
          <span className="font-medium">{filter.label}:</span>
          <span>{filter.value}</span>
          <button
            onClick={() => onRemove(filter.key, filter.value)}
            className="ml-1 hover:text-indigo-600"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </span>
      ))}
      {filters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-sm text-gray-600 hover:text-gray-900 underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
```

## Example: URL State Synchronization

```tsx
// hooks/useFilterParams.ts
import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export function useFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getFilter = useCallback(
    (key: string): string[] => {
      const value = searchParams.get(key);
      return value ? value.split(',') : [];
    },
    [searchParams]
  );

  const setFilter = useCallback(
    (key: string, values: string[]) => {
      const newParams = new URLSearchParams(searchParams);
      if (values.length > 0) {
        newParams.set(key, values.join(','));
      } else {
        newParams.delete(key);
      }
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const clearAllFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return {
    getFilter,
    setFilter,
    clearAllFilters,
  };
}

// Usage
function ProductList() {
  const { getFilter, setFilter, clearAllFilters } = useFilterParams();

  const categories = getFilter('category');
  const statuses = getFilter('status');

  const handleFilterChange = (filters: { categories: string[]; statuses: string[] }) => {
    setFilter('category', filters.categories);
    setFilter('status', filters.statuses);
  };

  // URL: /products?category=electronics,books&status=active
}
```

## Example: TanStack Table with Filters

```tsx
// components/ProductTable.tsx
import { useReactTable, getCoreRowModel, getFilteredRowModel, ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  category: string;
  status: string;
  price: number;
}

export function ProductTable({ data }: { data: Product[] }) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      enableColumnFilter: true,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      filterFn: 'arrIncludesSome', // For multi-select
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
    {
      accessorKey: 'price',
      header: 'Price',
      filterFn: 'inNumberRange',
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div>
      {/* Global search */}
      <SearchInput onSearch={setGlobalFilter} />

      {/* Table */}
      <table>
        {/* ... table rendering ... */}
      </table>

      <div className="mt-4 text-sm text-gray-600">
        Showing {table.getRowModel().rows.length} of {data.length} results
      </div>
    </div>
  );
}
```

## Example: Vue 3 Search with Debounce

```vue
<!-- components/SearchInput.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';

const emit = defineEmits<{
  search: [query: string];
}>();

const query = ref('');

const debouncedSearch = useDebounceFn((value: string) => {
  emit('search', value);
}, 300);

watch(query, (newValue) => {
  debouncedSearch(newValue);
});
</script>

<template>
  <div class="relative">
    <input
      v-model="query"
      type="text"
      placeholder="Search..."
      class="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-10 focus:border-indigo-500 focus:ring-indigo-500"
    />
    <button
      v-if="query"
      @click="query = ''"
      class="absolute inset-y-0 right-0 flex items-center pr-3"
    >
      ×
    </button>
  </div>
</template>
```

## Best Practices

1. **Debounce search** - Wait 300ms before triggering search
2. **URL state** - Sync filters to URL for shareable links
3. **Clear filters** - Provide "Clear all" button
4. **Filter chips** - Show active filters visually
5. **Count results** - Show "X of Y results"
6. **Keyboard shortcuts** - Cmd+K to focus search
7. **Loading states** - Show loading during filter

## Performance Tips

```tsx
// ❌ BAD: Filter on every keystroke
<input onChange={(e) => filterData(e.target.value)} />

// ✅ GOOD: Debounce search
const [debouncedQuery] = useDebounce(query, 300);
useEffect(() => filterData(debouncedQuery), [debouncedQuery]);
```

## Integration with Other Skills

- **table-datagrid-builder** - Add search/filter to tables
- **api-integration-layer** - Server-side filtering with React Query
- **state-management-setup** - Store filters in global state

---

**Version**: 1.0.0
**Category**: Frontend Extended
**Complexity**: Medium
