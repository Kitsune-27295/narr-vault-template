---
name: conflict-arbitration
description: Formal protocol for arbitrating canon collisions, source contradictions, and Point of Divergence (POD) branchings
---
# conflict-arbitration

Use this skill whenever two sources present conflicting assertions, or when a fanfiction storyline deliberately branches from source canon.

## Purpose & Context
Maintains vault epistemic integrity by preventing silent retcons, unresolved plot holes, or unacknowledged contradictions between raw canon sources and creative fanfiction divergence.

## The Canonical Hierarchy of Truth
When two assertions collide, resolve them using the strict 4-Tier Hierarchy:
1. **Tier 1 — Primary Source Canon:** Frozen raw text in `01_Canon_and_Divergence/Sources/`. Immutable ground truth.
2. **Tier 2 — Secondary Author Statements:** Interviews, authorial social posts, supplementary data books. Subservient to Tier 1 if a direct contradiction occurs.
3. **Tier 3 — Deliberate Fanfiction Divergence (POD):** Explicitly declared Points of Divergence (`POD-*.md`). Valid within the fanfic branch, but must explicitly declare which `CAN-*.md` baseline it diverges from (VAL019).
4. **Tier 4 — In-Universe Unreliable Narrators:** Characters can lie, misremember, hold flawed metaphysical models, or be deceived. A character claiming "X is impossible" does not invalidate an established baseline proving X occurred.

## Step-by-Step Execution Workflow

### Step 1: Render Conflict Arbitration Context
Assemble active contradictions from the registry:
```bash
narr prompt render conflict-arbitration
```

### Step 2: Register Collision in LDG-Contradictions.md
Add an entry in `08_Ledgers/LDG-Contradictions.md`:
| ID | Date | Topic | Side A Quote | Side B Quote | Status | Governing Rule & Resolution |
|---|---|---|---|---|---|---|
| CONT-<NNN> | YYYY-MM-DD | <Topic> | *"Quote A"* [[SRC-A]] | *"Quote B"* [[SRC-B]] | investigating | [PENDING ARBITRATION] |

### Step 3: Apply Governing Resolution Rule
Select the appropriate arbitration outcome:
- **Case A — True Canon Contradiction:** Source B supersedes Source A due to chronological priority or authorial revision.
  - Action: Update affected `CAN-*.md` baseline. Mark old fact `status: superseded` with `superseded_by: [[CAN-New]]`.
- **Case B — In-Universe Epistemic Limitation:** Both quotes are canon, but Side A was spoken by an uninformed character.
  - Action: Record character blindspot in `08_Ledgers/LDG-Character_Knowledge.md` and character sheet. Update contradiction status to `resolved`.
- **Case C — Deliberate Point of Divergence (Fanfiction):** The fanfiction intentionally breaks away from canon at an atomic event.
  - Action: Scaffold a new POD page:
    ```bash
    narr new pod "<POD_Title>"
    ```
    Link the POD to the diverged baseline (`CAN-*.md`). Update contradiction status to `resolved (POD)`.

### Step 4: Vault Consolidation & Integrity Check
Run consolidation and lint checks:
```bash
narr consolidate
narr crosscheck
narr lint
```
Confirm all links resolve cleanly, zero dead links exist, and zero open unresolved contradictions remain.
