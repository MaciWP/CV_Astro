# /memory-clear - Delete All Memories

Delete all persistent memories (requires confirmation).

---

## Usage

```
/memory-clear
```

**⚠️ WARNING**: This command deletes ALL memories permanently. Use with caution.

---

## What This Command Does

1. Prompts for confirmation (safety check)
2. If confirmed:
   - Deletes all memories from memory MCP
   - Deletes .claude/memory/MEMORY.md file
   - Archives old content to .claude/memory/archived/
3. Returns count of deleted memories

---

## Workflow

### Step 1: User Executes Command
```
/memory-clear
```

### Step 2: Confirmation Prompt
```
⚠️  WARNING: Delete All Memories?

This will permanently delete:
- 15 decisions
- 8 bug fixes
- 3 preferences
- 5 patterns
- 2 lessons

Total: 33 memories

Archived memories (>90 days) will be preserved.

Are you sure? (yes/no)
```

### Step 3: User Confirms
```
> yes
```

### Step 4: Deletion
```
🗑️  Deleting all memories...

✅ Deleted 33 memories
✅ Cleared MEMORY.md
✅ Archived to .claude/memory/archived/2025-11-17.md

Memory system reset complete.
```

---

## Safety Features

### 1. Confirmation Required
- User must type "yes" to confirm
- "no" or any other input cancels

### 2. Backup Before Delete
- Archives current MEMORY.md to `archived/YYYY-MM-DD.md`
- Preserves all content even after deletion

### 3. Preserved Archived Memories
- Memories >90 days old are already archived
- These are NOT deleted by /memory-clear
- Can be restored later if needed

---

## When to Use

**Use this command when**:
- Starting fresh on a new project
- Testing memory system (reset state)
- Memory got corrupted or contains errors
- Switching project focus (clear old context)

**Don't use** for:
- Deleting single memory (not implemented in Option B)
- Archiving old memories (automatic after 90 days)

---

## Implementation

When you execute `/memory-clear`:

1. Count current memories:
   ```typescript
   const allMemories = await mcp__memory__search_entities({
     query: getCurrentProject()
   });
   const activeMemories = allMemories.entities.filter(m => !m.archived);
   ```

2. Show confirmation prompt:
   ```typescript
   const confirmed = await AskUserQuestion({
     questions: [{
       question: `Delete ${activeMemories.length} memories permanently?`,
       header: 'Confirm Deletion',
       multiSelect: false,
       options: [
         { label: 'Yes, delete all', description: 'Permanently delete (archived backup created)' },
         { label: 'No, cancel', description: 'Keep all memories' }
       ]
     }]
   });
   ```

3. If confirmed:
   ```typescript
   // Archive current MEMORY.md
   const currentContent = await Read({ file_path: '.claude/memory/MEMORY.md' });
   const archivePath = `.claude/memory/archived/${new Date().toISOString().split('T')[0]}.md`;
   await Write({ file_path: archivePath, content: currentContent });

   // Delete from memory MCP
   for (const memory of activeMemories) {
     await mcp__memory__delete_entity({ name: memory.name });
   }

   // Clear MEMORY.md
   await Write({ file_path: '.claude/memory/MEMORY.md', content: '' });
   ```

4. Return confirmation:
   ```
   ✅ Deleted ${activeMemories.length} memories
   ✅ Archived to ${archivePath}
   ```

---

## Recovery

If you deleted memories by mistake:

1. Check `.claude/memory/archived/YYYY-MM-DD.md`
2. Copy relevant memories
3. Use `/memory-save` to restore them

---

**Command Type**: Destructive (requires confirmation)
**MCP Server**: memory
**Backup**: Automatic to archived/ directory
**Related**: /memory-show, /memory-save
