---
name: sandbox-diverge
description: "Generate several distinct, probability-weighted options for an open story question and file them as proposed notes in the sandbox only, never in canon or the manuscript. Use when the curator is stuck choosing between directions, wants alternatives to an obvious idea or asks what could happen next."
---
# sandbox-diverge

Use this skill to widen the option space before a decision. It writes only `06_Ideation_and_Unblocking/SBX-*.md` notes with `status: proposed`; it never touches `01_`, `02_`, `03_`, `04_`, `08_` or `memory/decisions/`. The curator chooses; `sandbox-promote` and `narrative-decide` come afterwards.

## Procedure
1. **State the question** in one sentence and the constraints that are already fixed (cite baselines and ledgers; run `narr search "<topic>" -k 5`).
2. **Name the obvious answer** and its likelihood. Most agents default to it; say so.
3. **Produce five options** that differ in kind, not in wording: different cause, different cost, different consequence for the POV character. For each, give a one-line description and a stated probability (the five add to 100 %).
4. **Add one low-probability option** under 5 % that breaks an assumption but stays inside canon.
5. **Check each option** against the epistemic horizons and Sanderson's Second Law (costs and limits). Mark options that need a point of divergence.
6. **File the note:** create one sandbox note with frontmatter `type: concept`, `status: proposed`, `scope: sandbox`, and the five options plus the long shot.

## Output rules
- Options are short pitches, not drafted scenes. No manuscript prose.
- Do not rank by quality, only by stated probability; say what would make the curator prefer each.
- Finish with the question "which one do you want to explore?" and wait.

## Gates
`narr lint --path 06_Ideation_and_Unblocking` must pass; links from canon pages into the sandbox are errors (VAL014).
