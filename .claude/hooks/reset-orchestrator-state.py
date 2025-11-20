#!/usr/bin/env python3
"""
Hook: Reset Orchestrator State on New User Message

Resets the orchestrator activation tracker when user submits a new prompt.
Also displays a visible reminder about the orchestrator rule.

Event: UserPromptSubmit
Purpose: Reset state for new message cycle
"""

import json
import sys
from pathlib import Path
from datetime import datetime

# State file to track if orchestrator was activated
STATE_FILE = Path.home() / ".claude" / "orchestrator-state.json"
DEBUG_LOG = Path.home() / ".claude" / "hook-debug.log"


def log_debug(message):
    """Write debug message to log file."""
    try:
        DEBUG_LOG.parent.mkdir(parents=True, exist_ok=True)
        with open(DEBUG_LOG, "a") as f:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            f.write(f"[{timestamp}] [RESET] {message}\n")
    except Exception as e:
        # Silent fail - don't break hook if logging fails
        pass


def reset_state():
    """Reset orchestrator activation state for new message."""
    try:
        STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
        state = {
            "orchestrator_activated": False,
            "tool_count": 0,
            "reset_at": datetime.now().isoformat()
        }
        with open(STATE_FILE, "w") as f:
            json.dump(state, f, indent=2)

        log_debug(f"State reset successfully: {state}")
        return True
    except Exception as e:
        log_debug(f"ERROR resetting state: {e}")
        return False


def main():
    try:
        # Reset state for new user message
        success = reset_state()

        # Display reminder (visible to Claude)
        print("🔄 Orchestrator state reset - new message cycle")
        print("🚨 Remember: Activate adaptive-meta-orchestrator FIRST!")

        if success:
            log_debug("Hook completed successfully")
        else:
            log_debug("Hook completed with errors")

    except Exception as e:
        log_debug(f"CRITICAL ERROR in main: {e}")
        # Still print reminder even if logging fails
        print("🔄 Orchestrator state reset - new message cycle")
        print("🚨 Remember: Activate adaptive-meta-orchestrator FIRST!")


if __name__ == "__main__":
    main()