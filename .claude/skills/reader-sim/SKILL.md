---
name: reader-sim
description: "Simulate a first-time reader of a pt-BR chapter, paragraph by paragraph, and report where attention, curiosity and trust rise or fall; diagnose only, output marked simulated. Use when a chapter must be checked for pacing, clarity and reader reward before revision."
---
# reader-sim

Use this skill to read a chapter as a reader who knows only what earlier chapters showed. It diagnoses; it never rewrites (Rule 20.3). Everything it reports is a simulation, not evidence of a real reader's reaction.

## Setup
1. Choose the persona from the curator's brief: genre fluency, patience for exposition, what they read for. Default: a fluent, impatient reader of serialized fiction in the same genre.
2. Load only the chapters before this one. The reader does not know the Story Bible, the ledgers or the termbase.
3. Run `narr lint --path 04_Manuscript` first (STY signals) and keep its numbers out of the reading; compare afterwards.

## Procedure
Read each `<!-- p:N -->` paragraph in order. After each, note in one line, only if something changed:
- **Curiosity:** a question the reader now wants answered, or one that was just answered.
- **Tension:** the stakes feel higher, lower or unchanged.
- **Clarity:** anything the reader could not follow (who, where, when, why).
- **Trust:** a promise kept or broken; a surprise that feels earned or cheated.
- **Drift:** the moment attention would leave, and the reason.

## Report
```text
SIMULATED READER REPORT: chapter <N>, persona <short>
Hook (p:1-3): <does it earn the next page>
Rises: p:_ <reason>; p:_ <reason>
Drops: p:_ <reason>; p:_ <reason>
Confusions: p:_ <what is unclear>
Open questions at the end: <list>
Reward channels present: surprise | emotion | information | beauty | humour
Strongest paragraph: p:_   Weakest paragraph: p:_
```
Rank the drops by size. Suggest at most three changes as questions for the curator.

## Limits
A simulated reader cannot judge taste, cultural fit or the author's long game. Say so in the report when a finding depends on any of these. Use `scene-audit` for scene mechanics and `tone-and-voice-audit` for voice.
