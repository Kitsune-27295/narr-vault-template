# ADR 0002: Simplified Canon Architecture (Baselines) and 10-Module Story Bible

## Status
Accepted

## Context
Under ADR 0001, each canonical universe directory (`Canon/<Franchise>/`) was partitioned into 7 subdirectories (`Sources/`, `01_Characters/`, `02_Locations/`, `03_Factions_Cultures/`, `04_Rules_Mechanics/`, `05_Items_Artifacts/`, `06_Timeline_Events/`). In practice, this caused several architectural liabilities:
1. **Hyper-Fragmentation and Routing Friction:** Dividing canonical lore across 6 separate categorical subdirectories required complex claim-routing heuristics and 6 distinct templates with artificial distinctions.
2. **Template Duplication & Schema Drift:** Multiple overlapping templates (`TPL_Canon_Character`, `TPL_Canon_Location`, `TPL_Canon_Faction_Org`, `TPL_Canon_Power_System`, `TPL_Canon_Item_Artifact`, `TPL_Canon_Event_Timeline`, `TPL_Canon_Entity`) led to maintenance friction and template drift.
3. **Bible Gaps & Structural Asymmetry:** The `Bible/` alternate-universe layer lacked dedicated top-level homes for Factions, Locations, Items, and Terminology, while mixing locations and items in `04_World_Locations_Items/`.
4. **Redundant Sourcing in AU Dossiers:** Fanfiction AU dossiers frequently linked to multiple raw captures instead of referencing a single consolidated canonical baseline.

Following a comparative audit of reference multiverse vaults and external skill collections (earlier project vaults), a streamlined, highly cohesive architecture was synthesized.

## Decision

We establish two foundational structural evolutions:

### 1. Canonical Layer Simplification (`Canon/<Franchise>/`)
Every canonical franchise directory is restricted to strictly two subdirectories:
- **`Sources/`**: Immutable raw web captures (`.md`) and cryptographic JSON sidecars (`.json`) with SHA256 integrity provenance.
- **`Baselines/`**: Consolidated, subject-specific canonical dossiers (`Baseline_<Subject>.md`) conforming to the universal `TPL_Canon_Baseline.md` schema (`note_type: canon-baseline`).

All legacy subdirectories (`01_Characters` through `06_Timeline_Events`) are deprecated and removed. Automated ingestion and pipeline tools (`tools/ingestor/`, `tools/clipper/`, `tools/rag/`) route exclusively to `Baselines/`.

### 2. Comprehensive 10-Module Bible Architecture (`Bible/`)
The `Bible/` directory is standardized into 10 explicit numbered modules:
1. **`01_Divergences_AU/`**: Points of Divergence (`DIV_*.md`), establishing chronological bifurcations from canon.
2. **`02_Cast_Characters/`**: Alternate-universe cast sheets (`*_AU.md`), documenting psychological profiles, voice notes, and canon deltas.
3. **`03_Factions_Organizations/`**: AU political structures, clans, syndicates, and village council dynamics (`00_Factions_Index.md`).
4. **`04_Locations/`**: Geographic and architectural settings altered or introduced in the AU (`LOC_*_AU.md`).
5. **`05_Items_Artifacts/`**: AU relics, synthesized weapons, and cross-cosmology treasures (`ITEM_*.md`).
6. **`06_Power_Systems_Mechanics/`**: Crossover energy conversion laws (`PWR_*`) and original techniques (`TECH_*`).
7. **`07_Relationship_Matrix/`**: Dynamic factional, interpersonal, and affinity matrices (`REL_*`).
8. **`08_Chronology_Calendar/`**: Master forward timeline measuring from the project epoch declared in `vault.yaml`.
9. **`09_Plot_Threads_Arcs/`**: Master narrative roadmaps (`Roadmap_Master.md`), active arcs (`ARC_*`), and open questions (`00_Open_Questions.md`).
10. **`10_Terminology_Glossary/`**: In-universe nomenclature, translation keys, and jargon registers (`00_Terminology_Index.md`).

### 3. Single-Link Baseline Workflow
Every Bible note links to exactly one canonical baseline note via Obsidian wikilink (`[[Canon/<Franchise>/Baselines/Baseline_<Topic>|Baseline - <Topic>]]`) and specifies the alternate-universe divergence delta. Direct links to raw wiki captures in `Sources/` are confined to the baseline notes themselves.

### 4. Template Suite Rationalization
The template registry in `99_System/Templates/` is pruned to 11 lean, unambiguous templates:
- **Canon (2):** `TPL_Canon_Baseline.md`, `TPL_Canon_Source.md`.
- **Bible (7):** `TPL_Bible_Divergence_POD.md`, `TPL_Bible_Cast_Profile.md`, `TPL_Bible_Power_System.md`, `TPL_Bible_Technique.md`, `TPL_Bible_Item_Artifact.md`, `TPL_Bible_Relationship_Matrix.md`, `TPL_Bible_Plot_Arc.md`.
- **Manuscript (2):** `TPL_Chapter_PT.md`, `TPL_Chapter_ES.md`.

## Consequences
- **Positive:**
  - Complete elimination of redundant, conflicting templates and hyper-fragmented folders.
  - High-precision FTS5 search and deterministic Fiction-Conscious RAG (F-RAG) tier classification.
  - Effortless Obsidian graph navigation: Bible files point to clean Baselines, which link down to provenance captures.
  - 100% test coverage across all pipeline engines and validator suites.
- **Negative:**
  - Existing scripts or legacy notes referring to `Canon/<Franchise>/01_Characters` etc. must be redirected to `Baselines/`.
- **Mitigation:**
  - Automated link validation (`npm run validate:links`) and vault validation (`npm run validate:vault`) run in CI and pre-commit checks.

