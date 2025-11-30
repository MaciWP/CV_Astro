#!/usr/bin/env python3
"""
Hook: Reset Orchestrator State on New User Message

Resets the orchestrator activation tracker and workflow state when user submits a new prompt.
Also displays a visible reminder about the orchestrator rule.

Event: UserPromptSubmit
Purpose: Reset state for new message cycle + 3-path enforcement
"""

import json
import sys
from pathlib import Path
from datetime import datetime

# UNIFIED State file - MUST match validate-orchestrator.py
CLAUDE_DIR = Path(__file__).parent.parent
STATE_FILE = CLAUDE_DIR / "state" / "workflow-state.json"
DEBUG_LOG = CLAUDE_DIR / "hook-debug.log"


def log_debug(message):
    """Write debug message to log file."""
    try:
        DEBUG_LOG.parent.mkdir(parents=True, exist_ok=True)
        with open(DEBUG_LOG, "a") as f:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            f.write(f"[{timestamp}] [RESET] {message}\n")
    except Exception as e:
        pass


def reset_state():
    """Reset ALL orchestrator state for new message (unified file)."""
    try:
        STATE_FILE.parent.mkdir(parents=True, exist_ok=True)

        # UNIFIED state structure - includes orchestrator + workflow + 3-path
        state = {
            # Orchestrator activation tracking
            "orchestrator_activated": False,
            "tool_count": 0,

            # 3-PATH ENFORCEMENT (CRITICAL)
            "execution_path": {
                "selected_path": None,
                "complexity_score": None,
                "required_agents": [],
                "executed_agents": [],
                "missing_agents": [],
                "current_phase": 0,
                "path_validation_status": "pending",
                "violations": []
            },

            # Workflow tracking
            "message_id": None,
            "tool_sequence": [],
            "agents_invoked": [],
            "estimated_complexity": 0,
            "security_detected": False,
            "phase_3_completed": False,
            "phase_5_security_completed": False,
            "files_read": 0,
            "files_to_write": 0,
            "grep_searches": 0,
            "glob_patterns": 0,
            "bash_commands": 0,
            "execution_blocked_count": 0,

            # Metadata
            "reset_at": datetime.now().isoformat(),
            "last_updated": datetime.now().isoformat()
        }

        with open(STATE_FILE, "w") as f:
            json.dump(state, f, indent=2)

        log_debug(f"Unified state reset: orchestrator_activated=False, execution_path=pending")
        return True
    except Exception as e:
        log_debug(f"ERROR resetting state: {e}")
        return False


def main():
    try:
        success = reset_state()

        # Display reminder (visible to Claude) - NO emojis for Windows compatibility
        print("[RESET] State reset - 3-PATH ENFORCEMENT ACTIVE")

        if success:
            log_debug("Hook completed successfully")
        else:
            log_debug("Hook completed with errors")

    except Exception as e:
        log_debug(f"CRITICAL ERROR in main: {e}")
        print("[RESET] State reset - 3-PATH ENFORCEMENT ACTIVE")


if __name__ == "__main__":
    main()