# Claude Code Instructions

This repository is governed strictly by the LLM Operating Contract in [@AGENTS.md](AGENTS.md).
Before executing any write or analysis, perform the cold-start sequence specified in AGENTS.md:
1. Read `vault.yaml`
2. Read `AGENTS.md`
3. Read `CONVENTIONS.md`
4. Read `context/author_voice.md`
5. Read `memory/hot.md`
6. Read `08_Ledgers/LDG-Session_Handoff.md`

All operations must adhere to:
- Zero-space filenames (Rule 10)
- Literal quote verification `*"..."*` against frozen sources (Rule 30)
- Strict non-manuscript technical writing style (Rule 15)
- Termbase consistency in translations (Rule 20)
- `narr lint` and `narr crosscheck` must exit 0 before completing tasks.

## Agent skills

### Issue tracker

Local markdown files under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context layout. See `docs/agents/domain.md`.

