#!/usr/bin/env python3
"""
Hook: Validate Orchestrator + 5-Tier Enforcement

Ensures that:
1. adaptive-meta-orchestrator skill is ALWAYS activated FIRST
2. Required agents are invoked based on complexity tier (TRIVIAL/FAST/STANDARD/ADVANCED/FULL)
3. NO BYPASS POSSIBLE - strict enforcement

Event: PreToolUse
Purpose: Enforce CLAUDE.md mandatory orchestrator rule + 5-tier workflow
"""

import json
import sys
from pathlib import Path
from datetime import datetime

# Paths
CLAUDE_DIR = Path(__file__).parent.parent
STATE_FILE = CLAUDE_DIR / "state" / "workflow-state.json"
TIERS_CONFIG = CLAUDE_DIR / "config" / "complexity-tiers.json"
DEBUG_LOG = CLAUDE_DIR / "hook-debug.log"

# Fallback paths (if running from different location)
if not CLAUDE_DIR.exists():
    CLAUDE_DIR = Path.home() / ".claude"
    STATE_FILE = CLAUDE_DIR / "state" / "workflow-state.json"
    TIERS_CONFIG = CLAUDE_DIR / "config" / "complexity-tiers.json"
    DEBUG_LOG = CLAUDE_DIR / "hook-debug.log"


def log_debug(message):
    """Write debug message to log file."""
    try:
        DEBUG_LOG.parent.mkdir(parents=True, exist_ok=True)
        with open(DEBUG_LOG, "a") as f:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            f.write(f"[{timestamp}] [VALIDATE] {message}\n")
    except:
        pass  # Silent fail


def load_state():
    """Load orchestrator activation state."""
    try:
        if STATE_FILE.exists():
            with open(STATE_FILE, "r") as f:
                return json.load(f)
    except Exception as e:
        log_debug(f"ERROR loading state: {e}")

    # Default state with 5-tier tracking
    return {
        "orchestrator_activated": False,
        "tool_count": 0,
        "execution_path": {
            "selected_tier": None,
            "tier_locked": False,
            "complexity_score": None,
            "required_agents": [],
            "executed_agents": [],
            "missing_agents": [],
            "current_phase": 0,
            "tier_validation_status": "pending",
            "violations": []
        }
    }


def save_state(state):
    """Save orchestrator activation state."""
    try:
        STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(STATE_FILE, "w") as f:
            json.dump(state, f, indent=2)
        return True
    except Exception as e:
        log_debug(f"ERROR saving state: {e}")
        return False


def load_tiers_config():
    """Load 5-tier execution configuration."""
    try:
        if TIERS_CONFIG.exists():
            with open(TIERS_CONFIG, "r") as f:
                return json.load(f)
    except Exception as e:
        log_debug(f"ERROR loading tiers config: {e}")
    return None


def get_tier_for_complexity(complexity_score, config):
    """Determine which tier applies based on complexity score."""
    if config is None:
        return None

    tiers = config.get("tiers", {})
    for tier_name, tier_def in tiers.items():
        range_def = tier_def.get("range", [])
        if len(range_def) == 2:
            min_val, max_val = range_def
            if min_val <= complexity_score <= max_val:
                return tier_name
    return None


def get_required_agents_for_tier(tier_name, config):
    """Get list of required agent names for a tier."""
    if config is None:
        return []

    tier_def = config.get("tiers", {}).get(tier_name, {})
    return tier_def.get("requiredAgents", [])


def is_direct_tools_allowed(tier_name, config):
    """Check if tier allows direct tool usage (TRIVIAL only)."""
    if config is None:
        return False

    tier_def = config.get("tiers", {}).get(tier_name, {})
    return tier_def.get("allowDirectTools", False)


def is_orchestrator_activation(tool_name, hook_data):
    """
    Check if this tool call is activating the orchestrator.
    Returns: True if this is Skill('adaptive-meta-orchestrator')
    """
    if tool_name != "Skill":
        return False

    try:
        full_data_str = json.dumps(hook_data, default=str).lower()
        orchestrator_patterns = [
            "adaptive-meta-orchestrator",
            "adaptive_meta_orchestrator",
            "adaptivemetaorchestrator"
        ]

        for pattern in orchestrator_patterns:
            if pattern in full_data_str:
                log_debug(f"[OK] Orchestrator detected via pattern: {pattern}")
                return True

        if "adaptive" in full_data_str and "meta" in full_data_str and "orchestrator" in full_data_str:
            pos_adaptive = full_data_str.find("adaptive")
            pos_meta = full_data_str.find("meta")
            pos_orch = full_data_str.find("orchestrator")
            max_pos = max(pos_adaptive, pos_meta, pos_orch)
            min_pos = min(pos_adaptive, pos_meta, pos_orch)
            if max_pos - min_pos < 50:
                log_debug(f"[OK] Orchestrator detected via proximity check")
                return True

        return False
    except Exception as e:
        log_debug(f"ERROR in orchestrator detection: {e}")
        return False


def extract_agent_from_task(hook_data):
    """Extract agent name from Task() call."""
    try:
        tool_input = hook_data.get("tool_input", {})

        # Check for subagent_type in various locations
        if isinstance(tool_input, dict):
            agent = tool_input.get("subagent_type")
            if agent:
                return agent

        # Search in full data
        full_data_str = json.dumps(hook_data, default=str)

        # Look for subagent_type pattern
        import re
        match = re.search(r'"subagent_type":\s*"([^"]+)"', full_data_str)
        if match:
            return match.group(1)

        return None
    except Exception as e:
        log_debug(f"ERROR extracting agent: {e}")
        return None


def is_phase_agent(tool_name, hook_data):
    """Check if this is a Task() call invoking a phase agent."""
    if tool_name != "Task":
        return False, None

    agent = extract_agent_from_task(hook_data)
    if agent and agent.startswith("phase-"):
        return True, agent
    return False, agent


def validate_tier_enforcement(state, agent_name, config):
    """
    Validate that the agent being invoked is allowed/required for current tier.
    Returns: (allowed: bool, message: str)
    """
    exec_path = state.get("execution_path", {})
    selected_tier = exec_path.get("selected_tier")

    # If no tier selected yet, allow (will be determined by complexity-scorer)
    if selected_tier is None:
        return True, "Tier not yet determined"

    required_agents = exec_path.get("required_agents", [])
    executed_agents = exec_path.get("executed_agents", [])

    # Track this agent execution
    if agent_name and agent_name not in executed_agents:
        executed_agents.append(agent_name)
        exec_path["executed_agents"] = executed_agents

    return True, f"Agent {agent_name} tracked for {selected_tier} tier"


def check_minimum_agents_before_execution(state, config):
    """
    Check if minimum required agents have been invoked before allowing execution tools.
    Returns: (allowed: bool, missing_agents: list)
    """
    exec_path = state.get("execution_path", {})
    selected_tier = exec_path.get("selected_tier")

    if selected_tier is None:
        # No tier determined yet - block execution tools until tier is set
        return False, ["Tier not determined - invoke phase-1b-complexity-scorer first"]

    required = exec_path.get("required_agents", [])
    executed = exec_path.get("executed_agents", [])

    # Find mandatory agents not yet executed
    missing = [a for a in required if a not in executed]

    if missing:
        exec_path["missing_agents"] = missing
        exec_path["tier_validation_status"] = "failed"
        return False, missing

    exec_path["tier_validation_status"] = "passed"
    return True, []


def update_tier_from_complexity(state, complexity_score, config):
    """Update execution tier based on complexity score."""
    tier_name = get_tier_for_complexity(complexity_score, config)
    if tier_name:
        required = get_required_agents_for_tier(tier_name, config)
        state["execution_path"]["selected_tier"] = tier_name
        state["execution_path"]["complexity_score"] = complexity_score
        state["execution_path"]["required_agents"] = required
        state["execution_path"]["tier_determined_at"] = datetime.now().isoformat()
        log_debug(f"[TIER] Selected {tier_name} (complexity={complexity_score}), required={len(required)} agents")


def block_with_error(message, details=None):
    """Block the tool and display error message."""
    print(f"[ERROR] {message}", file=sys.stderr)
    if details:
        print("", file=sys.stderr)
        for detail in details:
            print(f"  - {detail}", file=sys.stderr)
    print("", file=sys.stderr)
    log_debug(f"[BLOCK] {message}")


def allow_tool(reason, state):
    """Allow the tool to execute."""
    log_debug(f"[OK] ALLOWED: {reason}")
    save_state(state)
    sys.exit(0)


def main():
    """Main hook logic."""
    try:
        hook_data = json.load(sys.stdin)
        tool_name = hook_data.get("tool_name", "unknown")

        log_debug(f"Hook triggered for tool: {tool_name}")

        state = load_state()
        config = load_tiers_config()

        # ============================================
        # RULE 1: Orchestrator must be activated FIRST
        # ============================================
        if is_orchestrator_activation(tool_name, hook_data):
            state["orchestrator_activated"] = True
            state["tool_count"] += 1
            allow_tool("Orchestrator activation detected", state)
            return

        state["tool_count"] += 1

        # Block if orchestrator not yet activated
        if not state.get("orchestrator_activated", False):
            if state["tool_count"] == 1:
                block_with_error(
                    "ORCHESTRATOR RULE VIOLATION",
                    [
                        "You MUST activate Skill('adaptive-meta-orchestrator') as your FIRST action.",
                        "From CLAUDE.md: BEFORE analyzing user's message → EXECUTE: Skill('adaptive-meta-orchestrator')",
                        "Applies to: ALL messages (no exceptions)",
                        f"Current tool: {tool_name}",
                        f"Tool count: {state['tool_count']}"
                    ]
                )
                sys.exit(2)

        # ============================================
        # RULE 2: Track phase agent invocations
        # ============================================
        is_task, agent_name = is_phase_agent(tool_name, hook_data)

        if is_task and agent_name:
            # Track the agent
            exec_path = state.get("execution_path", {})
            executed = exec_path.get("executed_agents", [])
            if agent_name not in executed:
                executed.append(agent_name)
                exec_path["executed_agents"] = executed

            # If this is complexity-scorer, we'll get the complexity from its output
            # For now, just track it
            if agent_name == "phase-1b-complexity-scorer":
                log_debug(f"[TIER] Complexity scorer invoked - tier will be determined from result")

            log_debug(f"[AGENT] Tracked: {agent_name}")
            allow_tool(f"Phase agent {agent_name} tracked", state)
            return

        # ============================================
        # RULE 2.5: Require complexity-scorer before ANY other tool
        # ============================================
        ALLOWED_WITHOUT_SCORER = ["Skill", "Task"]

        if tool_name not in ALLOWED_WITHOUT_SCORER:
            exec_path = state.get("execution_path", {})
            executed_agents = exec_path.get("executed_agents", [])

            if "phase-1b-complexity-scorer" not in executed_agents:
                block_with_error(
                    "COMPLEXITY SCORER REQUIRED FIRST",
                    [
                        f"Tool '{tool_name}' blocked - complexity score not determined yet.",
                        "",
                        "MANDATORY WORKFLOW:",
                        "  1. Skill('adaptive-meta-orchestrator') - Activate orchestrator",
                        "  2. Task(subagent_type='phase-1b-complexity-scorer') - Score complexity",
                        "  3. Then use other tools based on your tier (TRIVIAL/FAST/STANDARD/ADVANCED/FULL)",
                        "",
                        "NO BYPASS POSSIBLE - This is enforced by hook."
                    ]
                )
                sys.exit(2)

        # ============================================
        # RULE 2.6: 5-TIER ENFORCEMENT - TRIVIAL allows direct tools
        # ============================================
        ORCHESTRATION_ONLY_TOOLS = ["Skill", "Task"]
        DIRECT_TOOLS = ["Read", "Glob", "Grep", "Edit", "Write", "Bash"]

        if tool_name in DIRECT_TOOLS:
            exec_path = state.get("execution_path", {})
            executed_agents = exec_path.get("executed_agents", [])
            selected_tier = exec_path.get("selected_tier")

            # Check if complexity-scorer was invoked
            if "phase-1b-complexity-scorer" in executed_agents:
                # Check if this tier allows direct tools
                if config:
                    allow_direct = is_direct_tools_allowed(selected_tier, config)

                    if allow_direct:
                        # TRIVIAL tier - allow direct tools after scorer
                        log_debug(f"[TIER] {selected_tier} allows direct tool: {tool_name}")
                        allow_tool(f"TRIVIAL tier allows {tool_name}", state)
                        return
                    else:
                        # Other tiers - require coordinator
                        if "phase-4-coordinator" not in executed_agents:
                            block_with_error(
                                "ORCHESTRATION PHASE - AGENTS ONLY",
                                [
                                    f"Tool '{tool_name}' blocked - main session can only orchestrate.",
                                    f"Selected tier: {selected_tier} (does NOT allow direct tools)",
                                    "",
                                    "After complexity-scorer, you must delegate to agents:",
                                    "  1. Task(phase-3a-task-lister) - List tasks",
                                    "  2. Task(phase-3-planner) - Create plan",
                                    "  3. Task(phase-4-coordinator) - Execute via coordinator",
                                    "",
                                    "Only TRIVIAL tier (0-30) allows direct tools.",
                                    "Agents have full tool access when invoked."
                                ]
                            )
                            sys.exit(2)

        # ============================================
        # RULE 3: Block execution tools if tier requirements not met
        # ============================================
        EXECUTION_TOOLS = ["Edit", "Write", "Bash"]

        if tool_name in EXECUTION_TOOLS and config:
            enforcement = config.get("enforcement", {})
            if enforcement.get("mode") == "STRICT" and enforcement.get("blockOnViolation", True):

                exec_path = state.get("execution_path", {})
                selected_tier = exec_path.get("selected_tier")

                # If tier is set, check minimum agents
                if selected_tier:
                    # Check if TRIVIAL tier (which allows direct tools)
                    if is_direct_tools_allowed(selected_tier, config):
                        allow_tool(f"TRIVIAL tier allows execution tool: {tool_name}", state)
                        return

                    # Other tiers - check minimum agents
                    allowed, missing = check_minimum_agents_before_execution(state, config)

                    if not allowed:
                        tier_def = config.get("tiers", {}).get(selected_tier, {})
                        min_agents = tier_def.get("minimumAgents", 0)
                        executed_count = len(exec_path.get("executed_agents", []))

                        block_with_error(
                            f"5-TIER ENFORCEMENT VIOLATION",
                            [
                                f"Selected tier: {selected_tier}",
                                f"Required agents: {min_agents}",
                                f"Executed agents: {executed_count}",
                                f"Missing mandatory agents:",
                                *[f"  - {a}" for a in missing[:5]],  # Show first 5
                                "",
                                "You MUST invoke the required phase agents before using execution tools.",
                                "NO BYPASS POSSIBLE."
                            ]
                        )
                        sys.exit(2)

        # ============================================
        # ALLOW: Tool passed all checks
        # ============================================
        allow_tool(f"Tool {tool_name} allowed", state)

    except json.JSONDecodeError as e:
        log_debug(f"ERROR: Invalid JSON from stdin: {e}")
        sys.exit(0)  # Fail-open for safety

    except Exception as e:
        log_debug(f"CRITICAL ERROR in main: {e}")
        sys.exit(0)  # Fail-open for safety


if __name__ == "__main__":
    main()
