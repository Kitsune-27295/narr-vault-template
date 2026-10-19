#!/usr/bin/env python3
"""Rebuild 00_Atlas/ATL-Home.md from the notes on disk, so the hub never drifts.

Every sub-folder of 02_Story_Bible becomes a section; arcs, events, baselines, decisions and
ledgers follow. Nothing is hand-listed.

Usage: python tools/build_atlas.py
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def title(p: Path) -> str:
    m = re.search(r'^title:\s*"?(.*?)"?\s*$', p.read_text(encoding="utf-8"), re.M)
    return (m.group(1) if m else p.stem).replace("|", "/")


def group(label: str, folder: Path) -> str:
    items = sorted(folder.glob("*.md")) if folder.is_dir() else []
    if not items:
        return ""
    return "\n".join([f"## {label}"] + [f"- [[{p.stem}|{title(p)}]]" for p in items])


def main() -> int:
    bible = ROOT / "02_Story_Bible"
    parts = ['---\nuid: "ATL-Home"\ntype: atlas\ntitle: "Story Bible Master Atlas"\nstatus: active\n---\n# Story Bible Master Atlas\n']
    if bible.is_dir():
        for folder in sorted(p for p in bible.iterdir() if p.is_dir()):
            parts.append(group(folder.name.replace("_", " "), folder))
    parts.append(group("Arcs", ROOT / "03_Continuity_and_Timeline" / "Arcs"))
    parts.append(group("Events", ROOT / "03_Continuity_and_Timeline" / "Events"))
    parts.append(group("Points of Divergence", ROOT / "01_Canon_and_Divergence" / "PODs"))
    parts.append(group("Canon Baselines", ROOT / "01_Canon_and_Divergence" / "Baselines"))
    parts.append(group("Decisions", ROOT / "memory" / "decisions"))
    parts.append(group("Ledgers", ROOT / "08_Ledgers"))
    out = ROOT / "00_Atlas" / "ATL-Home.md"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n\n".join(x for x in parts if x) + "\n", encoding="utf-8", newline="\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
