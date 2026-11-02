---
name: conflict-arbitration
description: "Formal protocol for arbitrating canon collisions, source contradictions, and Point of Divergence (POD) branchings. Use when two sources, a baseline and a fanfiction rule, or a point of divergence contradict each other."
---

# conflict-arbitration

Use this skill whenever two sources present conflicting assertions, or when the fanfiction storyline deliberately diverges from official canon.

## Purpose & Context
Maintains vault epistemic integrity by preventing silent retcons, unresolved plot holes, or unacknowledged contradictions between raw canon sources and creative fanfiction divergence.

## The Canonical Hierarchy of Truth
When two assertions collide, resolve them using the strict 4-Tier Hierarchy:
1. **Tier 1 — Deliberate Fanfiction Divergence (POD):** Points of Divergence in `Bible/01_Divergences_AU/` take absolute precedence over Canon (AGENTS.md Invariant Rule 2). A declared AU POD is the project's ground truth.
2. **Tier 2 — Primary Source Canon:** Frozen raw text in `Canon/<Franchise>/Sources/` and consolidated in `Canon/<Franchise>/Baselines/`. Authoritative un-diverged baseline.
3. **Tier 3 — Secondary Author Statements & Databooks:** Interviews, authorial notes, and databooks. Subservient to Tier 2 if a direct contradiction occurs in primary manga/novel text.
4. **Tier 4 — In-Universe Unreliable Narrators:** Characters can lie, misremember, hold flawed metaphysical models, or possess partial knowledge. A character claiming "technique X cannot be learned" does not override an established baseline proving X is possible.

## Step-by-Step Execution Workflow

### Step 1: Document the Collision
Record the contradiction in `00_Cockpit/04_Continuity_Audits.md`:
| ID | Date | Topic | Assertion A (with Link) | Assertion B (with Link) | Status | Governing Resolution |
|---|---|---|---|---|---|---|
| CONT-001 | YYYY-MM-DD | <Topic> | *"Quote A"* [[Link]] | *"Quote B"* [[Link]] | Investigating | [PENDING ARBITRATION] |

### Step 2: Apply Governing Resolution Rule
Select the appropriate outcome:
- **Case A — Canon Supersession:** Source B is later or more authoritative primary canon.
  - *Action:* Update affected Baseline in `Canon/<Franchise>/Baselines/`. Record superseded status in the baseline's uncertainty section.
- **Case B — In-Universe Epistemic Limitation:** Both quotes are canon, but Assertion A was spoken by a misinformed or biased character.
  - *Action:* Document character knowledge boundary in cast notes. Mark contradiction resolved.
- **Case C — Creative AU Point of Divergence:** The fanfiction intentionally departs from canon.
  - *Action:* Formalize a POD note in `Bible/01_Divergences_AU/DIV_<Name>.md` conforming to `TPL_Bible_Divergence_POD.md`. Link the POD directly to the diverged Baseline (`[[Canon/<Franchise>/Baselines/Baseline_<Topic>|Baseline - <Topic>]]`).

### Step 3: Vault Integrity Check
Run link and vault validators:
```bash
npm run validate:links
npm run validate:vault
```
