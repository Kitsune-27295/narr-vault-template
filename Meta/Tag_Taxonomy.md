# Tag Taxonomy

Tags are hierarchical (`family/value`). Prefer an existing family before adding a new one.

## Structural families (one per note, set by type)
| Tag | Used on |
|---|---|
| `canon/baseline` | Every `CAN-` baseline |
| `story_bible/<type>` | Story Bible notes: `character`, `power`, `technique`, `item`, `location`, `faction` |
| `continuity/pod` | Points of divergence |
| `arc/<phase>`, `timeline/event` | Arcs and events |
| `ledger/<kind>` | Ledgers |
| `memory/decision` | Decision records |

## Descriptive families (add as needed)
| Family | Example values |
|---|---|
| `power/` | `innate_gift`, `clan_secret`, `physique` |
| `technique/` | `martial_art` |
| `item/` | `artifact` |
| `character/` | `active`, plus roles such as `supporting`, `antagonist` |
| `status/` | `confirmed`, `draft`, `superseded`, `discharged` |

A preset may add its own families (see `Meta/Presets/<name>/`).

## Rules
- Use lowercase and underscores. No spaces, no CJK.
- Character names, clans and places go in plain tags.
- Never encode scope in a tag. Scope belongs in the `scope:` field.
