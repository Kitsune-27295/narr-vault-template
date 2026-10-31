# AGENTS.md

Markdown story bible for a work of fiction. Start with `00_Atlas/ATL-Home.md`, then `08_Ledgers/LDG-Session_Handoff.md`.

## Zones

| Zone | Prefix | Agent writes |
|---|---|---|
| `00_Atlas/` | ATL- | yes |
| `01_Canon_and_Divergence/Sources/` | SRC- | never (frozen) |
| `01_Canon_and_Divergence/Baselines/` | CAN- | yes |
| `02_Story_Bible/Characters/` | CHR- | yes |
| `02_Story_Bible/Locations/` | LOC- | yes |
| `02_Story_Bible/Systems/` | SYS- | yes |
| `08_Ledgers/` | LDG- | yes |

## Naming

- File name = prefix + name, no spaces (`CHR-Mira_Vale.md`); the `uid` in the front matter equals the file name without `.md`.
- Link notes with `[[uid]]`.

## Canon rules

1. Every quotation in a baseline is verbatim from the frozen source it cites.
2. Each baseline has a `## What it does NOT establish` section.
3. A system (`SYS-`) documents its costs and limits before its powers.
4. One owner per fact: write and quote it in one note; elsewhere give one line and a link.
5. Two sources that disagree: keep both quotes and add a row to `LDG-Contradictions`; never choose silently.
6. A character never acts on a fact not recorded in `LDG-Character_Knowledge`.

## Never edit

- Anything in `01_Canon_and_Divergence/Sources/`.
- Existing ledger rows: append, do not rewrite.

## Session close

Update `LDG-Session_Handoff` (done, next, decided).
