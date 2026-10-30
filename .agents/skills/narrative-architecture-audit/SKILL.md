---
name: narrative-architecture-audit
description: "Review-only audit of a chapter or arc across five groups (promises and payoffs, causal chain, character change, information flow, sensory and emotional texture), quoting paragraph markers and never editing. Use when a chapter or arc needs a structural diagnosis before revision or when a draft feels hollow without an obvious cause."
---
# narrative-architecture-audit

Use this skill to diagnose how a chapter or arc is built. It reads five groups separately, quotes evidence with `<!-- p:N -->` markers and never edits (Rule 20.3). Craft sources are credited in `05_Craft_and_Feedback/Checklists/CKL-Craft_Sources.md`.

## Read the five groups one at a time
Do not mix groups in one pass; each pass answers one question.
1. **Promises and payoffs:** what does the text promise the reader, and where is it kept? Cross-check `LDG-Foreshadowing.md`, `LDG-Chekhov_Guns.md` and the output of `python tools/vault_audit.py`.
2. **Causal chain:** does each beat follow from the previous one with "but" or "therefore", not "and then"? List every "and then" link.
3. **Character change:** what does the POV character believe at the start, what at the end, and which scene proves the shift? An arc without proof is a claim.
4. **Information flow:** who knows what, and when does the reader learn it? Check `LDG-Character_Knowledge.md` for anyone acting on knowledge they have not gained. Flag exposition delivered in one block.
5. **Texture:** sensory detail and emotion. Check both a floor (a scene with no body in it) and a ceiling (every beat embodied, every smell named). Prefer behaviour and plain naming over stacked symptoms. Use only in-universe anchors for comparison.

## Evidence rules
- Quote the marker, not the sentence: `p:14`. Quote text only to show a pattern.
- Mark inferences as inferences. A finding without a marker is an opinion; label it so.
- Treat a loose end as `abandoned` only if the text closes it; otherwise it is open.

## Report block
```text
ARCHITECTURE AUDIT: <chapter or arc>
Promises: kept [...]  open [...]  broken [...]
Causal chain: weak links at p:_ (and then), p:_ (and then)
Character change: from <belief> to <belief>, proven at p:_ | not proven
Information flow: surprises earned [...]  knowledge leaks [...]  exposition blocks [...]
Texture: floor ok|low at p:_   ceiling ok|high at p:_
Top three questions for the curator:
```
Follow with `revision-pass` only if the curator approves.
