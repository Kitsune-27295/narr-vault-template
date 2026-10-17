---
name: session-wrapup
description: Close a working session, record daily journal, trim working memory (hot.md <= 60 lines), update handoff ledger, and log lessons.
---
# Session Wrapup Routine

Use when the session is ending, the author says "wrap up", "salvar sessão", or before a major pause in work.

## Workflow
1. **Journal:**
   Append to `memory/journal/YYYY/YYYY-MM-DD.md` (create if needed with `type: journal`):
   - What happened this session.
   - What was created, modified, or discovered.
   - Immediate next action for next session.
2. **Decisions:**
   Ensure every key decision made has a formal record via `narr decide`.
3. **Lessons:**
   Append any hard-learned lesson or recurring friction to `memory/lessons.md`.
4. **Trim Working Memory (`memory/hot.md`):**
   Rewrite `memory/hot.md` to hold only active in-flight items.
   **Hard Budget: Must remain <= 60 lines.** Completed items move to the journal.
5. **Update Handoff Ledger:**
   ```bash
   narr session close --done "<summary>" --next "<next priority>" --decided "<key choices>"
   ```
6. **Verify:**
   ```bash
   narr lint
   ```
