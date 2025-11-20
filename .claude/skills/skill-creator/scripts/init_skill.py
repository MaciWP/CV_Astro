#!/usr/bin/env python3
"""
Skill Scaffolding Tool - Initialize new skill directory structure.

Usage:
    python init_skill.py my-new-skill --interactive
    python init_skill.py django-service-layer --domain django-drf --tech-stack "Django 5.0, DRF 3.14+"
"""

import argparse
import sys
from pathlib import Path
from typing import Optional


def validate_skill_name(name: str) -> bool:
    """Validate skill name is kebab-case."""
    if not name:
        return False
    if " " in name or "_" in name:
        return False
    if not name.replace("-", "").replace("_", "").isalnum():
        return False
    return True


def get_skill_template(
    name: str,
    domain: str = "backend",
    tech_stack: str = "",
    description: str = "",
    keywords: list[str] = None
) -> str:
    """Generate SKILL.md template with placeholders."""

    if keywords is None:
        keywords = []

    # Default keywords by domain
    domain_keywords = {
        "frontend": ["component", "ui", "state", "rendering"],
        "backend": ["api", "endpoint", "service", "backend"],
        "django-drf": ["django", "drf", "viewset", "serializer", "service layer"],
        "testing": ["test", "mock", "coverage", "pytest"],
        "ml": ["model", "training", "inference", "data"],
        "database": ["query", "schema", "index", "orm"]
    }

    default_keywords = domain_keywords.get(domain, ["skill"])
    all_keywords = list(set(keywords + default_keywords))

    keywords_yaml = "\n".join([f"  - {kw}" for kw in all_keywords])
    tech_stacks_yaml = f"  - {tech_stack}" if tech_stack else "  - To be defined"

    template = f'''---
name: "{name}"
description: "{description or 'TODO: Add skill description (max 1024 chars)'}"
keywords:
{keywords_yaml}
tech_stacks:
{tech_stacks_yaml}
version: "1.0.0"
---

# {name.replace("-", " ").title()}

**Auto-activates on**: TODO: Add activation keywords

## Mission

TODO: Define mission with **bold targets** and metrics

## Core Principles

### 1. {{{{Principle Name}}}}

**Rule**: {{{{State the principle}}}}

❌ **WRONG**:
```
// TODO: Add anti-pattern example
```

✅ **CORRECT**:
```
// TODO: Add correct pattern example
```

**Auto-check**:
- [ ] TODO: Add validation item
- [ ] TODO: Add validation item
- [ ] TODO: Add validation item

---

### 2. {{{{Principle Name}}}}

TODO: Add 2-4 more principles following same structure

---

## Anti-Patterns

### ❌ {{{{Anti-Pattern Name}}}}

**Problem**: {{{{Explain the issue}}}}

❌ **ANTI-PATTERN**:
```
// TODO: Add anti-pattern code
```

✅ **CORRECT**:
```
// TODO: Add correct code
```

**Why it matters**: {{{{Explain impact}}}}

---

## Validation Checklist

**Critical**:
- [ ] TODO: Add critical validation item
- [ ] TODO: Add critical validation item
- [ ] TODO: Add critical validation item

**High Priority**:
- [ ] TODO: Add high priority item
- [ ] TODO: Add high priority item

**Medium Priority**:
- [ ] TODO: Add medium priority item

---

## References

| Resource | Purpose |
|----------|---------|
| `TODO: file path` | TODO: purpose |
| `TODO: file path` | TODO: purpose |

---

## Activation

**Keywords**: {", ".join(all_keywords)}

**Context triggers**:
- TODO: When should this skill activate?
- TODO: What user actions trigger it?

**Explicit invocation**: "Use {name} skill to help me with [task]"

---

**Last Updated**: 2025-01-13
**Version**: 1.0.0
**Target Score**: 95+/100
'''

    return template


def create_skill_structure(
    base_path: Path,
    skill_name: str,
    domain: str = "backend",
    tech_stack: str = "",
    description: str = "",
    keywords: list[str] = None,
    interactive: bool = False
) -> Path:
    """Create complete skill directory structure."""

    # Interactive mode
    if interactive:
        print(f"\n🎯 Creating skill: {skill_name}")
        print("\nAnswer questions to configure your skill:\n")

        domain = input("Domain (frontend/backend/django-drf/testing/ml/database) [backend]: ").strip() or "backend"
        tech_stack = input("Tech stack (e.g., 'Django 5.0, DRF 3.14+'): ").strip()
        description = input("Brief description: ").strip()
        keywords_input = input("Keywords (comma-separated): ").strip()
        keywords = [k.strip() for k in keywords_input.split(",")] if keywords_input else []

    # Create directory structure
    skill_path = base_path / skill_name

    if skill_path.exists():
        print(f"❌ Error: Skill directory already exists: {skill_path}")
        return None

    # Create directories
    dirs = ["examples", "templates", "references", "checklists"]
    for dir_name in dirs:
        (skill_path / dir_name).mkdir(parents=True, exist_ok=True)

    # Generate SKILL.md
    skill_content = get_skill_template(skill_name, domain, tech_stack, description, keywords)
    (skill_path / "SKILL.md").write_text(skill_content)

    # Create placeholder README in each directory
    placeholders = {
        "examples": "# Examples\n\nAdd complete code examples here (5-10 files).\n",
        "templates": "# Templates\n\nAdd reusable {{slot}} templates here (3-5 files).\n",
        "references": "# References\n\nAdd detailed guides here (2-4 files, 20+ pages each).\n",
        "checklists": "# Checklists\n\nAdd expanded validation checklists here (1-3 files).\n"
    }

    for dir_name, content in placeholders.items():
        (skill_path / dir_name / "README.md").write_text(content)

    return skill_path


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Initialize new skill directory structure",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python init_skill.py my-new-skill --interactive
  python init_skill.py django-service-layer --domain django-drf --tech-stack "Django 5.0, DRF 3.14+"
  python init_skill.py api-error-handling --domain backend --description "Enforce API error handling best practices"
        """
    )

    parser.add_argument("skill_name", help="Skill name (kebab-case)")
    parser.add_argument("--domain", default="backend",
                       choices=["frontend", "backend", "django-drf", "testing", "ml", "database"],
                       help="Skill domain (default: backend)")
    parser.add_argument("--tech-stack", default="", help="Tech stack (e.g., 'Django 5.0, DRF 3.14+')")
    parser.add_argument("--description", default="", help="Brief skill description")
    parser.add_argument("--keywords", default="", help="Comma-separated keywords")
    parser.add_argument("--interactive", "-i", action="store_true",
                       help="Interactive mode (prompt for all options)")
    parser.add_argument("--output-dir", default=".claude/skills",
                       help="Output directory (default: .claude/skills)")

    args = parser.parse_args()

    # Validate skill name
    if not validate_skill_name(args.skill_name):
        print(f"❌ Error: Invalid skill name '{args.skill_name}'")
        print("   Skill name must be kebab-case (lowercase with hyphens)")
        print("   Examples: django-service-layer, api-error-handling")
        sys.exit(1)

    # Parse keywords
    keywords = [k.strip() for k in args.keywords.split(",")] if args.keywords else []

    # Create skill structure
    base_path = Path(args.output_dir)
    base_path.mkdir(parents=True, exist_ok=True)

    skill_path = create_skill_structure(
        base_path=base_path,
        skill_name=args.skill_name,
        domain=args.domain,
        tech_stack=args.tech_stack,
        description=args.description,
        keywords=keywords,
        interactive=args.interactive
    )

    if skill_path:
        print(f"\n✅ Skill created successfully!")
        print(f"\n📁 Location: {skill_path}")
        print(f"\n📝 Structure:")
        print(f"   {skill_path}/")
        print(f"   ├── SKILL.md (template with TODOs)")
        print(f"   ├── examples/ (add 5-10 code examples)")
        print(f"   ├── templates/ (add 3-5 reusable templates)")
        print(f"   ├── references/ (add 2-4 detailed guides)")
        print(f"   └── checklists/ (add 1-3 validation checklists)")

        print(f"\n🎯 Next steps:")
        print(f"   1. Edit {skill_path}/SKILL.md (fill in TODOs)")
        print(f"   2. Add examples to examples/")
        print(f"   3. Validate: python scripts/validate_skill.py {skill_path}")
        print(f"   4. Auto-improve: python scripts/auto_improve_skill.py {skill_path}")
        print(f"   5. Package: python scripts/package_skill.py {skill_path}")

        sys.exit(0)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
