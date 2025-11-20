# Hooks - Lifecycle Event Automation

**Purpose**: Execute custom automation at key points in Claude Code workflow

**Status**: Simple and practical (documents existing Claude Code hooks)

---

## What Are Hooks?

Hooks are **event listeners** that execute custom shell commands when specific Claude Code events occur.

**Use cases:**
- Auto-commit before file modifications
- Audio notifications when tasks complete
- Slack/Discord integration for team updates
- Pre-write formatting and linting
- Logging and analytics

---

## Available Events (6 total)

Claude Code supports these lifecycle events:

### 1. PreToolUse
**Fires**: Before Claude uses any tool (Read, Write, Edit, Bash, etc.)

**Use for**:
- Validation before writes
- Pre-commit git operations
- Backup before modifications
- Security checks

**Example**:
```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Write|Edit|MultiEdit",
      "hooks": [{
        "type": "command",
        "command": "git add . && git commit -m 'Pre-write backup'"
      }]
    }]
  }
}
```

---

### 2. PostToolUse
**Fires**: After a tool completes successfully

**Use for**:
- Auto-formatting after writes
- Run linters after edits
- Trigger tests after changes
- Update documentation

**Example**:
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write",
      "hooks": [{
        "type": "command",
        "command": "npx prettier --write {file}"
      }]
    }]
  }
}
```

---

### 3. UserPromptSubmit
**Fires**: When user submits a prompt to Claude

**Use for**:
- Logging user requests
- Analytics tracking
- Context injection
- Custom pre-processing

**Example**:
```json
{
  "hooks": {
    "UserPromptSubmit": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "echo 'User prompt: {prompt}' >> logs/prompts.log"
      }]
    }]
  }
}
```

---

### 4. Stop
**Fires**: When Claude finishes responding

**Use for**:
- Completion notifications
- Post-processing results
- Analytics logging
- Audio alerts

**Example**:
```json
{
  "hooks": {
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "say 'Claude Code is done'"
      }]
    }]
  }
}
```

---

### 5. SessionStart
**Fires**: When starting a new Claude Code session

**Use for**:
- Initialize workspace
- Load environment variables
- Setup logging
- Check prerequisites

**Example**:
```json
{
  "hooks": {
    "SessionStart": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "echo 'Session started' >> logs/sessions.log"
      }]
    }]
  }
}
```

---

### 6. Notification
**Fires**: System notifications

**Use for**:
- Custom notification handling
- External system integration
- Alert routing

---

## Configuration

### Location
Hooks are configured in `~/.claude/settings.json` (global) or `.claude/settings.json` (project-specific).

**Priority**: Project settings override global settings.

### Structure
```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "optional_filter",
        "hooks": [
          {
            "type": "command",
            "command": "shell_command_to_execute"
          }
        ]
      }
    ]
  }
}
```

### Matchers (Filters)

Matchers determine when hooks execute:

**Tool name matching**:
```json
"matcher": "Write"           // Only Write tool
"matcher": "Write|Edit"      // Write OR Edit
"matcher": "Write|Edit|MultiEdit"  // Multiple tools
```

**Empty matcher** = always execute:
```json
"matcher": ""  // Fires on every event
```

**File pattern matching** (in command):
```bash
# Use conditional logic in shell command
command: "if [[ {file} == *.ts ]]; then npx prettier --write {file}; fi"
```

---

## Hook Data (stdin)

Hooks receive JSON data via stdin:

```json
{
  "tool_name": "Write",
  "tool_params": {
    "file_path": "/path/to/file.ts",
    "content": "..."
  },
  "user_message": "Add authentication",
  "session_id": "abc123"
}
```

**Access in scripts**:
```python
#!/usr/bin/env python3
import json, sys

data = json.load(sys.stdin)
tool = data.get('tool_name')
file_path = data.get('tool_params', {}).get('file_path')

print(f"Hook triggered: {tool} on {file_path}")
```

---

## Performance

**Target latency**: <50ms per hook (ideal)

**Tips**:
- Use fast commands (avoid slow operations)
- Run heavy tasks asynchronously (`command &`)
- Cache results when possible
- Skip unnecessary hooks with matchers

**Example (async)**:
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write",
      "hooks": [{
        "type": "command",
        "command": "npm test > test.log 2>&1 &"  // Background
      }]
    }]
  }
}
```

---

## Error Handling

**Hook failures**:
- Non-critical hooks: Log warning, continue
- Critical operations: User should handle in script

**Best practices**:
```bash
# Exit code matters
command: "npx prettier --write {file} || echo 'Prettier failed' >&2"

# Timeout for slow commands
command: "timeout 5s npm test"
```

---

## Security Considerations

**Hooks execute with your permissions** - be cautious:

1. **Validate inputs**: Don't trust hook data blindly
2. **Avoid sensitive operations**: No auto-deploy to production
3. **Review third-party hooks**: Audit before using
4. **Limit scope**: Use matchers to restrict execution

**Example (safe)**:
```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Write",
      "hooks": [{
        "type": "command",
        "command": "git diff > .claude/backup.diff"  // Safe: just backup
      }]
    }]
  }
}
```

**Example (dangerous)**:
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "rm -rf /"  // NEVER DO THIS
      }]
    }]
  }
}
```

---

## Testing Hooks

**Test before enabling**:

1. **Manual test**:
```bash
# Simulate hook execution
echo '{"tool_name":"Write","tool_params":{"file_path":"test.ts"}}' | your_hook_script.py
```

2. **Dry-run mode** (in script):
```python
DRY_RUN = True
if not DRY_RUN:
    subprocess.run(['git', 'commit', '-m', 'Auto-commit'])
else:
    print('Would commit: Auto-commit')
```

3. **Enable gradually**:
- Start with `Stop` event (safest)
- Test with matchers (limited scope)
- Enable globally once confident

---

## Debugging

**Enable verbose logging**:
```bash
# Check hook execution logs
tail -f ~/.claude/logs/hooks.log
```

**Add debug output in hooks**:
```bash
command: "echo 'Hook fired: {tool_name}' >> /tmp/hooks-debug.log && your_command"
```

---

## Limitations

**What hooks CAN'T do** (by design):

1. **No built-in caching** - Hooks execute every time
2. **No priority system** - All hooks treated equally
3. **No parallel execution** - Sequential by default
4. **No automatic monitoring** - Manual logging only
5. **No sandboxing** - Full system access (be careful)

**These are intentional** - keeps hooks simple and predictable.

---

## Common Use Cases

### 1. Auto-commit before modifications
```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Write|Edit|MultiEdit",
      "hooks": [{
        "type": "command",
        "command": "git add . && git commit -m 'Auto-backup before {tool_name}'"
      }]
    }]
  }
}
```

### 2. Format after write
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write",
      "hooks": [{
        "type": "command",
        "command": "npx prettier --write {file}"
      }]
    }]
  }
}
```

### 3. Audio notification on completion
```json
{
  "hooks": {
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "say 'Task complete'"
      }]
    }]
  }
}
```

### 4. Slack notification
```json
{
  "hooks": {
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "curl -X POST -H 'Content-Type: application/json' -d '{\"text\":\"Claude finished\"}' YOUR_SLACK_WEBHOOK_URL"
      }]
    }]
  }
}
```

---

## Related Documentation

- **Examples**: `.claude/docs/hooks/examples.md` - Real-world use cases
- **Best Practices**: `.claude/docs/hooks/best-practices.md` - When to use, performance tips

---

**Version**: 1.0.0 (Simple Implementation)
**Status**: Practical guide for existing Claude Code hooks
**Approach**: Document reality, not aspirational features
