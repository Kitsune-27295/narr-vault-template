# CLAUDE.md

@AGENTS.md

`AGENTS.md` is the single operating contract for every agent in this repository, Claude Code included. This file only adds what is specific to Claude Code, so nothing is maintained twice.

## Claude Code specifics

- Repository-owned skills live in `.agents/skills/`; the lifecycle and handoffs are in `docs/agents/native-construction-workflow.md`.
- Before delivery run `npm test`; add `npm run check:agents`, `validate:links`, `validate:templates` or `validate:workflow` when the touched contract requires it.
- Do not commit, push or publish unless asked or authorized by the applicable workflow.
