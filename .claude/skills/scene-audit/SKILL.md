---
name: scene-audit
description: "Diagnose whether a scene turns, using the five commandments (inciting incident, turning point, crisis, climax, resolution) and the scene-and-sequel rhythm; review only, no prose edits. Use when a drafted scene feels flat, stalls the plot or its purpose is unclear."
---
# scene-audit

Use this skill to diagnose one scene or one chapter. It reads and reports; it never edits prose (Rule 20). Craft sources are credited in `05_Craft_and_Feedback/Checklists/CKL-Craft_Sources.md`; the wording here is the framework's own.

## Pre-audit gates
1. Run `narr lint --path 04_Manuscript` and note rhythm, openers and filter density (STY001-STY005); they are signals, not verdicts.
2. Read the chapter's `<!-- p:N -->` paragraphs. Every finding must cite a paragraph marker.
3. Read the POV character's dossier and the arc beat the chapter serves.

## Step 1: Find the five commandments
For each scene, write one line per commandment and cite the paragraphs that carry it. If one is missing, say so.
1. **Inciting incident:** the event that upsets the scene's starting balance. Is it caused by someone's choice or by chance?
2. **Turning point:** the moment the value at stake (safety, trust, hope, status) flips polarity.
3. **Crisis:** the decision the POV character must make. A strong crisis is a best bad choice or a choice between two goods that cannot both be had, and it is visible on the page.
4. **Climax:** the action that answers the crisis. Does the character act, or does something happen to them?
5. **Resolution:** what changed, and what it costs. Is the new state different from the opening state?

## Step 2: Classify the scene
- **Scene:** a goal, opposition, and an outcome (yes, no, yes-but, no-and). Name all three.
- **Sequel:** the reaction that follows an outcome: feeling, thinking, then a decision that sets the next goal. Name the decision.
- A healthy chapter alternates the two. Several scenes in a row without a sequel overheat; several sequels in a row stall.

## Step 3: Look for the six common failures
Report each that applies, with its paragraph:
1. No change in the value at stake from start to end.
2. The crisis is decided for the character (no real choice).
3. The climax is explained instead of dramatised.
4. The resolution is missing, so the next scene starts from nothing.
5. Too many turning points compete in one scene.
6. The scene exists only to deliver information.

## Step 4: Report
Use this fixed block, then stop:
```text
Scene: <title or p-range>
Commandments: inciting p:_, turn p:_, crisis p:_, climax p:_, resolution p:_
Type: scene | sequel   Outcome: yes | no | yes-but | no-and
Value shift: <value>: <from> -> <to>
Failures: <numbers from Step 3, or none>
One-sentence synthesis: <who wants what, what stops them, what changes>
```
Offer fixes as questions to the curator, never as rewritten prose. For a full-chapter pass, repeat per scene and finish with the chapter's sequel-to-scene balance.

## Related gates
`narr lint --path 04_Manuscript`, `python tools/vault_audit.py`. Use `reader-sim` for attention, `revision-pass` to plan edits, `narrative-architecture-audit` for arc-level structure.
