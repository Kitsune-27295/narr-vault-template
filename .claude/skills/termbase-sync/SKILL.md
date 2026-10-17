---
name: termbase-sync
description: Synchronize and govern multi-lingual terminology, cultivation ranks, proper nouns, and measurement units in TRM-Termbase.md
---
# termbase-sync

Use this skill when introducing new characters, martial arts, factions, artifacts, or when localizing chapters between pt-BR and es.

## Purpose & Context
Maintains absolute terminology consistency across all worldbuilding notes, drafts, and publication translations. Prevents terminology drift, inconsistent rank naming, and translation collisions.

## Pre-Execution Checklist
1. Identify all newly coined terms, Chinese/Pinyin source terms, or fantasy proper nouns.
2. Open `02_Story_Bible/Terminology/TRM-Termbase.md`.

## Step-by-Step Execution Workflow

### Step 1: Terminology Extraction & Comparison
When a new entity is introduced in lore or manuscript:
1. Extract original name (e.g., Pinyin, Hanzi, or fantasy source term).
2. Establish official **Brazilian Portuguese (pt-BR)** rendering.
3. Establish official **Spanish (es)** publication rendering.
4. Define grammatical gender, capitalization rule, and honorific register.

### Step 2: Register in TRM-Termbase.md
Append the standardized entry under the appropriate section in `02_Story_Bible/Terminology/TRM-Termbase.md`:

#### A. Measurement & Currency
```markdown
| World Unit | Earth Metric / Context Equivalent | Currency Exchange Standard |
|---|---|---|
| 1 Li | ~500 meters | Standard overland distance |
```

#### B. Titles & Honorifics Governance
```markdown
| Original / Source | pt-BR Translation | es Translation | Context & Social Register |
|---|---|---|---|
| Shifu (师父) | Mestre | Maestro | Familial martial mentor |
| Shixiong (师兄) | Irmão Sênior | Hermano Mayor | Senior disciple in lineage |
```

#### C. Cultivation Ranks & Realm Matrix
```markdown
| Realm Tier | pt-BR Standard | es Standard | Metaphysical Benchmark |
|---|---|---|---|
| Tier 1 | Reino Espiritual | Reino Espiritual | Faint aura condensation |
```

#### D. Techniques & Artifacts
```markdown
| Entity UID | pt-BR Term | es Term | Scope & Governing System |
|---|---|---|---|
| [[PWR-Void_Step]] | Passo do Vazio | Paso del Vacío | Spatial displacement |
```

### Step 3: Validate Terminology Compliance
Check that no draft or story bible file uses unapproved localized variants:
```bash
narr lint --path 02_Story_Bible/Terminology/TRM-Termbase.md
narr crosscheck
```

### Step 4: Multi-Agent Parity Check
Ensure the updated termbase propagates cleanly:
```bash
narr doctor
```
