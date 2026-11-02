---
note_type: cockpit-dashboard
type: dashboard
title: Home Dashboard
uid: CKP-HOME-DASHBOARD
status: active
aliases:
  - Home Dashboard
  - 00_Home_Dashboard
  - CKP-HOME-DASHBOARD
tags:
  - '#cockpit/dashboard'
created: '2026-11-02'
updated: '2026-11-02'
---

# Home Dashboard

> **Narrative Vault Framework workspace.** Set the title, source universes, and languages in `vault.yaml`.

---

## Canon Sources Inbox

![[Sources_Inbox.base]]

---

## Canon Encyclopedia (Holocron View)

![[Canon_Holocron.base]]

---

## Divergence Tracker

![[Bible_Divergences.base]]

---

## Story Grid - Scene Surgery Table

![[Story_Grid_Scenes.base]]

---

## Translation Pipeline

![[Translation_Pipeline.base]]

---

## Quick Navigation

### Canon
- [[Canon/Universe_Primary/00_Universe_Primary_Index|Universe Primary Canon Index]]
- [[Canon/Universe_Secondary/00_Universe_Secondary_Index|Universe Secondary Canon Index]]

### Bible & Narrative Core
- [[Bible/00_Bible_Master_Index|Bible Master Index]]
- [[Bible/09_Plot_Threads_Arcs/00_Open_Questions|Open Questions]]
- [[00_Cockpit/04_Continuity_Audits|Continuity Audits]]

### Continuity Ledgers
- [[Ledgers/IDX-Ledgers|Ledgers Master Index]]
- [[Ledgers/LDG-Chekhov|Chekhov's Gun Ledger]]
- [[Ledgers/LDG-Decisions|Narrative Decisions Ledger]]
- [[Ledgers/LDG-Open_Threads|Open Threads Ledger]]
- [[Ledgers/LDG-Contradictions|Contradictions Ledger]]
- [[Ledgers/LDG-Session_Handoff|Session Handoff Ledger]]

### Sandbox, Craft & Research
- [[Sandbox/README|Sandbox / Laboratory]]
- [[Sandbox/Seeds_Inbox|Seeds Inbox]]
- [[Sandbox/_registry|Sandbox Projects Registry]]
- [[Craft/README|Craft & Feedback]]
- [[Research/README|Research Layer]]

### Manuscript
- [[Manuscript/pt-BR/Index|Manuscript pt-BR Index]]
- [[Manuscript/es/Index_ES|Manuscript es Index]]

---

## Operational Lifecycle
1. **Capture** - `npm run clip` -> `Canon/<Universe>/Sources/`
2. **Distill** - `npm run ingest` -> `Canon/<Universe>/Baselines/`
3. **Establish Bible** - Divergence PODs, cast sheets, chronology
4. **Draft** - `Manuscript/pt-BR/` with Story Grid audit metadata
5. **Translate** - `Manuscript/es/` with lexicon alignment
6. **Publish** - `99_System/Export_Templates/AO3_Export_Procedure.md`
