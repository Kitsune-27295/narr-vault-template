---
note_type: memory
title: Operational Learnings
uid: MEM-LEARNINGS
status: active
aliases:
  - learnings
  - MEM-LEARNINGS
tags:
  - '#memory/learning'
created: '2026-11-02'
updated: '2026-11-02'
---

# Operational Learnings

Durable observations that change how future sessions act. Capped at 10 KB. Append; do not duplicate what the repository already records.

## Toolchain & Runtime
- **Node.js ESM and SQLite:** the toolchain uses `node:sqlite` (FTS5) for retrieval; no external vector database or Python bridge is needed.
- **Windows PowerShell:** if `.ps1` execution is disabled, invoke `npm.cmd` instead of `npm`.

## Information Architecture
- **Single source of truth:** story parameters, tier requirements, and thresholds live in `vault.yaml`.
- **Upstream sandbox isolation:** experiments stay in `Sandbox/` with an auditable `_registry.md`; the vault never links into it.
- **Foreshadowing via ledgers:** every plant is tracked in `Ledgers/LDG-Chekhov.md` with plant and payoff targets.
- **SNIA properties:** every live note carries `note_type`, `title`, `uid`, `status`, `aliases`, `tags`, `created`, `updated`.
