# Native Construction Workflow

This reference owns the shared lifecycle contract for the repository skills in `.agents/skills/`. The source of truth for skill behavior is each skill's `SKILL.md`; this page defines handoffs, repository boundaries, and completion evidence.

## Lifecycle and handoffs

| Phase | Skill | Input | Output and gate |
|---|---|---|---|
| Explore and clarify | `grilling` (`grill-me` alias) | Goal and repository context | Grounded decisions; ask only for materially unresolved choices. |
| Specify | `to-spec` | Agreed goal and evidence | `.scratch/<feature>/spec.md` with user stories, decisions, tests, scope, and ready status. |
| Decompose | `to-tickets` | Reviewed spec | Numbered vertical-slice issues, dependencies, acceptance checks, and ready statuses. |
| Implement | `implement` | Ready ticket and spec | Completed change with evidence, review, and commit when authorized. |
| Validate | `tdd` | Observable behavior and public seam | Red/green/refactor evidence and relevant project gates. |
| Review | `code-review` | Pinned diff and matching spec | Separate Standards and Spec findings, resolved or explicitly recorded. |
| Configure | `setup-matt-pocock-skills` | Request to bootstrap or repair this workflow | Idempotent inventory and minimal repair; no wholesale contract replacement. |

## Repository contracts

- Read `AGENTS.md` (or the applicable `CLAUDE.md`), `GLOSSARY.md`, relevant `docs/adr/`, and `docs/agents/domain.md` before domain design or implementation.
- Store specs and one-file-per-ticket issues under `.scratch/<feature-slug>/`; follow `docs/agents/issue-tracker.md` and preserve `ready-for-agent`, `claimed`, and `resolved` transitions.
- Internal docs, tools, tests, and Bible dossiers use en-US. Only manuscript prose under `Manuscript/pt-BR/` and `Manuscript/es/` use those languages.
- Preserve raw Canon sources and existing Manuscript prose. Never rewrite these destructively without explicit author direction.
- Keep docs/research and docs/adr current for material design/research decisions; do not leave durable rationale only in .scratch/.
- Distinguish source capture, typed canon, AU-established truth, provisional planning, and prose. Do not force editorial documents, raw sources, or prose into lore templates.
- Changes under `tools/` require tests; run `npm test` before delivery. If editing Obsidian links or reusable Markdown templates, also run `npm run validate:links`. Run `npm run validate:sources` after modifying capture metadata or source routing. Run `npm run validate:templates` when templates or their schema behavior changes.
- Use the local tracker and repository-owned skills. Do not depend on personal machine paths or external issue systems.

## State and review rules

Claim a ticket before implementation. Select only an unblocked ready ticket; a blocker is complete only when its referenced issue is resolved. Mark resolved only after acceptance checks pass and append a short evidence note. A failed review returns the ticket to active work; rerun affected validation and both review axes after material fixes.

For code review, pin the baseline before inspecting the change. Run independent Standards and Spec reviews concurrently when agent delegation is available; provide each reviewer only the baseline, diff, applicable standards or spec, and a concise prompt. Reviewers are read-only. Report their findings separately with severity, location, impact, and fix. If independent reviewers are unavailable, perform distinct read-only passes and disclose that limitation.

The standing authorization in the root operating contract permits autonomous resolution of decisions supported by repository evidence. Ask only when an unresolved decision could materially change scope, data integrity, or acceptance. Do not treat workflow ceremony as a reason to block execution.

## Acceptance checklist

- Goal and scope match the user's intent; domain terms match the glossary and no ADR conflict is silently introduced.
- Specs and tickets provide observable acceptance criteria and form a complete, ordered, unblocked implementation path.
- Tests demonstrate behavior through public interfaces. Relevant validation commands pass; unrelated failures are identified with evidence.
- Standards and Spec review are each complete, material findings are fixed or recorded with rationale, and status evidence reflects reality.
- The change is portable, documented at its owning layer, and leaves protected source/story material intact.
