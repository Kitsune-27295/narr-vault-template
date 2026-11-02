# ADR 0001: Three-Layer Fanfiction Vault Architecture

## Status
Accepted

## Context
Writing expansive, multi-franchise crossover fanfiction creates profound organizational challenges: canonical lore from diverse source materials frequently clashes with fanfiction-specific timeline alterations (AU points of divergence), while drafting prose requires distinct story-grid tracking and multilingual translation management.

## Decision
We establish a strict 3-Layer Vault Architecture within Obsidian:
1. `Canon/`: Pure, unadulterated source facts partitioned per franchise (`Canon/<Universe>/`), subdivided into 7 standardized modular directories (`Sources`, `01_Characters` through `06_Timeline_Events`).
2. `Bible/`: The authoritative ground truth of the fanfiction project, hosting Points of Divergence (PODs), cast sheets with canon deltas, relationship matrices, and arc outlines.
3. `Manuscript/`: Creative drafting workspace organized by language editions (`pt-BR/` for working scenes and `es/` for published chapters).
4. `00_Cockpit/` and `99_System/`: Supporting layers for operational dashboards and shared bilingual translation rules.

## Consequences
- **Positive:** Absolute clarity regarding what is official canon versus what is fanfiction AU divergence. Clean boundary for AI context retrieval.
- **Negative:** Requires rigorous discipline during note creation so files are not placed in the wrong layer.
- **Mitigation:** Automate routing via the franchise resolver and validate via the F-RAG indexer.

