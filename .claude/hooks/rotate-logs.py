#!/usr/bin/env python3
"""
Hook: Rotate Claude Debug Logs

Rotates hook-debug.log when it exceeds 100KB to prevent disk bloat.
Can be called manually or scheduled.

Usage: python3 .claude/hooks/rotate-logs.py
"""

import os
import shutil
from pathlib import Path
from datetime import datetime

# Configuration
LOG_FILE = Path.home() / ".claude" / "hook-debug.log"
MAX_SIZE_KB = 100  # Rotate when exceeds 100KB
MAX_BACKUPS = 3    # Keep 3 backup files

def get_file_size_kb(path: Path) -> float:
    """Get file size in KB."""
    if path.exists():
        return path.stat().st_size / 1024
    return 0

def rotate_log():
    """Rotate log file if it exceeds MAX_SIZE_KB."""
    if not LOG_FILE.exists():
        print(f"Log file not found: {LOG_FILE}")
        return False

    size_kb = get_file_size_kb(LOG_FILE)

    if size_kb < MAX_SIZE_KB:
        print(f"Log size ({size_kb:.1f}KB) below threshold ({MAX_SIZE_KB}KB). No rotation needed.")
        return False

    print(f"Log size ({size_kb:.1f}KB) exceeds threshold ({MAX_SIZE_KB}KB). Rotating...")

    # Delete oldest backup if we have MAX_BACKUPS
    for i in range(MAX_BACKUPS, 0, -1):
        old_backup = LOG_FILE.with_suffix(f".log.{i}")
        new_backup = LOG_FILE.with_suffix(f".log.{i+1}")

        if i == MAX_BACKUPS and old_backup.exists():
            old_backup.unlink()
            print(f"Deleted oldest backup: {old_backup.name}")
        elif old_backup.exists():
            shutil.move(old_backup, new_backup)
            print(f"Moved {old_backup.name} -> {new_backup.name}")

    # Move current log to .log.1
    backup_path = LOG_FILE.with_suffix(".log.1")
    shutil.move(LOG_FILE, backup_path)
    print(f"Moved {LOG_FILE.name} -> {backup_path.name}")

    # Create new empty log
    LOG_FILE.touch()
    print(f"Created new empty log: {LOG_FILE.name}")

    return True

def show_status():
    """Show current log status."""
    print("\n=== Log Status ===")
    print(f"Log file: {LOG_FILE}")
    print(f"Size: {get_file_size_kb(LOG_FILE):.1f}KB")
    print(f"Threshold: {MAX_SIZE_KB}KB")

    backups = list(LOG_FILE.parent.glob("hook-debug.log.*"))
    if backups:
        print(f"Backups: {len(backups)}")
        for b in sorted(backups):
            print(f"  - {b.name}: {get_file_size_kb(b):.1f}KB")

if __name__ == "__main__":
    rotated = rotate_log()
    show_status()

    if rotated:
        print("\n✅ Log rotated successfully")
    else:
        print("\n✅ No rotation needed")
