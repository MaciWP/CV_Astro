#!/usr/bin/env python3
"""
Skill Optimization Tool - Format and optimize skill structure.

Usage:
    python optimize_skill.py . --progressive-disclosure
    python optimize_skill.py path/to/skill --balance-content
    python optimize_skill.py . --target-length 200 --dry-run
"""

import argparse
import re
import sys
from pathlib import Path
from typing import List, Tuple
import yaml


class SkillOptimizer:
    """Optimize skill structure and formatting."""

    def __init__(self, skill_path: Path):
        self.skill_path = skill_path
        self.skill_file = skill_path / "SKILL.md" if skill_path.is_dir() else skill_path
        self.skill_dir = skill_path if skill_path.is_dir() else skill_path.parent

        if not self.skill_file.exists():
            raise FileNotFoundError(f"SKILL.md not found at {self.skill_file}")

        self.content = self.skill_file.read_text()
        self.lines = self.content.split("\n")
        self.frontmatter = self._parse_frontmatter()
        self.optimizations = []

    def _parse_frontmatter(self) -> dict:
        """Extract YAML frontmatter."""
        if not self.content.startswith("---"):
            return {}

        try:
            end_idx = self.content.find("---", 3)
            if end_idx == -1:
                return {}
            yaml_content = self.content[3:end_idx].strip()
            return yaml.safe_load(yaml_content) or {}
        except Exception:
            return {}

    def optimize(
        self,
        progressive_disclosure: bool = False,
        balance_content: bool = False,
        target_length: int = 200,
        format_code_blocks: bool = False
    ) -> Tuple[str, List[str]]:
        """Apply all optimizations."""

        if progressive_disclosure:
            self._apply_progressive_disclosure()

        if balance_content:
            self._balance_content_across_sections()

        if target_length > 0:
            self._optimize_length(target_length)

        if format_code_blocks:
            self._format_code_blocks()

        # Always apply these
        self._fix_markdown_formatting()
        self._optimize_section_order()

        return (self.content, self.optimizations)

    def _apply_progressive_disclosure(self) -> None:
        """Move long content to separate files."""
        # Find long code examples (>50 lines)
        code_blocks = re.finditer(r'```(\w*)\n(.*?)\n```', self.content, re.DOTALL)

        for match in code_blocks:
            code_content = match.group(2)
            code_lines = code_content.count('\n')

            if code_lines > 50:
                # Extract to examples/ folder
                lang = match.group(1) or 'text'
                example_num = len(list((self.skill_dir / 'examples').glob('*.md'))) + 1
                example_file = self.skill_dir / 'examples' / f'example_{example_num}.md'

                # Create example file
                (self.skill_dir / 'examples').mkdir(exist_ok=True)
                example_file.write_text(f"# Code Example {example_num}\n\n```{lang}\n{code_content}\n```\n")

                # Replace in SKILL.md with reference
                replacement = f"**See**: `examples/example_{example_num}.md` for complete code"
                self.content = self.content.replace(match.group(0), replacement)

                self.optimizations.append(f"Moved long code block ({code_lines} lines) to examples/example_{example_num}.md")

    def _balance_content_across_sections(self) -> None:
        """Balance content distribution across sections."""
        sections = self._extract_sections()

        # Calculate average section length
        section_lengths = {name: len(content.split('\n')) for name, content in sections.items()}
        avg_length = sum(section_lengths.values()) / len(section_lengths) if section_lengths else 0

        # Identify overly long sections (>2x average)
        for section_name, length in section_lengths.items():
            if length > avg_length * 2:
                self.optimizations.append(f"⚠️ Section '{section_name}' is long ({length} lines vs avg {avg_length:.0f}), consider splitting")

    def _optimize_length(self, target_length: int) -> None:
        """Optimize to target line count."""
        current_length = len(self.lines)

        if current_length <= target_length:
            self.optimizations.append(f"✅ Length optimal ({current_length} <= {target_length} target)")
            return

        excess = current_length - target_length
        self.optimizations.append(f"⚠️ Skill too long ({current_length} lines, target: {target_length}, excess: {excess})")

        # Suggest what to move
        sections = self._extract_sections()

        # Find longest sections
        longest_sections = sorted(
            [(name, len(content.split('\n'))) for name, content in sections.items()],
            key=lambda x: x[1],
            reverse=True
        )[:3]

        self.optimizations.append(f"💡 Suggestions to reduce length:")
        for section_name, length in longest_sections:
            self.optimizations.append(f"   - Move '{section_name}' ({length} lines) to references/")

    def _format_code_blocks(self) -> None:
        """Format code blocks consistently."""
        # Ensure all code blocks have language specified
        unspecified_blocks = len(re.findall(r'```\n', self.content))

        if unspecified_blocks > 0:
            # Try to infer language from context
            self.content = re.sub(
                r'```\n(import |from |class |def |function |const |let |var )',
                r'```python\n\1',
                self.content
            )
            self.optimizations.append(f"Added language specifiers to {unspecified_blocks} code blocks")

        # Ensure code blocks are properly closed
        block_count = self.content.count('```')
        if block_count % 2 != 0:
            self.optimizations.append(f"⚠️ Unmatched code blocks detected (found {block_count} markers, should be even)")

    def _fix_markdown_formatting(self) -> None:
        """Fix common markdown formatting issues."""
        original = self.content

        # Fix header spacing (ensure blank line before headers)
        self.content = re.sub(r'([^\n])\n(#{1,6} )', r'\1\n\n\2', self.content)

        # Fix list spacing (ensure blank line before lists)
        self.content = re.sub(r'([^\n])\n(- )', r'\1\n\n\2', self.content)

        # Fix multiple blank lines (max 2)
        self.content = re.sub(r'\n{4,}', '\n\n\n', self.content)

        if self.content != original:
            self.optimizations.append("Fixed markdown formatting (headers, lists, spacing)")

    def _optimize_section_order(self) -> None:
        """Ensure sections are in optimal order."""
        optimal_order = [
            'Mission',
            'Core Principles',
            'Anti-Patterns',
            'Validation',
            'References',
            'Activation'
        ]

        sections = self._extract_sections()
        current_order = list(sections.keys())

        # Check if order matches optimal
        misplaced = []
        for i, section in enumerate(current_order):
            # Find in optimal order
            if section in optimal_order:
                optimal_index = optimal_order.index(section)
                # Check if there are sections that should come before this one
                for j in range(optimal_index):
                    if optimal_order[j] in current_order:
                        current_j = current_order.index(optimal_order[j])
                        if current_j > i:
                            misplaced.append(section)
                            break

        if misplaced:
            self.optimizations.append(f"⚠️ Sections out of optimal order: {', '.join(misplaced)}")
            self.optimizations.append(f"💡 Optimal order: {' → '.join(optimal_order)}")

    def _extract_sections(self) -> dict:
        """Extract markdown sections."""
        sections = {}
        current_section = None
        current_content = []

        for line in self.lines:
            if line.startswith("## "):
                if current_section:
                    sections[current_section] = "\n".join(current_content)
                current_section = line[3:].strip()
                current_content = []
            elif current_section:
                current_content.append(line)

        if current_section:
            sections[current_section] = "\n".join(current_content)

        return sections


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Optimize skill structure and formatting",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python optimize_skill.py . --progressive-disclosure
  python optimize_skill.py path/to/skill --balance-content
  python optimize_skill.py . --target-length 200 --format-code-blocks
  python optimize_skill.py . --all --dry-run

Optimizations:
  --progressive-disclosure  Move long examples to examples/
  --balance-content         Balance content across sections
  --target-length N         Suggest reductions to reach N lines
  --format-code-blocks      Format code blocks consistently
  --all                     Apply all optimizations
        """
    )

    parser.add_argument("skill_path", help="Path to SKILL.md or skill directory")
    parser.add_argument("--progressive-disclosure", action="store_true",
                       help="Move long content to separate files")
    parser.add_argument("--balance-content", action="store_true",
                       help="Balance content distribution across sections")
    parser.add_argument("--target-length", type=int, default=0,
                       help="Target line count (suggests reductions)")
    parser.add_argument("--format-code-blocks", action="store_true",
                       help="Format code blocks consistently")
    parser.add_argument("--all", action="store_true",
                       help="Apply all optimizations")
    parser.add_argument("--dry-run", action="store_true",
                       help="Show optimizations without applying them")
    parser.add_argument("--backup", action="store_true",
                       help="Create backup before modifying")

    args = parser.parse_args()

    skill_path = Path(args.skill_path)

    try:
        optimizer = SkillOptimizer(skill_path)

        # Backup if requested
        if args.backup and not args.dry_run:
            backup_path = optimizer.skill_file.with_suffix('.md.backup')
            backup_path.write_text(optimizer.content)
            print(f"✅ Backup created: {backup_path}")

        # Determine which optimizations to apply
        if args.all:
            progressive = True
            balance = True
            target = 200
            format_blocks = True
        else:
            progressive = args.progressive_disclosure
            balance = args.balance_content
            target = args.target_length
            format_blocks = args.format_code_blocks

        # Apply optimizations
        optimized_content, optimizations = optimizer.optimize(
            progressive_disclosure=progressive,
            balance_content=balance,
            target_length=target,
            format_code_blocks=format_blocks
        )

        # Report
        print(f"\n⚙️ Skill Optimization Report")
        print(f"{'='*60}")
        print(f"Skill: {optimizer.skill_file}")
        print(f"Optimizations applied: {len(optimizations)}")
        print(f"{'='*60}\n")

        if optimizations:
            for i, opt in enumerate(optimizations, 1):
                if opt.startswith("⚠️"):
                    print(f"{i}. {opt}")
                elif opt.startswith("💡"):
                    print(f"{i}. {opt}")
                else:
                    print(f"{i}. ✅ {opt}")
        else:
            print("ℹ️ No optimizations needed - skill already optimal!")

        # Write optimized content
        if not args.dry_run:
            optimizer.skill_file.write_text(optimized_content)
            print(f"\n✅ SKILL.md optimized successfully")

            # Show length change
            original_lines = len(optimizer.lines)
            new_lines = len(optimized_content.split('\n'))
            if new_lines != original_lines:
                diff = new_lines - original_lines
                print(f"\n📊 Length: {original_lines} → {new_lines} lines ({diff:+d})")
        else:
            print(f"\n🔍 DRY RUN - No changes applied")

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