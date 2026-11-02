# Exclusions

This distribution is built by extraction, not by archiving a working vault. The categories below were left out on purpose.

| Excluded category | Why |
|---|---|
| Source captures, baselines, and indices of any franchise (`Canon/<Franchise>/...`) | Project canon and third-party text; only the empty archetype folders `Universe_Primary` and `Universe_Secondary` remain |
| Story Bible content (divergences, cast, factions, locations, items, power systems, relationships, chronology, arcs) | Project-specific; module folders and index notes remain as empty skeletons |
| Manuscript chapters and project notes | Project-specific; only the two chapter templates and indexes remain |
| Sandbox project specs, seeds, and registry rows | Project experiments; the lifecycle folders and the registry skeleton remain |
| Project ledgers rows, memory, journal, session handoffs | Project history; headers and governance text remain |
| Research notes, audit inventories, and research briefs | Project-specific or tied to one franchise's wiki |
| `.scratch/` (specs, tickets, one-off scripts) | Development artifacts of the original project |
| `.obsidian/workspace.json`, caches, `.db` indexes, logs, `node_modules/`, `.git/` | Machine state and generated data |
| Prior distribution archives (`*.zip`) | Obsolete versions |
| `tools/distribution/` | Template-maintainer extraction pipeline; its patch rules are project-specific by nature |
| Tests that assert project facts (`vault-consistency`) | Would fail on any other project |

Tools and tests that mentioned project franchises, characters, or terms were generalized in place (neutral fixtures, franchise-agnostic heuristics) rather than removed.
