# Domain Glossary — Multiverse Fanfiction Framework

This glossary establishes the canonical, authoritative vocabulary for the Multiverse Fanfiction Framework, its Obsidian vault architecture, its continuous ingestion pipeline, and its Fiction-Conscious RAG (F-RAG) engine.

---

## 1. Vault Architectural Layers

- **3-Layer Architecture**: The organizational model separating canonical source lore (`Canon/`), fanfiction universe modifications (`Bible/`), and narrative draft outputs (`Manuscript/`).
- **Cockpit (`00_Cockpit/`)**: The operational nerve center providing Dataview/Bases dashboards, inboxes, and translation progress overviews for both author and AI agents.
- **Canon (`Canon/`)**: The immutable repository of official universe facts, organized per franchise cosmology (`Canon/<Universe_Name>/`), subdivided into standardized modules (`00_Sources`, `01_Characters`, `02_Locations`, `03_Factions_Cultures`, `04_Rules_Mechanics`, `05_Items_Artifacts`, `06_Timeline_Events`).
- **Bible (`Bible/`)**: The repository of story-specific ground truth for the fanfiction project. Houses Points of Divergence (PODs), cast sheets with canon deltas, relationship matrices, and arc outlines.
- **Manuscript (`Manuscript/`)**: The narrative prose workspace structured into drafts (`pt-BR/`) and localized target editions (`es/`), enriched with Story Grid beat diagnostics.
- **System (`99_System/`)**: System-level configurations, bilingual lexicons, franchise routing rules (`franchise-rules.json`), and translation style guides.

---

## 2. Continuous Canon Ingestion Pipeline

- **Hybrid Web Clipper (Engine 1)**: CLI and library tool (`tools/clipper/`) that extracts clean Markdown from fandom/wiki URLs using virtual DOM pruning, infobox JSON serialization, and SHA-256 idempotency checks.
- **Modular Dossier Ingestor (Engine 2)**: Semantic map-reduce engine (`tools/ingestor/`) that decomposes raw clipped articles into typed claims and merges them into structured Modular Dossiers.
- **3 Pillars Rule**: Routing heuristic gating the creation of a standalone Modular Dossier: a concept must possess (1) independent invariant rules, (2) internal progression tiers, and (3) cross-arc narrative reusability. Concepts failing this rule are routed into catalog tables within existing host dossiers.
- **Scope Delegation**: Architectural boundary preventing content redundancy. Host dossiers delegate sub-techniques, specific artifacts, or foreign mechanics via standardized `[[Dossier - ...]]` wikilinks.
- **Canon Layering**: Hierarchy of canonical authority (`G-Primary`, `W-Author-WoB`, `C-Expanded`), standardizing terminology aliases in YAML and recording era retcons in Section 5 Conflict Logs.
- **Sidecar JSON**: Companion metadata file (`<slug>.json`) accompanying `<slug>.md` under `Sources/`, capturing raw infobox key-values and fetch provenance.
- **Franchise Resolver**: Router (`tools/clipper/franchise-resolver.js`) driven by `99_System/franchise-rules.json` that maps source URLs to target cosmologies under `Canon/` and auto-scaffolds missing directories.

---

## 3. Fiction-Conscious RAG (F-RAG)

- **F-RAG**: Retrieval-Augmented Generation engine designed specifically for creative writing and alternate-universe fanfiction, enforcing timeline divergence precedence over canonical baseline dossiers.
- **5-Tier Context Hierarchy**:
  - **Tier 1 (Active Scene & POV Anchor)**: Scene outline, active character POV, emotional beat, and immediate objective.
  - **Tier 2 (Timeline Divergences / AU Overrides)**: Active Points of Divergence (`Bible/01_Divergences_AU/DIV_*.md`). Strict rule: AU POD statements supersede canonical dossiers.
  - **Tier 3 (Character Profiles & Voices)**: Cast sheets with canon deltas, psychological evolution, and dialogue voice guidelines (`Bible/02_Cast_Characters/`).
  - **Tier 4 (System Mechanics & Constraints)**: Invariant power systems, energy limits, and conversion laws (`Canon/*/04_Rules_Mechanics/`).
  - **Tier 5 (Canonical Background Lore)**: History, geography, and general lore dossiers (`Canon/`).
- **AU Override Banner**: Explicit markdown alert (`> [!WARNING] **AU OVERRIDE**`) injected into prompt context to prevent LLM backsliding into default canon.
- **Token Budget Packing**: Algorithmic budget allocator packing retrieved context tier-by-tier within a user-defined token ceiling (`--budget <tokens>`), cleanly truncating lower-tier items.
- **SQLite FTS5 & BM25**: Local, high-speed lexical search index (`.scratch/vault_index.db`) powered by native `node:sqlite` with `unicode61 remove_diacritics 2` tokenization and weighted BM25 ranking.

---

## 4. Narrative & Fanfiction AU Concepts

- **Point of Divergence (POD)**: The exact historical or physical junction where the fanfiction timeline bifurcates from the canonical baseline.
- **Self-Insert (SI) / Original Character (OC)**: An entity possessing distinct identity, psychological arc, or meta-knowledge navigating the target multiverse.
- **Canon Delta**: The documented differential between a character or world state in canon and its altered reality in the fanfiction Bible.
- **Story Grid Beat**: Unit of dramatic narrative progression tracking Scene Event, Value Shift, Polarity Change (+/-), and Turning Point.
- **Translation Pipeline**: Asymmetric workflow wherein story drafts are authored in Brazilian Portuguese (`pt-BR`) and translated/published in Spanish (`es`) for platforms like AO3.
