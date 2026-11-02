---
title: Continuity Audits & Diagnostic Tracker
type: dashboard
tags: [cockpit, continuity, audits, story-grid]
---

# 🔍 Continuity Audits & Diagnostic Tracker

> Real-time narrative integrity, pacing balance, and setup/payoff tracking powered by Dataview.

---

## 🎯 Unresolved Setups & Foreshadowing Tracker

Identifies all scenes where a narrative setup, clue, or Chekhov's gun was planted (`setup_introduced != ""`) but has not yet been resolved (`payoff_resolved` is empty or unresolved).

```dataview
TABLE chapter_num AS "Chapter", scene_order AS "Scene", pov_char AS "POV", setup_introduced AS "Introduced Setup / Clue"
FROM "Manuscript/pt-BR/01_Scenes"
WHERE setup_introduced AND setup_introduced != "" AND (!payoff_resolved OR payoff_resolved = "")
SORT chapter_num ASC, scene_order ASC
```

---

## ⚖️ POV Pacing & Scene Distribution

Analyzes narrative focus and character presence balance across all drafted scenes.

```dataview
TABLE length(rows) AS "Total Scenes", rows.chapter_num AS "Chapters"
FROM "Manuscript/pt-BR/01_Scenes"
WHERE note_type = "scene-pt"
GROUP BY pov_char
```

---

## 🎬 Resolved Payoffs Log

Records all setups that have successfully reached fruition and dramatic payoff.

```dataview
TABLE chapter_num AS "Chapter", scene_order AS "Scene", setup_introduced AS "Original Setup", payoff_resolved AS "Payoff Resolution"
FROM "Manuscript/pt-BR/01_Scenes"
WHERE payoff_resolved AND payoff_resolved != ""
SORT chapter_num ASC, scene_order ASC
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
- [[Manuscript/pt-BR/Index|Manuscript PT-BR Index]]
- [[Bible/00_Bible_Master_Index|Bible Master Index]]

