@AGENTS.md

# Antigravity / Gemini delta

Antigravity reads `AGENTS.md` and `.agents/rules/` directly; this file only adds what is specific to it:

- `.agents/` is the canonical home of skills and rules (`.claude/` is generated from it by `narr hook install`).
- `.agents/hooks.json` wires the same `narr hook run ...` gate as Claude Code (PreToolUse deny/ask).
- Before finishing a task, `narr lint` and `python tools/vault_audit.py` must exit 0.

## Agent skills

### Issue tracker

Local markdown files under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context layout ([[TRM-Termbase]] and `memory/decisions/`). See `docs/agents/domain.md`.
