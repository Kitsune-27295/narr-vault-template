---
name: foreshadowing-audit
description: Track clues, setups, red herrings, and payoffs across serialized arcs to prevent orphaned Chekhov promises
---
# foreshadowing-audit

Use this skill when auditing narrative setups, reviewing arc pacing, or preparing climactic chapter beats.

## Purpose & Context
In serialized narrative fiction, unfulfilled setups ("orphaned Chekhov guns") and forgotten foreshadowing destroy reader trust. This skill enforces Karen Ahlstrom's continuity ledger discipline by tracking every planted clue from inception to discharge.

## Pre-Audit Invariant Gates
1. Verify that `08_Ledgers/LDG-Foreshadowing.md` and `08_Ledgers/LDG-Chekhov_Guns.md` are accessible.
2. Ensure all drafted chapters in `04_Manuscript/pt-BR/Chapters/` have been registered in the ledgers.

## Step-by-Step Execution Workflow

### Step 1: Render Foreshadowing Audit Context
Assemble the current ledger status and active arcs:
```bash
narr prompt render foreshadowing-audit
```

### Step 2: Audit Clue Trajectories
Inspect each row in `08_Ledgers/LDG-Foreshadowing.md`:
| Clue ID | Planted Chapter | Clue & Setup Description | Intended Target | Actual Payoff | Status |
|---|---|---|---|---|---|
| FSH-001 | C02 | Strange resonance when metal touches altar | Arc 2 Climax | — | planted |

Audit criteria:
1. **Distance Check:** Calculate chapter delta between `Planted Chapter` and current chapter.
2. **Overdue Warning (VAL028):** If the current chapter has surpassed the `Intended Target` without resolution or deliberate deferral, flag as `OVERDUE`.
3. **Pacing Balance:** Ensure no single chapter introduces more than 3 major unresolved clues without advancing existing ones.
4. **Red Herring Validation:** If a clue is a deliberate red herring, verify that an in-universe revelation resolves the false trail cleanly.

### Step 3: Reconcile Chekhov Weapons Ledger
Inspect `08_Ledgers/LDG-Chekhov_Guns.md`:
- Verify that every weapon or artifact introduced in the narrative has a defined narrative promise.
- Check that discharged weapons are marked `status: discharged` with their discharging chapter cited.

### Step 4: Update Ledgers
Update the status column in `LDG-Foreshadowing.md`:
- `planted`: Clue introduced; awaiting payoff.
- `primed`: Clue reinforced or referenced in a subsequent arc.
- `paid_off`: Clue fulfilled in climactic beat; cite payoff chapter.
- `abandoned`: Intentionally discarded (must include justification).

### Step 5: Verification Gate
Run crosscheck and lint to verify zero continuity drift:
```bash
narr crosscheck
narr lint --path 08_Ledgers
```
