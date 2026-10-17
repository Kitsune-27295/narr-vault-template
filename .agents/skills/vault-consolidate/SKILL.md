---
name: vault-consolidate
description: Audit vault consolidation leads (near-duplicate notes, dead links, stale superseded links, open contradictions) using deterministic Jaccard token overlap (narr candidates).
---

# Vault Consolidation Routine

Use after waves of several ingests, before beginning a new story arc, or when the author requests vault deduplication and refactoring.

---

## 1. Surface Deterministic Leads

Run:
```bash
narr candidates
```
Surfaces:
- **`[MERGE?]`**: Same page type with token Jaccard similarity $\ge 0.60$ not bidirectionally linked.
- **`[STALE_LINK]`**: Inbound links pointing to a page marked `status: superseded`.
- **`[CONTRADICTION]`**: Declared frontmatter contradictions or open ledger items in `LDG-Contradictions.md`.

Also run:
```bash
narr graph
```
to inspect disconnected orphan pages and dead links.

---

## 2. Formulate Consolidation Actions

Apply this decision matrix:

1. **True Duplicates:**
   - Choose the canonical SSOT page.
   - Refactor references using the atomic rename tool:
     ```bash
     narr mv <Duplicate_Page> <Target_Page>
     ```
   - Mark duplicate as `status: superseded` with `superseded_by: [[Target_Page]]`.
2. **Complementary Entities:**
   - If two pages share high lexical overlap but represent distinct entities, link them bidirectionally: `[[Page A]]` $\leftrightarrow$ `[[Page B]]`.
   - This silences `narr candidates` for that pair.
3. **Stale Links:**
   - Update wikilinks in pointing files to target the successor entity directly.
4. **Declared Contradictions:**
   - Verify that both perspectives are cited and documented in `08_Ledgers/LDG-Contradictions.md`.

---

## 3. Verify Vault Health

```bash
narr lint
narr crosscheck
```
Verify 100% compliance with zero errors and zero warnings.
