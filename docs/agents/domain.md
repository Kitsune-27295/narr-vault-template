# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`02_Story_Bible/Terminology/TRM-Termbase.md`** ([[TRM-Termbase]]): defines canonical domain concepts, proper nouns, and entity terms.
- **`memory/decisions/`**: read architectural decision records (`DEC-*.md`) that touch the area you are about to work in.

If any of these files do not exist, proceed silently. The domain modeling workflow creates them lazily when terms or decisions are resolved.

## File structure

Single-context story vault layout:

- `02_Story_Bible/Terminology/TRM-Termbase.md` ([[TRM-Termbase]])
- `memory/decisions/`
  - `DEC-Adopt_canonical_naming_and_core_ranks.md`
- `.scratch/`
- `docs/agents/`

## Use the termbase vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, or a test name), use the term as defined in [[TRM-Termbase]]. Do not drift to synonyms the termbase explicitly avoids.

If the concept you need is not in the termbase yet, note it for termbase synchronization (`termbase-sync`) instead of inventing unvetted terms.

## Flag ADR conflicts

If your output contradicts an existing decision record in `memory/decisions/`, surface it explicitly rather than silently overriding:

> _Contradicts DEC-XXXX, but worth reopening because…_
