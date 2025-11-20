---
name: orchestrator-observability
description: Monitor orchestrator performance, track prompt enhancement scores, detect workflow bottlenecks, and export metrics to PostgreSQL with WebSocket broadcasting. Keywords - monitoring, metrics, performance, observability, track metrics, workflow bottleneck, performance monitoring, orchestrator metrics
version: 1.0.0
---

# Orchestrator Observability Skill

Monitor the adaptive meta-orchestrator's performance, track prompt enhancement effectiveness, and provide real-time visibility into workflow optimizations for the Poneglyph System.

## Key Metrics Tracked

### Orchestrator Performance Metrics
- **Context detection accuracy**: Percentage of correctly identified contexts (language, domain, complexity)
- **Prompt enhancement score**: Quality score of enhanced prompts (0-100, based on Anthropic best practices)
- **Workflow speedup**: Time saved vs baseline execution (measured in %, target: 5-10x)
- **Multi-agent detection rate**: Accuracy of multi-agent task identification
- **Auto-documentation rate**: Percentage of tasks that triggered automatic documentation

### Prompt Enhancement Metrics
- **XML structure usage**: Count of prompts using proper XML tags (<analysis>, <plan>, etc.)
- **Pattern application**: Which prompt patterns were applied (template, COT, reflection, etc.)
- **Token optimization**: Token reduction achieved (target: 30-60% via TOON principles)
- **Confidence scores**: Model confidence after enhancement (0-100)

### Workflow Metrics
- **Task execution time**: Duration from start to completion
- **Tool usage efficiency**: Parallel vs sequential tool calls ratio
- **Agent coordination**: Multi-agent task coordination success rate
- **Error recovery**: Success rate of error handling and recovery

### Cross-Session Learning Metrics
- **Knowledge capture rate**: Percentage of bugs/features documented in AI_*.md files
- **Pattern reuse**: How often learned patterns are reused
- **Context carryover**: How well context is maintained across sessions

## Poneglyph System Integration

### PostgreSQL Export
All metrics are exported to PostgreSQL `events` table:

```sql
-- Orchestrator metric event structure
INSERT INTO events (
  event_type,
  event_data,
  severity,
  created_at
) VALUES (
  'orchestrator_metric',
  '{
    "metric_type": "prompt_enhancement_score",
    "value": 85,
    "task_id": "task-123",
    "context": {
      "language": "TypeScript",
      "domain": "Backend",
      "complexity": "Medium"
    },
    "patterns_applied": ["template", "chain-of-thought", "reflection"],
    "token_reduction": 45
  }'::jsonb,
  'info',
  NOW()
);
```

**Metric Event Types:**
- `orchestrator_metric:context_detection` - Context analysis results
- `orchestrator_metric:prompt_enhancement` - Prompt quality scores
- `orchestrator_metric:workflow_speedup` - Performance improvements
- `orchestrator_metric:multi_agent_decision` - Agent routing decisions
- `orchestrator_metric:auto_documentation` - Documentation triggers

### WebSocket Broadcasting
Metrics are broadcast in real-time via WebSocket to the Vue dashboard:

```typescript
// WebSocket event format
{
  type: 'orchestrator_metric',
  room: 'orchestrator',
  data: {
    metric_type: 'prompt_enhancement_score',
    value: 85,
    timestamp: '2025-11-12T10:30:00Z',
    task_id: 'task-123',
    context: {
      language: 'TypeScript',
      domain: 'Backend',
      complexity: 'Medium'
    }
  }
}
```

**WebSocket Rooms:**
- `orchestrator` - Orchestrator-specific metrics
- `system` - System-wide health metrics
- `tasks` - Task execution events

### Vue Dashboard Integration

**New Dashboard Panel: "Orchestrator Health"**

Location: `frontend/src/components/OrchestratorHealth.vue`

Displays:
1. **Context Detection Accuracy** (gauge chart, target: >90%)
2. **Prompt Enhancement Score** (line chart over time)
3. **Workflow Speedup** (bar chart, showing 1x, 5x, 10x improvements)
4. **Recent Enhancements** (table with task, patterns applied, token reduction)
5. **Multi-Agent Decisions** (pie chart: single-agent vs multi-agent)
6. **Auto-Documentation Rate** (percentage gauge)

## Health Score Calculation

Score starts at 100, deductions:

- **Context Detection Accuracy** (max -30):
  - < 70% accuracy → -30
  - < 80% accuracy → -15
  - < 90% accuracy → -5

- **Prompt Enhancement Quality** (max -30):
  - Avg score < 50 → -30
  - Avg score < 70 → -15
  - Avg score < 85 → -5

- **Workflow Performance** (max -25):
  - Avg speedup < 2x → -25
  - Avg speedup < 3x → -15
  - Avg speedup < 5x → -5

- **Auto-Documentation Rate** (max -15):
  - < 50% coverage → -15
  - < 70% coverage → -10
  - < 85% coverage → -5

### Health Status
- **85-100**: Healthy ✅ (Orchestrator performing optimally)
- **70-84**: Degraded ⚠️ (Some optimization needed)
- **0-69**: Unhealthy ❌ (Significant issues detected)

## Bottleneck Detection

### Low Context Detection Accuracy
```
Detected when: accuracy < 80% (min 10 tasks)
Severity: High
Recommendation: Review context detection patterns, update keyword matching
Impact: Incorrect agent routing, suboptimal prompt enhancement
```

### Poor Prompt Enhancement Scores
```
Detected when: avg_score < 70 (min 10 prompts)
Severity: Critical
Recommendation: Review Anthropic best practices, update pattern library
Impact: Lower model performance, increased token usage
```

### Insufficient Workflow Speedup
```
Detected when: avg_speedup < 3x (min 10 tasks)
Severity: Medium
Recommendation: Increase parallel execution, optimize tool usage patterns
Impact: Slower task completion, reduced productivity
```

### Low Auto-Documentation Rate
```
Detected when: documentation_rate < 70% (min 10 tasks)
Severity: Medium
Recommendation: Review documentation triggers, update AI_*.md templates
Impact: Poor cross-session learning, knowledge loss
```

### Multi-Agent Over-Usage
```
Detected when: multi_agent_rate > 40% (should be ~10-20%)
Severity: Low
Recommendation: Increase single-agent capability, refine complexity scoring
Impact: Unnecessary coordination overhead
```

## Performance Targets

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Context detection accuracy | > 90% | Track | 🎯 |
| Prompt enhancement score | > 85 | Track | 🎯 |
| Workflow speedup | 5-10x | Track | 🎯 |
| Token reduction | 30-60% | Track | 🎯 |
| Auto-documentation rate | > 80% | Track | 🎯 |
| Metric collection overhead | < 50ms | Track | 🎯 |
| PostgreSQL export latency | < 10ms | Track | 🎯 |
| WebSocket broadcast delay | < 5ms | Track | 🎯 |

## Metric Collection Implementation

### 1. Context Detection Tracking
```python
# Track context detection accuracy
def track_context_detection(task_id, detected_context, actual_context):
    accuracy = calculate_accuracy(detected_context, actual_context)

    # Export to PostgreSQL
    export_metric(
        metric_type='context_detection',
        value=accuracy,
        task_id=task_id,
        context=detected_context
    )

    # Broadcast via WebSocket
    broadcast_metric(
        room='orchestrator',
        metric_type='context_detection',
        value=accuracy
    )
```

### 2. Prompt Enhancement Tracking
```python
# Track prompt enhancement effectiveness
def track_prompt_enhancement(task_id, original_prompt, enhanced_prompt, patterns_applied):
    score = calculate_enhancement_score(enhanced_prompt)
    token_reduction = calculate_token_reduction(original_prompt, enhanced_prompt)

    export_metric(
        metric_type='prompt_enhancement',
        value=score,
        task_id=task_id,
        patterns_applied=patterns_applied,
        token_reduction=token_reduction
    )

    broadcast_metric(
        room='orchestrator',
        metric_type='prompt_enhancement_score',
        value=score,
        token_reduction=token_reduction
    )
```

### 3. Workflow Speedup Tracking
```python
# Track workflow performance improvements
def track_workflow_speedup(task_id, baseline_time, actual_time):
    speedup = baseline_time / actual_time

    export_metric(
        metric_type='workflow_speedup',
        value=speedup,
        task_id=task_id,
        baseline_time=baseline_time,
        actual_time=actual_time
    )

    broadcast_metric(
        room='orchestrator',
        metric_type='workflow_speedup',
        value=speedup
    )
```

## Dashboard Queries

### Get Orchestrator Health Score
```sql
-- Calculate current health score
WITH recent_metrics AS (
  SELECT
    event_data->>'metric_type' as metric_type,
    (event_data->>'value')::float as value
  FROM events
  WHERE event_type = 'orchestrator_metric'
    AND created_at > NOW() - INTERVAL '24 hours'
)
SELECT
  100 -
  CASE WHEN AVG(CASE WHEN metric_type = 'context_detection' THEN 100 - value ELSE 0 END) > 30 THEN 30
       WHEN AVG(CASE WHEN metric_type = 'context_detection' THEN 100 - value ELSE 0 END) > 15 THEN 15
       ELSE 0 END
  as health_score
FROM recent_metrics;
```

### Get Prompt Enhancement Trends
```sql
-- Get prompt enhancement scores over time
SELECT
  DATE_TRUNC('hour', created_at) as hour,
  AVG((event_data->>'value')::float) as avg_score,
  COUNT(*) as count
FROM events
WHERE event_type = 'orchestrator_metric'
  AND event_data->>'metric_type' = 'prompt_enhancement'
  AND created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('hour', created_at)
ORDER BY hour DESC;
```

### Get Multi-Agent Decision Rate
```sql
-- Calculate multi-agent vs single-agent ratio
SELECT
  CASE WHEN event_data->'decision'->>'multi_agent' = 'true' THEN 'Multi-Agent'
       ELSE 'Single-Agent' END as decision_type,
  COUNT(*) as count,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as percentage
FROM events
WHERE event_type = 'orchestrator_metric'
  AND event_data->>'metric_type' = 'multi_agent_decision'
  AND created_at > NOW() - INTERVAL '24 hours'
GROUP BY decision_type;
```

## Alerts & Notifications

### Alert Conditions
- Health score < 70
- Context detection accuracy < 75%
- Prompt enhancement score < 65 (avg)
- Workflow speedup < 2x (avg)
- Auto-documentation rate < 60%

### Alert Actions
1. Log warning to PostgreSQL (event_type: 'orchestrator_alert')
2. Broadcast alert via WebSocket to 'alerts' room
3. Display notification in Vue dashboard
4. Create entry in AI_BUGS_KNOWLEDGE.md if critical

## Best Practices

### Regular Monitoring
- Check Orchestrator Health panel daily
- Review prompt enhancement trends weekly
- Analyze workflow speedup patterns
- Monitor token reduction effectiveness

### Performance Optimization
- If context detection < 90%, update detection patterns
- If prompt scores < 85, review and add new patterns
- If speedup < 5x, increase parallel tool usage
- If documentation rate < 80%, refine triggers

### Capacity Planning
- Track metric volume growth
- Monitor PostgreSQL events table size
- Plan for WebSocket connection scaling
- Archive old metrics (>90 days) to reduce query load

### Meta-Monitoring (Observing the Observer)
- Track metric collection overhead (target: < 50ms)
- Monitor PostgreSQL export latency (target: < 10ms)
- Measure WebSocket broadcast delay (target: < 5ms)
- Ensure observability doesn't impact performance

## Integration Points

### With Adaptive Meta-Orchestrator
- Log context detection decisions
- Record prompt enhancement applications
- Track multi-agent routing choices
- Monitor auto-documentation triggers

### With PostgreSQL Events System
- Export all metrics to `events` table
- Use `event_type = 'orchestrator_metric'`
- Store detailed data in `event_data` JSONB column
- Query with GIN indexes for fast retrieval

### With WebSocket Server (Bun)
- Broadcast real-time metrics to Vue dashboard
- Use dedicated 'orchestrator' room
- Send aggregated data every 5 seconds
- Support dashboard subscriptions

### With Vue Dashboard
- Display Orchestrator Health panel
- Show real-time charts and gauges
- Provide drill-down into specific metrics
- Enable historical trend analysis

## Vue Component Example

```vue
<!-- frontend/src/components/OrchestratorHealth.vue -->
<template>
  <div class="orchestrator-health">
    <h2>Orchestrator Health</h2>

    <!-- Health Score Gauge -->
    <div class="health-score">
      <gauge-chart :value="healthScore" :max="100" />
      <p>Health Score: {{ healthScore }}/100</p>
      <span :class="healthStatus">{{ healthStatusText }}</span>
    </div>

    <!-- Prompt Enhancement Score Chart -->
    <div class="enhancement-chart">
      <h3>Prompt Enhancement Score (24h)</h3>
      <line-chart :data="enhancementScores" />
    </div>

    <!-- Workflow Speedup Bar Chart -->
    <div class="speedup-chart">
      <h3>Workflow Speedup</h3>
      <bar-chart :data="speedupData" />
    </div>

    <!-- Recent Enhancements Table -->
    <div class="recent-enhancements">
      <h3>Recent Enhancements</h3>
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Patterns</th>
            <th>Token Reduction</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in recentEnhancements" :key="item.task_id">
            <td>{{ item.task_id }}</td>
            <td>{{ item.patterns.join(', ') }}</td>
            <td>{{ item.token_reduction }}%</td>
            <td>{{ item.score }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useWebSocket } from '@/composables/useWebSocket';

const { socket, subscribe } = useWebSocket();

const healthScore = ref(0);
const enhancementScores = ref([]);
const speedupData = ref([]);
const recentEnhancements = ref([]);

// Subscribe to orchestrator metrics
const unsubscribe = subscribe('orchestrator', (data) => {
  if (data.metric_type === 'prompt_enhancement_score') {
    updateEnhancementScores(data);
  } else if (data.metric_type === 'workflow_speedup') {
    updateSpeedupData(data);
  }
});

onMounted(() => {
  loadInitialData();
});

onUnmounted(() => {
  unsubscribe();
});

async function loadInitialData() {
  // Fetch initial metrics from API
  const response = await fetch('/api/metrics/orchestrator/health');
  const data = await response.json();

  healthScore.value = data.health_score;
  enhancementScores.value = data.enhancement_scores;
  speedupData.value = data.speedup_data;
  recentEnhancements.value = data.recent_enhancements;
}

function updateEnhancementScores(data) {
  enhancementScores.value.push({
    timestamp: data.timestamp,
    value: data.value
  });

  // Keep only last 100 points
  if (enhancementScores.value.length > 100) {
    enhancementScores.value.shift();
  }
}

function updateSpeedupData(data) {
  speedupData.value.push(data);
}
</script>
```

## Success Criteria

**Observability Coverage**:
- [ ] 100% of orchestrator decisions tracked
- [ ] All prompt enhancements scored and logged
- [ ] Workflow speedup calculated for every task
- [ ] Context detection accuracy monitored

**Performance Targets**:
- [ ] Metric collection overhead < 50ms
- [ ] PostgreSQL export latency < 10ms
- [ ] WebSocket broadcast delay < 5ms
- [ ] Dashboard updates < 1 second lag

**Integration**:
- [ ] All metrics exported to PostgreSQL events table
- [ ] Real-time WebSocket broadcasting working
- [ ] Vue dashboard displays Orchestrator Health panel
- [ ] Alerts trigger on degraded health

Use this skill to ensure the adaptive meta-orchestrator is performing optimally and continuously improving!
