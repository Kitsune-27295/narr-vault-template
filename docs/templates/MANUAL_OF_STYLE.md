# Vault Authoring and Style Guide

This guide defines how people and writing agents create and maintain notes in this private Obsidian vault. It does not reproduce any external wiki policy. Research and transfer decisions are recorded in [Wiki Editorial Patterns and Story Continuity Research](../research/wiki-editorial-and-story-continuity-research.md); public export has a separate [guide](FANDOM_EXPORT_GUIDE.md).

## 1. Choose the right record

| Need | Home | Record the note as |
|---|---|---|
| Official source material and evidence | Canon/<Franchise>/ | Typed canon dossier; raw captures remain in Sources/ |
| An established change in this story's reality | Bible/ | AU decision with scope, effective chronology, rationale, and links to affected records |
| A possible future beat or unanswered design choice | Seeds_Scratchpad/ or relevant planning note | Idea/question/plan, clearly marked provisional |
| Drafted narrative prose | Manuscript/pt-BR/ | Scene/chapter prose; preserve the author's voice |
| Spanish publication text | Manuscript/es/ | Translation/publication artifact |
| Workflow, policy, tool or system guidance | docs/ or 99_System/ | Editorial/system document, not a lore dossier |

Use the smallest record that prevents meaningful loss of evidence or continuity. Do not create a dossier solely to satisfy a directory taxonomy.

## 2. Evidence and continuity

- Keep captured source content intact. A dossier summarizes claims and links to source captures; it does not replace them.
- Identify the relevant work/version/medium where sources can conflict. Separate confirmed facts, reported claims, interpretation, and unresolved conflicts.
- Do not silently promote a plan, theory, or inference into established Canon or AU truth.
- Canon remains the baseline. AU decisions belong in Bible/ and link to affected canon and story records.
- New chronology follows the authoritative baseline named in `vault.yaml`: forward dates only from the declared epoch; no negative dates, BP, or countdowns unless that baseline defines them.
- A correction should retain useful provenance and explain a material continuity change. Do not create a conflict log for a nonexistent conflict.

## 3. Structure and prose

- Start with a concise definition or purpose statement that lets a reader understand the note without opening every link.
- Use the matching template in 99_System/Templates/ for recurring typed records. Templates are starting structures, not checklists of mandatory prose.
- Remove unused optional sections. Never fill a section with “none”, generic filler, or invented detail merely to satisfy a shape.
- Put each detailed fact in one owning record; summarize only what a reader needs locally and link to the owner.
- Prefer short paragraphs, descriptive headings, lists for discrete facts, and tables only for genuinely comparable fields.
- Use franchise-specific names and transliterations consistently. Add aliases when they improve retrieval.
- Write internal guidance, tools, tests, and Bible dossiers in en-US. Preserve source language in raw captures and manuscript language in its designated edition.
- Wikilinks should point to stable note titles. Validate them after editing notes or reusable templates.

## 4. Metadata

Frontmatter is a retrieval contract, not a universal form. Use only properties defined for that note type in its template/registry. Keep values factual and machine-readable; use ISO dates when dates are needed. Prefer stable lowercase identifiers for note_type and type. Avoid duplicate properties that encode the same fact.

For Canon notes, canon_tier identifies evidence class, not truth status. Fandom pages are secondary references (C-Secondary); verify important claims against the primary work before treating them as settled. Fanon-domain sources do not belong in Canon.

Status must distinguish record lifecycle from story truth. A planning status such as proposed does not mean the proposed event has happened. For uncertain claims, state confidence and source context in the body rather than collapsing competing evidence into one status.

## 5. Templates and validation

Template owners are the files in 99_System/Templates/ and the registry in tools/templates/template-validator.js. A type must have one clear owner. When changing a template:

1. Update its registry contract and tests.
2. Check affected notes before migration.
3. Preserve source and authored prose.
4. Run npm run validate:templates, npm run validate:links, and npm test.

Validation checks required properties and structural invariants. It must not require every optional section to contain text. Source captures and manuscript prose have separate validation/disposition rules from dossiers.

## 6. Human and AI readability

Put canonical identity and high-value constraints near the top. Name provenance, certainty, chronology, and AU authority explicitly where relevant. Link related records instead of repeating their bodies. Avoid hidden meaning encoded only by color, callout styling, or folder position.

Writing agents must read the relevant Canon baseline, active AU decisions, and current scene/outline before drafting. If those disagree, preserve the distinction and report the conflict; do not silently resolve it.
