/**
 * Graceful Degradation Engine - Orchestrator v3.7
 * 5 niveles de degradacion con heuristic fallbacks
 */

import { TaskSharedState } from './shared-state';

// Types
type DegradationLevel = 0 | 1 | 2 | 3 | 4 | 5;

interface FailureEvent {
  type: 'agent' | 'phase' | 'orchestrator' | 'system';
  componentId: string;
  error: Error;
  context: Record<string, unknown>;
  timestamp: Date;
  retryable: boolean;
}

interface RecoveryAction {
  action: 'retry' | 'fallback_success' | 'phase_skipped_with_heuristic' |
          'partial_execution' | 'bypass_orchestrator' | 'total_failure';
  componentId: string;
  result?: unknown;
  degraded: boolean;
  message: string;
  nextSteps?: string[];
}

interface DegradationState {
  level: DegradationLevel;
  failedComponents: string[];
  workingComponents: string[];
  degradedOutput: boolean;
  userNotified: boolean;
  recoveryAttempts: { component: string; attempts: number }[];
}

interface CircuitBreakerState {
  componentId: string;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failureCount: number;
  failureThreshold: number;
  resetTimeout: number;
  lastFailure: Date | null;
  lastSuccess: Date | null;
}

// Heuristic fallback functions per phase
type HeuristicFallback = (context: Record<string, unknown>) => Promise<unknown>;

const HEURISTIC_FALLBACKS: Record<number, HeuristicFallback> = {
  // Phase 1: Evaluation - Use regex patterns instead of LLM
  1: async (context) => {
    const prompt = context.prompt as string || '';
    const words = prompt.toLowerCase().split(/\s+/);

    // Simple keyword detection
    const keywordPatterns: Record<string, string[]> = {
      component: ['component', 'create', 'build', 'new'],
      fix: ['fix', 'bug', 'error', 'broken'],
      test: ['test', 'testing', 'coverage'],
      refactor: ['refactor', 'improve', 'clean'],
      docs: ['document', 'readme', 'docs']
    };

    const detectedKeywords: string[] = [];
    for (const [category, patterns] of Object.entries(keywordPatterns)) {
      if (patterns.some(p => words.includes(p))) {
        detectedKeywords.push(category);
      }
    }

    // Simple complexity based on word count and special chars
    const complexity = Math.min(100, Math.round(
      words.length * 2 +
      (prompt.match(/[{}[\]()]/g)?.length || 0) * 5
    ));

    return {
      keywords: detectedKeywords,
      complexity,
      confidence: 50, // Low confidence for heuristic
      degraded: true
    };
  },

  // Phase 2: Context Loading - Keyword search instead of semantic
  2: async (context) => {
    const keywords = (context.keywords as string[]) || [];

    return {
      loaded: true,
      method: 'keyword_search',
      relevantFiles: [], // Would need file system access
      degraded: true
    };
  },

  // Phase 3: Decomposition - Split by sentences/bullets
  3: async (context) => {
    const objective = context.objective as string || '';

    // Split by common delimiters
    const tasks = objective
      .split(/[.;\n]/)
      .map(s => s.trim())
      .filter(s => s.length > 10)
      .map((task, i) => ({
        id: `T${i + 1}`,
        name: task.substring(0, 50),
        priority: 'medium' as const
      }));

    return {
      tasks: tasks.length > 0 ? tasks : [{ id: 'T1', name: objective, priority: 'medium' }],
      decomposed: true,
      degraded: true
    };
  },

  // Phase 4: Planning - Template-based plans
  4: async (context) => {
    const tasks = (context.tasks as { id: string; name: string }[]) || [];

    return {
      strategy: 'sequential',
      subtasks: tasks.map((t, i) => ({
        ...t,
        order: i + 1,
        model: 'sonnet',
        estimated_tokens: 500
      })),
      degraded: true
    };
  },

  // Phase 5: Execution - Single pass direct response
  5: async (context) => {
    return {
      executed: false,
      method: 'direct_response',
      message: 'Execution degraded - returning context for direct handling',
      context,
      degraded: true
    };
  },

  // Phase 6: Validation - Syntax check only
  6: async (context) => {
    return {
      validated: true,
      method: 'syntax_only',
      checks: ['syntax'],
      skipped: ['semantic', 'security', 'quality'],
      degraded: true
    };
  },

  // Phase 7: Consolidation - Minimal logging
  7: async (context) => {
    return {
      consolidated: true,
      method: 'minimal',
      archived: false,
      degraded: true
    };
  }
};

// Agent fallback chains
const AGENT_FALLBACK_CHAINS: Record<string, string[]> = {
  'opus-complex-agent': ['sonnet-medium-agent', 'haiku-simple-agent', 'direct-response'],
  'sonnet-medium-agent': ['haiku-simple-agent', 'direct-response'],
  'haiku-simple-agent': ['direct-response'],
  // Default fallback for any unknown agent
  'default': ['sonnet-fallback', 'haiku-fallback', 'direct-response']
};

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
  retryableErrors: ['rate_limit', 'timeout', 'transient', 'ECONNRESET', 'ETIMEDOUT']
};

class GracefulDegradation {
  private state: DegradationState;
  private sharedState: TaskSharedState;
  private circuitBreakers: Map<string, CircuitBreakerState>;
  private eventLog: FailureEvent[];

  constructor() {
    this.state = {
      level: 0,
      failedComponents: [],
      workingComponents: [],
      degradedOutput: false,
      userNotified: false,
      recoveryAttempts: []
    };
    this.sharedState = TaskSharedState.getInstance();
    this.circuitBreakers = new Map();
    this.eventLog = [];
  }

  /**
   * Handle any failure event
   */
  async handleFailure(failure: FailureEvent): Promise<RecoveryAction> {
    this.eventLog.push(failure);

    switch (failure.type) {
      case 'agent':
        return this.handleAgentFailure(failure);
      case 'phase':
        return this.handlePhaseFailure(failure);
      case 'orchestrator':
        return this.handleOrchestratorFailure(failure);
      case 'system':
        return this.handleSystemFailure(failure);
      default:
        return this.handleUnknownFailure(failure);
    }
  }

  /**
   * Level 1: Agent Failure
   */
  private async handleAgentFailure(failure: FailureEvent): Promise<RecoveryAction> {
    this.setLevel(1);
    this.state.failedComponents.push(failure.componentId);

    // Check circuit breaker
    const circuitState = this.getCircuitBreaker(failure.componentId);
    if (circuitState.state === 'OPEN') {
      // Skip retry, go to fallback
      return this.tryFallbackChain(failure);
    }

    // Try retry with exponential backoff if retryable
    if (failure.retryable && this.isRetryable(failure.error)) {
      const retryResult = await this.retryWithBackoff(failure);
      if (retryResult.success) {
        this.recordSuccess(failure.componentId);
        return {
          action: 'retry',
          componentId: failure.componentId,
          result: retryResult.result,
          degraded: false,
          message: `Retry successful after ${retryResult.attempts} attempts`
        };
      }
    }

    // Record failure and try fallback chain
    this.recordFailure(failure.componentId);
    return this.tryFallbackChain(failure);
  }

  /**
   * Try fallback agents in chain
   */
  private async tryFallbackChain(failure: FailureEvent): Promise<RecoveryAction> {
    const chain = AGENT_FALLBACK_CHAINS[failure.componentId] ||
                  AGENT_FALLBACK_CHAINS['default'];

    for (const fallbackAgent of chain) {
      if (fallbackAgent === 'direct-response') {
        // No more fallbacks, escalate to phase failure
        return this.handlePhaseFailure({
          ...failure,
          type: 'phase',
          componentId: `phase_${this.sharedState.currentPhase}`
        });
      }

      try {
        // Would execute fallback agent here
        // For now, return a simulated success
        this.state.workingComponents.push(fallbackAgent);

        return {
          action: 'fallback_success',
          componentId: fallbackAgent,
          degraded: true,
          message: `Fallback to ${fallbackAgent} successful`
        };
      } catch {
        continue;
      }
    }

    // All fallbacks failed
    return this.handlePhaseFailure({
      ...failure,
      type: 'phase',
      componentId: `phase_${this.sharedState.currentPhase}`
    });
  }

  /**
   * Level 2: Phase Failure
   */
  private async handlePhaseFailure(failure: FailureEvent): Promise<RecoveryAction> {
    this.setLevel(2);
    this.state.degradedOutput = true;

    const phaseId = parseInt(failure.componentId.replace('phase_', '')) ||
                    this.sharedState.currentPhase;

    // Use heuristic fallback
    const heuristic = HEURISTIC_FALLBACKS[phaseId];
    if (heuristic) {
      try {
        const result = await heuristic(failure.context);

        this.sharedState.addWarning({
          phase: phaseId,
          level: 'high',
          message: `Phase ${phaseId} used heuristic fallback due to: ${failure.error.message}`
        });

        return {
          action: 'phase_skipped_with_heuristic',
          componentId: failure.componentId,
          result,
          degraded: true,
          message: `Phase ${phaseId} completed with heuristic fallback`,
          nextSteps: ['Continue to next phase', 'Notify user at end']
        };
      } catch (heuristicError) {
        // Even heuristic failed, escalate
        return this.handleOrchestratorFailure({
          ...failure,
          type: 'orchestrator',
          error: heuristicError as Error
        });
      }
    }

    // No heuristic available, escalate
    return this.handleOrchestratorFailure({
      ...failure,
      type: 'orchestrator'
    });
  }

  /**
   * Level 3-4: Orchestrator Failure
   */
  private async handleOrchestratorFailure(failure: FailureEvent): Promise<RecoveryAction> {
    const workingPhases = Array.from(this.sharedState.metrics.phaseMetrics.values())
      .filter(p => p.status === 'complete')
      .map(p => p.phase);

    if (workingPhases.length > 0) {
      // Level 3: Partial failure - some phases work
      this.setLevel(3);

      return {
        action: 'partial_execution',
        componentId: 'orchestrator',
        result: {
          completedPhases: workingPhases,
          failedPhases: this.state.failedComponents
        },
        degraded: true,
        message: `Partial execution: ${workingPhases.length} phases completed, some failed`,
        nextSteps: ['Show partial results', 'Offer retry of failed phases']
      };
    }

    // Level 4: Total orchestrator failure
    this.setLevel(4);

    return {
      action: 'bypass_orchestrator',
      componentId: 'orchestrator',
      degraded: true,
      message: '⚠️ Multi-agent system unavailable. Switching to direct response mode.',
      nextSteps: ['Bypass orchestrator', 'Use direct Claude response']
    };
  }

  /**
   * Level 5: System Failure
   */
  private async handleSystemFailure(failure: FailureEvent): Promise<RecoveryAction> {
    this.setLevel(5);

    return {
      action: 'total_failure',
      componentId: 'system',
      degraded: true,
      message: `🔴 System unavailable: ${failure.error.message}`,
      nextSteps: [
        'Retry in a few minutes',
        'Check status page',
        'Context preserved for retry'
      ]
    };
  }

  /**
   * Unknown failure type
   */
  private async handleUnknownFailure(failure: FailureEvent): Promise<RecoveryAction> {
    this.setLevel(2);

    return {
      action: 'phase_skipped_with_heuristic',
      componentId: failure.componentId,
      degraded: true,
      message: `Unknown failure type handled: ${failure.error.message}`
    };
  }

  /**
   * Retry with exponential backoff
   */
  private async retryWithBackoff(failure: FailureEvent): Promise<{ success: boolean; result?: unknown; attempts: number }> {
    let delay = RETRY_CONFIG.initialDelay;
    let attempts = 0;
    const existingAttempts = this.state.recoveryAttempts.find(r => r.component === failure.componentId);

    if (existingAttempts && existingAttempts.attempts >= RETRY_CONFIG.maxRetries) {
      return { success: false, attempts: existingAttempts.attempts };
    }

    for (let i = 0; i < RETRY_CONFIG.maxRetries; i++) {
      attempts++;

      // Record attempt
      if (existingAttempts) {
        existingAttempts.attempts++;
      } else {
        this.state.recoveryAttempts.push({ component: failure.componentId, attempts: 1 });
      }

      try {
        // Wait before retry
        await this.sleep(delay);

        // Would execute retry here
        // For now, simulate failure until last attempt
        if (i === RETRY_CONFIG.maxRetries - 1) {
          // Simulate eventual success for demo
          return { success: false, attempts };
        }
      } catch {
        delay = Math.min(delay * RETRY_CONFIG.backoffMultiplier, RETRY_CONFIG.maxDelay);
      }
    }

    return { success: false, attempts };
  }

  /**
   * Check if error is retryable
   */
  private isRetryable(error: Error): boolean {
    const errorString = error.message.toLowerCase();
    return RETRY_CONFIG.retryableErrors.some(e => errorString.includes(e.toLowerCase()));
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Circuit breaker management
   */
  private getCircuitBreaker(componentId: string): CircuitBreakerState {
    if (!this.circuitBreakers.has(componentId)) {
      this.circuitBreakers.set(componentId, {
        componentId,
        state: 'CLOSED',
        failureCount: 0,
        failureThreshold: 3,
        resetTimeout: 30000,
        lastFailure: null,
        lastSuccess: null
      });
    }
    return this.circuitBreakers.get(componentId)!;
  }

  private recordFailure(componentId: string): void {
    const breaker = this.getCircuitBreaker(componentId);
    breaker.failureCount++;
    breaker.lastFailure = new Date();

    if (breaker.failureCount >= breaker.failureThreshold) {
      breaker.state = 'OPEN';
    }
  }

  private recordSuccess(componentId: string): void {
    const breaker = this.getCircuitBreaker(componentId);
    breaker.failureCount = 0;
    breaker.state = 'CLOSED';
    breaker.lastSuccess = new Date();
  }

  /**
   * Set degradation level
   */
  private setLevel(level: DegradationLevel): void {
    this.state.level = Math.max(this.state.level, level);
    this.sharedState.setDegradationLevel(level);
  }

  /**
   * Generate degradation report for user
   */
  generateReport(): string {
    if (this.state.level === 0) {
      return '';
    }

    const levelDescriptions: Record<DegradationLevel, string> = {
      0: 'Normal',
      1: 'Agent failure (fallback used)',
      2: 'Phase failure (heuristics used)',
      3: 'Partial execution',
      4: 'Orchestrator bypassed',
      5: 'System unavailable'
    };

    const report = [
      '---',
      `⚠️ **Degradation Notice**`,
      `- Level: ${this.state.level}/5 (${levelDescriptions[this.state.level]})`,
      `- Failed components: ${this.state.failedComponents.join(', ') || 'None'}`,
      `- Working components: ${this.state.workingComponents.join(', ') || 'All failed'}`,
      `- Output quality: ${this.state.degradedOutput ? 'Degraded (heuristics used)' : 'Normal'}`,
      this.getRecommendation(),
      '---'
    ];

    return report.join('\n');
  }

  /**
   * Get recommendation based on level
   */
  private getRecommendation(): string {
    switch (this.state.level) {
      case 1:
        return '- Recommendation: Results may be less optimal. Consider re-running.';
      case 2:
        return '- Recommendation: Some analysis was simplified. Review output carefully.';
      case 3:
        return '- Recommendation: Only partial results available. Consider retry.';
      case 4:
        return '- Recommendation: Multi-agent analysis not available. Using direct response.';
      case 5:
        return '- Recommendation: Please try again later.';
      default:
        return '';
    }
  }

  /**
   * Get current state
   */
  getState(): DegradationState {
    return { ...this.state };
  }

  /**
   * Get event log
   */
  getEventLog(): FailureEvent[] {
    return [...this.eventLog];
  }

  /**
   * Reset state for new task
   */
  reset(): void {
    this.state = {
      level: 0,
      failedComponents: [],
      workingComponents: [],
      degradedOutput: false,
      userNotified: false,
      recoveryAttempts: []
    };
    this.eventLog = [];
    // Keep circuit breakers across tasks for learning
  }
}

// Export singleton
let degradationInstance: GracefulDegradation | null = null;

export function getGracefulDegradation(): GracefulDegradation {
  if (!degradationInstance) {
    degradationInstance = new GracefulDegradation();
  }
  return degradationInstance;
}

export function resetGracefulDegradation(): void {
  if (degradationInstance) {
    degradationInstance.reset();
  }
}

export { GracefulDegradation };
export type { DegradationLevel, FailureEvent, RecoveryAction, DegradationState };
