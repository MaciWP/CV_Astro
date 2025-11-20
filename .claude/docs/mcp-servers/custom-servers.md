# MCP Servers - Creating Custom Servers

**Goal**: Build custom MCP servers when existing ones don't meet your needs

**Time**: ~30-60 minutes for basic server

---

## When to Create a Custom Server

### ✅ Create Custom Server When:

1. **Specific integration needed**:
   - Internal company API
   - Proprietary database
   - Custom tooling/services
   - Project-specific workflows

2. **Performance optimization**:
   - Batch operations for your use case
   - Caching strategy specific to your data
   - Custom rate limiting

3. **Business logic encapsulation**:
   - Multi-step workflows
   - Domain-specific operations
   - Security policies

### ❌ Don't Create Custom Server When:

1. **Existing server available**:
   - Check pulsemcp.com/servers first
   - 6480+ servers already exist
   - Official servers cover common needs

2. **Simple shell command works**:
   - One-off operations → Bash tool
   - No performance benefit needed
   - Overhead not justified

3. **Rare usage**:
   - Used once per month
   - Not performance-critical
   - Better as slash command or skill

---

## Quick Start (5 minutes)

### Official Template

Use the official MCP server template:

```bash
# Node.js/TypeScript server
npx create-mcp-server my-server

# Python server
uvx create-mcp-server my-server --language python
```

**This creates**:
```
my-server/
├── package.json (or pyproject.toml)
├── src/
│   └── index.ts (or main.py)
├── README.md
└── tsconfig.json (or pytest config)
```

---

## Basic Server Structure

### TypeScript Example

**`src/index.ts`**:

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// 1. Create server instance
const server = new Server(
  {
    name: 'my-custom-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 2. List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'my_tool',
        description: 'Does something useful',
        inputSchema: {
          type: 'object',
          properties: {
            input: {
              type: 'string',
              description: 'Input parameter',
            },
          },
          required: ['input'],
        },
      },
    ],
  };
});

// 3. Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'my_tool') {
    const { input } = request.params.arguments as { input: string };

    // Your logic here
    const result = await doSomething(input);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

// 4. Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
```

### Python Example

**`main.py`**:

```python
from mcp.server import Server, NotificationOptions
from mcp.server.models import InitializationOptions
import mcp.server.stdio
import mcp.types as types

# 1. Create server instance
server = Server("my-custom-server")

# 2. List available tools
@server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    return [
        types.Tool(
            name="my_tool",
            description="Does something useful",
            inputSchema={
                "type": "object",
                "properties": {
                    "input": {
                        "type": "string",
                        "description": "Input parameter",
                    },
                },
                "required": ["input"],
            },
        )
    ]

# 3. Handle tool calls
@server.call_tool()
async def handle_call_tool(
    name: str, arguments: dict
) -> list[types.TextContent | types.ImageContent | types.EmbeddedResource]:
    if name == "my_tool":
        input_value = arguments.get("input")

        # Your logic here
        result = await do_something(input_value)

        return [
            types.TextContent(
                type="text",
                text=str(result),
            )
        ]

    raise ValueError(f"Unknown tool: {name}")

# 4. Start server
async def main():
    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="my-custom-server",
                server_version="1.0.0",
                capabilities=server.get_capabilities(
                    notification_options=NotificationOptions(),
                    experimental_capabilities={},
                ),
            ),
        )

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
```

---

## Example: Database Query Server

**Real-world example - PostgreSQL query server**:

### Use Case

Execute PostgreSQL queries without exposing connection details to Claude.

### Implementation

**`src/postgres-server.ts`**:

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const server = new Server(
  { name: 'postgres-query', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'query',
        description: 'Execute safe read-only SQL query',
        inputSchema: {
          type: 'object',
          properties: {
            sql: { type: 'string', description: 'SQL query (SELECT only)' },
            params: { type: 'array', description: 'Query parameters' },
          },
          required: ['sql'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'query') {
    const { sql, params = [] } = request.params.arguments as {
      sql: string;
      params?: any[]
    };

    // Security: Only allow SELECT
    if (!sql.trim().toLowerCase().startsWith('select')) {
      throw new Error('Only SELECT queries allowed');
    }

    const result = await pool.query(sql, params);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result.rows, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
```

### Configuration

**`~/.claude/settings.json`**:

```json
{
  "mcpServers": {
    "postgres": {
      "command": "node",
      "args": ["./path/to/postgres-server/dist/index.js"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/mydb"
      }
    }
  }
}
```

### Usage

Claude can now execute queries:

```typescript
// Claude will use:
await mcp__postgres__query({
  sql: "SELECT * FROM users WHERE active = $1 LIMIT 10",
  params: [true]
});
// Returns: [{ id: 1, name: "Alice", ... }, ...]
```

---

## Security Best Practices

### 1. Input Validation

```typescript
// ❌ BAD: No validation
const result = await exec(request.params.arguments.command);

// ✅ GOOD: Whitelist allowed operations
const ALLOWED_COMMANDS = ['status', 'list', 'info'];
if (!ALLOWED_COMMANDS.includes(command)) {
  throw new Error('Command not allowed');
}
```

### 2. Environment Variables for Secrets

```typescript
// ❌ BAD: Hardcoded credentials
const apiKey = 'sk-1234567890abcdef';

// ✅ GOOD: From environment
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error('API_KEY not configured');
}
```

### 3. Read-Only by Default

```typescript
// ✅ GOOD: Separate tools for read vs write
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      { name: 'query', description: 'Read data (SELECT only)' },
      { name: 'mutate', description: 'Write data (requires confirmation)' },
    ],
  };
});
```

### 4. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
});

// Apply to expensive operations
async function expensiveOperation() {
  if (!limiter.check()) {
    throw new Error('Rate limit exceeded');
  }
  // ... operation
}
```

---

## Testing Your Server

### 1. Manual Testing (stdio)

```bash
# Start server manually
node dist/index.js

# Send JSON-RPC request via stdin
echo '{
  "jsonrpc": "2.0",
  "method": "tools/list",
  "id": 1
}' | node dist/index.js
```

### 2. Unit Tests

**`tests/server.test.ts`**:

```typescript
import { describe, it, expect } from 'vitest';
import { Server } from '../src/index.js';

describe('my-server', () => {
  it('lists tools correctly', async () => {
    const server = new Server(/* ... */);
    const tools = await server.listTools();

    expect(tools).toHaveLength(1);
    expect(tools[0].name).toBe('my_tool');
  });

  it('executes tool correctly', async () => {
    const result = await server.callTool('my_tool', { input: 'test' });

    expect(result.content[0].text).toContain('expected output');
  });
});
```

### 3. Integration Testing with Claude

Add to `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "my-server-dev": {
      "command": "node",
      "args": ["./my-server/dist/index.js"],
      "env": {
        "DEBUG": "true"
      }
    }
  }
}
```

Restart Claude Code and test:

```
Ask Claude: "Use my_tool with input 'test'"
Verify: Claude has access to mcp__my-server-dev__my_tool()
```

---

## Publishing and Sharing

### 1. Prepare for Publishing

**Checklist**:
- [ ] README.md with usage examples
- [ ] LICENSE file (MIT recommended)
- [ ] package.json with correct metadata
- [ ] TypeScript types exported
- [ ] Tests passing
- [ ] No hardcoded secrets

### 2. Publish to npm (TypeScript)

```bash
# 1. Build
npm run build

# 2. Test locally
npm link
# Test in another project: npm link my-mcp-server

# 3. Publish
npm publish
```

### 3. Publish to PyPI (Python)

```bash
# 1. Build
python -m build

# 2. Test locally
pip install -e .

# 3. Publish
python -m twine upload dist/*
```

### 4. Share on Directories

Submit to MCP directories:
- **pulsemcp.com/servers** - Primary directory
- **mcpserverfinder.com** - Searchable index
- **mcplist.ai** - Curated list

**Submission format**:
```json
{
  "name": "my-mcp-server",
  "description": "Brief description",
  "repository": "github.com/user/my-mcp-server",
  "author": "Your Name",
  "language": "typescript",
  "category": "database",
  "tags": ["postgres", "sql", "database"]
}
```

---

## Common Patterns

### Pattern 1: API Wrapper

```typescript
// Wrap external API with MCP interface
import axios from 'axios';

const API_BASE = 'https://api.example.com';

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'get_user') {
    const { userId } = request.params.arguments;
    const response = await axios.get(`${API_BASE}/users/${userId}`);

    return {
      content: [{ type: 'text', text: JSON.stringify(response.data) }],
    };
  }
});
```

### Pattern 2: File Processing

```typescript
// Process files with specific logic
import fs from 'fs/promises';
import path from 'path';

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'analyze_logs') {
    const { logPath } = request.params.arguments;

    // Security: Only allow logs directory
    const allowedDir = '/var/logs';
    const fullPath = path.resolve(allowedDir, logPath);
    if (!fullPath.startsWith(allowedDir)) {
      throw new Error('Access denied');
    }

    const content = await fs.readFile(fullPath, 'utf-8');
    const errors = content.split('\n').filter(line => line.includes('ERROR'));

    return {
      content: [{ type: 'text', text: `Found ${errors.length} errors` }],
    };
  }
});
```

### Pattern 3: Batch Operations

```typescript
// Combine multiple operations
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'batch_query') {
    const { queries } = request.params.arguments as { queries: string[] };

    // Execute in parallel
    const results = await Promise.all(
      queries.map(sql => pool.query(sql))
    );

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(results.map(r => r.rows))
      }],
    };
  }
});
```

---

## Troubleshooting

### Server Not Connecting

**1. Check stdout/stderr**:

```typescript
// Add debug logging
console.error('Server starting...'); // Goes to Claude logs
console.log('Data for Claude'); // Goes to Claude (JSON-RPC)
```

**2. Verify JSON-RPC format**:

```typescript
// Must return valid JSON-RPC response
return {
  content: [{ type: 'text', text: 'result' }],
  // NOT: return 'result'; // Invalid
};
```

### Tool Not Appearing

**1. Check tool schema**:

```typescript
// ✅ GOOD: Valid schema
inputSchema: {
  type: 'object',
  properties: { /* ... */ },
  required: ['param1'],
}

// ❌ BAD: Missing type
inputSchema: {
  properties: { /* ... */ },
}
```

**2. Restart Claude Code**:

```bash
# MCP servers load on startup
# Changes require restart
```

### Performance Issues

**1. Add caching**:

```typescript
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); // 10 minute TTL

async function cachedQuery(sql: string) {
  const cached = cache.get(sql);
  if (cached) return cached;

  const result = await pool.query(sql);
  cache.set(sql, result.rows);
  return result.rows;
}
```

**2. Connection pooling**:

```typescript
// ✅ GOOD: Reuse connections
const pool = new Pool({ max: 10 });

// ❌ BAD: New connection every time
const client = new Client();
await client.connect();
```

---

## Examples Repository

**Official Examples**: github.com/modelcontextprotocol/servers

```bash
# Clone official examples
git clone https://github.com/modelcontextprotocol/servers.git

# Explore implementations
cd servers/src
ls
# filesystem/, git/, memory/, fetch/, etc.
```

**Learn from**:
- `filesystem/` - File operations with access controls
- `git/` - Git commands via libgit2
- `memory/` - Knowledge graph with SQLite
- `fetch/` - Web content with markdown conversion

---

## When NOT to Create Custom Server

**Use native tools instead**:

1. **One-time operations** → Bash tool
2. **Simple file reads** → Read tool
3. **Git operations** → git MCP server (already exists)
4. **Web fetching** → fetch MCP server (already exists)

**Use slash commands instead**:

1. **Documentation loading** → `/load-module`
2. **Common workflows** → `/quick-debug`
3. **Discovery** → `/tools`, `/skills`

**Use skills instead**:

1. **Multi-step workflows** → Skill composition
2. **Agent coordination** → adaptive-meta-orchestrator
3. **Code analysis** → code-analyzer skill

---

## Next Steps

1. **Start with template**: `npx create-mcp-server my-server`
2. **Implement one tool**: Keep it simple initially
3. **Test locally**: Verify JSON-RPC communication
4. **Add to Claude**: Update settings.json
5. **Iterate**: Add features based on usage

---

**Version**: 1.0.0
**Resources**: github.com/modelcontextprotocol/servers (examples)
**Template**: `npx create-mcp-server` (quick start)
**Best Practice**: Start simple, add complexity as needed
