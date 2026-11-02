# ADR 0003: Continuous Modular Dossier Ingestion

## Status
Accepted

## Context
Fandom wikis contain massive amounts of noisy HTML, sidebars, advertisements, and unstructured narrative summaries. When importing lore into a fanfiction knowledge base, dumping raw web pages directly into canon folders creates unmaintainable bloat and hallucination vectors.

## Decision
We implement a two-engine continuous canon pipeline:
1. **Engine 1 (Hybrid Web Clipper):** Strips DOM boilerplate using `linkedom`, extracts infoboxes into sidecar JSON, formats progression tables as clean Markdown, and writes to `Canon/<Franchise>/Sources/`.
2. **Engine 2 (Semantic Map-Reduce Ingestor):** Decomposes raw sources into typed claims, evaluates them against the 3 Pillars Rule, and synthesizes them into structured Modular Dossiers under `Canon/<Franchise>/04_Rules_Mechanics/`.
3. **Scope Delegation & Canon Layering:** Sub-techniques and secondary items are delegated via wikilinks rather than duplicating full text. Conflict logs track retcons and adaptations.
4. **Declarative Franchise Routing:** Driven by `99_System/franchise-rules.json` with automatic directory scaffolding.

## Consequences
- **Positive:** High signal-to-noise ratio, structured invariant rules for LLMs, deterministic idempotency via SHA-256 hashes.
- **Negative:** Requires initial rule configuration for new cosmologies.
- **Mitigation:** Fallback franchise extraction and automated directory scaffolding.

