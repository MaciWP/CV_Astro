#!/usr/bin/env python3
"""
Hook: Trust Signal Detector

Detects trust and distrust signals in user messages to adjust autonomy level.
Updates .claude/state/user-trust.json when signals detected.

Event: PreToolUse (first tool of message)
Purpose: Dynamic trust level adjustment based on user behavior
"""

import json
import sys
import re
from pathlib import Path
from datetime import datetime

# State files
TRUST_STATE_FILE = Path.cwd() / ".claude" / "state" / "user-trust.json"
DEBUG_LOG = Path.home() / ".claude" / "hook-debug.log"
MESSAGE_CACHE_FILE = Path.home() / ".claude" / "last-message-hash.txt"


def log_debug(message):
    """Write debug message to log file."""
    try:
        DEBUG_LOG.parent.mkdir(parents=True, exist_ok=True)
        with open(DEBUG_LOG, "a", encoding="utf-8") as f:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            f.write(f"[{timestamp}] [TRUST-SIGNAL] {message}\n")
    except Exception:
        pass


# Trust signal patterns
TRUST_PATTERNS = {
    "explicit_high": {
        "patterns": [
            r"conf[ií]o en ti",
            r"i trust you",
            r"hazlo t[uú]",
            r"you do it",
            r"como mejor veas",
            r"as you see fit",
            r"haz lo que quieras",
            r"do what you want",
            r"tienes carta blanca",
            r"full autonomy"
        ],
        "weight": 0.5,
        "type": "trust"
    },
    "explicit_medium": {
        "patterns": [
            r"adelante",
            r"go ahead",
            r"proceed",
            r"continua",
            r"sigue",
            r"ok",
            r"bien",
            r"good",
            r"perfecto",
            r"perfect"
        ],
        "weight": 0.1,
        "type": "trust"
    },
    "explicit_distrust": {
        "patterns": [
            r"no conf[ií]o",
            r"don'?t trust",
            r"pregunta antes",
            r"ask first",
            r"preguntame",
            r"ask me",
            r"no hagas nada sin",
            r"don'?t do anything without",
            r"para",
            r"stop",
            r"espera",
            r"wait"
        ],
        "weight": -0.3,
        "type": "distrust"
    },
    "correction": {
        "patterns": [
            r"no,?\s+(me refer[ií]a|quer[ií]a|es)",
            r"no,?\s+(i meant|i wanted)",
            r"eso no es",
            r"that'?s not",
            r"mal",
            r"wrong",
            r"incorrecto",
            r"incorrect",
            r"otra vez",
            r"try again",
            r"no funciona",
            r"doesn'?t work"
        ],
        "weight": -0.2,
        "type": "distrust"
    }
}


def load_trust_state():
    """Load current trust state."""
    try:
        if TRUST_STATE_FILE.exists():
            with open(TRUST_STATE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception as e:
        log_debug(f"ERROR loading trust state: {e}")

    # Default state
    return {
        "trustLevel": 2,
        "interactionCount": 0,
        "metrics": {
            "acceptanceRate": 0.0,
            "rollbackRate": 0.0,
            "trustSignals": 0,
            "distrustSignals": 0
        },
        "lastUpdated": datetime.now().isoformat()
    }


def save_trust_state(state):
    """Save trust state."""
    try:
        TRUST_STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
        state["lastUpdated"] = datetime.now().isoformat()
        with open(TRUST_STATE_FILE, "w", encoding="utf-8") as f:
            json.dump(state, f, indent=2)
        return True
    except Exception as e:
        log_debug(f"ERROR saving trust state: {e}")
        return False


def detect_signals(message):
    """Detect trust/distrust signals in message."""
    if not message:
        return []

    message_lower = message.lower()
    detected = []

    for signal_type, config in TRUST_PATTERNS.items():
        for pattern in config["patterns"]:
            if re.search(pattern, message_lower, re.IGNORECASE):
                detected.append({
                    "signal_type": signal_type,
                    "pattern": pattern,
                    "weight": config["weight"],
                    "type": config["type"]
                })
                break  # One match per signal type is enough

    return detected


def calculate_trust_adjustment(signals):
    """Calculate trust level adjustment from signals."""
    total_adjustment = 0.0

    for signal in signals:
        total_adjustment += signal["weight"]

    # Clamp adjustment
    max_increase = 1.0
    max_decrease = 2.0

    return max(-max_decrease, min(max_increase, total_adjustment))


def update_trust_level(state, adjustment, signals):
    """Update trust level based on adjustment."""
    current_level = state.get("trustLevel", 2)
    new_level = current_level + adjustment

    # Clamp to valid range (1-5)
    new_level = max(1, min(5, round(new_level * 2) / 2))  # Round to 0.5

    # Update metrics
    metrics = state.get("metrics", {})

    for signal in signals:
        if signal["type"] == "trust":
            metrics["trustSignals"] = metrics.get("trustSignals", 0) + 1
        else:
            metrics["distrustSignals"] = metrics.get("distrustSignals", 0) + 1

    # Update state
    state["trustLevel"] = new_level
    state["metrics"] = metrics

    # Log change
    if new_level != current_level:
        history = state.get("history", {"trustLevelChanges": []})
        history["trustLevelChanges"].append({
            "from": current_level,
            "to": new_level,
            "signals": [s["signal_type"] for s in signals],
            "timestamp": datetime.now().isoformat()
        })
        # Keep last 20 changes
        history["trustLevelChanges"] = history["trustLevelChanges"][-20:]
        state["history"] = history

    return state


def get_message_hash(message):
    """Get simple hash of message to avoid processing same message twice."""
    return str(hash(message[:100] if message else ""))


def was_message_processed(message):
    """Check if this message was already processed."""
    try:
        current_hash = get_message_hash(message)
        if MESSAGE_CACHE_FILE.exists():
            with open(MESSAGE_CACHE_FILE, "r") as f:
                last_hash = f.read().strip()
                return last_hash == current_hash
    except Exception:
        pass
    return False


def mark_message_processed(message):
    """Mark message as processed."""
    try:
        MESSAGE_CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(MESSAGE_CACHE_FILE, "w") as f:
            f.write(get_message_hash(message))
    except Exception:
        pass


def main():
    """Main hook logic."""
    try:
        # Read hook data from stdin
        hook_data = json.load(sys.stdin)
        tool_name = hook_data.get("tool_name", "unknown")

        # Extract user message if available
        user_message = ""
        try:
            # Try to get user message from hook context
            if "user_message" in hook_data:
                user_message = hook_data["user_message"]
            elif "context" in hook_data and "message" in hook_data["context"]:
                user_message = hook_data["context"]["message"]
        except Exception:
            pass

        # Skip if no message or already processed
        if not user_message or was_message_processed(user_message):
            log_debug(f"Skipping - no message or already processed")
            sys.exit(0)

        # Detect signals
        signals = detect_signals(user_message)

        if signals:
            log_debug(f"Signals detected: {signals}")

            # Load current state
            state = load_trust_state()

            # Calculate adjustment
            adjustment = calculate_trust_adjustment(signals)

            if adjustment != 0:
                # Update trust level
                old_level = state.get("trustLevel", 2)
                state = update_trust_level(state, adjustment, signals)
                new_level = state.get("trustLevel", 2)

                # Save state
                save_trust_state(state)

                log_debug(f"Trust level: {old_level} → {new_level} (adjustment: {adjustment})")

                # Output notification if level changed significantly
                if abs(new_level - old_level) >= 0.5:
                    signal_names = [s["signal_type"] for s in signals]
                    print(f"🔒 Trust level adjusted: {old_level} → {new_level}", file=sys.stderr)
                    print(f"   Signals: {', '.join(signal_names)}", file=sys.stderr)

        # Mark message as processed
        mark_message_processed(user_message)

        # Always allow the tool to proceed
        sys.exit(0)

    except json.JSONDecodeError as e:
        log_debug(f"ERROR: Invalid JSON from stdin: {e}")
        sys.exit(0)

    except Exception as e:
        log_debug(f"CRITICAL ERROR: {e}")
        sys.exit(0)


if __name__ == "__main__":
    main()
