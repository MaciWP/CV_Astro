/**
 * SharedState - Orchestrator v3.7
 * Singleton para estado compartido durante la ejecucion de un task
 */

// Types
interface FileCache {
  content: string;
  readAt: Date;
  tokens: number;
}

interface Discovery {
  id: string;
  phase: number;
  agent: string;
  type: 'keyword' | 'pattern' | 'dependency' | 'risk' | 'opportunity';
  content: string;
  confidence: number;
  timestamp: Date;
}

interface Decision {
  id: string;
  phase: number;
  agent?: string;
  type: 'model_selection' | 'agent_selection' | 'conflict_resolution' |
        'approach_choice' | 'risk_assessment' | 'hitl_decision';
  selected: string;
  alternatives: { option: string; reason: string }[];
  reason: string;
  confidence: number;
  timestamp: Date;
}

interface Warning {
  id: string;
  phase: number;
  agent?: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
}

interface PhaseMetrics {
  phase: number;
  status: 'pending' | 'running' | 'complete' | 'failed' | 'skipped';
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  tokensInput: number;
  tokensOutput: number;
  cost: number;
  agents: string[];
  errors: string[];
}

interface AgentMetrics {
  agentId: string;
  phase: number;
  model: 'haiku' | 'sonnet' | 'opus';
  status: 'running' | 'complete' | 'failed';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  tokensInput: number;
  tokensOutput: number;
  cost: number;
  retries: number;
}

interface HandoffMessage {
  fromPhase: number;
  fromAgent: string;
  toPhase: number;
  timestamp: Date;
  summary: string;
  keyDecisions: string[];
  filesModified: string[];
  filesRead: string[];
  confidence: number;
}

interface BroadcastMessage {
  fromAgent: string;
  messageType: 'discovery' | 'warning' | 'completion' | 'request';
  priority: 'low' | 'medium' | 'high' | 'critical';
  content: unknown;
  timestamp: Date;
}

interface AgentQuery {
  id: string;
  fromAgent: string;
  toAgent: string;
  queryType: 'ask_for_data' | 'ask_for_validation' | 'ask_for_opinion';
  query: string;
  context?: unknown;
  timeout: number;
  timestamp: Date;
}

interface AgentResponse {
  queryId: string;
  fromAgent: string;
  toAgent: string;
  response: unknown;
  confidence: number;
  processingTime: number;
  timestamp: Date;
}

interface SharedStateData {
  taskId: string;
  startTime: Date;
  originalPrompt: string;
  currentPrompt: string;
  promptEnhanced: boolean;
  currentPhase: number;
  status: 'initializing' | 'running' | 'complete' | 'failed' | 'degraded';

  context: {
    filesRead: Map<string, FileCache>;
    filesModified: Map<string, { original: string; modified: string }>;
    discoveries: Discovery[];
    decisions: Decision[];
    warnings: Warning[];
    errors: Error[];
  };

  metrics: {
    totalTokens: number;
    totalCost: number;
    totalDuration: number;
    phaseMetrics: Map<number, PhaseMetrics>;
    agentMetrics: Map<string, AgentMetrics>;
  };

  communication: {
    handoffs: HandoffMessage[];
    broadcasts: BroadcastMessage[];
    queries: { query: AgentQuery; response?: AgentResponse }[];
  };

  degradation: {
    level: 0 | 1 | 2 | 3 | 4 | 5;
    failedComponents: string[];
    workingComponents: string[];
    degradedOutput: boolean;
  };
}

// Relevance map for context loading per phase
const PHASE_RELEVANCE_MAP: Record<number, string[]> = {
  0: ['cache_status', 'budget'],
  1: ['user_message', 'cached_patterns'],
  2: ['keywords', 'complexity', 'project_context'],
  3: ['context_loaded', 'objective'],
  4: ['discoveries', 'decisions', 'decomposition'],
  5: ['plan', 'files', 'tools'],
  6: ['execution_results', 'warnings', 'modified_files'],
  7: ['all_metrics', 'all_learnings']
};

// Cache freshness threshold (5 minutes)
const CACHE_FRESHNESS_MS = 5 * 60 * 1000;

class TaskSharedState implements SharedStateData {
  private static instance: TaskSharedState | null = null;

  taskId: string;
  startTime: Date;
  originalPrompt: string;
  currentPrompt: string;
  promptEnhanced: boolean;
  currentPhase: number;
  status: SharedStateData['status'];

  context: SharedStateData['context'];
  metrics: SharedStateData['metrics'];
  communication: SharedStateData['communication'];
  degradation: SharedStateData['degradation'];

  private constructor() {
    this.taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.startTime = new Date();
    this.originalPrompt = '';
    this.currentPrompt = '';
    this.promptEnhanced = false;
    this.currentPhase = 0;
    this.status = 'initializing';

    this.context = {
      filesRead: new Map(),
      filesModified: new Map(),
      discoveries: [],
      decisions: [],
      warnings: [],
      errors: []
    };

    this.metrics = {
      totalTokens: 0,
      totalCost: 0,
      totalDuration: 0,
      phaseMetrics: new Map(),
      agentMetrics: new Map()
    };

    this.communication = {
      handoffs: [],
      broadcasts: [],
      queries: []
    };

    this.degradation = {
      level: 0,
      failedComponents: [],
      workingComponents: [],
      degradedOutput: false
    };
  }

  static getInstance(): TaskSharedState {
    if (!TaskSharedState.instance) {
      TaskSharedState.instance = new TaskSharedState();
    }
    return TaskSharedState.instance;
  }

  static reset(): void {
    TaskSharedState.instance = null;
  }

  // Initialize new task
  initializeTask(prompt: string): void {
    this.originalPrompt = prompt;
    this.currentPrompt = prompt;
    this.status = 'running';
    this.startTime = new Date();
  }

  // File caching - avoid re-reading
  getFileIfCached(path: string): string | null {
    const cached = this.context.filesRead.get(path);
    if (cached && this.isFresh(cached.readAt)) {
      return cached.content;
    }
    return null;
  }

  cacheFile(path: string, content: string, tokens: number): void {
    this.context.filesRead.set(path, {
      content,
      readAt: new Date(),
      tokens
    });
  }

  private isFresh(readAt: Date): boolean {
    return Date.now() - readAt.getTime() < CACHE_FRESHNESS_MS;
  }

  // Record file modification
  recordFileModification(path: string, original: string, modified: string): void {
    this.context.filesModified.set(path, { original, modified });
  }

  // Discoveries
  addDiscovery(discovery: Omit<Discovery, 'id' | 'timestamp'>): string {
    const id = `disc_${this.context.discoveries.length + 1}`;
    this.context.discoveries.push({
      ...discovery,
      id,
      timestamp: new Date()
    });
    return id;
  }

  getDiscoveries(phase?: number): Discovery[] {
    if (phase !== undefined) {
      return this.context.discoveries.filter(d => d.phase === phase);
    }
    return this.context.discoveries;
  }

  // Decisions
  addDecision(decision: Omit<Decision, 'id' | 'timestamp'>): string {
    const id = `dec_${this.context.decisions.length + 1}`;
    this.context.decisions.push({
      ...decision,
      id,
      timestamp: new Date()
    });
    return id;
  }

  getDecisions(phase?: number): Decision[] {
    if (phase !== undefined) {
      return this.context.decisions.filter(d => d.phase === phase);
    }
    return this.context.decisions;
  }

  // Warnings
  addWarning(warning: Omit<Warning, 'id' | 'timestamp'>): string {
    const id = `warn_${this.context.warnings.length + 1}`;
    this.context.warnings.push({
      ...warning,
      id,
      timestamp: new Date()
    });
    return id;
  }

  getWarnings(level?: Warning['level']): Warning[] {
    if (level) {
      return this.context.warnings.filter(w => w.level === level);
    }
    return this.context.warnings;
  }

  // Errors
  addError(error: Error): void {
    this.context.errors.push(error);
  }

  // Phase metrics
  startPhase(phase: number): void {
    this.currentPhase = phase;
    this.metrics.phaseMetrics.set(phase, {
      phase,
      status: 'running',
      startTime: new Date(),
      tokensInput: 0,
      tokensOutput: 0,
      cost: 0,
      agents: [],
      errors: []
    });
  }

  completePhase(phase: number, success: boolean): void {
    const phaseMetric = this.metrics.phaseMetrics.get(phase);
    if (phaseMetric) {
      phaseMetric.status = success ? 'complete' : 'failed';
      phaseMetric.endTime = new Date();
      phaseMetric.duration = phaseMetric.startTime
        ? phaseMetric.endTime.getTime() - phaseMetric.startTime.getTime()
        : 0;
    }
  }

  updatePhaseTokens(phase: number, input: number, output: number): void {
    const phaseMetric = this.metrics.phaseMetrics.get(phase);
    if (phaseMetric) {
      phaseMetric.tokensInput += input;
      phaseMetric.tokensOutput += output;
      this.metrics.totalTokens += input + output;
    }
  }

  // Agent metrics
  startAgent(agentId: string, phase: number, model: 'haiku' | 'sonnet' | 'opus'): void {
    this.metrics.agentMetrics.set(agentId, {
      agentId,
      phase,
      model,
      status: 'running',
      startTime: new Date(),
      tokensInput: 0,
      tokensOutput: 0,
      cost: 0,
      retries: 0
    });

    const phaseMetric = this.metrics.phaseMetrics.get(phase);
    if (phaseMetric) {
      phaseMetric.agents.push(agentId);
    }
  }

  completeAgent(agentId: string, success: boolean, tokens?: { input: number; output: number }): void {
    const agentMetric = this.metrics.agentMetrics.get(agentId);
    if (agentMetric) {
      agentMetric.status = success ? 'complete' : 'failed';
      agentMetric.endTime = new Date();
      agentMetric.duration = agentMetric.endTime.getTime() - agentMetric.startTime.getTime();

      if (tokens) {
        agentMetric.tokensInput = tokens.input;
        agentMetric.tokensOutput = tokens.output;
        agentMetric.cost = this.calculateCost(tokens, agentMetric.model);
        this.metrics.totalCost += agentMetric.cost;
      }
    }
  }

  private calculateCost(tokens: { input: number; output: number }, model: string): number {
    const rates: Record<string, { input: number; output: number }> = {
      haiku: { input: 0.00025, output: 0.00125 },
      sonnet: { input: 0.003, output: 0.015 },
      opus: { input: 0.015, output: 0.075 }
    };
    const rate = rates[model] || rates.sonnet;
    return (tokens.input * rate.input + tokens.output * rate.output) / 1000;
  }

  // Communication - Handoffs
  addHandoff(handoff: Omit<HandoffMessage, 'timestamp'>): void {
    this.communication.handoffs.push({
      ...handoff,
      timestamp: new Date()
    });
  }

  getLastHandoff(toPhase: number): HandoffMessage | undefined {
    return this.communication.handoffs
      .filter(h => h.toPhase === toPhase)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
  }

  // Communication - Broadcasts
  broadcast(message: Omit<BroadcastMessage, 'timestamp'>): void {
    this.communication.broadcasts.push({
      ...message,
      timestamp: new Date()
    });
  }

  getBroadcasts(type?: BroadcastMessage['messageType']): BroadcastMessage[] {
    if (type) {
      return this.communication.broadcasts.filter(b => b.messageType === type);
    }
    return this.communication.broadcasts;
  }

  // Communication - Queries
  addQuery(query: Omit<AgentQuery, 'id' | 'timestamp'>): string {
    const id = `query_${this.communication.queries.length + 1}`;
    this.communication.queries.push({
      query: { ...query, id, timestamp: new Date() }
    });
    return id;
  }

  addQueryResponse(queryId: string, response: Omit<AgentResponse, 'queryId' | 'timestamp'>): void {
    const queryEntry = this.communication.queries.find(q => q.query.id === queryId);
    if (queryEntry) {
      queryEntry.response = {
        ...response,
        queryId,
        timestamp: new Date()
      };
    }
  }

  // Degradation
  setDegradationLevel(level: SharedStateData['degradation']['level']): void {
    this.degradation.level = Math.max(this.degradation.level, level);
    if (level >= 2) {
      this.degradation.degradedOutput = true;
    }
  }

  addFailedComponent(component: string): void {
    if (!this.degradation.failedComponents.includes(component)) {
      this.degradation.failedComponents.push(component);
    }
  }

  addWorkingComponent(component: string): void {
    if (!this.degradation.workingComponents.includes(component)) {
      this.degradation.workingComponents.push(component);
    }
  }

  // Get relevant context for a specific phase
  getRelevantContext(forPhase: number): Record<string, unknown> {
    const relevantKeys = PHASE_RELEVANCE_MAP[forPhase] || [];
    const context: Record<string, unknown> = {};

    if (relevantKeys.includes('discoveries')) {
      context.discoveries = this.context.discoveries;
    }
    if (relevantKeys.includes('decisions')) {
      context.decisions = this.context.decisions;
    }
    if (relevantKeys.includes('warnings')) {
      context.warnings = this.context.warnings;
    }
    if (relevantKeys.includes('modified_files')) {
      context.modifiedFiles = Array.from(this.context.filesModified.keys());
    }
    if (relevantKeys.includes('execution_results')) {
      context.executionResults = this.getPhaseResults(5); // Phase 5 results
    }
    if (relevantKeys.includes('all_metrics')) {
      context.metrics = {
        totalTokens: this.metrics.totalTokens,
        totalCost: this.metrics.totalCost,
        phases: Array.from(this.metrics.phaseMetrics.values())
      };
    }

    return context;
  }

  private getPhaseResults(phase: number): unknown {
    const phaseMetric = this.metrics.phaseMetrics.get(phase);
    const agentResults = Array.from(this.metrics.agentMetrics.values())
      .filter(a => a.phase === phase);

    return {
      phase,
      status: phaseMetric?.status,
      agents: agentResults,
      discoveries: this.getDiscoveries(phase),
      decisions: this.getDecisions(phase)
    };
  }

  // Serialize for persistence
  toJSON(): string {
    return JSON.stringify({
      taskId: this.taskId,
      startTime: this.startTime.toISOString(),
      originalPrompt: this.originalPrompt,
      currentPrompt: this.currentPrompt,
      promptEnhanced: this.promptEnhanced,
      currentPhase: this.currentPhase,
      status: this.status,
      context: {
        filesRead: Array.from(this.context.filesRead.entries()),
        filesModified: Array.from(this.context.filesModified.entries()),
        discoveries: this.context.discoveries,
        decisions: this.context.decisions,
        warnings: this.context.warnings,
        errors: this.context.errors.map(e => ({ message: e.message, stack: e.stack }))
      },
      metrics: {
        totalTokens: this.metrics.totalTokens,
        totalCost: this.metrics.totalCost,
        totalDuration: this.metrics.totalDuration,
        phaseMetrics: Array.from(this.metrics.phaseMetrics.entries()),
        agentMetrics: Array.from(this.metrics.agentMetrics.entries())
      },
      communication: this.communication,
      degradation: this.degradation
    }, null, 2);
  }

  // Get summary for handoffs (compressed context)
  getSummaryForHandoff(): string {
    const completedPhases = Array.from(this.metrics.phaseMetrics.values())
      .filter(p => p.status === 'complete')
      .map(p => p.phase);

    const keyDecisions = this.context.decisions
      .slice(-5)
      .map(d => `${d.type}: ${d.selected}`);

    return `Task ${this.taskId} | Phases: ${completedPhases.join(',')} | ` +
           `Tokens: ${this.metrics.totalTokens} | Cost: $${this.metrics.totalCost.toFixed(4)} | ` +
           `Decisions: ${keyDecisions.join('; ')}`;
  }
}

// Export singleton getter and types
export { TaskSharedState };
export type {
  SharedStateData,
  Discovery,
  Decision,
  Warning,
  PhaseMetrics,
  AgentMetrics,
  HandoffMessage,
  BroadcastMessage,
  AgentQuery,
  AgentResponse
};
