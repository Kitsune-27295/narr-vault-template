---
name: revision-pass
description: "Plan and run a revision in three scales (structure, scene, line) with a defect list first, curator approval second and prose edits last, each pass ending in a gate. Use when a draft chapter must be revised and the changes need an order, an approval point and a way to verify them."
---
# revision-pass

Use this skill to revise without making things worse. Prose is changed only after a written defect list and the curator's approval (Rule 20.3). Craft sources are credited in `05_Craft_and_Feedback/Checklists/CKL-Craft_Sources.md`.

## The rule of order
Work from the largest scale to the smallest. Fixing sentences in a scene that will be cut wastes effort.
1. **Structure:** does the chapter serve its arc beat, and do its promises line up with the ledgers? Tools: `narrative-architecture-audit`, `foreshadowing-audit`, `narr crosscheck`.
2. **Scene:** does each scene turn? Tools: `scene-audit`, `reader-sim`.
3. **Line:** rhythm, filter words, repeated openers, stock phrases, voice. Tools: `narr stats <N>`, `narr lint --path 04_Manuscript`, `tone-and-voice-audit`.

## Protocol for each scale
1. **Review.** Run the tools for that scale. Write a numbered defect list; each item quotes the paragraph marker and states the problem in one sentence. No fixes yet.
2. **Triage.** Mark each defect must-fix, should-fix or leave. Explain any "leave".
3. **Approval.** Show the list to the curator. Do not edit until the curator approves the items to change.
4. **Refactor.** Change only the approved items. Keep every `<!-- p:N -->` marker and its order. One defect, one change.
5. **Reversion test.** For each change ask: if I put the old text back, does the passage get worse? If not, undo the change.
6. **Gate.** Run `narr prompt validate write-chapter <file>`, `narr lint --path <file>` and, if a translation exists, `narr translate check <N>`. Stop the scale until they pass.

## Bounded loop
At most three review-refactor rounds per scale. If a defect survives round three, record it in `08_Ledgers/LDG-Contradictions.md` or as a decision with `narr decide` and move on.

## Output
After the last scale, append one handoff line: what changed, what was left, which defects remain. Never claim the chapter is "improved"; report which gates now pass.
