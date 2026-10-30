---
name: tone-and-voice-audit
description: Audit manuscript chapters against Pitch & Tone Bible negative boundaries, sensory texture, and character formality registers
---
# tone-and-voice-audit

Use this skill to perform stylistic and thematic quality assurance on completed drafts or revisions.

## Purpose & Context
Prevents tonal degradation, anachronisms, AI stylistic homogenization ("fluff"), and character voice drift. Enforces the creative boundaries defined in `02_Story_Bible/Cosmology_and_Godhood/SCP-Tone_and_Identity_Bible.md`.

## Pre-Audit Invariant Gates
1. Review `02_Story_Bible/Cosmology_and_Godhood/SCP-Tone_and_Identity_Bible.md`.
2. Inspect target chapter in `04_Manuscript/pt-BR/Chapters/` or `04_Manuscript/es/Chapters/`.

## Step-by-Step Execution Workflow

### Step 1: Thematic Negative Boundaries Audit
Verify that the text strictly respects the 4 Thematic Negative Boundaries:
1. **Earned Growth:** No unearned power-ups, convenient awakening without physical, psychological, or spiritual toll.
2. **Antagonist Psychology:** Antagonists must not act out of cartoonish malice; their actions must be driven by coherent, self-justified internal logic.
3. **Zero Anachronisms:** Modern idioms, contemporary pop-culture humor, and meta-commentary are strictly forbidden.
4. **Metaphysical Law (Sanderson's First Law):** Declared energy costs and universal limitations in `02_Story_Bible/Powers_and_Systems/` cannot be bypassed for plot convenience.

### Step 2: Dialogue & Voice Register Audit
Compare each speaking character against their `02_Story_Bible/Characters/CHR-*.md` sheet:
- **Catchphrases & Verbal Tics:** Are signature phrases used organically rather than mechanistically?
- **Formality Register:** Does an elder speak with appropriate gravitas? Does a disciple observe proper social distancing in speech?
- **Stress Reaction:** Does the character's reaction under mortal pressure match their declared stress profile?

### Step 3: Prose Style & Sensory HUD Audit
Audit narrative prose against high-craft standards:
- **Sensory Anchors:** Does the scene engage at least 3 distinct senses (smell, temperature, sound, visual silhouette, physical weight)?
- **Active Voice:** Flag and eliminate passive verbs (`foi feito por`, `era visto por`) (VAL024).
- **Prose Cadence:** Check sentence length variation—short staccato sentences during high-stakes combat, expansive rhythmic periods during atmospheric worldbuilding.

### Step 4: Invariant Linter Check
Run automated stylistic checks:
```bash
narr lint --path 04_Manuscript
```
Confirm 0 errors and 0 warnings.
