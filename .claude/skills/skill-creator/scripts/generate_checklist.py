#!/usr/bin/env python3
"""
Checklist Generator - Auto-generate validation checklists from Core Principles.

Usage:
    python generate_checklist.py . --from-principles
    python generate_checklist.py path/to/skill --add-auto-checks
    python generate_checklist.py . --format grouped --output-file checklist.md
"""

import argparse
import re
import sys
from pathlib import Path
from typing import List, Dict, Tuple


class ChecklistGenerator:
    """Generate validation checklists from skill content."""

    def __init__(self, skill_path: Path):
        self.skill_path = skill_path
        self.skill_file = skill_path / "SKILL.md" if skill_path.is_dir() else skill_path

        if not self.skill_file.exists():
            raise FileNotFoundError(f"SKILL.md not found at {self.skill_file}")

        self.content = self.skill_file.read_text()
        self.lines = self.content.split("\n")

    def generate_from_principles(self) -> List[Dict[str, str]]:
        """Generate checklist items from Core Principles section."""
        checklist_items = []

        # Extract Core Principles section
        principles_section = self._extract_section("Core Principles")

        if not principles_section:
            print("⚠️ No Core Principles section found")
            return []

        # Parse principles
        principle_pattern = r'###\s+\d+\.\s+(.+?)\n\n\*\*Rule\*\*:\s+(.+?)(?=\n\n|\Z)'
        principles = re.findall(principle_pattern, principles_section, re.DOTALL)

        for i, (title, rule) in enumerate(principles, 1):
            # Generate yes/no question from principle
            question = self._convert_rule_to_question(title, rule)

            # Try to generate auto-check
            auto_check = self._generate_auto_check(title, rule)

            checklist_items.append({
                'priority': 'Critical' if i <= 2 else 'High Priority' if i <= 4 else 'Medium Priority',
                'question': question,
                'auto_check': auto_check,
                'from_principle': title
            })

        return checklist_items

    def generate_from_anti_patterns(self) -> List[Dict[str, str]]:
        """Generate checklist items from Anti-Patterns section."""
        checklist_items = []

        # Extract Anti-Patterns section
        anti_patterns_section = self._extract_section("Anti-Patterns")

        if not anti_patterns_section:
            print("⚠️ No Anti-Patterns section found")
            return []

        # Parse anti-patterns
        pattern = r'###\s+❌\s+(.+?)\n'
        anti_patterns = re.findall(pattern, anti_patterns_section)

        for anti_pattern in anti_patterns:
            # Generate negative check (ensure anti-pattern is NOT present)
            question = f"Does code avoid: {anti_pattern.lower()}?"

            # Try to generate auto-check (grep pattern to detect violation)
            auto_check = self._generate_violation_check(anti_pattern)

            checklist_items.append({
                'priority': 'Critical',
                'question': question,
                'auto_check': auto_check,
                'from_anti_pattern': anti_pattern
            })

        return checklist_items

    def _extract_section(self, section_name: str) -> str:
        """Extract content of a specific section."""
        pattern = f'## {section_name}(.*?)(?=##|---|\Z)'
        match = re.search(pattern, self.content, re.DOTALL)
        return match.group(1).strip() if match else ""

    def _convert_rule_to_question(self, title: str, rule: str) -> str:
        """Convert a principle rule to a yes/no question."""
        # Clean title and rule
        title_clean = title.strip().rstrip('?')
        rule_clean = rule.strip().rstrip('.')

        # Common patterns to convert to questions
        patterns = [
            (r'^ALL (.+?) must (.+?)$', r'Do all \1 \2?'),
            (r'^(.+?) should (.+?)$', r'Does \1 \2?'),
            (r'^(.+?) must (.+?)$', r'Does \1 \2?'),
            (r'^Never (.+?)$', r'Is code free of \1?'),
            (r'^Always (.+?)$', r'Does code always \1?'),
            (r'^(.+?) are (.+?)$', r'Are \1 \2?'),
            (r'^(.+?) is (.+?)$', r'Is \1 \2?'),
        ]

        for pattern, replacement in patterns:
            match = re.match(pattern, rule_clean, re.IGNORECASE)
            if match:
                return re.sub(pattern, replacement, rule_clean, flags=re.IGNORECASE)

        # Fallback: generic question from title
        if '?' not in title_clean:
            return f"Does code follow: {title_clean}?"
        else:
            return title_clean

    def _generate_auto_check(self, title: str, rule: str) -> str:
        """Generate automated validation check (grep, pytest, etc.)."""
        # Django/DRF specific patterns
        drf_patterns = {
            'service': 'grep -r "def.*Service" apps/',
            'viewset': 'grep -r "class.*ViewSet" apps/',
            'serializer': 'grep -r "class.*Serializer" apps/',
            'multi-tenant': 'grep -r "TenantAwareModel" apps/',
            'type hints': 'grep -r "def.*) ->" apps/',
            'test': 'pytest --collect-only | grep test_',
            'mock': 'grep -r "mocker.Mock" apps/*/tests/',
        }

        # Check for keywords in title/rule
        combined = f"{title} {rule}".lower()

        for keyword, check in drf_patterns.items():
            if keyword in combined:
                return check

        # Generic patterns
        if 'no' in rule.lower() or 'never' in rule.lower():
            # Negative check - should NOT find
            forbidden_term = self._extract_forbidden_term(rule)
            if forbidden_term:
                return f'grep -r "{forbidden_term}" apps/ # Should return 0 results'

        return ""  # No auto-check available

    def _generate_violation_check(self, anti_pattern: str) -> str:
        """Generate grep pattern to detect anti-pattern violation."""
        # Common violation patterns
        violation_checks = {
            'business logic': 'grep -rn "if.*save()" apps/*/views/',
            'manual tenant': 'grep -rn "tenant_id=" apps/',
            'mock()': 'grep -rn "from unittest.mock import Mock" apps/*/tests/',
            'n+1 query': 'grep -rn "\.objects\.all()" apps/ # Check for missing select_related',
            'hardcoded': 'grep -rn -E "(http://|https://|localhost)" apps/',
        }

        anti_pattern_lower = anti_pattern.lower()

        for keyword, check in violation_checks.items():
            if keyword in anti_pattern_lower:
                return check

        # Fallback: generic grep
        # Extract key term from anti-pattern
        key_terms = re.findall(r'\b[A-Z][a-z]+\b', anti_pattern)
        if key_terms:
            return f'grep -rn "{key_terms[0]}" apps/'

        return ""

    def _extract_forbidden_term(self, rule: str) -> str:
        """Extract forbidden term from negative rule."""
        # Patterns like "Never use X", "Avoid Y"
        patterns = [
            r'never use (.+?)(?:\.|$)',
            r'avoid (.+?)(?:\.|$)',
            r'do not (.+?)(?:\.|$)',
            r'don\'t (.+?)(?:\.|$)',
        ]

        for pattern in patterns:
            match = re.search(pattern, rule, re.IGNORECASE)
            if match:
                return match.group(1).strip()

        return ""

    def format_checklist(self, items: List[Dict[str, str]], format_type: str = "simple") -> str:
        """Format checklist items into markdown."""
        if format_type == "grouped":
            # Group by priority
            grouped = {}
            for item in items:
                priority = item['priority']
                if priority not in grouped:
                    grouped[priority] = []
                grouped[priority].append(item)

            md = "# Validation Checklist\n\n"
            md += "**Auto-generated from Core Principles and Anti-Patterns**\n\n"
            md += "---\n\n"

            for priority in ['Critical', 'High Priority', 'Medium Priority']:
                if priority in grouped:
                    md += f"## {priority}\n\n"
                    for item in grouped[priority]:
                        md += f"- [ ] {item['question']}\n"
                        if item.get('auto_check'):
                            md += f"  - **Auto-check**: `{item['auto_check']}`\n"
                    md += "\n"

            return md

        else:  # simple format
            md = "# Validation Checklist\n\n"
            for item in items:
                md += f"- [ ] **[{item['priority']}]** {item['question']}\n"
                if item.get('auto_check'):
                    md += f"  - Auto-check: `{item['auto_check']}`\n"
            return md


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Generate validation checklists from skill content",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python generate_checklist.py . --from-principles
  python generate_checklist.py path/to/skill --from-anti-patterns
  python generate_checklist.py . --all --format grouped
  python generate_checklist.py . --all --output-file checklists/validation.md

Sources:
  --from-principles      Generate from Core Principles section
  --from-anti-patterns   Generate from Anti-Patterns section
  --all                  Generate from both sources
        """
    )

    parser.add_argument("skill_path", help="Path to SKILL.md or skill directory")
    parser.add_argument("--from-principles", action="store_true",
                       help="Generate checklist from Core Principles")
    parser.add_argument("--from-anti-patterns", action="store_true",
                       help="Generate checklist from Anti-Patterns")
    parser.add_argument("--all", action="store_true",
                       help="Generate from both sources")
    parser.add_argument("--format", choices=["simple", "grouped"], default="grouped",
                       help="Output format (default: grouped)")
    parser.add_argument("--output-file", help="Save to file (default: print to stdout)")
    parser.add_argument("--add-to-skill", action="store_true",
                       help="Add generated checklist to SKILL.md")

    args = parser.parse_args()

    skill_path = Path(args.skill_path)

    try:
        generator = ChecklistGenerator(skill_path)

        print(f"🔧 Generating checklist from {generator.skill_file}...\n")

        all_items = []

        # Determine what to generate
        if args.all or args.from_principles:
            print("📋 Extracting from Core Principles...")
            principles_items = generator.generate_from_principles()
            all_items.extend(principles_items)
            print(f"   ✅ Generated {len(principles_items)} items\n")

        if args.all or args.from_anti_patterns:
            print("📋 Extracting from Anti-Patterns...")
            anti_pattern_items = generator.generate_from_anti_patterns()
            all_items.extend(anti_pattern_items)
            print(f"   ✅ Generated {len(anti_pattern_items)} items\n")

        if not all_items:
            print("⚠️ No checklist items generated. Use --from-principles or --from-anti-patterns")
            sys.exit(1)

        # Format checklist
        checklist_md = generator.format_checklist(all_items, args.format)

        # Output
        if args.output_file:
            output_path = Path(args.output_file)
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_text(checklist_md)
            print(f"✅ Checklist saved to: {output_path}")
        else:
            print("="*60)
            print(checklist_md)
            print("="*60)

        if args.add_to_skill:
            # Add to SKILL.md Validation section
            content = generator.content

            # Find Validation section
            if "## Validation" in content:
                # Replace existing checklist
                pattern = r'(## Validation.*?)((?=##)|(?=---)|$)'
                new_section = f"## Validation Checklist\n\n{checklist_md}\n\n"
                content = re.sub(pattern, new_section, content, flags=re.DOTALL)
                generator.skill_file.write_text(content)
                print(f"\n✅ Checklist added to SKILL.md Validation section")
            else:
                print(f"\n⚠️ No Validation section found in SKILL.md")

        print(f"\n📊 Summary:")
        print(f"   Total items: {len(all_items)}")
        print(f"   With auto-checks: {sum(1 for item in all_items if item.get('auto_check'))}")
        print(f"   Critical: {sum(1 for item in all_items if item['priority'] == 'Critical')}")
        print(f"   High Priority: {sum(1 for item in all_items if item['priority'] == 'High Priority')}")
        print(f"   Medium Priority: {sum(1 for item in all_items if item['priority'] == 'Medium Priority')}")

        sys.exit(0)

    except FileNotFoundError as e:
        print(f"❌ Error: {e}")
        sys.exit(2)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(3)


if __name__ == "__main__":
    main()