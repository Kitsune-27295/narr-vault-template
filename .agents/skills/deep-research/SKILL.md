---
name: deep-research
description: Deep 3-Level Research Protocol: Local Story Vault, then Second_brain PKB (craft/science only), then Web Intelligence via Firecrawl.
---
# Deep Research Protocol (Strict Non-Pollution)

Stop at the first level that directly answers the question.

## Level 1: Local Story Vault & Canon
1. **BM25 Search:**
   ```bash
   narr search "<terms>" -k 8
   ```
2. **Fiction-Conscious Context:**
   ```bash
   narr rag context --chapter <NN>
   ```
3. Inspect `01_Canon_and_Divergence/` and `02_Story_Bible/`. If answered, stop here.

## Level 2: Personal Knowledge Base (`C:\Users\Utilizador\Desktop\brain`)
> [!IMPORTANT]
> **STRICT SCOPE BOUNDARY - CRAFT & REAL-WORLD SCIENCE ONLY:**
> The PKB is reserved for writing craft, prose cadence, genre theory, physics, biochemistry, philosophy, and software architecture.
> **NEVER query PKB for fictional franchise lore or character profiles.** Skip Level 2 for fictional trivia.

1. **Query PKB:**
   ```bash
   sb search "<terms>" -k 8
   ```
2. Report findings with page attribution.

## Level 3: Web Intelligence & Parallel Verification
1. Fetch direct URLs via `firecrawl_scrape`.
2. General queries: run `firecrawl_search` and `search_web` in parallel, cross-verify, and synthesize.
