#!/usr/bin/env python3
"""
Pattern Extraction Tool - Auto-extract code examples from project codebase.

Usage:
    python extract_patterns.py --domain viewsets --output-dir examples/
    python extract_patterns.py --domain services --codebase-path apps/
    python extract_patterns.py --domain tests --format markdown
"""

import argparse
import ast
import re
import sys
from pathlib import Path
from typing import Optional, List, Dict
from dataclasses import dataclass


@dataclass
class CodeExample:
    """Represents an extracted code example."""
    title: str
    description: str
    file_path: str
    line_start: int
    line_end: int
    code: str
    has_violation: bool = False
    violation_type: str = ""
    correct_alternative: str = ""


class PatternExtractor:
    """Extract patterns from Django/DRF codebase."""

    def __init__(self, codebase_path: Path):
        self.codebase_path = codebase_path
        self.examples: List[CodeExample] = []

    def extract_viewsets(self) -> List[CodeExample]:
        """Extract ViewSet patterns."""
        examples = []

        for file in self.codebase_path.glob('apps/*/views/*.py'):
            try:
                content = file.read_text()
                tree = ast.parse(content)
                lines = content.split('\n')

                for node in ast.walk(tree):
                    if isinstance(node, ast.ClassDef):
                        # Check if it's a ViewSet
                        bases = [base.id for base in node.bases if isinstance(base, ast.Name)]
                        if any(base in ['ViewSet', 'ModelViewSet', 'ReadOnlyModelViewSet'] for base in bases):
                            # Extract class code
                            start_line = node.lineno - 1
                            end_line = node.end_lineno if hasattr(node, 'end_lineno') else start_line + 20
                            code = '\n'.join(lines[start_line:end_line])

                            # Check for violations (business logic in views)
                            has_violation = self._detect_viewset_violations(node, lines)

                            example = CodeExample(
                                title=f"ViewSet: {node.name}",
                                description=f"{'❌ VIOLATION' if has_violation else '✅ CORRECT'}: ViewSet with {'business logic' if has_violation else 'service delegation'}",
                                file_path=str(file.relative_to(self.codebase_path)),
                                line_start=start_line + 1,
                                line_end=end_line,
                                code=code,
                                has_violation=has_violation,
                                violation_type="Business logic in view" if has_violation else ""
                            )
                            examples.append(example)

            except Exception as e:
                print(f"⚠️ Error processing {file}: {e}")
                continue

        return examples

    def extract_services(self) -> List[CodeExample]:
        """Extract Service layer patterns."""
        examples = []

        for file in self.codebase_path.glob('apps/*/services.py'):
            try:
                content = file.read_text()
                tree = ast.parse(content)
                lines = content.split('\n')

                for node in ast.walk(tree):
                    if isinstance(node, ast.ClassDef):
                        # Check if it's a Service class
                        if 'Service' in node.name:
                            # Extract first 1-2 methods as example
                            methods = [n for n in node.body if isinstance(n, ast.FunctionDef)]
                            if methods:
                                method = methods[0]
                                start_line = method.lineno - 1
                                end_line = method.end_lineno if hasattr(method, 'end_lineno') else start_line + 15

                                code = '\n'.join(lines[start_line:end_line])

                                # Check for type hints
                                has_type_hints = self._has_type_hints(method)

                                example = CodeExample(
                                    title=f"Service: {node.name}.{method.name}()",
                                    description=f"{'✅ CORRECT' if has_type_hints else '❌ VIOLATION'}: Service method {'with' if has_type_hints else 'without'} type hints",
                                    file_path=str(file.relative_to(self.codebase_path)),
                                    line_start=start_line + 1,
                                    line_end=end_line,
                                    code=code,
                                    has_violation=not has_type_hints,
                                    violation_type="Missing type hints" if not has_type_hints else ""
                                )
                                examples.append(example)

            except Exception as e:
                print(f"⚠️ Error processing {file}: {e}")
                continue

        return examples

    def extract_models(self) -> List[CodeExample]:
        """Extract Model patterns (especially multi-tenant)."""
        examples = []

        for file in self.codebase_path.glob('apps/*/models/*.py'):
            try:
                content = file.read_text()
                tree = ast.parse(content)
                lines = content.split('\n')

                for node in ast.walk(tree):
                    if isinstance(node, ast.ClassDef):
                        # Check if inherits from TenantAwareModel
                        bases = [base.id if isinstance(base, ast.Name) else base.attr if isinstance(base, ast.Attribute) else '' for base in node.bases]
                        is_multi_tenant = 'TenantAwareModel' in bases

                        if is_multi_tenant or 'Model' in bases:
                            start_line = node.lineno - 1
                            end_line = min(node.end_lineno if hasattr(node, 'end_lineno') else start_line + 30, start_line + 30)
                            code = '\n'.join(lines[start_line:end_line])

                            example = CodeExample(
                                title=f"Model: {node.name}",
                                description=f"{'✅ CORRECT' if is_multi_tenant else 'ℹ️ INFO'}: {'Multi-tenant model' if is_multi_tenant else 'Standard model'}",
                                file_path=str(file.relative_to(self.codebase_path)),
                                line_start=start_line + 1,
                                line_end=end_line,
                                code=code,
                                has_violation=False
                            )
                            examples.append(example)

            except Exception as e:
                print(f"⚠️ Error processing {file}: {e}")
                continue

        return examples

    def extract_serializers(self) -> List[CodeExample]:
        """Extract Serializer patterns (I/O separation)."""
        examples = []

        for file in self.codebase_path.glob('apps/*/serializers/*.py'):
            try:
                content = file.read_text()
                tree = ast.parse(content)
                lines = content.split('\n')

                for node in ast.walk(tree):
                    if isinstance(node, ast.ClassDef):
                        # Check if it's a Serializer
                        bases = [base.id if isinstance(base, ast.Name) else base.attr if isinstance(base, ast.Attribute) else '' for base in node.bases]
                        is_serializer = any('Serializer' in base for base in bases)

                        if is_serializer:
                            # Check for Input/Output separation
                            has_io_separation = 'Input' in node.name or 'Output' in node.name

                            start_line = node.lineno - 1
                            end_line = min(node.end_lineno if hasattr(node, 'end_lineno') else start_line + 25, start_line + 25)
                            code = '\n'.join(lines[start_line:end_line])

                            example = CodeExample(
                                title=f"Serializer: {node.name}",
                                description=f"{'✅ CORRECT' if has_io_separation else '❌ VIOLATION'}: {'I/O separated' if has_io_separation else 'Single serializer (should split)'}",
                                file_path=str(file.relative_to(self.codebase_path)),
                                line_start=start_line + 1,
                                line_end=end_line,
                                code=code,
                                has_violation=not has_io_separation,
                                violation_type="Missing I/O separation" if not has_io_separation else ""
                            )
                            examples.append(example)

            except Exception as e:
                print(f"⚠️ Error processing {file}: {e}")
                continue

        return examples

    def extract_tests(self) -> List[CodeExample]:
        """Extract pytest patterns (AAA pattern)."""
        examples = []

        for file in self.codebase_path.glob('apps/*/tests/*_tests.py'):
            try:
                content = file.read_text()
                tree = ast.parse(content)
                lines = content.split('\n')

                for node in ast.walk(tree):
                    if isinstance(node, ast.FunctionDef):
                        # Check if it's a test function
                        if node.name.startswith('test_'):
                            start_line = node.lineno - 1
                            end_line = min(node.end_lineno if hasattr(node, 'end_lineno') else start_line + 20, start_line + 20)
                            code = '\n'.join(lines[start_line:end_line])

                            # Check for AAA pattern (blank lines separate sections)
                            blank_lines = sum(1 for i in range(start_line, end_line) if lines[i].strip() == '')
                            has_aaa = blank_lines >= 2

                            # Check for mocker usage
                            uses_mocker = 'mocker' in code

                            example = CodeExample(
                                title=f"Test: {node.name}",
                                description=f"{'✅ CORRECT' if has_aaa else '❌ VIOLATION'}: Test {'with' if has_aaa else 'without'} AAA pattern{', uses mocker' if uses_mocker else ''}",
                                file_path=str(file.relative_to(self.codebase_path)),
                                line_start=start_line + 1,
                                line_end=end_line,
                                code=code,
                                has_violation=not has_aaa,
                                violation_type="Missing AAA structure" if not has_aaa else ""
                            )
                            examples.append(example)
                            break  # Only take first test from each file

            except Exception as e:
                print(f"⚠️ Error processing {file}: {e}")
                continue

        return examples

    def _detect_viewset_violations(self, node: ast.ClassDef, lines: List[str]) -> bool:
        """Detect business logic in ViewSet methods."""
        for method in node.body:
            if isinstance(method, ast.FunctionDef):
                # Check for business logic indicators
                for stmt in ast.walk(method):
                    # If statements with calculations (business logic)
                    if isinstance(stmt, ast.If):
                        return True
                    # Save operations directly (should delegate to service)
                    if isinstance(stmt, ast.Call):
                        if isinstance(stmt.func, ast.Attribute):
                            if stmt.func.attr in ['save', 'update', 'create', 'delete']:
                                # Check if it's not delegated to service
                                method_lines = lines[method.lineno-1:method.end_lineno] if method.end_lineno else []
                                if not any('Service' in line for line in method_lines):
                                    return True
        return False

    def _has_type_hints(self, func_node: ast.FunctionDef) -> bool:
        """Check if function has type hints."""
        # Check return annotation
        has_return = func_node.returns is not None

        # Check parameter annotations
        has_params = any(arg.annotation is not None for arg in func_node.args.args if arg.arg != 'self')

        return has_return or has_params

    def generate_markdown(self, examples: List[CodeExample], domain: str) -> str:
        """Generate markdown documentation from examples."""
        md = f"# {domain.title()} Pattern Examples\n\n"
        md += f"**Auto-extracted from codebase**\n"
        md += f"**Total examples**: {len(examples)}\n\n"
        md += "---\n\n"

        # Group by violation/correct
        correct = [e for e in examples if not e.has_violation]
        violations = [e for e in examples if e.has_violation]

        if violations:
            md += "## ❌ Anti-Patterns (Violations Found)\n\n"
            for example in violations[:5]:  # Limit to 5 examples
                md += f"### {example.title}\n\n"
                md += f"**File**: `{example.file_path}:{example.line_start}`\n"
                md += f"**Issue**: {example.violation_type}\n\n"
                md += "❌ **WRONG**:\n```python\n"
                md += example.code[:500] + ("..." if len(example.code) > 500 else "")  # Limit code length
                md += "\n```\n\n"
                md += "**Why it matters**: This violates best practices and should be refactored.\n\n"
                md += "---\n\n"

        if correct:
            md += "## ✅ Correct Patterns\n\n"
            for example in correct[:5]:  # Limit to 5 examples
                md += f"### {example.title}\n\n"
                md += f"**File**: `{example.file_path}:{example.line_start}`\n\n"
                md += "✅ **CORRECT**:\n```python\n"
                md += example.code[:500] + ("..." if len(example.code) > 500 else "")
                md += "\n```\n\n"
                md += "**Why it works**: Follows project patterns and best practices.\n\n"
                md += "---\n\n"

        return md


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Extract code patterns from Django/DRF codebase",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python extract_patterns.py --domain viewsets --output-dir examples/
  python extract_patterns.py --domain services --codebase-path apps/
  python extract_patterns.py --domain all --format markdown

Supported domains:
  viewsets    - ViewSets with service delegation
  services    - Service layer patterns
  models      - Model patterns (multi-tenant aware)
  serializers - Serializer I/O separation
  tests       - pytest AAA pattern
  all         - Extract all domains
        """
    )

    parser.add_argument("--domain",
                       choices=["viewsets", "services", "models", "serializers", "tests", "all"],
                       default="all",
                       help="Domain to extract patterns from")
    parser.add_argument("--codebase-path", default=".",
                       help="Path to codebase root (default: current directory)")
    parser.add_argument("--output-dir", default="examples",
                       help="Output directory for examples (default: examples/)")
    parser.add_argument("--format", choices=["markdown", "json"], default="markdown",
                       help="Output format")
    parser.add_argument("--max-examples", type=int, default=10,
                       help="Maximum examples per domain (default: 10)")

    args = parser.parse_args()

    codebase_path = Path(args.codebase_path)
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    if not codebase_path.exists():
        print(f"❌ Error: Codebase path not found: {codebase_path}")
        sys.exit(1)

    extractor = PatternExtractor(codebase_path)

    print(f"🔍 Extracting patterns from {codebase_path}...")

    domains_to_extract = []
    if args.domain == "all":
        domains_to_extract = ["viewsets", "services", "models", "serializers", "tests"]
    else:
        domains_to_extract = [args.domain]

    for domain in domains_to_extract:
        print(f"\n📦 Extracting {domain} patterns...")

        # Extract based on domain
        if domain == "viewsets":
            examples = extractor.extract_viewsets()
        elif domain == "services":
            examples = extractor.extract_services()
        elif domain == "models":
            examples = extractor.extract_models()
        elif domain == "serializers":
            examples = extractor.extract_serializers()
        elif domain == "tests":
            examples = extractor.extract_tests()
        else:
            continue

        if not examples:
            print(f"   ⚠️ No examples found for {domain}")
            continue

        # Limit examples
        examples = examples[:args.max_examples]

        print(f"   ✅ Found {len(examples)} examples")

        # Generate output
        if args.format == "markdown":
            markdown = extractor.generate_markdown(examples, domain)
            output_file = output_dir / f"{domain}_patterns.md"
            output_file.write_text(markdown)
            print(f"   📝 Saved to: {output_file}")
        else:
            # JSON output
            import json
            json_data = [
                {
                    "title": e.title,
                    "description": e.description,
                    "file": e.file_path,
                    "line": e.line_start,
                    "code": e.code,
                    "has_violation": e.has_violation
                }
                for e in examples
            ]
            output_file = output_dir / f"{domain}_patterns.json"
            output_file.write_text(json.dumps(json_data, indent=2))
            print(f"   📝 Saved to: {output_file}")

    print(f"\n✅ Pattern extraction complete!")
    print(f"\n📁 Output directory: {output_dir}")
    print(f"\n💡 Next steps:")
    print(f"   1. Review extracted examples in {output_dir}/")
    print(f"   2. Use examples to populate skill examples/ folder")
    print(f"   3. Generate ❌/✅ pairs from violations")

    sys.exit(0)


if __name__ == "__main__":
    main()