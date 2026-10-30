---
name: continuity-postmortem
description: Conduct a blameless postmortem when a manuscript chapter violates established canon baselines, power-scaling limits (Sanderson), character voice, or timeline causality.
---

# Narrative Continuity Postmortem

Use when an author, editor, or linter flags a continuity break, character voice deviation, power-scaling plot hole, or broken Chekhov promise in `04_Manuscript/`.

**Objective:** Understand how the rupture entered the manuscript, determine whether it represents an intentional Point of Divergence (`POD-`) or an unintentional defect, and remediate both the symptom and the root cause.

---

## 1. Collect Evidence & Identify the Rupture

1. Identify the chapter and specific paragraph (`<!-- p:N -->`) where the inconsistency occurred.
2. Search the Story Bible and Baselines for the authoritative rule:
   ```bash
   narr search "<conflicting concept>" -k 5
   ```
3. Check `08_Ledgers/LDG-Active_Threads.md` and `LDG-Chekhov_Guns.md` to see if a narrative promise was violated.

---

## 2. Classify the Rupture Type

- **Type A: Unintentional Hallucination / Fact Error:** The prose contradicts an immutable baseline (e.g., character absorbs a 10,000-year ring at Rank 10 without explanation).
- **Type B: Intentional Fanfiction Divergence:** The change is an intentional AU element that was never formally declared in `01_Canon_and_Divergence/PODs/`.
- **Type C: Character Voice / Settei Regression:** A character uses modern slang, acts out of alignment with their `Voice & Mannerisms`, or breaks their established knowledge horizon.

---

## 3. Execute Remediation

1. **If Unintentional (Type A or C):**
   - Apply surgical diff to the manuscript chapter in `04_Manuscript/pt-BR/Chapters/`.
   - Re-validate translation parity in `04_Manuscript/es/Chapters/` if already translated.
2. **If Intentional Divergence (Type B):**
   - Scaffold an authoritative Point of Divergence:
     ```bash
     narr new pod "<POD Short Title>"
     ```
   - Anchor the divergence to the baseline and declare the butterfly effects.
3. **Record Contradiction:**
   - Update `08_Ledgers/LDG-Contradictions.md` if the discrepancy remains an active tension across factions or sources.

---

## 4. Run Quality Verification

```bash
narr lint
narr crosscheck
```
Ensure zero errors and zero warnings before closing the session.
