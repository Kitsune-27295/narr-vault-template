# Domain Glossary — Narrative Vault Framework

This glossary establishes the canonical, authoritative vocabulary for the Narrative Vault Framework, its Obsidian vault architecture, its continuous ingestion pipeline, and its Fiction-Conscious RAG (F-RAG) engine.

---

## 1. Vault Architectural Layers

- **3-Layer Architecture**: The organizational model separating canonical source lore (`Canon/`), fanfiction universe modifications (`Bible/`), and narrative draft outputs (`Manuscript/`).
- **Cockpit (`00_Cockpit/`)**: The operational nerve center providing Dataview/Bases dashboards, inboxes, and translation progress overviews for both author and AI agents.
- **Canon (`Canon/`)**: The evidence-organized repository of universe references and sourced claims, organized per franchise cosmology (`Canon/<Universe_Name>/`), strictly divided into two primary subdirectories: `Sources/` (immutable raw captures and cryptographic JSON sidecars) and `Baselines/` (subject-specific canonical baseline dossiers `Baseline_<Subject>.md` serving as authoritative reference hubs).
- **Bible (`Bible/`)**: The repository of story-specific ground truth for the fanfiction project. Houses Points of Divergence (PODs), cast profiles with canon deltas, relationship matrices, arc outlines, AU factions, locations, items, multiverse energy conversion laws, and terminology across 10 structured modules (`01_Divergences_AU` through `10_Terminology_Glossary`).
- **Manuscript (`Manuscript/`)**: The narrative prose workspace structured into drafts (`pt-BR/`) and localized target editions (`es/`), enriched with Story Grid beat diagnostics.
- **System (`99_System/`)**: System-level configurations, bilingual lexicons, franchise routing rules (`franchise-rules.json`), and translation style guides.

---

## 2. Continuous Canon Ingestion Pipeline

- **Hybrid Web Clipper (Engine 1)**: CLI and library tool (`tools/clipper/`) that extracts clean Markdown from fandom/wiki URLs using virtual DOM pruning, infobox JSON serialization, and SHA-256 idempotency checks.
- **Modular Dossier Ingestor (Engine 2)**: Semantic map-reduce engine (`tools/ingestor/`) that decomposes raw clipped articles into typed claims and merges them into structured Modular Dossiers.
- **3 Pillars Rule**: Routing heuristic gating the creation of a standalone Modular Dossier: a concept must possess (1) independent invariant rules, (2) internal progression tiers, and (3) cross-arc narrative reusability. Concepts failing this rule are routed into catalog tables within existing host dossiers.
- **Scope Delegation**: Architectural boundary preventing content redundancy. Host dossiers delegate sub-techniques, specific artifacts, or foreign mechanics via standardized `[[Dossier - ...]]` wikilinks.
- **Canon Tier**: Describes evidence/source class on Canon notes, not whether a statement is objectively true: G-Primary for the primary work or official publication, W-Author-WoB for attributed author statements, C-Expanded for official supplemental material, and C-Secondary for community-maintained/reference synthesis. `AU-Override` marks a Bible decision and `F-Fanon` marks fan-created material; neither is a Canon evidence tier. An accessible secondary wiki capture must not be labeled primary evidence merely because it describes canon.
- **Negative Boundary**: Explicit demarcation within a canonical baseline declaring what the source material does *not* establish, preventing AI hallucinations, fanon leaps, and ungrounded extrapolation.
- **Contradictions Ledger**: Auditable register (`Ledgers/LDG-Contradictions.md`) recording identified canon collisions, translation lineage variances, or timeline disputes with dual citations (Side A, Side B) and authorial resolution rationale.
- **Single-Link Baseline Provenance**: Architectural rule requiring every AU Bible dossier to link to exactly one canonical baseline (`[[Canon/<Franchise>/Baselines/Baseline_<Topic>|Baseline - <Topic>]]`) and document only the divergence delta.
- **Epistemic Traceability**: Unidirectional provenance chain progressing strictly from frozen raw source captures (`Sources/`) to canonical baselines (`Baselines/`) to Points of Divergence (`01_Divergences_AU/`) to established Story Bible reality (`Bible/`).
- **Continuity State**: Distinguishes sourced canon, established AU truth, provisional plan, unresolved question, and published manuscript state. Use the owning note and its evidence/decision links to establish state; a structured plan does not become canon automatically.
- **Sidecar JSON**: Companion metadata file (`<slug>.json`) accompanying `<slug>.md` under `Canon/<Cosmology>/Sources/`, capturing raw infobox key-values and fetch provenance. The Ingestor also reads legacy `00_Sources/` directories.
- **Franchise Resolver**: Router (`tools/clipper/franchise-resolver.js`) driven by `99_System/franchise-rules.json` that maps source URLs to target cosmologies under `Canon/` and auto-scaffolds missing directories.

---

## 3. Fiction-Conscious RAG (F-RAG)

- **F-RAG**: Retrieval-Augmented Generation engine designed specifically for creative writing and alternate-universe fanfiction, enforcing timeline divergence precedence over canonical baseline dossiers.
- **5-Tier Context Hierarchy**:
  - **Tier 1 (Active Scene & POV Anchor)**: Scene outline, active character POV, emotional beat, and immediate objective.
  - **Tier 2 (Timeline Divergences / AU Overrides)**: Active Points of Divergence (`Bible/01_Divergences_AU/DIV_*.md`). Strict rule: AU POD statements supersede canonical dossiers.
  - **Tier 3 (Character Profiles & Voices)**: Cast sheets with canon deltas, psychological evolution, and dialogue voice guidelines (`Bible/02_Cast_Characters/`).
  - **Tier 4 (System Mechanics & Constraints)**: Invariant power systems, multiverse energy synergy laws, OC techniques, and canonical energy baselines (`Bible/06_Power_Systems_Mechanics/`, `Bible/05_Items_Artifacts/`, and Canon power system baselines).
  - **Tier 5 (Canonical Background Lore)**: History, geography, and general lore dossiers (`Canon/`).
- **AU Override Banner**: Explicit markdown alert (`> [!WARNING] **AU OVERRIDE**`) injected into prompt context to prevent LLM backsliding into default canon.
- **Token Budget Packing**: Algorithmic budget allocator packing retrieved context tier-by-tier within a user-defined token ceiling (`--budget <tokens>`), cleanly truncating lower-tier items.
- **SQLite FTS5 & BM25**: Local, high-speed lexical search index (`.scratch/vault_index.db`) powered by native `node:sqlite` with `unicode61 remove_diacritics 2` tokenization and weighted BM25 ranking.

---

## 4. Narrative & Fanfiction AU Concepts

- **Point of Divergence (POD)**: The exact historical or physical junction where the fanfiction timeline bifurcates from the canonical baseline.
- **Self-Insert (SI) / Original Character (OC)**: An entity possessing distinct identity, psychological arc, or meta-knowledge navigating the target multiverse.
- **Canon Delta**: The documented differential between a character or world state in canon and its altered reality in the fanfiction Bible.
- **Wikilink Delegation**: The architectural convention delegating detailed technique, item, or power system mechanics to standalone dossiers in `Bible/06_Power_Systems_Mechanics/`, keeping character profiles clean by documenting only personal mastery tier, proficiency, and idiosyncratic variations (`[[Dossier_Link|Name]]: **[Rank]** — [Proficiency notes]`).
- **Multiverse Synergy Law**: Invariant rules governing how divergent energy systems (for example two unrelated energy systems) convert, collide, and synthesize within the unified fanfiction reality (`Bible/06_Power_Systems_Mechanics/01_Multiverse_Synergy/`).
- **OC Invariant Technique**: Standalone original or modified martial arts, ritual arrays, and bloodline abilities (`Bible/06_Power_Systems_Mechanics/02_Techniques_OC/`) structured under fandom wiki standards.
- **Story Grid Beat**: Unit of dramatic narrative progression tracking Scene Event, Value Shift, Polarity Change (+/-), and Turning Point.
- **Translation Pipeline**: Asymmetric workflow wherein story drafts are authored in Brazilian Portuguese (`pt-BR`) and translated/published in Spanish (`es`) for platforms like AO3.

---

## 5. Cognitive Harness & Continuity Subsystems

- **Declarative Vault Configuration (`vault.yaml`)**: The single top-level declarative contract defining story parameters, active tier, languages, character modules, continuity thresholds (`chekhov_gap`, `thread_dormant_gap`), and context budgets.
- **Cognitive Harness (`context/` & `memory/`)**: The two-tier agent memory architecture: `context/` for invariant authorial voice, tone, and language pipeline constraints; `memory/` for in-flight working state (`hot.md`), durable operational learnings (`learnings.md`), and session journals.
- **Continuity Ledgers (`Ledgers/`)**: The cross-cutting governance suite tracking plants and payoffs (`LDG-Chekhov.md`), narrative decisions not visible in prose (`LDG-Decisions.md`), open subplots (`LDG-Open_Threads.md`), contradictions (`LDG-Contradictions.md`), and session handoffs (`LDG-Session_Handoff.md`).
- **Chekhov's Gun Ledger**: Auditable register tracking narrative elements planted in prose and their eventual payoff chapter, preventing dropped promises.
- **Upstream Sandbox Laboratory (`Sandbox/`)**: Isolated creative staging laboratory (`draft/` -> `review/` -> `approved/` -> `_archive/`) where foreign cosmologies and speculative concepts mature under independent review before formal promotion to the Story Bible.
- **Craft Domain (`Craft/`)**: Dedicated space for narrative architecture audits, scene diagnostics, character voice guides, and critique reports.
- **Research Domain (`Research/`)**: Dedicated space for non-canon real-world science, tactical treatises, and historical references.
- **Cold-Start Sequence**: The disciplined 6-step read sequence executed at the beginning of each agent session.
- **Session-Close Sequence**: The disciplined 5-step write sequence executed before the final commit of each agent session.

---

## 6. Standardized Narrative Information Architecture (SNIA)

- **Standardized Narrative Information Architecture (SNIA)**: The comprehensive knowledge-organization specification (`docs/schema/information-architecture.md` and ADR 0008) defining folder boundaries, entity UIDs, Obsidian properties, tag namespaces, and lifecycle deprecation.
- **Epistemic Invariant ('Every Fact Has One Home')**: The fundamental rule that every fact belongs to the single layer whose job it is; elsewhere, summarize in one sentence and link there.
- **Canonical Unique Identifier (UID)**: Standardized entity identifier carrying an approved 3-letter domain prefix (`CAN-`, `SRC-`, `DIV-`, `CHR-`, `FAC-`, `LOC-`, `ITM-`, `PWR-`, `TEC-`, `REL-`, `TML-`, `ARC-`, `TRM-`, `LDG-`, `SBX-`, `CRT-`, `AUD-`, `RES-`, `CTX-`, `MEM-`, `MSP-`, `SYS-`) recorded in frontmatter `uid` and registered in `aliases`.
- **Obsidian 1.4+ Properties**: Universal YAML frontmatter standard ensuring every live note carries typed `note_type`, `title`, `uid`, `status`, `aliases`, `tags`, `created`, and `updated` fields.
- **Hierarchical Tag Taxonomy**: Strictly lowercase, namespaced associative tags (`#namespace/subvalue`) cutting across folders with strict anti-duplication rules (never tagging what frontmatter properties already record).
- **Map of Content (MOC)**: Top-level navigational atlas or domain dashboard utilizing standard 5-column tables (`UID`, `Module / Entity`, `Category`, `Status`, `Summary / Scope`) to enable friction-free human and AI navigation.

