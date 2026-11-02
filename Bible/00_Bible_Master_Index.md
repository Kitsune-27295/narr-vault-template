---
note_type: bible-index
title: Story Bible Master Index
uid: BIB-MASTER-INDEX
status: established
aliases:
  - Story Bible
  - Bible Master Index
  - BIB-MASTER-INDEX
tags:
  - '#bible/index'
created: '2026-11-02'
updated: '2026-11-02'
---

# Story Bible Master Index

> The authoritative ground truth of the narrative. Where Canon Baselines describe what is true in the source works, the Story Bible defines what is true in this story. Points of Divergence (PODs) recorded in `01_Divergences_AU/` take absolute precedence over canon.

---

## Architecture & Modules

| UID | Module / Domain | Type / Category | Status | Summary / Scope |
|---|---|---|---|---|
| `BIB-DIV` | [[01_Divergences_AU/\|01_Divergences_AU/]] | Divergence PODs | active | Points of Divergence establishing where and how the story deviates from canon |
| `BIB-CHR` | [[02_Cast_Characters/\|02_Cast_Characters/]] | Cast Profiles | active | Cast dossiers: canon deltas, voice, decision logic, state as of a date |
| `BIB-FAC` | [[03_Factions_Organizations/\|03_Factions_Organizations/]] | Factions & Organizations | active | Political bodies, clans, syndicates, and their relationships |
| `BIB-LOC` | [[04_Locations/\|04_Locations/]] | Settings & Geography | active | Places altered or introduced by the story |
| `BIB-ITM` | [[05_Items_Artifacts/\|05_Items_Artifacts/]] | Items & Relics | active | Weapons, artifacts, and crafted objects |
| `BIB-PWR` | [[06_Power_Systems_Mechanics/\|06_Power_Systems_Mechanics/]] | Power Systems & Techniques | active | Energy laws, cross-universe conversion rules, and standalone techniques |
| `BIB-REL` | [[07_Relationship_Matrix/\|07_Relationship_Matrix/]] | Social & Factional Webs | active | Relationship webs, emotional dynamics, and allegiances |
| `BIB-TML` | [[08_Chronology_Calendar/\|08_Chronology_Calendar/]] | Forward Timeline | active | Authoritative timeline measured from the epoch declared in `vault.yaml` |
| `BIB-ARC` | [[09_Plot_Threads_Arcs/\|09_Plot_Threads_Arcs/]] | Plot Arcs & Roadmaps | active | Serialized arcs, dramatic spines, active subplots, and open questions |
| `BIB-TRM` | [[10_Terminology_Glossary/\|10_Terminology_Glossary/]] | Terminology & Romanization | active | In-universe terminology, naming rules, and translation keys |

---

## Governance & Arbitration
- **[[Ledgers/LDG-Contradictions|Contradictions Ledger]]**: auditable register of canon collisions and authorial resolutions.

---

## Invariant Rules for Bible Maintenance

1. **Divergence precedence:** PODs in `01_Divergences_AU/` override official canon. Never let drafting default back to canon when an AU rule is declared.
2. **Single-link baseline provenance:** every Bible entry that adapts a canon concept links to the single authoritative Baseline (`[[Canon/<Franchise>/Baselines/Baseline_<Topic>\|Baseline - <Topic>]]`) and records only its delta.
3. **Language discipline:** Bible notes are written in US English (`en-US`); only `Manuscript/` drafts use other languages.
4. **Chronology alignment:** all dating follows the epoch and calendar declared in `vault.yaml`.
