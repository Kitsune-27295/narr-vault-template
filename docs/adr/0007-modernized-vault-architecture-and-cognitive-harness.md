# ADR 0007: Modernized Vault Architecture and Cognitive Harness

## Status
Accepted

## Context
ADR 0001 and ADR 0002 established the 3-Layer Vault Architecture (`Canon/`, `Bible/`, `Manuscript/`) and streamlined canonical baselines and Bible modules. However, comparative analysis across reference vaults (several earlier project vaults) exposed critical operational liabilities:
1. Configuration fragmentation across scattered files.
2. Lack of in-flight session memory leading to context drift across agent turns.
3. Absence of a formal continuity ledger suite for tracking foreshadowing (Chekhov's guns), narrative decisions, and session handoffs.
4. An unintegrated, informal scratchpad (`Seeds_Scratchpad/`) lacking lifecycle phases and isolation boundaries.
5. Lack of dedicated domains for prose craft diagnostics (`Craft/`) and non-canon background research (`Research/`).
6. Absence of automated system health diagnostics and retrieval evaluation benchmarks.

## Decision
We modernize the target vault ecosystem with a blank-slate architectural reconstruction adapted to the native Node.js v24 ESM stack:

1. **Root Declarative Configuration (`vault.yaml`):**
   A single top-level YAML configuration defining story metadata, active tier (`T2`), languages (`drafting: pt-BR, publication: es`), character modules, tier requirements, continuity thresholds (`chekhov_gap`, `thread_dormant_gap`), and context budgets (`hot_lines`, `agents_lines`, `note_bytes`).

2. **Cognitive Second Brain Harness (`context/` and `memory/`):**
   - `context/author.md`: Author voice, tone, perspective, and pacing constraints.
   - `context/languages.md`: Bilingual translation pipeline rules and zero-CJK invariant.
   - `memory/hot.md`: In-flight active state (<60 lines) read on cold start.
   - `memory/learnings.md`: Operational learnings changing next-session behavior.
   - `memory/journal/YYYY-MM.md`: Append-only session work log.

3. **Continuity Ledgers Suite (`Ledgers/`):**
   - `LDG-Chekhov.md`: Plants and payoffs tracker (`planted`, `paid_off`, `abandoned`).
   - `LDG-Decisions.md`: Creative and story choices not visible in prose (Date, Decision, What was rejected, Why, Chapter).
   - `LDG-Open_Threads.md`: Active, dormant, and resolved subplots.
   - `LDG-Contradictions.md`: Conflict register with dual citations and authorial resolutions (replacing the earlier Bible-level register).
   - `LDG-Session_Handoff.md`: Surface boundary handoff tracking where work stopped.
   - `IDX-Ledgers.md`: Master index for Obsidian navigation.

4. **Upstream Sandbox Laboratory (`Sandbox/`):**
   Replaces `Seeds_Scratchpad/` with an isolated staging environment (`draft/`, `review/`, `approved/`, `_archive/`) and an auditable project registry (`_registry.md`). The laboratory is upstream; the vault never wikilinks into `Sandbox/`.

5. **Craft & Research Domains (`Craft/` and `Research/`):**
   - `Craft/`: Style guides, scene diagnostic rubrics, critique reports (`Critiques/`), and narrative audits (`Audits/`).
   - `Research/`: Real-world science, history, and mythology reference notes (`Notes/`, `Inbox/`).

6. **Retrieval Evaluation Benchmark (`eval/`) & Tooling:**
   - `eval/queries.yaml` & `eval/baseline.json`: Benchmark suite measuring search recall@k and MRR.
   - Node.js ESM tools: `tools/doctor.js`, `tools/brief.js`, `tools/vault/ledger-validator.js`, `tools/session-close.js`, and `tools/rag/eval.js`.

7. **The Seven Inviolable Rules & Disciplined Cold-Start / Close Sequence:**
   Codified in `AGENTS.md` and `CLAUDE.md`.

## Consequences
- **Positive:**
  - Complete elimination of session context drift and hardcoded parameters.
  - High-precision foreshadowing tracking preventing orphaned narrative promises.
  - Upstream isolation protecting the Bible from unverified foreign concepts.
  - Instantaneous diagnostic health checks via `npm run doctor` and `npm run brief`.
  - Zero external Python dependencies; 100% native Node.js ESM execution.
- **Negative:**
  - Requires maintaining `memory/hot.md` and session handoffs on every working turn.
- **Mitigation:**
  - Enforced via `tools/session-close.js` and automated budget checks in `tools/doctor.js`.

