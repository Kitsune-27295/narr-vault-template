---
name: consolidate
description: "Use when the author asks to clean up, consolidate, review, or audit the vault, or after adding multiple sources or chapters. Detects near-duplicate pages, stale links, contradictions, and lint warnings, proposing clean reconciliations."
---

# Consolidate the wiki and vault

Use this skill to perform vault-wide maintenance, eliminate redundancy, repair broken links, and reconcile lore across Canon, Bible, and Manuscript layers.

## 1. Scan Vault Health
Run deterministic health and validation checks:
```bash
npm run validate:vault
npm run validate:links
npm run validate:templates
npm run validate:sources
npm test
```

## 2. Identify Defect Categories
1. **Broken Links:** Wikilinks pointing to non-existent notes or outdated paths.
2. **Duplicate Baselines:** Two baselines covering overlapping domains without clear scope boundaries.
3. **Orphaned Notes:** Notes with zero incoming links that are not indexed in dashboards or master indexes.
4. **Stale Divergences:** Bible notes referencing obsolete Canon paths instead of current `Canon/<Franchise>/Baselines/` hubs.
5. **Lint / Schema Errors:** Notes missing required frontmatter fields or mandatory section headers.

## 3. Propose Consolidation Plan
Present findings in a clear table:
| Defect Type | Location | Problem | Proposed Fix |
|---|---|---|---|
| Broken link | Bible/... | Links to old 01_Characters path | Update link to Baselines/Baseline_... |

Wait for author approval before executing structural deletions or major note merges.

## 4. Execute and Re-verify
Execute approved changes, update indices, and re-run validation commands to ensure zero broken links and 100% test pass.
