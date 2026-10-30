#!/usr/bin/env python3
"""Deterministic vault guard that runs the narr-fiction linter (same checks as `narr lint`).
Fails on invariant, ontological, structural, or continuity errors.

Usage:
    python tools/vault_audit.py            # errors fail (exit 1), warnings print
    python tools/vault_audit.py --warn     # also list warnings in full
"""

from __future__ import annotations

import sys
from collections import defaultdict
from pathlib import Path

from framework_core.linter.checks import CORE_CHECKS
from framework_core.linter.engine import LinterRegistry
from narr_fiction.checks import NARR_CHECKS
from narr_fiction.vault import NarrVault

ROOT = Path(__file__).resolve().parent.parent


def main() -> int:
    registry = LinterRegistry()
    for check in [*CORE_CHECKS, *NARR_CHECKS]:
        registry.register(check)
    report = registry.run(NarrVault(ROOT))

    errors: dict[str, list[str]] = defaultdict(list)
    warnings: dict[str, list[str]] = defaultdict(list)
    for diag in report.diagnostics:
        bag = errors if str(diag.severity).lower() == "error" else warnings
        bag[diag.code].append(f"{diag.path or '-'}: {diag.message}")

    show_all = "--warn" in sys.argv
    for title, bag in (("ERROR", errors), ("WARN", warnings)):
        for code in sorted(bag):
            print(f"[{title}] {code} ({len(bag[code])})")
            for msg in bag[code][: (None if title == "ERROR" or show_all else 3)]:
                print("   ", msg)

    total_errors = sum(len(v) for v in errors.values())
    total_warnings = sum(len(v) for v in warnings.values())
    print(f"\nvault_audit: {total_errors} error(s), {total_warnings} warning(s)")
    return 1 if total_errors else 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")  # type: ignore[union-attr]
    sys.exit(main())
