#!/usr/bin/env python3
"""
Skill Validation Tool - Validate skill quality with quick or full scoring.

Usage:
    python validate_skill.py . --mode quick
    python validate_skill.py path/to/skill --mode full
    python validate_skill.py . --mode full --json --min-score 95
"""

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Optional
import yaml


class SkillScorer:
    """Score skill quality across 5 categories (0-100 total)."""

    def __init__(self, skill_path: Path):
        self.skill_path = skill_path
        self.skill_file = skill_path / "SKILL.md" if skill_path.is_dir() else skill_path

        if not self.skill_file.exists():
            raise FileNotFoundError(f"SKILL.md not found at {self.skill_file}")

        self.content = self.skill_file.read_text()
        self.lines = self.content.split("\n")
        self.frontmatter = self._parse_frontmatter()
        self.sections = self._parse_sections()

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

    def _parse_sections(self) -> dict:
        """Parse markdown sections."""
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

    def score(self) -> dict:
        """Score skill across all categories."""
        structure_score, structure_issues = self.score_structure()
        activation_score, activation_issues = self.score_activation()
        content_score, content_issues = self.score_content()
        actionability_score, actionability_issues = self.score_actionability()
        reusability_score, reusability_issues = self.score_reusability()

        total_score = (
            structure_score + activation_score + content_score +
            actionability_score + reusability_score
        )

        all_issues = (
            structure_issues + activation_issues + content_issues +
            actionability_issues + reusability_issues
        )

        # Generate suggestions
        suggestions = self._generate_suggestions(total_score, {
            'structure': structure_score,
            'activation': activation_score,
            'content': content_score,
            'actionability': actionability_score,
            'reusability': reusability_score
        })

        return {
            'score': total_score,
            'passed': total_score >= 95,
            'breakdown': {
                'structure': structure_score,
                'activation': activation_score,
                'content': content_score,
                'actionability': actionability_score,
                'reusability': reusability_score
            },
            'issues': all_issues,
            'suggestions': suggestions
        }

    def score_structure(self) -> tuple[int, list[str]]:
        """Score structure quality (0-20 points)."""
        score = 20
        issues = []

        # YAML frontmatter (5 pts)
        if not self.frontmatter:
            score -= 5
            issues.append("Missing or invalid YAML frontmatter")
        elif 'name' not in self.frontmatter or 'description' not in self.frontmatter:
            score -= 3
            issues.append("Missing required YAML fields (name, description)")

        # Enhanced fields bonus
        if 'keywords' not in self.frontmatter:
            score -= 1
            issues.append("Missing 'keywords' field in YAML")
        if 'tech_stacks' not in self.frontmatter:
            score -= 1
            issues.append("Missing 'tech_stacks' field in YAML")

        # Section completeness (5 pts)
        required_sections = ['Mission', 'Core Principles', 'Anti-Patterns', 'Validation']
        missing = [s for s in required_sections if not any(s in sec for sec in self.sections.keys())]
        if missing:
            deduction = min(5, len(missing) * 2)
            score -= deduction
            issues.append(f"Missing sections: {', '.join(missing)}")

        # Length optimization (5 pts)
        line_count = len(self.lines)
        if 150 <= line_count <= 250:
            pass  # Perfect
        elif 100 <= line_count < 150 or 250 < line_count <= 300:
            score -= 1
            issues.append(f"Length {line_count} acceptable but not optimal (target: 150-250)")
        elif 300 < line_count <= 400:
            score -= 3
            issues.append(f"Too long ({line_count} lines), move content to references/")
        else:
            score -= 5
            issues.append(f"Length {line_count} far from optimal (150-250)")

        # Formatting quality (5 pts)
        if not self._check_markdown_formatting():
            score -= 3
            issues.append("Markdown formatting issues detected")

        return (max(0, score), issues)

    def score_activation(self) -> tuple[int, list[str]]:
        """Score activation quality (0-20 points)."""
        score = 20
        issues = []

        # Keyword coverage (7 pts)
        keywords = self.frontmatter.get('keywords', [])
        keyword_count = len(keywords) if isinstance(keywords, list) else 0

        if keyword_count >= 7:
            pass  # Perfect
        elif keyword_count >= 5:
            score -= 1
            issues.append(f"Only {keyword_count} keywords, recommend 7+ for better activation")
        elif keyword_count >= 3:
            score -= 4
            issues.append(f"Insufficient keywords ({keyword_count}), add more domain-specific terms")
        else:
            score -= 7
            issues.append("Missing or very few keywords, add 7+ domain-specific terms")

        # Check for generic keywords
        generic_keywords = ['code', 'quality', 'best practice', 'good', 'better']
        if any(k in keywords for k in generic_keywords):
            score -= 1
            issues.append("Avoid generic keywords, use domain-specific terms")

        # Concrete triggers (7 pts)
        activation_section = self.sections.get('Activation', '')
        concrete_scenarios = len(re.findall(r'User says:|User shows:|Claude detects:', activation_section))

        if concrete_scenarios >= 3:
            pass  # Perfect
        elif concrete_scenarios >= 2:
            score -= 1
            issues.append("Add 1 more concrete scenario example")
        elif concrete_scenarios >= 1:
            score -= 3
            issues.append("Add 2+ more concrete scenario examples")
        else:
            score -= 7
            issues.append("Add 3+ concrete scenarios showing when skill activates")

        # Description quality (6 pts)
        description = self.frontmatter.get('description', '')
        desc_len = len(description)

        if desc_len == 0:
            score -= 6
            issues.append("Missing description in YAML")
        elif desc_len > 1500:
            score -= 5
            issues.append(f"Description too long ({desc_len} chars), max 1024 recommended")
        elif desc_len > 1024:
            score -= 3
            issues.append(f"Description long ({desc_len} chars), consider condensing to <1024")

        return (max(0, score), issues)

    def score_content(self) -> tuple[int, list[str]]:
        """Score content quality (0-25 points)."""
        score = 25
        issues = []

        # Code examples (8 pts)
        wrong_examples = len(re.findall(r'❌.*?```', self.content, re.DOTALL))
        correct_examples = len(re.findall(r'✅.*?```', self.content, re.DOTALL))
        example_pairs = min(wrong_examples, correct_examples)

        if example_pairs >= 5:
            pass  # Perfect
        elif example_pairs >= 3:
            score -= 1
            issues.append(f"Add {5-example_pairs} more ❌/✅ code example pairs")
        elif example_pairs >= 1:
            score -= 4
            issues.append(f"Add {5-example_pairs} more ❌/✅ code example pairs (need 5+)")
        else:
            score -= 8
            issues.append("Missing ❌/✅ code examples, add at least 5 pairs")

        # Project specificity (6 pts)
        project_refs = len(re.findall(r'apps/[\w/]+\.py', self.content))
        project_refs += len(re.findall(r'lib/[\w/]+\.dart', self.content))
        project_refs += len(re.findall(r'src/[\w/]+\.(ts|js|tsx)', self.content))

        if project_refs >= 5:
            pass  # Perfect
        elif project_refs >= 3:
            score -= 1
            issues.append("Add more real project file references")
        elif project_refs >= 1:
            score -= 3
            issues.append("Add 3+ real project file references")
        else:
            score -= 6
            issues.append("Add real project file references (apps/, lib/, src/)")

        # Quantifiable metrics (6 pts)
        quantified_metrics = len(re.findall(r'\d+%|\d+ms|<\d+|>\d+|\d+ lines', self.content))
        vague_terms = len(re.findall(r'\b(fast|slow|good|better|improve|enhance)\b', self.content, re.IGNORECASE))

        if quantified_metrics >= 5 and vague_terms < 3:
            pass  # Perfect
        elif quantified_metrics >= 3:
            score -= 2
            issues.append("Quantify more targets (use %, ms, lines, count)")
        else:
            score -= 6
            issues.append("Most metrics are vague, quantify with specific numbers")

        # Completeness (5 pts)
        if len(self.sections) < 5:
            score -= 3
            issues.append("Skill seems incomplete, add more sections")

        # Check for TODOs
        todos = len(re.findall(r'TODO:', self.content))
        if todos > 5:
            score -= 2
            issues.append(f"Contains {todos} TODOs, complete before finalizing")

        return (max(0, score), issues)

    def score_actionability(self) -> tuple[int, list[str]]:
        """Score actionability (0-20 points)."""
        score = 20
        issues = []

        # Checklist items (6 pts)
        checklist_items = len(re.findall(r'- \[ \]', self.content))

        if checklist_items >= 10:
            pass  # Perfect
        elif checklist_items >= 8:
            score -= 1
            issues.append("Add 2 more checklist items (target: 10+)")
        elif checklist_items >= 5:
            score -= 3
            issues.append(f"Add {10-checklist_items} more checklist items")
        else:
            score -= 6
            issues.append("Insufficient checklist items, add at least 10")

        # Auto-checks (5 pts)
        auto_checks = len(re.findall(r'(grep|pytest|python|npm test|cargo test)', self.content, re.IGNORECASE))

        if auto_checks >= 5:
            pass  # Perfect
        elif auto_checks >= 3:
            score -= 2
            issues.append("Add more automated validation suggestions (grep, pytest, etc.)")
        else:
            score -= 5
            issues.append("Add 5+ automation suggestions (grep patterns, test commands)")

        # Applicability - yes/no questions (4 pts)
        questions = len(re.findall(r'\?', self.content))
        if questions < 5:
            score -= 2
            issues.append("Add more yes/no validation questions")

        # Check for vague checklist items
        vague_items = len(re.findall(r'- \[ \] (Check|Verify|Ensure) (?!.*\?).*$', self.content, re.MULTILINE))
        if vague_items > 3:
            score -= 2
            issues.append("Make checklist items more specific (convert to yes/no questions)")

        return (max(0, score), issues)

    def score_reusability(self) -> tuple[int, list[str]]:
        """Score reusability (0-15 points)."""
        score = 15
        issues = []

        # Generalizable principles (5 pts)
        # Check for hardcoded project names
        hardcoded = len(re.findall(r'\b(Binora|EasyBoard|MyProject)\b', self.content))
        if hardcoded > 5:
            score -= 3
            issues.append("Too many hardcoded project names, use generic terms or {{project_name}}")
        elif hardcoded > 2:
            score -= 1
            issues.append("Some hardcoded project names, consider genericizing")

        # Project examples (5 pts)
        if 'References' in self.sections or 'Reference' in self.sections:
            refs_content = self.sections.get('References', '') or self.sections.get('Reference', '')
            ref_count = len(re.findall(r'\|.*?\|.*?\|', refs_content))

            if ref_count >= 5:
                pass  # Perfect
            elif ref_count >= 3:
                score -= 2
                issues.append("Add more project file references")
            else:
                score -= 5
                issues.append("Add 5+ project file references in References section")
        else:
            score -= 5
            issues.append("Missing References section")

        # Documentation links (5 pts)
        doc_links = len(re.findall(r'\[.*?\]\(.*?\)', self.content))

        if doc_links >= 5:
            pass  # Perfect
        elif doc_links >= 3:
            score -= 2
            issues.append("Add more documentation links")
        else:
            score -= 5
            issues.append("Add 5+ documentation links (official docs, CLAUDE.md, etc.)")

        return (max(0, score), issues)

    def _check_markdown_formatting(self) -> bool:
        """Check basic markdown formatting."""
        # Check for code blocks properly closed
        code_blocks = re.findall(r'```', self.content)
        if len(code_blocks) % 2 != 0:
            return False

        # Check for headers
        if not re.search(r'^#{1,6} ', self.content, re.MULTILINE):
            return False

        return True

    def _generate_suggestions(self, score: int, breakdown: dict) -> list[str]:
        """Generate improvement suggestions based on score."""
        suggestions = []

        if score >= 95:
            suggestions.append("✅ Excellent! Skill is production-ready.")
            return suggestions

        if breakdown['structure'] < 16:
            suggestions.append("Improve structure: Check YAML, section completeness, and length (150-250 lines)")

        if breakdown['activation'] < 16:
            suggestions.append("Enhance activation: Add more domain-specific keywords and concrete scenarios")

        if breakdown['content'] < 20:
            suggestions.append("Strengthen content: Add ❌/✅ code pairs, project references, and quantifiable metrics")

        if breakdown['actionability'] < 16:
            suggestions.append("Boost actionability: Expand checklist to 10+ items, add automation suggestions")

        if breakdown['reusability'] < 12:
            suggestions.append("Improve reusability: Add documentation links, project references, avoid hardcoding")

        if score < 85:
            suggestions.append("⚠️ Significant iteration needed. Consider using auto_improve_skill.py for automatic fixes.")

        return suggestions


def validate_quick(skill_path: Path) -> tuple[bool, str]:
    """Quick validation (Anthropic-style format check)."""
    skill_file = skill_path / "SKILL.md" if skill_path.is_dir() else skill_path

    if not skill_file.exists():
        return (False, f"❌ SKILL.md not found at {skill_file}")

    content = skill_file.read_text()

    # Check YAML frontmatter
    if not content.startswith("---"):
        return (False, "❌ Missing YAML frontmatter (must start with ---)")

    try:
        end_idx = content.find("---", 3)
        if end_idx == -1:
            return (False, "❌ Invalid YAML frontmatter (missing closing ---)")

        yaml_content = content[3:end_idx].strip()
        frontmatter = yaml.safe_load(yaml_content)

        if not frontmatter:
            return (False, "❌ Empty YAML frontmatter")

        if 'name' not in frontmatter:
            return (False, "❌ Missing 'name' field in YAML")

        if 'description' not in frontmatter:
            return (False, "❌ Missing 'description' field in YAML")

        # Check description length
        if len(frontmatter['description']) > 1024:
            return (False, f"⚠️ Description too long ({len(frontmatter['description'])} chars, max 1024)")

        # Check name format
        name = frontmatter['name']
        if ' ' in name or name != name.lower():
            return (False, f"⚠️ Name should be lowercase and hyphenated: '{name}'")

        return (True, "✅ PASS - Basic structure valid")

    except Exception as e:
        return (False, f"❌ Invalid YAML frontmatter: {str(e)}")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Validate skill quality",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python validate_skill.py . --mode quick
  python validate_skill.py path/to/skill --mode full
  python validate_skill.py . --mode full --json --min-score 95
        """
    )

    parser.add_argument("skill_path", help="Path to SKILL.md or skill directory")
    parser.add_argument("--mode", choices=["quick", "full"], default="full",
                       help="Validation mode: quick (format check) or full (0-100 scoring)")
    parser.add_argument("--min-score", type=int, default=95,
                       help="Minimum acceptable score for full mode (default: 95)")
    parser.add_argument("--json", action="store_true",
                       help="Output in JSON format")

    args = parser.parse_args()

    skill_path = Path(args.skill_path)

    try:
        if args.mode == "quick":
            passed, message = validate_quick(skill_path)

            if args.json:
                print(json.dumps({"passed": passed, "message": message}))
            else:
                print(message)

            sys.exit(0 if passed else 1)

        else:  # full mode
            scorer = SkillScorer(skill_path)
            result = scorer.score()

            if args.json:
                print(json.dumps(result, indent=2))
            else:
                print(f"\n📊 Skill Quality Score: {result['score']}/100")
                print(f"\n{'='*60}")
                print(f"Structure:      {result['breakdown']['structure']}/20")
                print(f"Activation:     {result['breakdown']['activation']}/20")
                print(f"Content:        {result['breakdown']['content']}/25")
                print(f"Actionability:  {result['breakdown']['actionability']}/20")
                print(f"Reusability:    {result['breakdown']['reusability']}/15")
                print(f"{'='*60}")
                print(f"TOTAL:          {result['score']}/100")

                if result['passed']:
                    print(f"\n✅ PASSED (score >= {args.min_score})")
                else:
                    print(f"\n❌ FAILED (score < {args.min_score})")

                if result['issues']:
                    print(f"\n⚠️ Issues Found:")
                    for issue in result['issues']:
                        print(f"   - {issue}")

                if result['suggestions']:
                    print(f"\n💡 Suggestions:")
                    for suggestion in result['suggestions']:
                        print(f"   {suggestion}")

            sys.exit(0 if result['passed'] else 1)

    except FileNotFoundError as e:
        print(f"❌ Error: {e}")
        sys.exit(2)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(3)


if __name__ == "__main__":
    main()
