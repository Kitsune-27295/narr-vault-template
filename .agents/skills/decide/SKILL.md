---
name: decide
description: "Use when the author makes or revisits an architectural, worldbuilding, or narrative design choice that will be referenced again (\"let's use X\", \"we decided Y\", \"why did we pick Z\"). Records it as an ADR or Bible decision note."
---

# Record a decision

Use this skill to document durable architectural, worldbuilding, or narrative decisions so rationale is never lost across turns or sessions.

## 1. When to Use
- Establishing a new vault architectural pattern or directory convention.
- Establishing crossover energy synergy laws or cultivation equivalencies.
- Choosing between conflicting plot directions or character origin designs.
- Modifying testing or validation rules.

## 2. Where Decisions Live
- **Vault Architecture & Engineering:** Record as an Architectural Decision Record in `docs/adr/NNNN-<slug>.md`.
- **Story Lore & AU Mechanics:** Record in the relevant Bible module (e.g. `Bible/01_Divergences_AU/`, `Bible/06_Power_Systems_Mechanics/`, or `Bible/00_Bible_Master_Index.md`).

## 3. Decision Record Structure
```markdown
# ADR NNNN: <Title>

## Status
Proposed | Accepted | Superseded by [[ADR-XXXX]]

## Context
What problem, trade-off, or architectural challenge prompted this decision?

## Decision
What is the chosen approach, pattern, or rule?

## Consequences
- **Positive:** What benefits or clarity are gained?
- **Negative:** What trade-offs or constraints are introduced?
- **Mitigation:** How do we handle the negative consequences?
```

## 4. Rule of Immutability
Never silently edit a historical decision that was already accepted and acted upon. When a decision changes, write a new decision record that explicitly states it supersedes the previous one, and update the status of the old record to `Superseded`.
