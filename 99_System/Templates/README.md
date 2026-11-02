# Template Registry

Use a template only when the note has a recurring retrieval or continuity purpose. Omit unsupported/irrelevant sections; do not fill placeholders with guessed facts. Template validation is maintained in tools/templates/template-validator.js and can be run with npm run validate:templates. Eligible typed notes can be audited with npm run validate:vault.

## Canon

| Type | Template |
|---|---|
| Canonical Baseline | TPL_Canon_Baseline.md |
| Captured source | TPL_Canon_Source.md |

Canonical baselines consolidate subject-matter evidence from raw source captures into single-domain reference hubs in `Canon/<Franchise>/Baselines/`. Raw captures and their sidecars are preserved as captured in `Canon/<Franchise>/Sources/`.

## Story Bible and manuscript

| Type | Template |
|---|---|
| AU divergence | TPL_Bible_Divergence_POD.md |
| Cast profile | TPL_Bible_Cast_Profile.md |
| Relationship matrix | TPL_Bible_Relationship_Matrix.md |
| Plot arc | TPL_Bible_Plot_Arc.md |
| AU power system | TPL_Bible_Power_System.md |
| AU technique | TPL_Bible_Technique.md |
| AU item | TPL_Bible_Item_Artifact.md |
| Portuguese chapter draft | TPL_Chapter_PT.md |
| Spanish working chapter | TPL_Chapter_ES.md |

## Operational and Framework Note Types

Operational dashboards, master indexes, concept labs, and framework ledgers use declared note types recognized by `tools/templates/template-validator.js`:

| Note Type | Category & Scope | Description |
|---|---|---|
| `cockpit-dashboard` | 00_Cockpit/ | Operational dashboards (`00_Home_Dashboard.md`) and continuity trackers (`04_Continuity_Audits.md`). |
| `canon-index` | Canon/ | Cosmology indexes (`00_<Cosmology>_Index.md`). |
| `bible-index` | Bible/ | Master Bible index (`00_Bible_Master_Index.md`) and module indexes. |
| `bible-open-questions` | Bible/09_Plot_Threads_Arcs/ | Active continuity, mechanics, and timeline branch register (`00_Open_Questions.md`). |
| `ledger` | Ledgers/ | Continuity ledgers (`LDG-Chekhov.md`, `LDG-Decisions.md`, `LDG-Open_Threads.md`, `LDG-Contradictions.md`, `LDG-Session_Handoff.md`, `IDX-Ledgers.md`). |
| `manuscript-index` | Manuscript/ | Manuscript drafting and translation production indexes (`Index.md`, `Index_ES.md`). |
| `chapter-pt` | Manuscript/pt-BR/ | Direct Portuguese chapter draft (`PT_Chapter_01_Template.md`). |
| `chapter-es` | Manuscript/es/ | Direct Spanish chapter draft (`ES_Draft_Chapter_01_Template.md`). |
| `sandbox-registry` | Sandbox/ | Upstream laboratory registry and staging index (`README.md`, `_registry.md`). |
| `sandbox-project` | Sandbox/draft/ | Staging lab project specs for foreign cosmology / mechanic incubation. |
| `seeds-inbox` | Sandbox/ | Raw narrative concepts, speculative ideas, and quick capture inbox (`Seeds_Inbox.md`). |
| `craft` | Craft/ | Prose style guides, diagnostic audits, and chapter critiques (`README.md`, `Guides/`). |
| `research` | Research/ | Non-canon history, science, and real-world domain research (`README.md`, `Notes/`). |
| `context` | context/ | Authorial voice, stylistic constraints, and translation pipeline rules (`author.md`, `languages.md`). |
| `memory` | memory/ | Cognitive harness active state (`hot.md`) and operational learnings (`learnings.md`). |
| `journal` | memory/journal/ | Append-only monthly session changelogs (`YYYY-MM.md`). |
| `fic-arc-auxiliary` | Bible/09_Plot_Threads_Arcs/ | Multi-universe roadmap register. |
| `fic-cast-auxiliary` | Bible/02_Cast_Characters/ | Cast relationship roster tracker. |
| `fic-timeline-auxiliary` | Bible/08_Chronology_Calendar/ | Project timeline calendar. |
| `lexicon` | 99_System/Lexicon_PT_ES/ | Bilingual terminology register (`Glossary_Terms_PT_ES.md`). |
| `voice-guide` | 99_System/Lexicon_PT_ES/ | Character voice and dialogue guide (`Character_Voice_Guide_ES.md`). |
| `ao3-export-guide` | 99_System/Export_Templates/ | AO3 publication procedure (`AO3_Export_Procedure.md`). |

One-off dashboards, ledgers, lexicons, indexes, and editorial procedures must declare their registered `note_type`; unclassified notes fail validation. Existing final chapters remain authored publication text and are not regenerated from templates.

## Template Consolidation & Baselines

All universe-specific and entity-specific canon templates were consolidated into `TPL_Canon_Baseline.md` (serving as the single authoritative canonical dossier structure) and `TPL_Canon_Source.md` (for raw source captures). Bible profiles follow the dedicated `TPL_Bible_*` schema suite. Redundant or obsolete legacy templates have been cleanly pruned to eliminate schema conflicts.

## Public export assets

Portable Infobox examples are stored separately in 99_System/Export_Templates/Fandom/. They are platform-specific export starting points, not authoring templates.
