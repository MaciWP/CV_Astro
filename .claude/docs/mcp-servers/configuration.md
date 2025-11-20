# MCP Servers - Configuration Guide

**Goal**: Configure 4 essential MCP servers (filesystem, git, memory, fetch)

**Time**: ~10 minutes total setup

---

## Prerequisites

### Install Required Tools

**1. Node.js (for npx)**:
```bash
# Check if installed
node --version  # Should be v18+

# Install if needed
# Windows: Download from nodejs.org
# Mac: brew install node
# Linux: apt install nodejs npm
```

**2. uv (Python package manager)**:
```bash
# Check if installed
uv --version

# Install if needed
# Windows: pip install uv
# Mac/Linux: curl -LsSf https://astral.sh/uv/install.sh | sh
```

---

## Configuration File Location

**Global** (all projects):
```
~/.claude/settings.json
```

**Project-specific** (this project only):
```
D:\PYTHON\Poneglyph\.claude\settings.json
```

**Recommendation**: Start with global, then override per-project if needed.

---

## Complete Configuration

**Add this to `~/.claude/settings.json`**:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "D:\\PYTHON\\Poneglyph"
      ]
    },
    "git": {
      "command": "uvx",
      "args": [
        "mcp-server-git",
        "--repository",
        "D:\\PYTHON\\Poneglyph"
      ]
    },
    "memory": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-memory"
      ]
    },
    "fetch": {
      "command": "uvx",
      "args": [
        "mcp-server-fetch"
      ]
    }
  }
}
```

**Important**: Replace `D:\\PYTHON\\Poneglyph` with your actual project path.

---

## Individual Server Configuration

### 1. filesystem Server

**What it does**: Secure file operations with access controls

**Configuration**:
```json
{
  "filesystem": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-filesystem",
      "/path/to/allowed/directory"
    ]
  }
}
```

**Parameters**:
- `npx`: Node package executor (no global install needed)
- `-y`: Auto-confirm (skip prompt)
- `@modelcontextprotocol/server-filesystem`: Official package
- `/path/to/allowed/directory`: **Security**: Restrict to this directory

**Security Best Practices**:
```json
{
  "filesystem": {
    "args": [
      "@modelcontextprotocol/server-filesystem",
      "D:\\PYTHON\\Poneglyph",  // ✅ Project directory
      // NOT: "C:\\" - TOO BROAD
      // NOT: "D:\\" - TOO BROAD
    ]
  }
}
```

**Available Tools**:
- `read_file` - Read file contents
- `write_file` - Write to file
- `list_directory` - List files/folders
- `create_directory` - Create folder
- `move_file` - Move/rename
- `search_files` - Find files by pattern

**Example Usage** (Claude will do this):
```typescript
await mcp__filesystem__read_file({
  path: "src/auth.ts"
});

await mcp__filesystem__write_file({
  path: "src/new.ts",
  content: "// New file"
});
```

---

### 2. git Server

**What it does**: Git operations with structured data

**Configuration**:
```json
{
  "git": {
    "command": "uvx",
    "args": [
      "mcp-server-git",
      "--repository",
      "/path/to/git/repo"
    ]
  }
}
```

**Parameters**:
- `uvx`: UV package executor (Python)
- `mcp-server-git`: Official Git MCP server
- `--repository`: Path to Git repository

**Multiple Repositories** (if needed):
```json
{
  "git-poneglyph": {
    "command": "uvx",
    "args": ["mcp-server-git", "--repository", "D:\\PYTHON\\Poneglyph"]
  },
  "git-other": {
    "command": "uvx",
    "args": ["mcp-server-git", "--repository", "D:\\PYTHON\\OtherProject"]
  }
}
```

**Available Tools**:
- `git_status` - Get repo status
- `git_diff` - Show changes
- `git_commit` - Create commit
- `git_log` - Commit history
- `git_show` - Show commit details
- `git_create_branch` - New branch
- `git_checkout` - Switch branch

**Example Usage**:
```typescript
// Get status
const status = await mcp__git__status();
// { modified: ['file1.ts'], untracked: ['file2.ts'] }

// Get commit history
const commits = await mcp__git__log({ limit: 5 });
// [{ hash: 'abc123', message: 'Fix bug', author: '...' }]

// Create commit
await mcp__git__commit({
  message: "Add new feature",
  files: ["src/feature.ts"]
});
```

---

### 3. memory Server

**What it does**: Persistent knowledge graph (cross-session memory)

**Configuration**:
```json
{
  "memory": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-memory"
    ]
  }
}
```

**Parameters**:
- `npx`: Node package executor
- `-y`: Auto-confirm
- `@modelcontextprotocol/server-memory`: Official memory server

**No path needed** - Stores data in Claude's data directory automatically.

**Storage Location**:
```
~/.claude/memory/
  ├── entities.json     # Knowledge entities
  ├── relations.json    # Relationships
  └── metadata.json     # Metadata
```

**Available Tools**:
- `create_entities` - Store knowledge nodes
- `create_relations` - Link entities
- `search_nodes` - Find by query
- `open_nodes` - Get specific nodes
- `delete_entities` - Remove knowledge

**Example Usage**:
```typescript
// Store project structure
await mcp__memory__create_entities({
  entities: [
    {
      name: "Poneglyph Project",
      entityType: "project",
      observations: [
        "Vue 3 + TypeScript frontend",
        "FastAPI backend",
        "PostgreSQL database"
      ]
    }
  ]
});

// Create relationship
await mcp__memory__create_relations({
  relations: [
    {
      from: "Poneglyph Project",
      to: "Vue 3",
      relationType: "uses"
    }
  ]
});

// Next session - retrieve
const project = await mcp__memory__search_nodes({
  query: "Poneglyph Project"
});
// Claude remembers the project structure!
```

**This Solves Module 09-PERSISTENT-MEMORY** ✅

---

### 4. fetch Server

**What it does**: Fetch web content optimized for LLM

**Configuration**:
```json
{
  "fetch": {
    "command": "uvx",
    "args": [
      "mcp-server-fetch"
    ]
  }
}
```

**Parameters**:
- `uvx`: UV package executor
- `mcp-server-fetch`: Official fetch server

**Optional Configuration** (rate limiting):
```json
{
  "fetch": {
    "command": "uvx",
    "args": [
      "mcp-server-fetch"
    ],
    "env": {
      "RATE_LIMIT": "10",  // Max 10 requests per minute
      "TIMEOUT": "30000"   // 30 second timeout
    }
  }
}
```

**Available Tools**:
- `fetch` - Get web content
- `fetch_markdown` - Convert to markdown
- `fetch_pdf` - Extract PDF text

**Example Usage**:
```typescript
// Fetch documentation
const docs = await mcp__fetch__fetch({
  url: "https://vuejs.org/api/composition-api-setup.html"
});
// Returns: Markdown-formatted documentation

// Better than WebFetch because:
// - Faster (optimized)
// - Markdown output (LLM-friendly)
// - Error handling
// - Rate limiting
```

---

## Verification

**After configuration, restart Claude Code and test**:

### Test filesystem:
```typescript
// Claude will be able to use:
await mcp__filesystem__list_directory({ path: "." });
```

### Test git:
```typescript
await mcp__git__status();
```

### Test memory:
```typescript
await mcp__memory__create_entities({
  entities: [{ name: "Test", entityType: "note", observations: ["Testing"] }]
});
```

### Test fetch:
```typescript
await mcp__fetch__fetch({ url: "https://example.com" });
```

**If tools appear** = MCP servers working! ✅

---

## Troubleshooting

### Server Not Starting

**1. Check command exists**:
```bash
# For npx servers
npx --version

# For uvx servers
uvx --version
```

**2. Test server manually**:
```bash
# Filesystem
npx -y @modelcontextprotocol/server-filesystem /path/to/dir

# Git
uvx mcp-server-git --repository /path/to/repo

# Memory
npx -y @modelcontextprotocol/server-memory

# Fetch
uvx mcp-server-fetch
```

**If these fail**, install dependencies:
```bash
npm install -g npm  # Update npm
pip install uv      # Install uv
```

### Permission Denied

**filesystem server**:
```json
{
  "filesystem": {
    "args": [
      "@modelcontextprotocol/server-filesystem",
      "D:\\PYTHON\\Poneglyph"  // Make sure this path exists and is readable
    ]
  }
}
```

**git server**:
```bash
# Check if directory is a git repo
cd D:\PYTHON\Poneglyph
git status  # Should work
```

### Slow Performance

**Enable caching** (built-in, automatic for most servers)

**Connection pooling** (automatic)

**Check latency**:
- filesystem: <50ms
- git: <100ms
- memory: <100ms
- fetch: <500ms

---

## Advanced Configuration

### Environment Variables

```json
{
  "fetch": {
    "command": "uvx",
    "args": ["mcp-server-fetch"],
    "env": {
      "HTTP_PROXY": "http://proxy.example.com:8080",
      "HTTPS_PROXY": "https://proxy.example.com:8080"
    }
  }
}
```

### Custom Ports (if needed)

```json
{
  "custom-mcp": {
    "command": "node",
    "args": ["./my-server.js", "--port", "3000"]
  }
}
```

### Logging

```json
{
  "git": {
    "command": "uvx",
    "args": ["mcp-server-git", "--repository", "/path", "--verbose"]
  }
}
```

---

## Project-Specific Override

**Global** (`~/.claude/settings.json`):
```json
{
  "mcpServers": {
    "filesystem": {
      "args": [/*...*/]
    }
  }
}
```

**Project** (`D:\PYTHON\Poneglyph\.claude\settings.json`):
```json
{
  "mcpServers": {
    "filesystem": {
      "args": [
        "@modelcontextprotocol/server-filesystem",
        "D:\\PYTHON\\Poneglyph\\src"  // More restrictive
      ]
    }
  }
}
```

**Project config overrides global** for that project only.

---

## Next Steps

1. **Add configuration** to settings.json
2. **Restart Claude Code**
3. **Test MCP tools** (Claude will have new tools available)
4. **Use in workflows** (Claude will use them automatically when appropriate)

---

**Version**: 1.0.0
**Servers**: 4 (filesystem, git, memory, fetch)
**Setup Time**: ~10 minutes
**Benefit**: 5-100x speedup + persistent memory
