---
name: foreshadowing-audit
description: "Track clues, setups, red herrings, and payoffs across serialized arcs to prevent orphaned Chekhov promises. Use when setups, clues and payoffs must be checked for orphaned promises before drafting or revising an arc."
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
Read `08_Ledgers/LDG-Foreshadowing.md`, `08_Ledgers/LDG-Chekhov_Guns.md` and the active arcs.

### Step 2: Audit Clue Trajectories
Inspect each row in `08_Ledgers/LDG-Foreshadowing.md`:
| Clue ID | Planted Chapter | Clue & Setup Description | Intended Target | Actual Payoff | Status |
|---|---|---|---|---|---|
| FSH-001 | C02 | Strange resonance when metal touches altar | Arc 2 Climax | — | planted |

Read the deterministic results instead of calculating by hand:
```bash
python tools/vault_audit.py
```
- **FSH001 (error):** a payoff chapter that comes before its plant.
- **FSH002 (error):** a row marked paid off or discharged without a payoff chapter.
- **FSH003 (warning):** a planted or primed row without a planted chapter.
- **VAL028 (warning):** an unresolved row whose `Intended Target` chapter is already drafted.

Audit criteria beyond the CLI:
1. **Promise, progress, payoff:** every promise needs at least one visible progress beat between plant and payoff. Mark a row `primed` when a later chapter reinforces it, and name that chapter.
2. **Kind:** note whether the row is a clue, a lie, a truth or a pinch; a lie or truth first planted in the final quarter of an arc is a structural problem.
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
python tools/vault_audit.py
narr lint --path 08_Ledgers
```
