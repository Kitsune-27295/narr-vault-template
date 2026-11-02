---
name: triage
description: "Use when the author asks which captured sources are worth compiling into baselines first, or when several pending sources exist in Canon/<Franchise>/Sources/. Classifies each source with structured criteria to propose ingest, baseline-compile, skip, or clarify."
---

# Triage pending sources

Use this skill to prioritize, filter, and classify raw captured sources in `Canon/<Franchise>/Sources/` before synthesizing them into canonical baselines.

## 1. Gather the State
List raw source captures without corresponding baseline coverage or where `is_processed: false` is declared in frontmatter.

## 2. Answer Four Core Questions for Every Source
1. **Franchise & Canon Tier:** Is this primary canon, secondary databook/novel, adaptation-specific, or fanon? (Fanon is rejected from Canon).
2. **Relevance to Current Story Arcs:** Does this directly support Act I/II narrative planning, cast profiles, power mechanics, or immediate scene drafting?
3. **Pillars Check:** Does the source establish standalone rules, taxonomies, or multi-arc significance, or is it merely minor background detail?
4. **Collision Risk:** Does the source contradict established baselines or declared Points of Divergence (`Bible/01_Divergences_AU/`)?

## 3. The Triage Policy
- **Compile Now:** High-relevance, primary or secondary canon establishing new mechanics, major factions, key characters, or world lore $\rightarrow$ Route to `dossier-compile` into `Canon/<Franchise>/Baselines/`.
- **Reference Only:** Minor trivia, episode recap, or secondary detail that does not warrant its own baseline $\rightarrow$ Keep in `Sources/` and link as a secondary citation in an existing baseline.
- **Conflict / POD Candidate:** Directly conflicts with existing canon or planned AU narrative $\rightarrow$ Route to `conflict-arbitration`.
- **Reject / Archive:** Fanon or corrupt wiki scrape $\rightarrow$ Quarantine or remove.
