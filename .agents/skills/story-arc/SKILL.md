---
name: story-arc
description: "Structure and track narrative arcs: choose an arc type, write the lie and the truth, place the beats with but-therefore connectors and prove the change on the page. Use when an arc needs a beat sheet, a dramatic spine, progress tracking or a check that its beats connect."
---
# story-arc

Use this skill to plan or restructure an arc in `03_Continuity_and_Timeline/Arcs/`. The method is the framework's own distillation of widely taught arc craft; sources are credited in `05_Craft_and_Feedback/Checklists/CKL-Craft_Sources.md`.

## Workflow
1. Scaffold the arc: `narr new arc "<Arc Title>"`.
2. **Choose the arc type** for the POV character and write it in the arc page:
   - **Positive change:** the character replaces a false belief with a truth.
   - **Flat:** the character already holds the truth and changes the world around them.
   - **Negative (fall, disillusion or corruption):** the character abandons a truth or embraces a deeper lie.
3. **Write the spine in five lines:** the *lie* the character believes, the *truth* that would free them, what they *want* (outer goal), what they *need* (inner truth) and the *ghost* (the past event that keeps the lie alive).
4. **Place the beats** in the arc's beat table with a target chapter for each, in order: hook, first plot point, first pinch, midpoint, second pinch, second plot point, climax, resolution. Chapters must exist or be planned and must increase down the table.
5. **Connect the beats.** Between every pair of beats write the connector word: *but* (an obstacle reverses the plan) or *therefore* (a consequence follows). Rewrite any *and then* link.
6. **Prove the change.** Name the chapter that shows the character before the change and the chapter that shows them after, with the same situation seen twice.
7. **Tie to the ledgers.** Register promises in `LDG-Foreshadowing.md` and open threads in `LDG-Active_Threads.md`. A lie planted late or a truth with no earlier hint is a promise problem; run `narr crosscheck`.
8. Run `narr graph` to confirm the arc is connected, then `narr lint --path 03_Continuity_and_Timeline`.

## Position checks
Rough windows, not laws: first plot point about a quarter in, midpoint about halfway, second plot point about three quarters, climax in the last tenth. A midpoint at one fifth, or a climax at sixty percent, deserves a reason in the arc page.

## Related
`scene-audit` for the scenes inside each beat, `narrative-architecture-audit` for a structural diagnosis, `foreshadowing-audit` for promises.
