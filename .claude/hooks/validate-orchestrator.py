#!/usr/bin/env python3
"""
Hook: Validate Orchestrator First Rule

Ensures that adaptive-meta-orchestrator skill is ALWAYS activated FIRST
on every user message, before any other tool use.

Event: PreToolUse
Purpose: Enforce CLAUDE.md mandatory orchestrator rule
"""

import json
import sys
from pathlib import Path
from datetime import datetime

# State file to track if orchestrator was activated in current message
STATE_FILE = Path.home() / ".claude" / "orchestrator-state.json"
DEBUG_LOG = Path.home() / ".claude" / "hook-debug.log"


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

    return {"orchestrator_activated": False, "tool_count": 0}


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


def is_orchestrator_activation(tool_name, hook_data):
    """
    Check if this tool call is activating the orchestrator.

    Returns: True if this is Skill('adaptive-meta-orchestrator')
    """
    if tool_name != "Skill":
        return False

    # Convert entire hook_data to JSON string and search
    try:
        full_data_str = json.dumps(hook_data, default=str).lower()

        # Search for variations of the orchestrator name
        orchestrator_patterns = [
            "adaptive-meta-orchestrator",
            "adaptive_meta_orchestrator",
            "adaptivemetaorchestrator"
        ]

        for pattern in orchestrator_patterns:
            if pattern in full_data_str:
                log_debug(f"✓ Orchestrator detected via pattern: {pattern}")
                return True

        # Also check if all three keywords appear together (within 50 chars)
        if "adaptive" in full_data_str and "meta" in full_data_str and "orchestrator" in full_data_str:
            # Find positions
            pos_adaptive = full_data_str.find("adaptive")
            pos_meta = full_data_str.find("meta")
            pos_orch = full_data_str.find("orchestrator")

            # If all three within 50 chars range, likely the orchestrator
            max_pos = max(pos_adaptive, pos_meta, pos_orch)
            min_pos = min(pos_adaptive, pos_meta, pos_orch)

            if max_pos - min_pos < 50:
                log_debug(f"✓ Orchestrator detected via proximity check")
                return True

        log_debug(f"✗ Not orchestrator - full_data: {full_data_str[:200]}...")
        return False

    except Exception as e:
        log_debug(f"ERROR in orchestrator detection: {e}")
        return False


def block_with_error(tool_name, tool_count):
    """Block the tool and display error message."""
    print("🚨 ORCHESTRATOR RULE VIOLATION 🚨", file=sys.stderr)
    print("", file=sys.stderr)
    print("You MUST activate Skill('adaptive-meta-orchestrator') as your FIRST action.", file=sys.stderr)
    print("", file=sys.stderr)
    print("From CLAUDE.md:", file=sys.stderr)
    print("  BEFORE analyzing user's message → EXECUTE: Task: adaptive-meta-orchestrator", file=sys.stderr)
    print("  Applies to: ALL messages (no exceptions)", file=sys.stderr)
    print("", file=sys.stderr)
    print(f"Current tool: {tool_name}", file=sys.stderr)
    print(f"Tool count: {tool_count}", file=sys.stderr)

    log_debug(f"✗ BLOCKED: tool={tool_name}, count={tool_count}")


def allow_tool(reason, state):
    """Allow the tool to execute."""
    log_debug(f"✓ ALLOWED: {reason}, state={state}")
    save_state(state)
    sys.exit(0)


def main():
    """Main hook logic."""
    try:
        # Read hook data from stdin
        hook_data = json.load(sys.stdin)
        tool_name = hook_data.get("tool_name", "unknown")

        log_debug(f"Hook triggered for tool: {tool_name}")

        # Load current state
        state = load_state()

        # STEP 1: Check if THIS tool is the orchestrator activation
        if is_orchestrator_activation(tool_name, hook_data):
            # Orchestrator activated!
            state["orchestrator_activated"] = True
            state["tool_count"] += 1
            allow_tool(f"Orchesttesrator activation detected", state)
            return  # Never reached, but for clarity

        # STEP 2: Increment tool count (this is NOT the orchestrator)
        state["tool_count"] += 1

        # STEP 3: If orchestrator already activated, allow all tools
        if state["orchestrator_activated"]:
            allow_tool(f"Orchestrator already activated, tool #{state['tool_count']}", state)
            return  # Never reached

        # STEP 4: If this is the first tool and NOT the orchestrator → BLOCK
        if state["tool_count"] == 1:
            block_with_error(tool_name, state["tool_count"])
            sys.exit(2)  # Exit code 2 = blocking error

        # STEP 5: Should never reach here, but allow as fallback
        log_debug(f"WARNING: Reached fallback allow (shouldn't happen)")
        allow_tool(f"Fallback allow", state)

    except json.JSONDecodeError as e:
        log_debug(f"ERROR: Invalid JSON from stdin: {e}")
        # If can't read JSON, allow (fail-open for safety)
        sys.exit(0)

    except Exception as e:
        log_debug(f"CRITICAL ERROR in main: {e}")
        # On critical error, allow (fail-open for safety)
        sys.exit(0)


if __name__ == "__main__":
    main()