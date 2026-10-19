#!/usr/bin/env python3
"""Deterministic vault guard that delegates to `narr.checks`.
Fails on invariant, ontological, structural, or continuity errors.

Usage:
    python tools/vault_audit.py            # errors fail (exit 1), warnings print
    python tools/vault_audit.py --warn     # also list warnings in full
"""

from __future__ import annotations

import sys
from collections import defaultdict
from pathlib import Path

# Add src to sys.path if narr is not installed in the active environment
_REPO_ROOT = Path(__file__).resolve().parent.parent.parent
_SRC_DIR = _REPO_ROOT / "src"
if _SRC_DIR.is_dir() and str(_SRC_DIR) not in sys.path:
    sys.path.insert(0, str(_SRC_DIR))

from narr.checks import run_all_checks  # noqa: E402
from narr.vault import Vault  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent


def main() -> int:
    vault = Vault.find(ROOT)
    findings = run_all_checks(vault)

    errors: dict[str, list[str]] = defaultdict(list)
    warnings: dict[str, list[str]] = defaultdict(list)

    for f in findings:
        if f.severity == "error":
            errors[f.code].append(f"{f.path}: {f.message}")
        else:
            warnings[f.code].append(f"{f.path}: {f.message}")

    show_all = "--warn" in sys.argv
    for title, bag in (("ERROR", errors), ("WARN", warnings)):
        for k in sorted(bag):
            print(f"[{title}] {k} ({len(bag[k])})")
            for m in bag[k][: (None if title == "ERROR" or show_all else 3)]:
                print("   ", m)

    total_errors = sum(len(v) for v in errors.values())
    total_warnings = sum(len(v) for v in warnings.values())
    print(f"\nvault_audit: {total_errors} error(s), {total_warnings} warning(s)")
    return 1 if total_errors else 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.exit(main())
