# ADR 0004: Bible Power Systems, Multiverse Taxonomy & Wikilink Delegation

## Status
Accepted

## Context
In crossover fanfiction involving distinct cosmologies (for example a ninja world, a cultivation world, and a mythic-armor world), three critical organizational tensions arise:
1. **Proliferation & Duplication:** Describing full technique, skill, and power mechanics inside every character profile causes massive duplication, token bloat, and maintenance overhead across cast sheets.
2. **Ambiguous AU Energy Governance:** Multiverse energy interactions (such as conversion between two unrelated energy systems, somatic compatibility, and channel hygiene) had no dedicated architectural home in the vault.
3. **Partitioning Confusion:** Authors and AI agents need unambiguous rules on where canonical lore ends and fanfiction AU mechanics begin, and how multi-cosmology assets are categorized.

## Decision

We establish a 3-Tier Registration Hierarchy and Wikilink Delegation Architecture:

### 1. Three-Tier Energy Registration Hierarchy
1. **Micro Level (Personal Character Proficiency):**
   - Documented in **Section 3 of Cast Profiles** (`Bible/02_Cast_Characters/<Name>_AU.md`).
   - Strictly enforces the **Wikilink Delegation Standard**: profiles do *not* rewrite full technique mechanics. They record only:
     `- [[Dossier_or_TECH_Link|Technique Name]]: **[Mastery Tier / Rank]** — [Brief 1–2 sentence description of personal proficiency, variant, or operational constraint]`.
2. **Meso Level (Standalone Invariant OC Techniques & Bloodlines):**
   - Documented in `Bible/06_Power_Systems_Mechanics/02_Techniques_OC/` with prefix `TECH_*.md`.
   - Adheres to `TPL_Bible_Technique.md` (`note_type: "fic-technique"`, `type: "technique_au"`).
   - Holds the complete mechanics, hand seals, energy costs, progression tiers, flaws, and known practitioner tables (inspired by fandom wiki standards).
3. **Macro Level (Multiverse Synergy Laws & Energy Systems):**
   - Documented in `Bible/06_Power_Systems_Mechanics/01_Multiverse_Synergy/` with prefix `PWR_*.md`.
   - Adheres to `TPL_Bible_Power_System.md` (`note_type: "fic-power-system"`, `type: "power_system_au"`).
   - Defines primordial equivalence ratios, density rankings, somatic pathway convergence, and planar crossover rules.

### 2. Multi-Cosmology Separation Architecture
- **In `Canon/` (Official Canon Sandbox):**
  - Partitioned per franchise horizontally: `Canon/<Universe_Name>/` strictly divided into `Sources/` (raw captures) and `Baselines/` (canonical baseline dossiers per ADR 0002).
  - Canon lore never mixes between franchises.
- **In `Bible/` (Integrated Multiverse Sandbox):**
  - Functional modular organization across 10 structured modules:
    - `01_Divergences_AU/` (`DIV_*.md`)
    - `02_Cast_Characters/` (`*_AU.md`)
    - `03_Factions_Organizations/` (`00_Factions_Index.md`)
    - `04_Locations/` (`LOC_*.md`)
    - `05_Items_Artifacts/` (`ITEM_*.md`)
    - `06_Power_Systems_Mechanics/` (`PWR_*.md` and `TECH_*.md`)
    - `07_Relationship_Matrix/` (`REL_*.md`)
    - `08_Chronology_Calendar/` (project epoch calendar)
    - `09_Plot_Threads_Arcs/` (`ARC_*.md`, `00_Open_Questions.md`)
    - `10_Terminology_Glossary/` (`00_Terminology_Index.md`)
  - Frontmatter metadata enforces taxonomy: `cosmology: Multiverse-Synergy | <Franchise>`, `origin_cosmology: <Franchise>`, and `canon_tier: AU-Override`.

### 3. F-RAG Authority & Precedence
- Dossiers in `Bible/06_Power_Systems_Mechanics/` are categorized into **Tier 4 (System Mechanics & Hard Constraints)** with **AU Override precedence**.
- When F-RAG searches for combat or energy mechanics, AU synergy laws take absolute precedence over canonical databooks.

## Consequences
- **Positive:** Character sheets remain clean, readable, and focused on voice and character dynamics. Full mechanics are written once (DRY). Navigation in Obsidian is hyperlinked and instant.
- **Negative:** Requires creating standalone dossiers for recurring techniques instead of inlining them in character profiles.
- **Mitigation:** The 3 Pillars Rule gates the creation of standalone dossiers; non-reusable or trivial sub-skills remain in catalog tables.

