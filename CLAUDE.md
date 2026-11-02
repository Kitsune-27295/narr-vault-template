# CLAUDE.md — Narrative Vault Framework & Operating Contract

This document is the operating contract for Claude Code interacting with this repository, maintaining complete operational parity with `AGENTS.md`.

---

## Agent skills

### Issue tracker
Local markdown issues under `.scratch/<feature-slug>/issues/`. See `docs/agents/issue-tracker.md`.
Superseded historical records in `.scratch/` are provenance only; do not treat their preserved body as active work or canon. Follow the authoritative chronology and current Canon/Bible records.

### Domain docs
Single-context repository layout (`GLOSSARY.md` + `docs/adr/`). See `docs/agents/domain.md`.

### Native construction workflow
Repository-owned Matt Pocock workflow skills live in `.agents/skills/`. Follow `docs/agents/native-construction-workflow.md`; run `npm run validate:workflow` when editing its skills or references.

### Consolidated vault skills
The `.agents/skills/` directory houses 15 specialized skills adapted for the vault lifecycle:
- **Knowledge Lifecycle:** `research`, `triage`, `ingest`, `dossier-compile`, `query`, `consolidate`, `conflict-arbitration`, `decide`.
- **Narrative Craft:** `story-arc`, `narrative-architecture-audit`, `foreshadowing-audit`, `tone-and-voice-audit`, `reader-sim`, `revision-pass`, `unblock`.

---

## 1. Project Purpose & Dual Usability

This repository is a **production-ready, dual-surface framework and vault template for long-form narrative projects (original fiction, fanfiction, multiverse and crossover work)**:
- **Human Authors:** Full Obsidian vault support with Dataview/Bases dashboards (`00_Cockpit/`), Robert Caro-style archival sourcing (`Canon/`), Story Grid diagnostic scene trackers (`Manuscript/pt-BR/`), an asymmetrical Portuguese-to-Spanish translation pipeline (`Manuscript/es/`), and an isolated upstream creative laboratory (`Sandbox/`).
- **AI Coding & Writing Agents:** Deterministic command-line toolchain, strict schema validation, offline SQLite FTS5 search, Fiction-Conscious RAG (F-RAG) context assembly, and a Second Brain cognitive harness (`context/`, `memory/`, `Ledgers/`).

---

## 2. Cold-Start & Session-Close Sequences

### Cold-Start Sequence (Read in order)
1. **`vault.yaml`** — Story title, source universes, active tier, rating, languages, character modules, thresholds, and budgets.
2. **`context/author.md`** — Authorial voice, tone, narrative perspective, and stylistic constraints.
3. **`context/languages.md`** — Bilingual translation rules (pt-BR / es), paragraph markers, and zero-CJK invariant.
4. **`memory/hot.md`** — In-flight active work, what needs the author, and active invariants.
5. **`Ledgers/LDG-Session_Handoff.md`** (last row) — Where the previous session stopped and next immediate priority.
6. **The target note** the author or task specifically references.

### Session-Close Sequence (Write in order before final commit)
1. **`memory/hot.md`** — Update in-flight items, active chapter state, author-pending questions, and vault stats (strictly <= 60 lines).
2. **`memory/journal/YYYY-MM.md`** — Append session summary: `- [YYYY-MM-DD] <kind> | <what changed and why it mattered>`.
3. **`memory/learnings.md`** — Append durable operational learnings that change next-session behavior (capped at 10 KB).
4. **`Ledgers/`** — Update relevant ledgers (`LDG-Chekhov.md`, `LDG-Decisions.md`, `LDG-Open_Threads.md`, `LDG-Contradictions.md`).
5. **`Ledgers/LDG-Session_Handoff.md`** — Append session handoff row via `npm run session:close` or manual append.

---

## 3. Command Surface & Development Lifecycle

All lifecycle scripts are defined in `package.json` (Node.js v24 ESM):

```bash
# Verification & Diagnostics
npm test                    # Run full Vitest unit & integration test suite
npm run doctor              # Inspect runtime, SQLite, configuration, and directory health
npm run brief               # Output fast morning/cold-start operational briefing
npm run validate:workflow   # Validate native construction skills
npm run validate:templates  # Validate markdown templates & frontmatter schemas
npm run validate:sources    # Validate source capture frontmatter and JSON sidecars
npm run validate:vault      # Validate eligible typed vault notes
npm run validate:links      # Check active Obsidian links across all vault domains
npm run validate:ledgers    # Check Chekhov gaps and dormant open threads
npm run session:close       # Record session handoff row and update journal

# Engine 1: Web Clipper
npm run clip -- <url>       # Clip fandom wiki article into Canon/<Franchise>/Sources/

# Engine 2: Modular Ingestor
npm run ingest -- <path>    # Ingest raw source into structured Modular Baseline Dossier

# Unified Pipeline
npm run pipeline -- <url>   # Execute clip + ingest end-to-end in one pass

# Engine 3: Fiction-Conscious RAG (F-RAG)
npm run rag:sync            # Incremental sync of all vault markdown into .scratch/vault_index.db
npm run rag:search -- "<q>" [--zone <zone>] [--limit <n>]
npm run rag:context -- "<q>" [--scene <path>] [--budget <tokens>]
npm run rag:eval            # Run retrieval evaluation benchmark against eval/queries.yaml
```

---

## 4. Vault Architecture & Operating Boundaries

The vault adheres to the expanded **Dual-Surface Vault Architecture** (see `docs/adr/0001-three-layer-fanfiction-vault-architecture.md`, `docs/adr/0002-simplified-canon-and-comprehensive-bible.md`, `docs/adr/0007-modernized-vault-architecture-and-cognitive-harness.md`, and `docs/adr/0008-standardized-vault-information-architecture.md`; specified in `docs/schema/information-architecture.md`):

1. **`00_Cockpit/`**: Central operational dashboards (`00_Home_Dashboard.md`), inboxes, Bases tables, and translation progress overviews.
2. **`Canon/`**: The immutable baseline of official source lore, partitioned per franchise (`Canon/<Universe_Name>/`), strictly divided into two subdirectories:
   - `Sources/`: Raw clipped Markdown files and cryptographic JSON sidecars with SHA256 integrity verification.
   - `Baselines/`: Consolidated, subject-specific canonical baseline dossiers (`Baseline_<Subject>.md`) conforming to `TPL_Canon_Baseline.md` (`note_type: canon-baseline`).
3. **`Bible/`**: The story's ground truth (alternate-universe or original) organized into 10 structured modules:
   - `01_Divergences_AU/`: Points of Divergence (PODs) labeled `DIV_*.md`.
   - `02_Cast_Characters/`: Cast profiles documenting canon deltas and dialogue voices (`*_AU.md`).
   - `03_Factions_Organizations/`: Political structures, clans, syndicates, and council dynamics as they exist in the story.
   - `04_Locations/`: Geographic and architectural settings altered or introduced in the AU (`LOC_*_AU.md`).
   - `05_Items_Artifacts/`: AU relics, synthesized weapons, and cross-cosmology treasures (`ITEM_*.md`).
   - `06_Power_Systems_Mechanics/`: Multiverse energy synergy laws (`PWR_*`) and standalone OC techniques (`TECH_*`).
   - `07_Relationship_Matrix/`: Dynamic interpersonal and factional matrices (`REL_*`).
   - `08_Chronology_Calendar/`: Master forward timeline measured from the project's declared epoch.
   - `09_Plot_Threads_Arcs/`: Master narrative roadmap, active arcs (`ARC_*`), and open questions.
   - `10_Terminology_Glossary/`: In-universe terminology, naming rules, and translation keys.
4. **`Manuscript/`**: Story prose workspace:
   - `pt-BR/`: Master drafting language (direct chapter files with Story Grid audit notes; no subfolders).
   - `es/`: Publication language (direct translated chapter files ready for AO3 export; no subfolders).
5. **`Ledgers/`**: Cross-cutting continuity ledgers (`LDG-Chekhov.md`, `LDG-Decisions.md`, `LDG-Open_Threads.md`, `LDG-Contradictions.md`, `LDG-Session_Handoff.md`, `IDX-Ledgers.md`).
6. **`Sandbox/`**: Upstream creative development laboratory (`_registry.md`, `README.md`, `draft/`, `review/`, `approved/`, `_archive/`). Not canon until promoted to Bible.
7. **`Craft/`**: Narrative diagnostics, scene surgery rubrics, critique reports (`Critiques/`), and audit findings (`Audits/`).
8. **`Research/`**: Non-canon real-world science, history, and mythology reference notes (`Notes/`, `Inbox/`).
9. **`context/`**: Author voice (`author.md`) and language pipeline standards (`languages.md`).
10. **`memory/`**: In-flight cognitive state (`hot.md`), durable learnings (`learnings.md`), and session work logs (`journal/`).
11. **`eval/`**: Golden retrieval evaluation benchmark (`queries.yaml`, `baseline.json`).
12. **`99_System/`**: System configuration, templates, bilingual lexicons, and franchise routing (`franchise-rules.json`, a starter routing registry to adapt per project).

---

## 5. Invariant Rules for AI Agents

1. **Language Discipline:**
   - All internal documentation, system configs, tools, tests, and Bible dossiers **MUST be in US English (`en-US`)**.
   - The **ONLY** exceptions are prose drafts in `Manuscript/pt-BR/` (Portuguese) and `Manuscript/es/` (Spanish).
2. **AU Divergence Precedence (F-RAG Rule):**
   - In fanfiction drafting, **Points of Divergence (`Bible/01_Divergences_AU/`) take absolute precedence over Canon**.
   - If an AU POD states that a character's powers, background, or relationships have changed, the AI **must adhere strictly to the AU reality** and never default back to official canon.
3. **Single-Link Baseline Provenance:**
   - AU dossiers in `Bible/` must link directly to a single canonical baseline (`[[Canon/<Franchise>/Baselines/Baseline_<Topic>|Baseline - <Topic>]]`) and document only the AU divergence delta. Avoid linking directly to multiple raw captures in `Sources/`.
4. **Non-Destructive Sourcing & Manuscript Protection:**
   - Raw files in `Canon/*/Sources/` and existing story text in `Manuscript/` must never be overwritten destructively without explicit author command. Feedback belongs in `Craft/Critiques/` or as proposed diffs.
5. **Fast Feedback & Test Safety:**
   - Any modifications to code in `tools/` must be accompanied or validated by tests in `tests/`. Always run `npm test` before committing changes.
6. **Authoritative Timeline Alignment:**
   - Declare the project's epoch and authoritative calendar baseline in `vault.yaml` (`story.epoch`, `story.authoritative_calendar`); that baseline governs every dated event.
   - Measure dated chronology forward from the declared epoch. Never mix competing dating systems (for example negative years, `BP`, or countdowns relative to a source work) unless the baseline explicitly defines them.
   - Derive character ages from documented birth years and the event year; do not carry forward conflicting legacy ages.

7. **Vault Link Integrity:**
   - When editing Obsidian wikilinks, note paths, or reusable Markdown templates, run `npm run validate:links` and resolve all reported missing targets before completion.
8. **Zero-CJK Policy:**
   - Outside immutable source captures in `Canon/*/Sources/`, all live vault files prohibit Hanzi/Kanji characters (default policy; relax it in `context/languages.md` if the project does not need it). Romanize all Japanese, Chinese, or foreign terms with italics (for example Hepburn or Pinyin forms set in italics).
9. **Native Mermaid Diagrams:**
   - All architecture trees, state lifecycles, and workflows must be rendered in native ````mermaid` blocks. ASCII art diagrams are prohibited.
10. **Sandbox Staging Isolation:**
   - The laboratory in `Sandbox/` is upstream of the vault. Ideas are not canon until promoted to `Bible/`. The vault never wikilinks into `Sandbox/` (cite sandbox paths in \`code\`).
11. **Standardized Information Architecture (SNIA) & UID Conventions:**
   - All live notes must define valid Obsidian 1.4+ Properties (`note_type`, `title`, `uid`, `status`, `aliases`, `tags`, `created`, `updated`).
   - Entity UIDs must follow the approved 3-letter prefix taxonomy (`CKP-`, `BIB-`, `CAN-`, `SRC-`, `DIV-`, `CHR-`, `FAC-`, `LOC-`, `ITM-`, `PWR-`, `TEC-`, `REL-`, `TML-`, `ARC-`, `TRM-`, `LDG-`, `SBX-`, `CRT-`, `AUD-`, `RES-`, `CTX-`, `MEM-`, `MSP-`, `SYS-`).
   - Tags must strictly adhere to the lowercase `#namespace/subvalue` taxonomy without duplicating frontmatter properties.
