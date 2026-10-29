---
name: vault-query
description: "Disciplined knowledge query: search before reading, answer with citations, report gaps, and file back valuable syntheses. Use when the vault must be searched and answered with citations and gaps reported."
---
# Query the Vault

Use when the author asks what the story bible knows, connects, or establishes about a character, power, timeline event, or rule.

## 1. Search First; Never Open Files Blindly
Run search with 2 to 3 formulations:
```bash
narr search "<terms>" -k 8
```
Inspect scores and snippets before opening full files.

## 2. Read Only What Hits Justify
Use `narr related "<title>"` to view inbound/outbound links. Open only relevant files.

## 3. Answer with Citations
- Cite every factual claim using `[[Page_Name]]`.
- Differentiate:
  - **Canon Ground Truth:** `[[CAN-...]]`
  - **Fanfiction State:** `[[CHR-...]]`
  - **Divergence Point:** `[[POD-...]]`
- When sources disagree, present both sides.

## 4. Report Vault Gaps
If search finds no coverage, state plainly: *"The vault does not currently establish [X]."*
Do not invent or hallucinate facts without explicitly declaring them as proposals.
