#!/usr/bin/env python3
"""
Skill Auto-Improvement Tool - Automatically fix common quality issues.

Usage:
    python auto_improve_skill.py . --score-report score.json
    python auto_improve_skill.py path/to/skill --auto-validate
    python auto_improve_skill.py . --backup --dry-run
"""

import argparse
import json
import re
import sys
from pathlib import Path
from datetime import datetime
import yaml


class SkillAutoImprover:
    """Automatically improve skill based on score report."""

    def __init__(self, skill_path: Path):
        self.skill_path = skill_path
        self.skill_file = skill_path / "SKILL.md" if skill_path.is_dir() else skill_path

        if not self.skill_file.exists():
            raise FileNotFoundError(f"SKILL.md not found at {self.skill_file}")

        self.content = self.skill_file.read_text()
        self.lines = self.content.split("\n")
        self.frontmatter = self._parse_frontmatter()
        self.improvements_made = []

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

    def _update_frontmatter(self, updates: dict) -> None:
        """Update YAML frontmatter."""
        if not self.content.startswith("---"):
            # Create new frontmatter
            new_frontmatter = yaml.dump(updates, default_flow_style=False)
            self.content = f"---\n{new_frontmatter}---\n\n{self.content}"
            self.frontmatter = updates
            return

        end_idx = self.content.find("---", 3)
        if end_idx == -1:
            return

        # Merge existing with updates
        merged = {**self.frontmatter, **updates}
        new_frontmatter = yaml.dump(merged, default_flow_style=False)
        self.content = f"---\n{new_frontmatter}---\n{self.content[end_idx+3:]}"
        self.frontmatter = merged

    def improve(self, score_report: dict = None) -> tuple[str, list[str]]:
        """Apply all improvements."""
        # Auto-validate if no score report provided
        if score_report is None:
            print("ℹ️ No score report provided, running validation...")
            from validate_skill import SkillScorer
            scorer = SkillScorer(self.skill_path)
            score_report = scorer.score()

        breakdown = score_report.get('breakdown', {})

        # Apply fixes based on category scores
        if breakdown.get('structure', 0) < 16:
            self._fix_structure_issues()

        if breakdown.get('activation', 0) < 16:
            self._fix_activation_issues()

        if breakdown.get('content', 0) < 20:
            self._fix_content_issues()

        if breakdown.get('actionability', 0) < 16:
            self._fix_actionability_issues()

        if breakdown.get('reusability', 0) < 12:
            self._fix_reusability_issues()

        return (self.content, self.improvements_made)

    def _fix_structure_issues(self) -> None:
        """Fix structure-related issues."""
        # Add missing YAML fields
        if 'keywords' not in self.frontmatter:
            # Extract keywords from content
            keywords = self._extract_keywords_from_content()
            self._update_frontmatter({'keywords': keywords})
            self.improvements_made.append(f"Added {len(keywords)} keywords to YAML")

        if 'tech_stacks' not in self.frontmatter:
            self._update_frontmatter({'tech_stacks': ['To be defined']})
            self.improvements_made.append("Added tech_stacks field to YAML")

        if 'version' not in self.frontmatter:
            self._update_frontmatter({'version': '1.0.0'})
            self.improvements_made.append("Added version field to YAML")

        # Fix length if too long (>300 lines)
        line_count = len(self.lines)
        if line_count > 300:
            self.improvements_made.append(f"⚠️ Skill too long ({line_count} lines), consider moving examples to examples/")

    def _fix_activation_issues(self) -> None:
        """Fix activation-related issues."""
        # Ensure minimum keywords
        keywords = self.frontmatter.get('keywords', [])
        if isinstance(keywords, list) and len(keywords) < 5:
            extracted = self._extract_keywords_from_content()
            combined = list(set(keywords + extracted))[:10]  # Max 10
            self._update_frontmatter({'keywords': combined})
            self.improvements_made.append(f"Expanded keywords from {len(keywords)} to {len(combined)}")

        # Add concrete scenarios if missing
        if 'Activation' in self.content:
            activation_section = self._get_section_content('Activation')
            if 'User says:' not in activation_section and 'User shows:' not in activation_section:
                # Add template for concrete scenarios
                suggestion = "\n\n**Concrete scenarios**:\n- User says: \"[TODO: Add real scenario]\"\n- User shows: \"[TODO: Add code example]\"\n- Claude detects: \"[TODO: Add detection pattern]\"\n"
                self.content = self.content.replace('## Activation', f'## Activation{suggestion}')
                self.improvements_made.append("Added concrete scenarios template to Activation section")

    def _fix_content_issues(self) -> None:
        """Fix content-related issues."""
        # Count existing code example pairs
        wrong_examples = len(re.findall(r'❌.*?```', self.content, re.DOTALL))
        correct_examples = len(re.findall(r'✅.*?```', self.content, re.DOTALL))
        example_pairs = min(wrong_examples, correct_examples)

        if example_pairs < 3:
            self.improvements_made.append(f"⚠️ Only {example_pairs} ❌/✅ code pairs, add {3-example_pairs} more (recommend running extract_patterns.py)")

        # Check for project references
        project_refs = len(re.findall(r'apps/[\w/]+\.py', self.content))
        if project_refs < 3:
            self.improvements_made.append("⚠️ Add 3+ project file references (apps/*/models.py, etc.)")

        # Suggest quantifying vague metrics
        vague_terms = re.findall(r'\b(fast|slow|good|better|improve|enhance)\b', self.content, re.IGNORECASE)
        if len(vague_terms) > 3:
            self.improvements_made.append(f"⚠️ Found {len(vague_terms)} vague terms, quantify metrics (use %, ms, lines)")

        # Replace TODOs with suggestions
        todos = len(re.findall(r'TODO:', self.content))
        if todos > 5:
            self.improvements_made.append(f"⚠️ {todos} TODOs remaining, complete before finalizing")

    def _fix_actionability_issues(self) -> None:
        """Fix actionability-related issues."""
        # Count checklist items
        checklist_items = len(re.findall(r'- \[ \]', self.content))

        if checklist_items < 8:
            # Try to generate from Core Principles
            if 'Core Principles' in self.content or 'Principles' in self.content:
                self.improvements_made.append(f"⚠️ Only {checklist_items} checklist items, add {8-checklist_items} more")
                self.improvements_made.append("💡 Suggestion: Generate from Core Principles using generate_checklist.py")

        # Check for auto-checks
        auto_checks = len(re.findall(r'(grep|pytest|python|npm test|cargo test)', self.content, re.IGNORECASE))
        if auto_checks < 3:
            self.improvements_made.append("⚠️ Add automation suggestions (grep patterns, pytest commands)")

        # Improve vague checklist items
        vague_items = re.findall(r'- \[ \] (Check|Verify|Ensure) (.+?)$', self.content, re.MULTILINE)
        if len(vague_items) > 3:
            self.improvements_made.append(f"⚠️ {len(vague_items)} vague checklist items, convert to yes/no questions")

    def _fix_reusability_issues(self) -> None:
        """Fix reusability-related issues."""
        # Check for hardcoded project names
        hardcoded = re.findall(r'\b(Binora|EasyBoard|MyProject)\b', self.content)
        if len(hardcoded) > 5:
            self.improvements_made.append(f"⚠️ {len(hardcoded)} hardcoded project names, use {{{{project_name}}}} placeholders")

        # Ensure References section exists
        if 'References' not in self.content and 'Reference' not in self.content:
            references_template = """
## References

| Resource | Purpose |
|----------|---------|
| `apps/core/` | Core application patterns |
| `CLAUDE.md` | Project architecture and guidelines |
| Official docs | Framework documentation |
"""
            # Add before final section
            if '---\n\n**Last Updated**' in self.content:
                self.content = self.content.replace('---\n\n**Last Updated**', f'{references_template}\n---\n\n**Last Updated**')
                self.improvements_made.append("Added References section template")
            else:
                self.improvements_made.append("⚠️ Add References section with 5+ project file/doc links")

        # Check documentation links
        doc_links = len(re.findall(r'\[.*?\]\(.*?\)', self.content))
        if doc_links < 3:
            self.improvements_made.append("⚠️ Add 5+ documentation links (official docs, CLAUDE.md, etc.)")

    def _extract_keywords_from_content(self) -> list[str]:
        """Extract potential keywords from skill content."""
        # Look for technical terms (capitalized, common patterns)
        potential_keywords = set()

        # From skill name
        if 'name' in self.frontmatter:
            name_parts = self.frontmatter['name'].lower().split('-')
            potential_keywords.update(name_parts)

        # Common domain terms in content
        common_patterns = [
            r'\b(viewset|serializer|model|service|django|drf|api|rest)\b',
            r'\b(test|pytest|mock|fixture|coverage)\b',
            r'\b(database|query|orm|postgresql|sql)\b',
            r'\b(frontend|backend|ui|component|state)\b',
            r'\b(react|vue|angular|flutter|swift)\b'
        ]

        for pattern in common_patterns:
            matches = re.findall(pattern, self.content, re.IGNORECASE)
            potential_keywords.update([m.lower() for m in matches])

        # Limit to most common
        return sorted(list(potential_keywords))[:10]

    def _get_section_content(self, section_name: str) -> str:
        """Get content of a specific section."""
        pattern = f'## {section_name}(.*?)(?=##|---|\Z)'
        match = re.search(pattern, self.content, re.DOTALL)
        return match.group(1).strip() if match else ""


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Automatically improve skill quality",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python auto_improve_skill.py . --score-report score.json
  python auto_improve_skill.py path/to/skill --auto-validate
  python auto_improve_skill.py . --backup --dry-run

Workflow:
  1. Run validate_skill.py to get score report
  2. Run auto_improve_skill.py with score report
  3. Re-run validate_skill.py to verify improvements
        """
    )

    parser.add_argument("skill_path", help="Path to SKILL.md or skill directory")
    parser.add_argument("--score-report", help="Path to score report JSON from validate_skill.py")
    parser.add_argument("--auto-validate", action="store_true",
                       help="Automatically run validation before improving")
    parser.add_argument("--backup", action="store_true",
                       help="Create backup before modifying (SKILL.md.backup)")
    parser.add_argument("--dry-run", action="store_true",
                       help="Show improvements without applying them")
    parser.add_argument("--json", action="store_true",
                       help="Output in JSON format")

    args = parser.parse_args()

    skill_path = Path(args.skill_path)

    try:
        # Load score report if provided
        score_report = None
        if args.score_report:
            with open(args.score_report) as f:
                score_report = json.load(f)
        elif args.auto_validate:
            # Will be handled by improver
            pass
        else:
            print("⚠️ No score report provided, use --score-report or --auto-validate")
            print("   Running with auto-validation...")

        improver = SkillAutoImprover(skill_path)

        # Backup if requested
        if args.backup and not args.dry_run:
            backup_path = improver.skill_file.with_suffix('.md.backup')
            backup_path.write_text(improver.content)
            print(f"✅ Backup created: {backup_path}")

        # Apply improvements
        improved_content, improvements = improver.improve(score_report)

        if args.json:
            result = {
                'improvements_made': improvements,
                'improvement_count': len(improvements),
                'dry_run': args.dry_run
            }
            print(json.dumps(result, indent=2))
        else:
            print(f"\n🔧 Auto-Improvement Report")
            print(f"{'='*60}")
            print(f"Skill: {improver.skill_file}")
            print(f"Improvements applied: {len(improvements)}")
            print(f"{'='*60}\n")

            if improvements:
                for i, improvement in enumerate(improvements, 1):
                    if improvement.startswith("⚠️"):
                        print(f"{i}. {improvement}")
                    elif improvement.startswith("💡"):
                        print(f"{i}. {improvement}")
                    else:
                        print(f"{i}. ✅ {improvement}")
            else:
                print("ℹ️ No automatic improvements available.")
                print("   Skill may already be high quality or needs manual review.")

        # Write improved content
        if not args.dry_run:
            improver.skill_file.write_text(improved_content)
            print(f"\n✅ SKILL.md updated successfully")

            # Re-validate to show new score
            print(f"\n📊 Re-validating...")
            from validate_skill import SkillScorer
            scorer = SkillScorer(skill_path)
            new_score = scorer.score()

            print(f"\n   New score: {new_score['score']}/100")
            if score_report and 'score' in score_report:
                old_score = score_report['score']
                improvement = new_score['score'] - old_score
                print(f"   Improvement: +{improvement} points ({old_score} → {new_score['score']})")

            if new_score['passed']:
                print(f"   ✅ PASSED (score >= 95)")
            else:
                print(f"   ⚠️ Score < 95, manual review recommended")

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
