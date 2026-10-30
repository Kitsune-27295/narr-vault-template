---
uid: "LDG-Architecture_Decision_Records"
type: ledger
title: "Architecture Decision Records"
description: "Formal log of foundational structural and architectural decisions governing the narrative framework"
status: active
---

# Architecture Decision Records (ADR)

This ledger records architectural decisions that govern vault topology, ingestion invariants, multi-agent synchronizations, and cognitive memory tiering across the Narrative Framework.

---

## ADR-001: Separation of Canon Truth from Creative Divergence
- **Status:** Accepted (2026-10-15)
- **Context:** Creative fanfiction projects historically suffered from "fanon bleed", where creative hypotheses contaminated factual canon references.
- **Decision:** Strictly isolate pure canon inside `01_Canon_and_Divergence/Baselines/` (`CAN-` prefix) grounded in immutable raw sources (`SRC-` prefix). All narrative divergences must be explicitly declared in `01_Canon_and_Divergence/PODs/` (`POD-` prefix).
- **Consequences:** Linters reject any creative speculation in `CAN-` files. Creative changes require an explicit POD anchor.

---

## ADR-002: Dual Agent Harness Topology (.agents and .claude)
- **Status:** Accepted (2026-10-15)
- **Context:** Different AI coding harnesses (Google Antigravity, Claude Code) read skills from different standard root locations.
- **Decision:** Maintain identical skill catalogs in both `.agents/skills/` and `.claude/skills/`, enforced by `narr doctor` multi-agent parity verification.
- **Consequences:** Zero drift between agent harnesses; complete tooling portability.

---

## ADR-003: Unified CLI Architecture (narr)
- **Status:** Accepted (2026-10-16)
- **Context:** Legacy framework relied on multiple disjointed python scripts (`vault_lint.py`, `bible_crosscheck.py`, `catalog_manager.py`).
- **Decision:** Consolidate all vault operations into a single modular CLI tool (`narr`) installed via `pyproject.toml` with subcommands (`doctor`, `lint`, `crosscheck`, `ingest`, `new`, `preset`, `prompt`, `pipeline`).
- **Consequences:** Standardized testing, robust packaging, streamlined terminal operations.

---

## ADR-004: Right-Sized Ingest Consolidation
- **Status:** Accepted (2026-10-17)
- **Context:** Naive 1:1 source-to-baseline ingestion created hyper-fragmented micro-stubs (108 stubs), causing severe context-window thrashing and tool-hopping overhead. Monolithic mega-files (>50 KB) cause token exhaustion.
- **Decision:** Mandate a "Goldilocks Zone" for canon baselines: 3 KB to 15 KB (approx. 80-220 lines), consolidating 2 to 5 versioned or closely related sources per baseline.
- **Consequences:** High informational density, reduced tool hops, unified topic context. Multi-source baselines verify quotes against the union of cited sources.

---

## ADR-005: 4-Tier Cognitive Memory & Knowledge Governance
- **Status:** Accepted (2026-10-17)
- **Context:** Long-horizon narrative generation and multi-chapter authoring require seamless coordination between instant operational state, episodic session logs, structured canonical truth, and evolutionary framework governance.
- **Decision:** Establish a formal 4-Tier Cognitive Memory Hierarchy synthesized from production multi-agent memory frameworks:
  1. **Tier 1 (Ephemeral Working Memory):** `memory/hot.md` (active sprint goals, immediate blockers, context limits).
  2. **Tier 2 (Episodic Session Memory):** `08_Ledgers/LDG-Session_Handoff.md` and `LDG-Canon_Ingest_Log.md` (append-only timeline of agent actions, verification proofs, and handoff tokens).
  3. **Tier 3 (Semantic & Structural Memory):** `01_Canon_and_Divergence/` and `02_Story_Bible/` (persistent wikilinked entity graphs, RPG status sheets, and consolidated baselines indexed in SQLite FTS5).
  4. **Tier 4 (Evolutionary Meta-Governance):** `.agents/skills/framework-sync-governance/` and `Meta/Presets/` (bidirectional synchronization between specialized story vaults and the neutral framework core).
- **Consequences:** Eliminates context drift across multi-session authoring, ensures zero-regression transitions, and guarantees architectural integrity.

---

## ADR-006: Native Link-Following Renaming & Undo Journal (`narr mv`)
- **Status:** Accepted (2026-10-17)
- **Context:** In ongoing narrative projects, renaming characters, factions, or power systems manually resulted in widespread broken ``wikilinks``.
- **Decision:** Implement `narr mv <old> <new>` with global link following across all markdown files and an atomic rollback journal stored in `.narr/mv_journal.jsonl`.
- **Consequences:** All inbound references are updated automatically; any rename can be undone with 100% fidelity using `narr mv --undo`.

---

## ADR-007: Deterministic Consolidation Leads (`narr candidates`)
- **Status:** Accepted (2026-10-17)
- **Context:** Fandom wiki inboxes and creative worldbuilding often introduce near-duplicate entities with minor title variations.
- **Decision:** Implement `narr candidates` using mathematical Jaccard token overlap ($\ge 0.60$) between entities of the same type, detecting stale links to superseded pages, and surfacing declared contradictions.
- **Consequences:** Provides actionable, evidence-based consolidation leads without autonomous destructive merges.

---

## ADR-008: Retrieval Quality Benchmarking (`narr eval`)
- **Status:** Accepted (2026-10-17)
- **Context:** As vaults expand to hundreds of pages, RAG retrieval quality for chapter drafting risks degradation without quantitative measurement.
- **Decision:** Adopt `Second_brain`'s evaluation framework (`eval/queries.yaml` and `eval/runs.jsonl`), calculating Recall@k, MRR, Hit Rate, and NDCG@k via `narr eval`.
- **Consequences:** Guarantees that search recall remains $\ge 0.80$; warns when hybrid vector indexing or FTS5 re-weighting is needed.

---

## ADR-009: Network-Confined Source Clipping & Offline Mirroring (`narr clip` & `narr import`)
- **Status:** Accepted (2026-10-17)
- **Context:** Ingesting fandom wiki lore or downloaded novel chapters required tedious manual file creation and formatting.
- **Decision:** Add `narr clip <url>` (with SSRF protection and tracking parameter removal) and `narr import <folder>` (offline folder mirror with SHA-256 deduplication).
- **Consequences:** Web and offline sources are staged automatically into `01_Canon_and_Divergence/Sources/inbox/` with `.meta.json` sidecars, preventing duplicate inboxes.

---

## ADR-010: Budget-Constrained Multi-Tier Operational Memory Brief (`narr memory brief`)
- **Status:** Accepted (2026-10-17)
- **Context:** Large LLM context windows often get bloated by raw file dumps during session initialization.
- **Decision:** Implement `narr memory brief` enforcing a strict character budget (<9,000 chars) that synthesizes working memory (`hot.md`), active plot threads, primed Chekhov guns, open decisions, pending inbox items, and vault health.
- **Consequences:** Any agent cold-starts with perfect situational awareness in under 1,500 tokens.

---

## ADR-011: Deterministic Vault Guard Beyond the Linter (`tools/vault_audit.py`)
- **Status:** Superseded by ADR-015 (2026-10-19)
- **Context:** `narr lint` and `narr crosscheck` passed while baselines held unsourced numbers, quotes did not come from the cited source, tables had broken columns, scopes were undefined and ledgers held sample rows.
- **Decision:** Ship `tools/vault_audit.py`. It fails on dead wikilinks, frozen-source SHA mismatch, italic quotes absent from the cited sources, `uid` not matching the filename, undefined `scope`, table column mismatch, ledger rows for unwritten chapters, absolute local links and CJK outside Sources.
- **Consequences:** Run it with `narr lint` before every commit. `tools/build_atlas.py` rebuilds the Atlas so the hub cannot drift.

---

## ADR-012: Content-Level Multi-Agent Parity (`narr doctor`)
- **Status:** Accepted (2026-10-18)
- **Context:** The parity check compared only rule file names, so a drifted skill passed as "Synchronized".
- **Decision:** `narr doctor` compares rules and skills by relative path and by line-ending-insensitive SHA-256, and names the drifting files.
- **Consequences:** Edit a skill in both `.agents/` and `.claude/` in the same change, or the check fails.

---

## ADR-013: Author Voice Reaches the Chapter Prompt
- **Status:** Accepted (2026-10-18)
- **Context:** `narr prompt render write-chapter` ignored `context/author_voice.md`, and spent its token budget on frontmatter.
- **Decision:** The prompt includes `context/author_voice.md` as a priority-1 section and strips YAML frontmatter from every injected note.
- **Consequences:** The voice contract shapes every drafted chapter. Keep the file short; it is truncated at 2,200 characters.

---

## ADR-014: Presets Register Their Page Types
- **Status:** Accepted (2026-10-18)
- **Context:** Presets introduced page types (for example a profession or a theory) that `narr lint` rejected until the curator edited `vault.yaml` by hand.
- **Decision:** A preset manifest may list `custom_types`. `narr preset apply` appends the missing ones to `vault.yaml` and reports them. The merge is idempotent.
- **Consequences:** Applying a preset is enough to make its seeded templates lint-clean.

---

## ADR-015: Centralized Guard SSOT in `narr.checks` and Thin Audit Wrapper
- **Status:** Accepted (2026-10-19)
- **Context:** ADR-011 created `tools/vault_audit.py` as an independent script outside the core CLI engine, duplicating verification logic and diverging from `narr lint` / `narr crosscheck`.
- **Decision:** Promote all vault invariant checks (VAL033–VAL038) directly into `src/narr/checks.py`. Refactor `template/tools/vault_audit.py` into a thin client delegating directly to `narr.checks.run_all_checks`. Supersede standalone guard logic in ADR-011.
- **Consequences:** Single Source of Truth for all ontological rules across CLI, test suites, and template helper scripts.
