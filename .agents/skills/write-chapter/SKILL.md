---
name: write-chapter
description: "Draft narrative chapters in pt-BR using hybrid prompt assembly, <!-- p:N --> paragraph delimiters, and continuous ledger synchronization. Use when a chapter must be drafted in pt-BR with paragraph markers, continuity and ledger synchronisation."
---
# write-chapter

Use this skill when drafting, revising, or expanding a narrative chapter in `04_Manuscript/pt-BR/Chapters/`.

## Purpose & Context
This workflow produces high-literary serialized fiction in natural Brazilian Portuguese (pt-BR) while enforcing strict narrative continuity, epistemic horizons, Sanderson power limits, and paragraph-level parity readiness for publication translation.

## Pre-Drafting Invariant Gates
Before writing a single paragraph of narrative prose:
1. Verify that the relevant Arc outline exists in `03_Continuity_and_Timeline/Arcs/`.
2. Verify that the POV Character Settei exists in `02_Story_Bible/Characters/` with a defined Visual HUD and Voice & Mannerisms (VAL026).
3. Ensure the current chapter does not breach the 10/90 Iceberg Ratio (WBL001).
4. Check active ledgers in `08_Ledgers/` for unresolved threads, primed Chekhov guns, and character knowledge constraints.

## Step-by-Step Execution Workflow

### Step 1: Scaffold Chapter Page
Generate the chapter markdown file using the blueprint engine:
```bash
narr new chapter_pt "C<NN> - <Chapter_Title>"
```
This creates `04_Manuscript/pt-BR/Chapters/C<NN>_<Slug>.md` with compliant frontmatter (`type: chapter`, `language: pt-BR`, `status: draft`).

### Step 2: Assemble Deterministic Context
Generate the fiction-conscious prompt with token budgeting:
```bash
narr prompt render write-chapter --chapter <NN> --pov "<Character_Name>" --arc "<Arc_Name>"
```
Review the assembled context sections:
- Atmospheric Tone & Negative Boundaries from `SCP-Tone_and_Identity_Bible.md`.
- Epistemic Horizon Ledger from `LDG-Character_Knowledge.md` (ensuring the POV character does not possess out-of-scene knowledge).
- Active Plot Threads & Chekhov Weapons.
- Foreshadowing Clues setup obligations.

### Step 3: Draft Narrative Prose
Draft the chapter in `04_Manuscript/pt-BR/Chapters/C<NN>_<Slug>.md` observing the core rules:
- **Language:** Natural, evocative Brazilian Portuguese (pt-BR).
- **Paragraph Delimiters:** Prefix every single narrative paragraph with `<!-- p:1 -->`, `<!-- p:2 -->`, etc. This provides the deterministic anchor for 1:1 publication translation (MSC004).
- **Show, Don't Tell:** Ground emotions in physical manifestations, tactile textures, and sensory anchors.
- **Active Voice:** Eliminate passive constructions and robotic transitions (VAL024).
- **Zero AI Fluff:** Never include conversational greetings or conversational commentary.
- **Absolute Metaphysical Limits:** Obey the energy costs and immutable boundaries declared in `02_Story_Bible/Powers_and_Systems/`.

### Step 4: Validate Invariants
Run deterministic post-generation validation:
```bash
narr prompt validate write-chapter 04_Manuscript/pt-BR/Chapters/C<NN>_<Slug>.md
```
Verifies:
- VAL010: Zero CJK characters outside raw sources.
- VAL024: Zero conversational AI preambles.
- Sequential integrity of `<!-- p:N -->` paragraph delimiters.
- Wikilink bracket syntax balance (`[[...]]`).

### Step 4b: Read the Prose Signals
```bash
narr stats <NN>
```
Look at sentence rhythm, filter words, -mente adverbs and repeated openers. These are advisory (STY001-STY005); fix real problems and explain the rest. Allow at most three revise-and-validate rounds per chapter; after that, record what is left in the handoff instead of looping.

### Step 5: Synchronize Operational Ledgers
First write the *state diff* of the chapter in the handoff: new facts, changed facts, and contradictions that stay open until the curator decides (log those in `LDG-Contradictions.md`). Then immediately update the continuity ledgers in `08_Ledgers/`:
1. `08_Ledgers/LDG-Character_Knowledge.md`:
   - Append newly acquired knowledge or deceptions experienced by the characters.
2. `08_Ledgers/LDG-Chekhov_Guns.md`:
   - Register any newly introduced objects, promises, or weapons (`status: primed`).
   - If an existing primed weapon was discharged in this chapter, update `status: discharged`.
3. `08_Ledgers/LDG-Active_Threads.md`:
   - Update progression or mark resolved threads.
4. `08_Ledgers/LDG-Foreshadowing.md`:
   - If a subtle clue or hint was planted, record the clue ID, planted chapter, and intended payoff arc.

### Step 6: Pre-Commit Quality Gates
Execute vault integrity checks:
```bash
narr lint --path 04_Manuscript/pt-BR/Chapters/C<NN>_<Slug>.md
narr crosscheck
```
Both commands must report 0 errors and 0 issues before the drafting turn is complete.
