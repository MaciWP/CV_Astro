# Skill Creation Guide

Complete step-by-step guide for creating new skills.

## Table of Contents

1. [Before You Start](#before-you-start)
2. [Method 1: Using skill-builder](#method-1-using-skill-builder)
3. [Method 2: Manual Creation](#method-2-manual-creation)
4. [Testing Your Skill](#testing-your-skill)
5. [Publishing Your Skill](#publishing-your-skill)
6. [Examples](#examples)

## Before You Start

### Planning Your Skill

Ask yourself:

1. **What capability does this skill provide?**
   - Be specific: "Form validation with React Hook Form" not "Forms"

2. **Who is the target user?**
   - Frontend developer, Backend developer, DevOps engineer?

3. **What frameworks/technologies?**
   - List 2-3 main technologies to support

4. **Is there overlap with existing skills?**
   - Check [Available Skills](./available-skills.md) first
   - Complement, don't duplicate

5. **What are the activation keywords?**
   - List 8-12 terms users would search for

### Skill Scope

✅ **Good scope** (focused):
- "Multi-select dropdown with search"
- "JWT authentication flow"
- "Docker multi-stage builds"

❌ **Bad scope** (too broad):
- "React components"
- "Backend development"
- "DevOps"

## Method 1: Using skill-builder

The easiest way to create a new skill.

### Step 1: Activate skill-builder

```typescript
Task({
  subagent_type: 'skill-builder',
  prompt: `Create a skill for [capability] that:
  - Handles [use case 1]
  - Supports [framework 1] and [framework 2]
  - Includes examples for [scenario]

  Target users: [user type]
  Activation keywords: [keyword list]`
});
```

### Step 2: Review Generated Skill

skill-builder will:
1. Create directory structure
2. Generate SKILL.md with examples
3. Add activation keywords
4. Include best practices

### Step 3: Customize and Test

1. Review generated code examples
2. Add domain-specific best practices
3. Test activation with keywords
4. Add more examples if needed

### Example: Creating a Notification Skill

```typescript
Task({
  subagent_type: 'skill-builder',
  prompt: `Create a skill for displaying toast notifications that:
  - Handles success, error, warning, info types
  - Supports React (react-hot-toast) and Vue 3 (vue-toastification)
  - Includes examples for: basic toast, promise toast, custom styling
  - Shows best practices for: position, duration, accessibility

  Target users: Frontend developers
  Activation keywords: toast, notification, alert, message, snackbar, banner`
});
```

## Method 2: Manual Creation

For more control over the skill content.

### Step 1: Create Directory Structure

```bash
mkdir -p .claude/skills/[skill-name]
touch .claude/skills/[skill-name]/SKILL.md
```

Example:
```bash
mkdir -p .claude/skills/pagination-builder
touch .claude/skills/pagination-builder/SKILL.md
```

### Step 2: Add Frontmatter

```yaml
---
name: pagination-builder
description: Build pagination UI with page numbers, next/prev buttons, server-side pagination. Keywords - pagination, paging, page numbers, next previous, server side pagination, offset limit
---
```

**Keyword Strategy**:
- Include variations: "pagination", "paging", "page numbers"
- Include implementation terms: "offset limit", "cursor based"
- Include framework terms: "react pagination", "vue pagination"

### Step 3: Add Core Sections

```markdown
# Pagination Builder

## When to Use This Skill

Activate when:
- Adding pagination to data tables or lists
- Implementing server-side pagination
- Need cursor-based or offset pagination
- Building page number navigation

## What This Skill Does

Creates pagination components with:
- Page number display with ellipsis (1 ... 5 6 7 ... 20)
- Next/Previous buttons
- Jump to page functionality
- Server-side pagination integration
- Responsive mobile design

## Supported Technologies

**React**:
- TanStack Table (built-in pagination)
- Custom hooks

**Vue 3**:
- Composition API
- Custom composables

**Backend**:
- Offset/Limit pagination
- Cursor-based pagination
```

### Step 4: Add Code Examples

Start with the most common use case:

```markdown
## Example: Basic Pagination Component (React)

\`\`\`tsx
// components/Pagination.tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = generatePageNumbers(currentPage, totalPages);

  return (
    <nav className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded border disabled:opacity-50"
      >
        Previous
      </button>

      {pages.map((page, index) =>
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(Number(page))}
            className={`px-3 py-1 rounded border ${
              currentPage === page ? 'bg-blue-500 text-white' : ''
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded border disabled:opacity-50"
      >
        Next
      </button>
    </nav>
  );
}

function generatePageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];

  return [1, '...', current - 1, current, current + 1, '...', total];
}
\`\`\`
```

Then add alternative implementations and advanced patterns.

### Step 5: Add Best Practices

```markdown
## Best Practices

1. **Always show total pages** - Users need context (Page 5 of 20)
2. **Disable at boundaries** - Disable Previous on page 1, Next on last page
3. **Keyboard navigation** - Support arrow keys for page navigation
4. **Mobile responsive** - Show fewer page numbers on mobile
5. **Loading states** - Disable pagination during data fetch
6. **URL state** - Sync current page to URL query params
7. **Accessibility** - Use ARIA labels, role="navigation"
```

### Step 6: Add Integration

```markdown
## Integration with Other Skills

- **table-datagrid-builder** - Add pagination to data tables
- **api-integration-layer** - Fetch paginated data from API
- **state-management-setup** - Store pagination state
- **infinite-scroll-builder** - Alternative to pagination
```

### Step 7: Add Footer

```markdown
---

**Version**: 1.0.0
**Category**: Frontend
**Complexity**: Low
```

## Testing Your Skill

### Test 1: Activation

1. Start a conversation with keywords:
   ```
   "I need pagination for my user table"
   ```

2. Verify skill activates automatically

3. Check that examples are relevant

### Test 2: Code Quality

1. Copy code examples
2. Paste into actual project
3. Verify they compile/run without errors
4. Test in browser/runtime

### Test 3: Completeness

Ask yourself:
- [ ] Can a developer use this without external docs?
- [ ] Are all common use cases covered?
- [ ] Are best practices included?
- [ ] Are pitfalls documented?

### Test 4: Token Usage

1. Check file size: `ls -lh .claude/skills/[name]/SKILL.md`
2. Target: 3-8KB
3. If > 10KB: Split into multiple skills

## Publishing Your Skill

### Step 1: Update CLAUDE.md

Add to "Available Resources" > "Skills" section:

```markdown
**Skills** (50 skills):
- `pagination-builder` - Page numbers, next/prev, server-side
...
```

### Step 2: Update Documentation

Add to `.claude/docs/skills-system/available-skills.md`:

```markdown
### pagination-builder

**Category**: Frontend
**Complexity**: Low

Builds pagination components with page numbers, next/prev buttons, and server-side integration.

**Keywords**: pagination, paging, page numbers, next previous

**Frameworks**: React, Vue 3
```

### Step 3: Test End-to-End

1. Start fresh conversation
2. Use activation keywords
3. Verify skill loads and provides correct guidance
4. Follow examples to build feature

## Examples

### Example 1: Simple Utility Skill

```yaml
---
name: currency-formatter
description: Format currency values with locale support, symbol placement, precision. Keywords - currency, money, price, format, locale, internationalization
---

# Currency Formatter

## When to Use This Skill

Activate when:
- Displaying prices or monetary values
- Need locale-specific formatting ($1,234.56 vs 1.234,56 €)
- Converting between currencies
- Formatting for different regions

## What This Skill Does

Formats currency values with:
- Locale-specific symbols and separators
- Configurable precision (2 decimals default)
- Negative value handling
- Currency conversion

## Supported Technologies

**JavaScript/TypeScript**:
- Intl.NumberFormat (native)
- currency.js library
- dinero.js (money calculations)

## Example: Intl.NumberFormat

\`\`\`typescript
function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

// Usage
formatCurrency(1234.56); // "$1,234.56"
formatCurrency(1234.56, 'EUR', 'de-DE'); // "1.234,56 €"
\`\`\`

## Best Practices

1. **Use Intl.NumberFormat** - Native, no dependencies
2. **Store as cents** - Avoid floating point issues (store 1234 not 12.34)
3. **Server-side conversion** - Don't convert currencies client-side
4. **Consistent precision** - Always 2 decimals for currency

---

**Version**: 1.0.0
**Category**: Frontend
**Complexity**: Low
```

### Example 2: Complex Integration Skill

See existing skills like `api-endpoint-builder` or `cicd-pipeline-builder` for examples of complex skills with multiple frameworks, advanced patterns, and extensive integration.

## Troubleshooting

### Skill Not Activating

**Problem**: Keywords used but skill doesn't activate

**Solutions**:
1. Check frontmatter syntax (valid YAML)
2. Verify keywords in description field
3. Use more specific keywords
4. Test with `/skills` command to see if listed

### Examples Not Working

**Problem**: Code examples have errors

**Solutions**:
1. Test all examples in actual projects
2. Include imports/dependencies
3. Add comments for non-obvious parts
4. Provide working context (not just fragments)

### Skill Too Large

**Problem**: File size > 10KB

**Solutions**:
1. Remove redundant examples
2. Split into multiple focused skills
3. Move detailed content to resources/
4. Link to external docs for deep dives

## Next Steps

1. Read [Skill Structure](./skill-structure.md) for detailed template
2. Browse [Available Skills](./available-skills.md) for examples
3. Use `skill-builder` to generate your first skill
4. Test and iterate based on usage

---

**Last Updated**: 2025-01-17
**Version**: 1.0.0
