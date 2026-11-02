---
note_type: cockpit-dashboard
type: dashboard
title: Continuity Audits & Diagnostic Tracker
uid: CKP-CONTINUITY-AUDITS
status: active
aliases:
  - Continuity Audits
  - 04_Continuity_Audits
  - CKP-CONTINUITY-AUDITS
tags:
  - '#cockpit/dashboard'
created: '2026-11-01'
updated: '2026-11-02'
---

# 🔍 Continuity Audits & Diagnostic Tracker

> Real-time narrative integrity, pacing balance, and setup/payoff tracking powered by Dataview.

---

## 🎯 Unresolved Setups & Foreshadowing Tracker

Identifies all scenes where a narrative setup, clue, or Chekhov's gun was planted (`setup_introduced != ""`) but has not yet been resolved (`payoff_resolved` is empty or unresolved).

```dataview
TABLE chapter_num AS "Chapter", pov_char AS "POV", setup_introduced AS "Introduced Setup / Clue"
FROM "Manuscript/pt-BR"
WHERE setup_introduced AND setup_introduced != "" AND (!payoff_resolved OR payoff_resolved = "")
SORT chapter_num ASC
```

---

## ⚖️ POV Pacing & Scene Distribution

Analyzes narrative focus and character presence balance across all drafted scenes.

```dataview
TABLE length(rows) AS "Total Chapters", rows.chapter_num AS "Chapters"
FROM "Manuscript/pt-BR"
WHERE note_type = "chapter-pt" OR note_type = "scene-pt"
GROUP BY pov_char
```

---

## 🎬 Resolved Payoffs Log

Records all setups that have successfully reached fruition and dramatic payoff.

```dataview
TABLE chapter_num AS "Chapter", setup_introduced AS "Original Setup", payoff_resolved AS "Payoff Resolution"
FROM "Manuscript/pt-BR"
WHERE payoff_resolved AND payoff_resolved != ""
SORT chapter_num ASC
```

---

## 💀 Cast Mortality & Continuity State Sanity Check

Cross-checks characters across the cast to track vital statuses and prevent anachronistic appearances post-mortem.

```dataview
TABLE status AS "Vital Status", cosmology AS "Cosmology Origin", aliases AS "Titles / Aliases"
FROM "Bible/02_Cast_Characters"
SORT status ASC, file.name ASC
```

---

## 🔗 Cockpit Navigation

- [[00_Cockpit/00_Home_Dashboard|Home Dashboard]]
- [[Ledgers/LDG-Contradictions|Contradictions Ledger]]
- [[Manuscript/pt-BR/Index|Manuscript PT-BR Index]]
- [[Bible/00_Bible_Master_Index|Bible Master Index]]

