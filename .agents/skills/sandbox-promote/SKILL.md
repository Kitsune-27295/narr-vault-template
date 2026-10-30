---
name: sandbox-promote
description: Sanitize, distill, and promote mature concepts from 06_Ideation_and_Unblocking into authoritative Story Bible layers.
---
# Sandbox Distillation & Promotion (`sandbox-promote`)

Use this skill when transitioning mature concepts from `06_Ideation_and_Unblocking/` to `02_Story_Bible/` or `01_Canon_and_Divergence/PODs/`.

## 1. Epistemic Distillation (Sanitization)
Before promotion, strip:
- Cross-universe analogies ("like Dragon Ball", "anime style").
- Raw brainstorming dialogue, author scratch notes, and stream-of-thought dumps.
Retain:
- In-universe rules, physics, physical specifications, character traits, and historical lineages.

## 2. Execute Promotion via CLI
```bash
narr promote "<path-to-sandbox-file>" --zone <characters|factions|locations|powers|cosmology|pods> --prefix <CHR|FAC|LOC|PWR|SYS|SCP|POD> --slug <Safe_Slug> --title "<Formal Title>"
```

## 3. Log Decision
Record the promotion in memory:
```bash
narr decide "Promote <Entity> to Story Bible"
```

## 4. Validate
```bash
narr lint
```
