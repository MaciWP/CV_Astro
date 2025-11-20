---
name: date-picker-setup
description: Setup date pickers with range selection, time picker, timezone support. React DatePicker, Flatpickr, date-fns. Keywords - date picker, calendar, date range picker, time picker, react datepicker, flatpickr, date selection
---

# Date Picker Setup

## When to Use This Skill

Activate when:
- Need date selection UI (calendar popup)
- Building date range pickers (start/end dates)
- Implementing time picker or datetime picker
- Need timezone support
- Creating booking or scheduling interfaces

## What This Skill Does

Creates date pickers with:
- Single date selection
- Date range selection (start/end)
- Time picker integration
- Timezone support
- Min/max date restrictions
- Disabled dates (blackout dates)
- Custom date formatting
- Accessibility

## Supported Technologies

**React**:
- react-datepicker (popular, customizable)
- react-day-picker (lightweight)
- @mui/x-date-pickers (Material UI)
- Flatpickr (vanilla JS, works anywhere)

**Vue 3**:
- @vuepic/vue-datepicker
- vue3-datepicker

**Date Libraries**:
- date-fns (modern, tree-shakeable)
- Day.js (lightweight)
- Luxon (timezone support)

## Example: React DatePicker (Single Date)

```tsx
// components/DatePicker.tsx
import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePicker({
  selected,
  onChange,
  minDate,
  maxDate,
  placeholder = 'Select date',
  disabled = false,
}: DatePickerProps) {
  return (
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      minDate={minDate}
      maxDate={maxDate}
      placeholderText={placeholder}
      disabled={disabled}
      dateFormat="MMM dd, yyyy"
      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
      wrapperClassName="w-full"
    />
  );
}

// Usage
function BookingForm() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <DatePicker
      selected={date}
      onChange={setDate}
      minDate={new Date()} // Today onwards
      maxDate={addDays(new Date(), 90)} // Next 90 days
      placeholder="Select booking date"
    />
  );
}
```

## Example: Date Range Picker

```tsx
// components/DateRangePicker.tsx
import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { format, differenceInDays } from 'date-fns';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (dates: { start: Date | null; end: Date | null }) => void;
  minDate?: Date;
  maxDate?: Date;
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  minDate,
  maxDate,
}: DateRangePickerProps) {
  const handleChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    onChange({ start, end });
  };

  const nights =
    startDate && endDate ? differenceInDays(endDate, startDate) : 0;

  return (
    <div>
      <ReactDatePicker
        selected={startDate}
        onChange={handleChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        minDate={minDate}
        maxDate={maxDate}
        monthsShown={2} // Show 2 months side by side
        placeholderText="Select date range"
        dateFormat="MMM dd, yyyy"
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
      />
      {nights > 0 && (
        <p className="mt-2 text-sm text-gray-600">
          {nights} night{nights !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
```

## Example: DateTime Picker (Date + Time)

```tsx
// components/DateTimePicker.tsx
import ReactDatePicker from 'react-datepicker';
import { useState } from 'react';

export function DateTimePicker() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <ReactDatePicker
      selected={date}
      onChange={setDate}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={15} // 15 minute intervals
      dateFormat="MMM dd, yyyy h:mm aa"
      timeCaption="Time"
      minDate={new Date()}
      filterTime={(time) => {
        // Only allow 9 AM to 6 PM
        const hour = time.getHours();
        return hour >= 9 && hour < 18;
      }}
      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
    />
  );
}
```

## Example: Custom Date Input (Material UI)

```tsx
// components/DatePicker.tsx (Material UI)
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';

export function MuiDatePicker() {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        value={value}
        onChange={setValue}
        minDate={new Date()}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}
```

## Example: Vue 3 Date Picker

```vue
<!-- components/DatePicker.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const date = ref<Date | null>(null);

const emit = defineEmits<{
  'update:modelValue': [date: Date | null];
}>();
</script>

<template>
  <VueDatePicker
    v-model="date"
    :min-date="new Date()"
    :enable-time-picker="false"
    format="MMM dd, yyyy"
    placeholder="Select date"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
```

## Example: Disabled Dates (Blackout Dates)

```tsx
// Block weekends and specific dates
function BookingDatePicker() {
  const [date, setDate] = useState<Date | null>(null);

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };

  const blackoutDates = [
    new Date('2025-12-25'), // Christmas
    new Date('2025-01-01'), // New Year
  ];

  const isBlackoutDate = (date: Date) => {
    return blackoutDates.some(
      (blackout) =>
        blackout.toDateString() === date.toDateString()
    );
  };

  return (
    <ReactDatePicker
      selected={date}
      onChange={setDate}
      filterDate={(date) => !isWeekend(date) && !isBlackoutDate(date)}
      highlightDates={blackoutDates}
      minDate={new Date()}
      placeholderText="Select weekday"
    />
  );
}
```

## Example: Timezone Support (Luxon)

```tsx
// components/TimezoneDatePicker.tsx
import { DateTime } from 'luxon';
import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';

interface TimezoneDatePickerProps {
  timezone: string; // 'America/New_York', 'Europe/London', etc.
  onChange: (isoString: string) => void;
}

export function TimezoneDatePicker({
  timezone,
  onChange,
}: TimezoneDatePickerProps) {
  const [date, setDate] = useState<Date | null>(null);

  const handleChange = (newDate: Date | null) => {
    setDate(newDate);
    if (newDate) {
      // Convert to ISO string in the specified timezone
      const dt = DateTime.fromJSDate(newDate, { zone: timezone });
      onChange(dt.toISO()!);
    }
  };

  return (
    <div>
      <ReactDatePicker
        selected={date}
        onChange={handleChange}
        showTimeSelect
        dateFormat="MMM dd, yyyy h:mm aa"
        timeZone={timezone}
      />
      <p className="mt-2 text-sm text-gray-500">Timezone: {timezone}</p>
    </div>
  );
}
```

## Custom Styling

```css
/* Custom DatePicker styles */
.react-datepicker {
  @apply border-gray-300 shadow-lg;
}

.react-datepicker__header {
  @apply bg-indigo-600 border-b-0;
}

.react-datepicker__current-month,
.react-datepicker__day-name {
  @apply text-white;
}

.react-datepicker__day--selected,
.react-datepicker__day--keyboard-selected {
  @apply bg-indigo-600 text-white hover:bg-indigo-700;
}

.react-datepicker__day:hover {
  @apply bg-gray-100;
}

.react-datepicker__day--disabled {
  @apply text-gray-300 cursor-not-allowed;
}
```

## Best Practices

1. **Min/max dates** - Restrict selectable dates
2. **Disabled dates** - Block weekends, holidays, unavailable dates
3. **Date formatting** - Use consistent format (ISO 8601 for API, locale format for display)
4. **Timezone handling** - Store UTC, display in user's timezone
5. **Validation** - Validate date ranges (end > start)
6. **Accessibility** - Keyboard navigation, ARIA labels
7. **Mobile-friendly** - Use native picker on mobile (`type="date"`)

## Common Date Formats

```tsx
import { format } from 'date-fns';

// Display formats
format(date, 'MMM dd, yyyy'); // Jan 15, 2025
format(date, 'MMMM do, yyyy'); // January 15th, 2025
format(date, 'MM/dd/yyyy'); // 01/15/2025
format(date, 'yyyy-MM-dd'); // 2025-01-15 (ISO 8601)

// API format (ISO 8601)
date.toISOString(); // 2025-01-15T10:30:00.000Z
```

## Integration with Other Skills

- **form-builder-with-validation** - Date validation in forms
- **api-integration-layer** - Send dates in ISO format
- **state-management-setup** - Store selected dates in store

---

**Version**: 1.0.0
**Category**: Frontend Extended
**Complexity**: Low-Medium
