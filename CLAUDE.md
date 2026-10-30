@AGENTS.md

# Claude Code delta

Everything shared is in `AGENTS.md` (cold-start order, zones, CLI gates) and `.agents/rules/`.
Only what is specific to Claude Code lives here:

- `.claude/skills/` and `.claude/rules/` are **generated mirrors** of `.agents/`; edit `.agents/`, then run `narr hook install`.
- `.claude/settings.json` holds the generated PreToolUse/SessionStart/Stop hooks (`narr hook run ...`) and deny rules for frozen sources.
- Before finishing a task, `narr lint` and `python tools/vault_audit.py` must exit 0.

## Agent skills

### Issue tracker

Local markdown files under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context layout. See `docs/agents/domain.md`.
