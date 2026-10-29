---
name: tone-and-voice-audit
description: "Audit manuscript chapters against Pitch & Tone Bible negative boundaries, sensory texture, and character formality registers. Use when chapters must be audited against the tone bible, negative boundaries and character registers."
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
4. **Metaphysical Law (Sanderson's Second Law):** Declared energy costs and universal limitations in `02_Story_Bible/Powers_and_Systems/` cannot be bypassed for plot convenience.

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

### Step 4: Deterministic Signals First
Read the numbers before judging by ear:
```bash
narr stats <N>                    # add --lang es for the Spanish chapter
narr lint --path 04_Manuscript    # STY001-STY005 are advisory warnings
```
Treat each signal as a place to look, not a verdict: STY001 filter words, STY002 -mente adverbs, STY003 flat rhythm, STY004 repeated sentence openers, STY005 stock phrases and negative parallelisms. Thresholds live in the `style:` block of `vault.yaml`.

### Step 5: Known Failure Modes of Generated Prose
Check each, and cite the paragraph marker:
1. **Stock physical tells:** the same breath, jaw, knuckle or heartbeat gesture standing in for every emotion.
2. **Negative parallelism:** "it was not X, it was Y" used as a default rhythm.
3. **Summary endings:** a paragraph or scene that closes by explaining its own meaning.
4. **Metaphor clusters:** three images stacked where one specific image would do; a metaphor family that never changes.
5. **Abstract emotion naming** where behaviour would show it (and the reverse: a symptom list where one plain word would do).
6. **Uniform cadence:** equal-length sentences or paragraphs for a whole scene.
7. **Dialogue as exposition:** characters telling each other what both already know.
8. **Generic specificity:** details that could belong to any story (a "worn leather satchel") instead of this one.
9. **Echoed openers and tics:** the same first word, the same pet phrase, scene after scene.

### Step 6: Patterns versus Tics
List what recurs and sort it. A *pattern* is chosen and varied by the author (a recurring image with a changing meaning). A *tic* repeats without change. Record tics for the curator; do not rewrite them without approval (Rule 20.3). Cite at most two example paragraph markers for the voice test: "could this sentence be someone else's?" and "can it be shorter without loss?"

### Step 7: Gate
```bash
narr lint --path 04_Manuscript
```
Confirm 0 errors; explain every remaining warning in the report instead of silencing it.
