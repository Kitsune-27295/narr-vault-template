# ADR 0008: Standardized Vault Information Architecture & Knowledge Organization

## Status
Accepted

## Context
ADR 0007 established the modernized vault architecture, cognitive harness (`context/`, `memory/`), continuity ledgers (`Ledgers/`), upstream laboratory (`Sandbox/`), and narrative craft layers (`Craft/`, `Research/`). However, audit of the vault's internal note ecosystem revealed critical information architecture liabilities:
1. Inconsistent entity identifiers across domains (underscores, hyphens, prefixes missing on cast characters).
2. Fragmented YAML frontmatter metadata (missing `uid`, `title`, `created`, `updated`, and `status` across 200+ notes).
3. Unstructured, flat tags (`#bible`, `#ledger`, `#cast`) duplicating folder names without associative retrieval value.
4. Residual Chinese/Japanese (CJK) characters embedded in live baseline and cast notes, conflicting with the Zero-CJK invariant.
5. Inconsistent Maps of Content (MOCs) lacking uniform column structures.

## Decision
We establish the **Standardized Narrative Information Architecture (SNIA)** as the permanent knowledge organization contract across the entire vault:

1. **Epistemic Invariant ("Every Fact Has One Home"):**
   Every fact belongs to the single layer whose job it is; elsewhere, summarize in one sentence and link there. Bible AU dossiers link to a single canonical baseline (`[[Canon/<Franchise>/Baselines/Baseline_<Topic>|Baseline - <Topic>]]`) and document only the divergence delta.

2. **Authoritative Specification (`docs/schema/information-architecture.md`):**
   A dedicated schema specification codifying layer ownership, UID prefixes, Obsidian properties, tag namespaces, MOC tables, and lifecycle deprecation policies.

3. **Canonical UID Prefix Taxonomy:**
   Standardized 3-letter prefix conventions across all entities:
   - `CKP-`: Cockpit Dashboards & Atlases
   - `BIB-`: Bible Master Indexes & Registries
   - `CAN-`: Canon Baselines
   - `SRC-`: Sourced Raw Captures
   - `DIV-`: Points of Divergence
   - `CHR-`: Cast Character Profiles
   - `FAC-`: Factions & Organizations
   - `LOC-`: Locations & Architecture
   - `ITM-`: Items, Relics & Weapons
   - `PWR-`: Power Systems & Energy Laws
   - `TEC-`: Techniques & Invariant Skills
   - `REL-`: Relationship & Covenant Matrices
   - `TML-`: Chronology & Timeline Events
   - `ARC-`: Story Arcs & Plot Threads
   - `TRM-`: Terminology & Glossaries
   - `LDG-`: Continuity Ledgers
   - `SBX-`: Sandbox Staging Projects
   - `CRT-`: Craft Critiques
   - `AUD-`: Narrative Audits
   - `RES-`: Research Reference Notes
   - `CTX-`: Cognitive Context Notes
   - `MEM-`: Memory Notes
   - `MSP-`: Manuscript Drafts & Indexes
   - `SYS-`: System Lexicons & Procedures

4. **Universal Obsidian 1.4+ Properties Schema:**
   Every live note carries a typed YAML frontmatter block:
   - `note_type`: Registered schema type or approved exception.
   - `title`: Clean, human-readable title without emojis or CJK characters.
   - `uid`: Canonical entity identifier matching approved prefix taxonomy.
   - `status`: Valid lifecycle status (`active`, `known`, `established`, `concluded`, `idea`, `superseded`, `deprecated`).
   - `aliases`: Array of strings including the canonical UID and alternative titles.
   - `tags`: Array of hierarchical tags.
   - `created` & `updated`: ISO date stamps (YYYY-MM-DD).

5. **Hierarchical Tag Taxonomy (`#namespace/subvalue`):**
   Strictly lowercase, namespaced associative tags (`#canon/<franchise>`, `#bible/<module>`, `#ledger/<category>`, `#sandbox/<stage>`, `#craft/<type>`, `#research/<domain>`, `#context/<scope>`, `#memory/<type>`).
   Anti-duplication rule: Never tag what a frontmatter property already carries (e.g. no `#status/active`).

6. **Standardized Maps of Content (MOCs):**
   Uniform 5-column tabular indexes (`UID`, `Module / Entity`, `Category`, `Status`, `Summary / Scope`) across `00_Cockpit/00_Home_Dashboard.md`, `Bible/00_Bible_Master_Index.md`, `Ledgers/IDX-Ledgers.md`, `Craft/README.md`, and `Research/README.md`.

7. **Zero-CJK Policy Enforcement:**
   Outside immutable captures in `Canon/*/Sources/`, all live vault files prohibit Hanzi/Kanji characters. Romanize all Japanese, Chinese, or foreign terms with italics (for example Hepburn or Pinyin forms set in italics).

## Consequences
- **Positive:**
  - 100% deterministic AI context assembly and SQLite FTS5 metadata indexing.
  - Complete elimination of broken wikilinks through alias-backed UID resolution.
  - High associative discoverability through hierarchical tags and standardized MOCs.
  - Zero-CJK compliance guaranteed across all 147 live vault notes.
  - Fully verified by automated test suites (`tests/template-validator.test.js`).
- **Negative:**
  - Frontmatter editing requires adherence to Obsidian Properties conventions.
- **Mitigation:**
  - Automated verification via `npm run validate:vault` and `npm run validate:links`.

