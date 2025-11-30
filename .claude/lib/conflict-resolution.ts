/**
 * Conflict Resolution Engine - Orchestrator v3.7
 * Resuelve conflictos entre agentes con criterios claros
 */

import { TaskSharedState, Decision } from './shared-state';

// Types
type ConflictType = 'model' | 'approach' | 'priority' | 'tie' | 'critical';
type ResolutionStrategy = 'higher_model' | 'minimum_change' | 'user_alignment' | 'hitl' | 'vote';

interface AgentRecommendation {
  agentId: string;
  recommendation: string;
  model?: 'haiku' | 'sonnet' | 'opus';
  approach?: 'create' | 'extend' | 'modify' | 'delete';
  priority?: number;
  confidence: number;
  risk: 'low' | 'medium' | 'high' | 'critical';
  estimatedTokens?: number;
  estimatedDuration?: number;
  rationale: string;
}

interface ConflictResolution {
  conflictId: string;
  conflictType: ConflictType;
  agentsInvolved: string[];
  recommendations: AgentRecommendation[];
  resolution: {
    strategy: ResolutionStrategy;
    winner: AgentRecommendation | null;
    reason: string;
    confidence: number;
    requiresHITL: boolean;
  };
  timestamp: Date;
}

// Resolution rules by conflict type
const RESOLUTION_RULES: Record<ConflictType, {
  autoResolve: boolean;
  strategy: ResolutionStrategy;
  description: string;
}> = {
  model: {
    autoResolve: true,
    strategy: 'higher_model',
    description: 'Higher model wins (quality > speed)'
  },
  approach: {
    autoResolve: true,
    strategy: 'minimum_change',
    description: 'Minimum change wins (extend > create)'
  },
  priority: {
    autoResolve: true,
    strategy: 'user_alignment',
    description: 'User objective alignment wins'
  },
  tie: {
    autoResolve: false,
    strategy: 'hitl',
    description: 'Technical tie - escalate to user'
  },
  critical: {
    autoResolve: false,
    strategy: 'hitl',
    description: 'Critical risk - always escalate to user'
  }
};

// Model hierarchy for comparison
const MODEL_HIERARCHY: Record<string, number> = {
  opus: 3,
  sonnet: 2,
  haiku: 1
};

// Approach change size estimation
const APPROACH_CHANGE_SIZE: Record<string, number> = {
  delete: 1,
  modify: 2,
  extend: 3,
  create: 4
};

class ConflictResolver {
  private state: TaskSharedState;
  private resolutionHistory: ConflictResolution[] = [];

  constructor() {
    this.state = TaskSharedState.getInstance();
  }

  /**
   * Detect conflict type from recommendations
   */
  detectConflictType(recommendations: AgentRecommendation[]): ConflictType {
    if (recommendations.length < 2) {
      return 'tie'; // Not really a conflict, but treat as resolved
    }

    // Check for critical risks first
    const hasCriticalRisk = recommendations.some(r => r.risk === 'critical');
    if (hasCriticalRisk) {
      return 'critical';
    }

    // Check for model conflicts
    const models = new Set(recommendations.map(r => r.model).filter(Boolean));
    if (models.size > 1) {
      return 'model';
    }

    // Check for approach conflicts
    const approaches = new Set(recommendations.map(r => r.approach).filter(Boolean));
    if (approaches.size > 1) {
      return 'approach';
    }

    // Check for priority conflicts (different recommendations with similar confidence)
    const confidences = recommendations.map(r => r.confidence);
    const maxConfidence = Math.max(...confidences);
    const minConfidence = Math.min(...confidences);

    if (maxConfidence - minConfidence < 10) {
      // Very close confidence scores
      return 'tie';
    }

    return 'priority';
  }

  /**
   * Resolve conflict between agent recommendations
   */
  async resolveConflict(
    recommendations: AgentRecommendation[],
    userObjective: string
  ): Promise<ConflictResolution> {
    const conflictType = this.detectConflictType(recommendations);
    const rule = RESOLUTION_RULES[conflictType];

    let resolution: ConflictResolution['resolution'];

    switch (conflictType) {
      case 'model':
        resolution = this.resolveModelConflict(recommendations);
        break;

      case 'approach':
        resolution = this.resolveApproachConflict(recommendations);
        break;

      case 'priority':
        resolution = await this.resolvePriorityConflict(recommendations, userObjective);
        break;

      case 'tie':
        resolution = this.resolveTie(recommendations);
        break;

      case 'critical':
        resolution = this.resolveCritical(recommendations);
        break;

      default:
        resolution = {
          strategy: 'hitl',
          winner: null,
          reason: 'Unknown conflict type',
          confidence: 0,
          requiresHITL: true
        };
    }

    const conflictResolution: ConflictResolution = {
      conflictId: `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      conflictType,
      agentsInvolved: recommendations.map(r => r.agentId),
      recommendations,
      resolution,
      timestamp: new Date()
    };

    // Log the resolution as a decision
    this.logResolutionAsDecision(conflictResolution);

    // Store in history
    this.resolutionHistory.push(conflictResolution);

    return conflictResolution;
  }

  /**
   * Model conflict: Higher model wins (quality > speed)
   */
  private resolveModelConflict(recommendations: AgentRecommendation[]): ConflictResolution['resolution'] {
    const sorted = [...recommendations].sort((a, b) => {
      const aScore = MODEL_HIERARCHY[a.model || 'sonnet'];
      const bScore = MODEL_HIERARCHY[b.model || 'sonnet'];
      return bScore - aScore;
    });

    const winner = sorted[0];

    return {
      strategy: 'higher_model',
      winner,
      reason: `Quality > speed: selected ${winner.model} (higher model) for safety`,
      confidence: 95,
      requiresHITL: false
    };
  }

  /**
   * Approach conflict: Minimum change wins (avoid over-engineering)
   */
  private resolveApproachConflict(recommendations: AgentRecommendation[]): ConflictResolution['resolution'] {
    const sorted = [...recommendations].sort((a, b) => {
      const aSize = APPROACH_CHANGE_SIZE[a.approach || 'modify'];
      const bSize = APPROACH_CHANGE_SIZE[b.approach || 'modify'];
      return aSize - bSize;
    });

    const winner = sorted[0];

    return {
      strategy: 'minimum_change',
      winner,
      reason: `Prefer minimal changes: ${winner.approach} has lower complexity than alternatives`,
      confidence: 85,
      requiresHITL: false
    };
  }

  /**
   * Priority conflict: User objective alignment wins
   */
  private async resolvePriorityConflict(
    recommendations: AgentRecommendation[],
    userObjective: string
  ): Promise<ConflictResolution['resolution']> {
    // Calculate alignment scores
    const alignmentScores = recommendations.map(r => ({
      recommendation: r,
      alignment: this.calculateAlignmentScore(r, userObjective)
    }));

    // Sort by alignment
    alignmentScores.sort((a, b) => b.alignment - a.alignment);

    const best = alignmentScores[0];
    const second = alignmentScores[1];

    // If very close, escalate to HITL
    if (second && Math.abs(best.alignment - second.alignment) < 5) {
      return {
        strategy: 'hitl',
        winner: null,
        reason: `Close alignment scores (${best.alignment}% vs ${second.alignment}%) - user input needed`,
        confidence: 50,
        requiresHITL: true
      };
    }

    return {
      strategy: 'user_alignment',
      winner: best.recommendation,
      reason: `Most aligned with user objective (${best.alignment}% alignment)`,
      confidence: best.alignment,
      requiresHITL: false
    };
  }

  /**
   * Tie conflict: Escalate to HITL
   */
  private resolveTie(recommendations: AgentRecommendation[]): ConflictResolution['resolution'] {
    return {
      strategy: 'hitl',
      winner: null,
      reason: `Technical tie between ${recommendations.length} options - user must decide`,
      confidence: 50,
      requiresHITL: true
    };
  }

  /**
   * Critical conflict: Always escalate to HITL
   */
  private resolveCritical(recommendations: AgentRecommendation[]): ConflictResolution['resolution'] {
    const criticalRisks = recommendations
      .filter(r => r.risk === 'critical')
      .map(r => r.rationale);

    return {
      strategy: 'hitl',
      winner: null,
      reason: `CRITICAL: Security/data risk detected - user must decide. Risks: ${criticalRisks.join('; ')}`,
      confidence: 0,
      requiresHITL: true
    };
  }

  /**
   * Calculate alignment score between recommendation and user objective
   */
  private calculateAlignmentScore(recommendation: AgentRecommendation, userObjective: string): number {
    // Simple keyword-based alignment scoring
    const objectiveWords = userObjective.toLowerCase().split(/\s+/);
    const rationale = recommendation.rationale.toLowerCase();
    const rec = recommendation.recommendation.toLowerCase();

    let matches = 0;
    for (const word of objectiveWords) {
      if (word.length > 3) { // Skip short words
        if (rationale.includes(word) || rec.includes(word)) {
          matches++;
        }
      }
    }

    // Base alignment from matches
    const matchScore = Math.min((matches / objectiveWords.length) * 100, 50);

    // Add confidence factor
    const confidenceBonus = (recommendation.confidence / 100) * 30;

    // Penalize high risk
    const riskPenalty = recommendation.risk === 'high' ? 10 :
                        recommendation.risk === 'critical' ? 30 : 0;

    return Math.round(matchScore + confidenceBonus - riskPenalty + 20); // 20 base points
  }

  /**
   * Log resolution as a decision in shared state
   */
  private logResolutionAsDecision(resolution: ConflictResolution): void {
    const decision: Omit<Decision, 'id' | 'timestamp'> = {
      phase: this.state.currentPhase,
      type: 'conflict_resolution',
      selected: resolution.resolution.winner?.recommendation || 'HITL required',
      alternatives: resolution.recommendations
        .filter(r => r !== resolution.resolution.winner)
        .map(r => ({
          option: r.recommendation,
          reason: `${r.agentId}: ${r.rationale} (confidence: ${r.confidence}%)`
        })),
      reason: resolution.resolution.reason,
      confidence: resolution.resolution.confidence
    };

    this.state.addDecision(decision);
  }

  /**
   * Get resolution history
   */
  getResolutionHistory(): ConflictResolution[] {
    return this.resolutionHistory;
  }

  /**
   * Get conflicts that required HITL
   */
  getHITLConflicts(): ConflictResolution[] {
    return this.resolutionHistory.filter(r => r.resolution.requiresHITL);
  }

  /**
   * Update resolution after HITL input
   */
  resolveWithUserInput(conflictId: string, selectedRecommendation: AgentRecommendation): void {
    const conflict = this.resolutionHistory.find(r => r.conflictId === conflictId);
    if (conflict) {
      conflict.resolution.winner = selectedRecommendation;
      conflict.resolution.reason += ` (User selected: ${selectedRecommendation.recommendation})`;
      conflict.resolution.requiresHITL = false;

      // Log user decision
      this.state.addDecision({
        phase: this.state.currentPhase,
        type: 'hitl_decision',
        selected: selectedRecommendation.recommendation,
        alternatives: conflict.recommendations
          .filter(r => r !== selectedRecommendation)
          .map(r => ({ option: r.recommendation, reason: r.rationale })),
        reason: 'User resolved conflict',
        confidence: 100
      });
    }
  }

  /**
   * Generate HITL question for unresolved conflicts
   */
  generateHITLQuestion(conflict: ConflictResolution): {
    question: string;
    options: { label: string; description: string }[];
  } {
    const options = conflict.recommendations.map(r => ({
      label: r.recommendation,
      description: `${r.agentId}: ${r.rationale} (confidence: ${r.confidence}%, risk: ${r.risk})`
    }));

    let question = '';
    switch (conflict.conflictType) {
      case 'tie':
        question = 'Los agentes tienen opiniones igualmente válidas. ¿Cuál prefieres?';
        break;
      case 'critical':
        question = '⚠️ Se detectaron riesgos críticos. ¿Cómo quieres proceder?';
        break;
      default:
        question = 'Hay un conflicto entre agentes. ¿Cuál enfoque prefieres?';
    }

    return { question, options };
  }
}

// Export singleton getter
let resolverInstance: ConflictResolver | null = null;

export function getConflictResolver(): ConflictResolver {
  if (!resolverInstance) {
    resolverInstance = new ConflictResolver();
  }
  return resolverInstance;
}

export function resetConflictResolver(): void {
  resolverInstance = null;
}

export { ConflictResolver };
export type { ConflictType, ConflictResolution, AgentRecommendation, ResolutionStrategy };
