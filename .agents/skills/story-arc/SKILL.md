---
name: story-arc
description: "Structure and track narrative arcs and plot threads in Bible/09_Plot_Threads_Arcs/. Helps select arc archetypes, define character dramatic spine, place beats with but-therefore causality, and track serialized milestones."
---

# story-arc

Use this skill to design, track, and audit narrative arcs and serialized plot threads in `Bible/09_Plot_Threads_Arcs/`.

## 1. Core Principles
- **Causality over Chronology:** Every major beat must connect via "Therefore" or "But" (causal consequence or complication), never "And then" (episodic drift).
- **Dramatic Spine:** Ground every character arc in a core Lie the protagonist believes, the Truth they must confront, their Want (surface goal), and their Need (thematic/internal realization).
- **Story Grid Alignment:** Ensure each arc defines global inciting incident, middle build crisis, and climactic turn.

## 2. Arc Template Integration
Create or update arc files conforming to `TPL_Bible_Plot_Arc.md`:
```markdown
---
note_type: fic-arc
title: "Arc 01: <Arc Title>"
status: active
chronology_start: "<calendar date>"
chronology_end: "<calendar date>"
pov_characters: ["<POV Character>"]
---

# Arc 01: <Arc Title>

## Summary
...

## Dramatic Spine
- **Protagonist Lie:** ...
- **Protagonist Truth:** ...
- **External Want:** ...
- **Internal Need:** ...

## Milestones & Beat Sheet
1. **Beat 1 (Inciting Incident):** ...
2. **Beat 2 (Rising Conflict):** ... [Therefore]
3. **Beat 3 (Midpoint Shift):** ... [But]
4. **Beat 4 (Crisis):** ... [Therefore]
5. **Beat 5 (Climax):** ...

## Status and Progress
...
```

## 3. Verification
Verify that arc beats align with the project calendar (epoch declared in `vault.yaml`) documented in `Bible/08_Chronology_Calendar/`.
