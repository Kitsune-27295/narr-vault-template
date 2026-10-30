---
name: translate-chapter
description: "Translate and localize manuscript chapters from pt-BR to es publication with 1:1 paragraph parity (MSC004) and TRM-Termbase compliance. Use when a pt-BR chapter must be translated to es with paragraph parity and termbase compliance."
---
# translate-chapter

Use this skill when translating and localizing a validated draft chapter from `04_Manuscript/pt-BR/Chapters/` into `04_Manuscript/es/Chapters/` for publication.

## Purpose & Context
The publication layer is released in literary Spanish (`es`). To guarantee editorial integrity, audiobook alignment, and multi-language synchronization, every Spanish chapter must maintain a strict 1:1 paragraph correspondence (`MSC004`) with its Brazilian Portuguese counterpart.

## Pre-Translation Invariant Gates
1. Verify that the source pt-BR chapter draft is complete and validated:
   ```bash
   narr lint --path 04_Manuscript/pt-BR/Chapters/C<NN>_<Slug>.md
   ```
2. Verify that `02_Story_Bible/Terminology/TRM-Termbase.md` contains the official localization equivalents for all proper nouns, martial ranks, and realm terminology.

## Step-by-Step Execution Workflow

### Step 1: Scaffold Publication Page
Scaffold the target Spanish chapter linking back to the source draft:
Create `04_Manuscript/es/Chapters/C<NN>_<Slug_ES>.md` by hand (copy the pt-BR file's frontmatter, set `language: es` and `source_ref`).
This generates `04_Manuscript/es/Chapters/C<NN>_<Slug_ES>.md` with frontmatter:
```yaml
---
uid: "C<NN>_<Slug_ES>"
type: chapter
title: "C<NN> - <Spanish_Title>"
language: es
status: draft
source_translation_ref: "[[C<NN>_<Slug_PT>]]"
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags:
  - manuscript/es
---
```

### Step 2: Assemble Localization Context
Gather the translation context yourself:
Review:
- Source pt-BR chapter text with existing `<!-- p:N -->` anchors.
- Official terminology mappings from `TRM-Termbase.md`.
- Target prose rhythm and tone guidelines from `SCP-Tone_and_Identity_Bible.md`.

### Step 3: Execute Translation with Paragraph Parity
Translate the prose paragraph by paragraph into literary Spanish:
- Maintain exact 1:1 paragraph alignment: `<!-- p:1 -->` in Spanish translates `<!-- p:1 -->` from Portuguese.
- Do not merge separate paragraphs or split single paragraphs.
- Apply official Spanish localized terms from `TRM-Termbase.md`.
- Preserve sensory imagery, dramatic subtext, and character voice registers.
- Never output AI conversational introductions (e.g., 'Aquí está la traducción').

### Step 4: Verify Translation Parity (MSC004)
Run automated parity verification:
```bash
narr translate check <NN>
```
And execute deep invariant validation:
```bash
narr translate check <NN>
```
Verifies:
- MSC004: Every `<!-- p:N -->` marker of the source appears exactly once, in the same order (block counts with a 10 % tolerance apply only when neither file has markers).
- Complete preservation of sequential `<!-- p:N -->` paragraph delimiters.
- VAL010: Zero CJK characters in publication output.
- VAL024: Zero conversational assistant preambles.
- Zero broken wikilink brackets.

### Step 5: Final Pre-Commit Gates
Run the full lint suite:
```bash
narr lint
narr doctor
```
Ensure 0 errors, 0 warnings, and 4/4 doctor passes.
