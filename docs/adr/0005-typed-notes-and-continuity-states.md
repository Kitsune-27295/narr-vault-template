# ADR 0005: Typed Notes and Continuity States

## Status
Accepted

## Context

The vault combines source captures, sourced canon dossiers, story-specific AU decisions, provisional planning, manuscript prose, editorial guidance, and public-export artifacts. A single documentation style or dossier schema cannot serve all of these safely. Public fandom wikis optimize reader lookup of published facts; this private vault also needs provenance, uncertainty, narrative authority, and protection for unpublished material.

## Decision

1. Keep the existing Canon/Bible/Manuscript architecture and supporting Cockpit/System layers.
2. Classify recurring machine-retrievable notes by a stable note_type with a corresponding template and validator contract. Editorial documents, source captures, and prose use their own rules; they are not forced into lore-dossier schemas.
3. Distinguish sourced canon, established AU truth, provisional plan, unresolved question, and published manuscript state. A plan or inference never becomes established truth by virtue of appearing in a structured note.
4. Preserve raw captured source bodies and link dossiers to their evidence. Identify medium/version where sources conflict; record uncertainty rather than inventing a resolution.
   Fandom-hosted encyclopedias default to secondary evidence (C-Secondary); fanon-domain captures are refused by the Canon clipper. Source tier follows source authority, not franchise identity.
5. Treat template headings as optional when no supported content applies. Templates should not induce filler or unsupported claims. Each detailed fact has one owning note; other notes summarize and link.
6. Keep private authoring templates distinct from public wiki export assets. The export guide is advisory; the target wiki's current policy and sandbox preview govern public formatting.
7. Record chronology using the authoritative forward calendar declared in `vault.yaml`. Do not introduce negative dates, BP, or countdowns.

## Consequences

- People and agents can retrieve story facts without confusing canon, AU truth, plans, and prose.
- Type-specific validation can expose drift while leaving narrative and editorial documents intact.
- Some existing dossiers require source-grounded reconstruction. Migration must preserve source captures and manuscript prose.
- A small number of note types may intentionally remain untemplated until repeated use demonstrates value.
