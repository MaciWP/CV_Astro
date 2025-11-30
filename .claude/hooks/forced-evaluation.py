#!/usr/bin/env python3
"""
Hook: Forced Evaluation (3-Step Pattern)

Enforces the EVALUATE → ACTIVATE → RUN pattern for orchestrator reliability.
Based on research showing 80-84% skill activation with forced evaluation.

Event: PreToolUse
Purpose: Ensure systematic evaluation before tool execution
"""

import json
import sys
from pathlib import Path
from datetime import datetime

# State and log files
STATE_FILE = Path.home() / ".claude" / "evaluation-state.json"
DEBUG_LOG = Path.home() / ".claude" / "hook-debug.log"


def log_debug(message):
    """Write debug message to log file."""
    try:
        DEBUG_LOG.parent.mkdir(parents=True, exist_ok=True)
        with open(DEBUG_LOG, "a", encoding="utf-8") as f:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            f.write(f"[{timestamp}] [FORCED-EVAL] {message}\n")
    except Exception:
        pass  # Silent fail


def load_state():
    """Load evaluation state."""
    try:
        if STATE_FILE.exists():
            with open(STATE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception as e:
        log_debug(f"ERROR loading state: {e}")

    return {
        "phase_evaluations": {},
        "tool_count": 0,
        "evaluation_complete": False,
        "last_tool": None
    }


def save_state(state):
    """Save evaluation state."""
    try:
        STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(STATE_FILE, "w", encoding="utf-8") as f:
            json.dump(state, f, indent=2)
        return True
    except Exception as e:
        log_debug(f"ERROR saving state: {e}")
        return False


def is_orchestrator_tool(tool_name, hook_data):
    """Check if this tool call is the orchestrator skill."""
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
                return True

        return False
    except Exception:
        return False


def is_evaluation_tool(tool_name):
    """Check if this is an evaluation/analysis tool."""
    evaluation_tools = [
        "Read", "Grep", "Glob",  # Context gathering
        "Skill",  # Skill activation (including orchestrator)
        "TodoWrite",  # Planning
        "AskUserQuestion"  # Clarification
    ]
    return tool_name in evaluation_tools


def is_execution_tool(tool_name):
    """Check if this is an execution tool (writes/modifies)."""
    execution_tools = [
        "Write", "Edit", "Bash",  # File/system modification
        "NotebookEdit",  # Notebook modification
        "Task"  # Agent invocation (execution)
    ]
    return tool_name in execution_tools


def check_evaluation_pattern(state, tool_name):
    """
    Check if the 3-step pattern is being followed:
    1. EVALUATE: Assessment phase (Read, Grep, Glob, etc.)
    2. ACTIVATE: Orchestrator/skill activation
    3. RUN: Execution (Write, Edit, Task, etc.)

    Returns: (allowed: bool, message: str)
    """
    tool_count = state.get("tool_count", 0)
    orchestrator_activated = state.get("orchestrator_activated", False)

    # Phase 1: First tools should be evaluation or orchestrator
    if tool_count < 3 and is_execution_tool(tool_name) and not orchestrator_activated:
        return False, (
            "⚠️ EVALUATION PATTERN WARNING\n"
            "Executing write tools before proper evaluation.\n"
            "Pattern: EVALUATE → ACTIVATE → RUN\n"
            f"Current tool: {tool_name} (execution tool)\n"
            "Consider: Read/Grep/Glob first, then orchestrator, then execute."
        )

    # Always allow evaluation tools
    if is_evaluation_tool(tool_name):
        return True, "Evaluation tool allowed"

    # Allow execution if orchestrator was activated
    if orchestrator_activated:
        return True, "Orchestrator activated, execution allowed"

    # Default: allow with warning logged
    log_debug(f"WARNING: {tool_name} executed without full evaluation pattern")
    return True, "Allowed with warning"


def main():
    """Main hook logic."""
    try:
        # Read hook data from stdin
        hook_data = json.load(sys.stdin)
        tool_name = hook_data.get("tool_name", "unknown")

        log_debug(f"Hook triggered for tool: {tool_name}")

        # Load current state
        state = load_state()
        state["tool_count"] = state.get("tool_count", 0) + 1
        state["last_tool"] = tool_name

        # Track orchestrator activation
        if is_orchestrator_tool(tool_name, hook_data):
            state["orchestrator_activated"] = True
            log_debug("Orchestrator activation detected")

        # Check evaluation pattern
        allowed, message = check_evaluation_pattern(state, tool_name)

        # Save state
        save_state(state)

        if allowed:
            log_debug(f"✓ ALLOWED: {tool_name} - {message}")
            sys.exit(0)  # Allow tool
        else:
            # Log warning but don't block (soft enforcement)
            log_debug(f"⚠️ WARNING: {tool_name} - {message}")
            # For now, we warn but don't block
            # To make it strict: sys.exit(2)
            sys.exit(0)

    except json.JSONDecodeError as e:
        log_debug(f"ERROR: Invalid JSON from stdin: {e}")
        sys.exit(0)  # Fail-open

    except Exception as e:
        log_debug(f"CRITICAL ERROR: {e}")
        sys.exit(0)  # Fail-open


if __name__ == "__main__":
    main()
