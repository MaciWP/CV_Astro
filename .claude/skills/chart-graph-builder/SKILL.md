---
name: chart-graph-builder
description: Build charts and graphs with Chart.js, Recharts, Victory. Line charts, bar charts, pie charts, real-time data visualization. Keywords - charts, graphs, data visualization, chart js, recharts, victory, line chart, bar chart, pie chart
---

# Chart/Graph Builder

## When to Use This Skill

Activate when:
- Creating data visualizations (line, bar, pie, area charts)
- Building dashboards with metrics
- Displaying analytics and statistics
- Real-time data visualization
- Interactive charts with tooltips and legends

## What This Skill Does

Creates charts with:
- Line charts (trends over time)
- Bar charts (comparisons)
- Pie/Donut charts (proportions)
- Area charts (cumulative data)
- Real-time updating charts
- Interactive tooltips and legends
- Responsive sizing

## Supported Technologies

**React**:
- Recharts (recommended - composable, React-first)
- Victory (flexible, declarative)
- Chart.js + react-chartjs-2 (feature-rich)
- Tremor (dashboard components)

**Vue 3**:
- Chart.js + vue-chartjs
- ApexCharts + vue3-apexcharts

## Example: Line Chart (Recharts)

```tsx
// components/LineChart.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  date: string;
  revenue: number;
  expenses: number;
}

interface LineChartProps {
  data: DataPoint[];
}

export function RevenueLineChart({ data }: LineChartProps) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value: number) =>
              `$${value.toLocaleString()}`
            }
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            strokeWidth={2}
            name="Revenue"
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#ef4444"
            strokeWidth={2}
            name="Expenses"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Usage
const data = [
  { date: 'Jan', revenue: 4000, expenses: 2400 },
  { date: 'Feb', revenue: 3000, expenses: 1398 },
  { date: 'Mar', revenue: 2000, expenses: 9800 },
  { date: 'Apr', revenue: 2780, expenses: 3908 },
  { date: 'May', revenue: 1890, expenses: 4800 },
  { date: 'Jun', revenue: 2390, expenses: 3800 },
];

<RevenueLineChart data={data} />;
```

## Example: Bar Chart (Recharts)

```tsx
// components/BarChart.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface BarChartData {
  category: string;
  sales: number;
  target: number;
}

export function SalesBarChart({ data }: { data: BarChartData[] }) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#3b82f6" name="Actual Sales" />
          <Bar dataKey="target" fill="#94a3b8" name="Target" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

## Example: Pie Chart (Recharts)

```tsx
// components/PieChart.tsx
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PieData {
  name: string;
  value: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function CategoryPieChart({ data }: { data: PieData[] }) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Usage
const data = [
  { name: 'Electronics', value: 400 },
  { name: 'Clothing', value: 300 },
  { name: 'Food', value: 200 },
  { name: 'Books', value: 150 },
];
```

## Example: Area Chart (Recharts)

```tsx
// components/AreaChart.tsx
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function UserGrowthAreaChart({ data }: { data: { month: string; users: number }[] }) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="users"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorUsers)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
```

## Example: Real-Time Chart (Recharts)

```tsx
// components/RealTimeChart.tsx
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export function RealTimeChart() {
  const [data, setData] = useState<{ time: string; value: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newDataPoint = {
        time: new Date().toLocaleTimeString(),
        value: Math.random() * 100,
      };

      setData((prev) => {
        const updated = [...prev, newDataPoint];
        // Keep last 20 data points
        return updated.slice(-20);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis domain={[0, 100]} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

## Example: Chart.js with React

```tsx
// components/Chart.tsx
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function ChartJsLineChart() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [4000, 3000, 2000, 2780, 1890, 2390],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Revenue',
      },
    },
  };

  return <Line data={data} options={options} />;
}
```

## Example: Vue 3 Chart (Chart.js)

```vue
<!-- components/LineChart.vue -->
<script setup lang="ts">
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue',
      data: [4000, 3000, 2000, 2780, 1890, 2390],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<template>
  <div class="h-80">
    <Line :data="chartData" :options="options" />
  </div>
</template>
```

## Best Practices

1. **Responsive charts** - Use `ResponsiveContainer` or similar
2. **Color accessibility** - Use contrasting colors
3. **Tooltips** - Show detailed data on hover
4. **Legends** - Label all data series
5. **Axis labels** - Clear labels for X and Y axes
6. **Format numbers** - Use locale formatting ($1,000 not 1000)
7. **Loading states** - Show skeleton while loading data
8. **Performance** - Limit data points (subsample if needed)

## Common Chart Types

| Chart Type | Use Case |
|------------|----------|
| **Line** | Trends over time |
| **Bar** | Comparisons between categories |
| **Pie/Donut** | Proportions (parts of whole) |
| **Area** | Cumulative data |
| **Scatter** | Correlation between variables |
| **Histogram** | Distribution of data |

## Integration with Other Skills

- **api-integration-layer** - Fetch chart data from API
- **loading-states-handler** - Skeleton loaders for charts
- **state-management-setup** - Store chart data in global state

---

**Version**: 1.0.0
**Category**: Frontend Extended
**Complexity**: Medium
