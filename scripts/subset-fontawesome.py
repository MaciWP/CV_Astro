#!/usr/bin/env python3
"""
Font Awesome Subset Script
Creates minimal Font Awesome font files containing only the icons used in the project.
Reduces font file sizes from ~250KB to ~20KB.
"""

import subprocess
import sys
from pathlib import Path

# Font Awesome 5 Free - Solid icons used in the project
# Format: icon-name: unicode-codepoint
SOLID_ICONS = {
    'arrow-up': 'f062',
    'bolt': 'f0e7',
    'brain': 'f5dc',          # ONNX
    'briefcase': 'f0b1',
    'building': 'f1ad',
    'calculator': 'f1ec',     # NumPy/Pelusas
    'calendar-alt': 'f073',
    'check': 'f00c',
    'chevron-down': 'f078',
    'chevron-up': 'f077',
    'cloud': 'f0c2',              # VMware/virtualization
    'code': 'f121',
    'code-branch': 'f126',
    'cogs': 'f085',
    'cube': 'f1b2',
    'cubes': 'f1b3',
    'database': 'f1c0',
    'desktop': 'f108',
    'download': 'f019',
    'edit': 'f044',
    'envelope': 'f0e0',       # Email/contact
    'exchange-alt': 'f362',
    'envelope-open-text': 'f658',
    'file-alt': 'f15c',
    'file-code': 'f1c9',
    'flask': 'f0c3',
    'globe': 'f0ac',          # PWA/i18n
    'graduation-cap': 'f19d',
    'i-cursor': 'f246',
    'id-card': 'f2c2',
    'key': 'f084',
    'language': 'f1ab',
    'map-marked': 'f59f',
    'mobile-alt': 'f3cd',
    'network-wired': 'f6ff',
    'paper-plane': 'f1d8',
    'plug': 'f1e6',
    'project-diagram': 'f542',
    'puzzle-piece': 'f12e',
    'question-circle': 'f059',
    'rocket': 'f135',
    'search': 'f002',
    'server': 'f233',
    'sun': 'f185',            # Theme toggle
    'sync-alt': 'f2f1',
    'table': 'f0ce',
    'tags': 'f02c',           # NFC Assets Manager
    'tasks': 'f0ae',
    'tools': 'f7d9',
    'trophy': 'f091',
    'tv': 'f26c',
    'vial': 'f492',
    'wifi': 'f1eb',
}

# Font Awesome 5 Brands icons used in the project
BRAND_ICONS = {
    'aws': 'f375',
    'css3-alt': 'f38b',
    'docker': 'f395',
    'git-alt': 'f841',
    'github': 'f09b',
    'html5': 'f13b',
    'java': 'f4e4',
    'js': 'f3b8',
    'linkedin': 'f08c',
    'microsoft': 'f3ca',
    'python': 'f3e2',
    'react': 'f41b',
    'vmware': 'f78f',
    'windows': 'f17a',
}

def get_pyftsubset_path():
    """Find pyftsubset executable."""
    # Try common locations
    paths = [
        Path(sys.executable).parent / 'Scripts' / 'pyftsubset.exe',
        Path.home() / 'AppData' / 'Roaming' / 'Python' / 'Python313' / 'Scripts' / 'pyftsubset.exe',
        Path.home() / 'AppData' / 'Local' / 'Programs' / 'Python' / 'Python313' / 'Scripts' / 'pyftsubset.exe',
    ]
    for p in paths:
        if p.exists():
            return str(p)
    # Fallback to calling via python -m
    return None

def subset_font(input_path, output_path, unicodes, pyftsubset_path=None):
    """Create a subset font file with only the specified glyphs."""
    if not Path(input_path).exists():
        print(f"Error: Input font not found: {input_path}")
        return False

    # Build unicode range string
    unicode_str = ','.join([f'U+{u}' for u in unicodes])

    if pyftsubset_path:
        cmd = [
            pyftsubset_path,
            str(input_path),
            f'--unicodes={unicode_str}',
            f'--output-file={output_path}',
            '--flavor=woff2',
            '--layout-features=*',
            '--no-hinting',
            '--desubroutinize',
        ]
    else:
        cmd = [
            sys.executable, '-m', 'fontTools.subset',
            str(input_path),
            f'--unicodes={unicode_str}',
            f'--output-file={output_path}',
            '--flavor=woff2',
            '--layout-features=*',
            '--no-hinting',
            '--desubroutinize',
        ]

    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"Error subsetting {input_path}:")
            print(result.stderr)
            return False
        return True
    except Exception as e:
        print(f"Exception: {e}")
        return False

def main():
    project_root = Path(__file__).parent.parent
    fonts_dir = project_root / 'public' / 'styles' / 'fonts'

    pyftsubset_path = get_pyftsubset_path()
    print(f"Using pyftsubset: {pyftsubset_path or 'via python -m'}")

    # Subset solid font
    solid_input = fonts_dir / 'fa-solid-900-original.woff2'
    solid_output = fonts_dir / 'fa-solid-900.woff2'
    solid_unicodes = list(SOLID_ICONS.values())

    print(f"\nSubsetting solid font ({len(solid_unicodes)} icons)...")
    if subset_font(solid_input, solid_output, solid_unicodes, pyftsubset_path):
        orig_size = solid_input.stat().st_size / 1024
        new_size = solid_output.stat().st_size / 1024
        print(f"  Original: {orig_size:.1f} KB")
        print(f"  Subset:   {new_size:.1f} KB")
        print(f"  Saved:    {orig_size - new_size:.1f} KB ({(1 - new_size/orig_size) * 100:.1f}%)")

    # Subset brands font
    brands_input = fonts_dir / 'fa-brands-400-original.woff2'
    brands_output = fonts_dir / 'fa-brands-400.woff2'
    brand_unicodes = list(BRAND_ICONS.values())

    print(f"\nSubsetting brands font ({len(brand_unicodes)} icons)...")
    if subset_font(brands_input, brands_output, brand_unicodes, pyftsubset_path):
        orig_size = brands_input.stat().st_size / 1024
        new_size = brands_output.stat().st_size / 1024
        print(f"  Original: {orig_size:.1f} KB")
        print(f"  Subset:   {new_size:.1f} KB")
        print(f"  Saved:    {orig_size - new_size:.1f} KB ({(1 - new_size/orig_size) * 100:.1f}%)")

    print("\n" + "="*50)
    print("NEXT STEPS:")
    print("1. Rename subset files to replace originals:")
    print(f"   - {solid_output.name} -> {solid_input.name}")
    print(f"   - {brands_output.name} -> {brands_input.name}")
    print("2. Or update Layout.astro to use the subset files")
    print("="*50)

if __name__ == '__main__':
    main()
