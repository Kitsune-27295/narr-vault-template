---
uid: "TMP-Baseline"
type: baseline
title: "<Domain title, as in domains.yaml>"
domain: <domain_id>
aliases:
  - "<Alternate name, translation or Pinyin>"
source_ids:
  - "SRC-<YYYYMMDD>-<slug>"
status: draft
scope: source_canon
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags:
  - "canon/baseline"
---
# <Domain title>

<!--
Charter (copy from domains.yaml, never edit the scope here):
  Domain: <domain_id> (<kind>). In scope: <scope_in topics>.
  Delegated: <topic> -> <owner domain id>; link, do not explain.
One dossier per domain. A fact lives in the dossier that owns it; every other dossier links.
Create it with `narr domain new <domain_id>`; route the sources with `narr ingest route <id>`.
-->

> [!NOTE]
> **Executive Summary:** <2-3 sentences: what this domain is, which sources feed it, and what it governs in the setting.>

---

## 1. Definition and Terminology
<!-- One unified definition. Choose the vault's canonical term; list every alias, translation and Pinyin in the frontmatter and in the table below. Follow the vault's terminology decision (memory/decisions/DEC-*.md). -->

<Definition: what the domain is, in the setting's own terms, reconciled across all sources.>

| Canonical term | Aliases and variants | Where the variants appear |
|:---|:---|:---|
| **<Term>** | <Alias; translation; Pinyin> | <SRC ids> |

---

## 2. Mechanics and Laws
<!-- Rules that always hold, one atomic fact per line, each with a literal quote. State limits and costs before powers (rule 30). -->

- **[Law 1]:** <Assertion.>
  *"<Literal quote from the source.>"* [[SRC-<id>]]
- **[Limit 1]:** <Cost, ceiling or restriction.>
  *"<Literal quote.>"* [[SRC-<id>]]

---

## 3. Taxonomy and Progression
<!-- Tiers, categories, levels or stages. Use tables. Keep each source's own scale distinct when scales differ. -->

| Tier or category | Definition | Mechanical effect | Examples | Source |
|:---|:---|:---|:---|:---|
| **<Tier>** | <Definition> | <Effect> | <Examples> | [[SRC-<id>]] |

---

## 4. Interactions and Delegations
<!-- How this domain touches others. Explain only what this domain owns; for everything in `delegates`, write one line and link the owner dossier. -->

- **With [[CAN-<Other_Dossier>]]:** <One-line interaction; the owner explains the mechanics.>

See also: [[CAN-<Related_Dossier>]]

---

## 5. Divergences: Retcons, Media Variants, Translation Conflicts
<!-- Never choose a side silently. Separate three kinds of divergence:
 - Retcon or era: the rule as it really works vs what characters of an era knew.
 - Medium: source text vs adaptations; rank them with `canon_authority` in vault.yaml.
 - Translation: variant names for one thing.
Each side keeps its own literal quote and uid. Log source-vs-source conflicts in 08_Ledgers/LDG-Contradictions.md. -->

- **<Topic>:** <What differs.>
  - Side A: *"<Quote.>"* [[SRC-<id>]]
  - Side B: *"<Quote.>"* [[SRC-<id>]]
  - Status: open | resolved by era | resolved by authority. Ledger: <CON id>.

---

## 6. Verbatim Evidence
*Rule 30: literal quotations from frozen sources in `01_Canon_and_Divergence/Sources/`, one source per quote.*

- *"<Quote demonstrating the central fact.>"* [[SRC-<id>]]

---

## 7. What it does NOT establish
*Rule 30: say what the sources do not state, to stop assumptions and fanon bleed.*

1. **<Boundary 1>:** <The sources do not state or imply that ...>
2. **<Boundary 2>:** <Does not allow ...>

---

## 8. Maintenance Log
*Incremental upsert: a new source is routed, then each claim is redundant (skip), complementary (insert in the right section) or conflicting (section 5 and the ledger). Never overwrite silently.*

| Date | Source | Change |
|:---|:---|:---|
| YYYY-MM-DD | [[SRC-<id>]] | <Created / added tier X / recorded conflict> |

---

## 9. Glossary and Aliases

| Term | Category | Definition |
|:---|:---|:---|
| **<Term>** | <Category> | <One-line definition> |
