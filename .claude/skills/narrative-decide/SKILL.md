---
name: narrative-decide
description: Record or supersede architectural and narrative choices (ADRs) in memory/decisions/ with context, alternatives, and consequences.
---
# Record a Narrative or Architectural Decision

Use when making or revisiting a choice that affects worldbuilding, plot branches, retcons, or system conventions ("let's adopt X", "we decided Y").

## Workflow
1. **Search Existing Decisions:**
   ```bash
   narr search "<choice>" --type decision
   ```
   If a decision on the same question exists, this new decision will **supersede** it.
2. **Scaffold the Decision:**
   ```bash
   narr decide "<Decision Title>" [--supersedes DEC-<old_slug>]
   ```
   Creates `memory/decisions/DEC-<slug>.md` with `status: proposed`.
3. **Document Core Sections:**
   - **Contexto e Motivação:** What forced this choice.
   - **Decisão Tomada:** One unambiguous declarative sentence.
   - **Consequências:** What gets easier, what gets harder, what is now immutable.
   - **Alternativas Rejeitadas:** Each alternative considered and why it lost.
4. **Author Sign-Off:**
   Ask the curator: *"Approve this decision, or adjust?"* On approval, change `status: accepted`.
5. **Supersede, Never Delete:**
   Replaced decisions receive `status: superseded` with `superseded_by: [[DEC-New]]`.
6. **Lint:**
   ```bash
   narr lint
   ```
