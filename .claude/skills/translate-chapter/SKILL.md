---
name: translate-chapter
description: Translate and localize manuscript chapters from pt-BR to es publication with 1:1 paragraph parity (MSC004) and TRM-Termbase compliance
---
# translate-chapter

Use this skill when translating and localizing a validated draft chapter from `04_Manuscript/pt-BR/Chapters/` into `04_Manuscript/es/Chapters/` for publication.

## Purpose & Context
The publication layer is released in literary Spanish (`es`). To guarantee editorial integrity, audiobook alignment, and multi-language synchronization, every Spanish chapter must maintain a strict 1:1 paragraph correspondence (`MSC004`) with its Brazilian Portuguese counterpart.

## Pre-Translation Invariant Gates
1. Verify that the source pt-BR chapter draft is complete and validated:
   ```bash
   narr prompt validate write-chapter 04_Manuscript/pt-BR/Chapters/C<NN>_<Slug>.md
   ```
2. Verify that `02_Story_Bible/Terminology/TRM-Termbase.md` contains the official localization equivalents for all proper nouns, martial ranks, and realm terminology.

## Step-by-Step Execution Workflow

### Step 1: Scaffold Publication Page
Scaffold the target Spanish chapter linking back to the source draft:
```bash
narr new chapter_es "C<NN> - <Spanish_Title>" --source-ref "C<NN>_<Slug_PT>"
```
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
Generate the translation prompt with full termbase integration:
```bash
narr prompt render translate-chapter --chapter <NN> --lang es
```
Review the assembled context:
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
narr prompt validate translate-chapter 04_Manuscript/es/Chapters/C<NN>_<Slug_ES>.md --source-file 04_Manuscript/pt-BR/Chapters/C<NN>_<Slug_PT>.md
```
Verifies:
- MSC004: Paragraph count difference is within strict tolerance ($\le 10\%$).
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
