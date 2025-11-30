#!/usr/bin/env python3
"""
Hook: Iteration Detector

Detects when user message is a correction or iteration on previous output.
Triggers prompt-chain-analyzer agent for root cause analysis.

Event: PreToolUse (first tool of message)
Purpose: Learn from user corrections to prevent repeated mistakes
"""

import json
import sys
import re
from pathlib import Path
from datetime import datetime

# Files
DECISIONS_LOG = Path.cwd() / ".claude" / "state" / "decisions.jsonl"
DEBUG_LOG = Path.home() / ".claude" / "hook-debug.log"
ITERATION_STATE = Path.home() / ".claude" / "iteration-state.json"


def log_debug(message):
    """Write debug message to log file."""
    try:
        DEBUG_LOG.parent.mkdir(parents=True, exist_ok=True)
        with open(DEBUG_LOG, "a", encoding="utf-8") as f:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            f.write(f"[{timestamp}] [ITERATION] {message}\n")
    except Exception:
        pass


# Iteration detection patterns
ITERATION_PATTERNS = {
    "explicit_correction": {
        "patterns": [
            r"no,?\s+me refer[ií]a",
            r"no,?\s+i meant",
            r"no,?\s+quer[ií]a",
            r"no,?\s+i wanted",
            r"eso no es lo que",
            r"that'?s not what i",
            r"no era eso",
            r"that wasn'?t it"
        ],
        "confidence": 0.95,
        "type": "correction"
    },
    "implicit_correction": {
        "patterns": [
            r"otra vez",
            r"try again",
            r"intenta de nuevo",
            r"inténtalo otra vez",
            r"hazlo de nuevo",
            r"do it again",
            r"repite",
            r"repeat"
        ],
        "confidence": 0.85,
        "type": "retry"
    },
    "dissatisfaction": {
        "patterns": [
            r"no funciona",
            r"doesn'?t work",
            r"está mal",
            r"it'?s wrong",
            r"incorrecto",
            r"incorrect",
            r"error",
            r"bug",
            r"falla",
            r"fail"
        ],
        "confidence": 0.75,
        "type": "error"
    },
    "clarification": {
        "patterns": [
            r"lo que quer[ií]a (decir|era)",
            r"what i (meant|wanted) (was|is)",
            r"para ser más claro",
            r"to be (more )?clear",
            r"me explico",
            r"let me (explain|clarify)",
            r"en realidad",
            r"actually"
        ],
        "confidence": 0.80,
        "type": "clarification"
    }
}


def detect_iteration(message):
    """Detect if message is an iteration/correction."""
    if not message:
        return None

    message_lower = message.lower()

    for pattern_type, config in ITERATION_PATTERNS.items():
        for pattern in config["patterns"]:
            if re.search(pattern, message_lower, re.IGNORECASE):
                return {
                    "detected": True,
                    "pattern_type": pattern_type,
                    "pattern": pattern,
                    "confidence": config["confidence"],
                    "type": config["type"]
                }

    return None


def load_iteration_state():
    """Load iteration tracking state."""
    try:
        if ITERATION_STATE.exists():
            with open(ITERATION_STATE, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception:
        pass

    return {
        "iteration_count": 0,
        "last_iteration": None,
        "patterns_detected": []
    }


def save_iteration_state(state):
    """Save iteration tracking state."""
    try:
        ITERATION_STATE.parent.mkdir(parents=True, exist_ok=True)
        with open(ITERATION_STATE, "w", encoding="utf-8") as f:
            json.dump(state, f, indent=2)
    except Exception as e:
        log_debug(f"ERROR saving state: {e}")


def log_iteration(iteration_info, message):
    """Log iteration to decisions.jsonl for analysis."""
    try:
        DECISIONS_LOG.parent.mkdir(parents=True, exist_ok=True)

        entry = {
            "timestamp": datetime.now().isoformat(),
            "type": "iteration_detected",
            "iterationType": iteration_info["type"],
            "patternType": iteration_info["pattern_type"],
            "confidence": iteration_info["confidence"],
            "messageSummary": message[:100] + "..." if len(message) > 100 else message,
            "requiresAnalysis": iteration_info["confidence"] > 0.7
        }

        with open(DECISIONS_LOG, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry) + "\n")

        log_debug(f"Logged iteration: {iteration_info['type']}")

    except Exception as e:
        log_debug(f"ERROR logging iteration: {e}")


def main():
    """Main hook logic."""
    try:
        # Read hook data from stdin
        hook_data = json.load(sys.stdin)
        tool_name = hook_data.get("tool_name", "unknown")

        # Extract user message
        user_message = ""
        try:
            if "user_message" in hook_data:
                user_message = hook_data["user_message"]
            elif "context" in hook_data and "message" in hook_data["context"]:
                user_message = hook_data["context"]["message"]
        except Exception:
            pass

        # Skip if no message
        if not user_message:
            sys.exit(0)

        # Detect iteration
        iteration = detect_iteration(user_message)

        if iteration and iteration.get("detected"):
            log_debug(f"Iteration detected: {iteration}")

            # Log to decisions
            log_iteration(iteration, user_message)

            # Update state
            state = load_iteration_state()
            state["iteration_count"] = state.get("iteration_count", 0) + 1
            state["last_iteration"] = {
                "type": iteration["type"],
                "confidence": iteration["confidence"],
                "timestamp": datetime.now().isoformat()
            }
            state["patterns_detected"].append(iteration["pattern_type"])
            # Keep last 20
            state["patterns_detected"] = state["patterns_detected"][-20:]
            save_iteration_state(state)

            # Notify user that iteration was detected
            if iteration["confidence"] > 0.8:
                print(f"🔄 Iteración detectada ({iteration['type']})", file=sys.stderr)
                print(f"   Analizando qué fase falló...", file=sys.stderr)

                # The orchestrator will use prompt-chain-analyzer
                # based on this detection logged in decisions.jsonl

        # Always allow tool to proceed
        sys.exit(0)

    except json.JSONDecodeError as e:
        log_debug(f"ERROR: Invalid JSON: {e}")
        sys.exit(0)

    except Exception as e:
        log_debug(f"CRITICAL ERROR: {e}")
        sys.exit(0)


if __name__ == "__main__":
    main()
