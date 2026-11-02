---
name: to-spec
description: Turn a grounded, sufficiently clarified feature goal into a reviewable repository spec with user stories, design and test decisions, scope, and acceptance criteria.
---

# To Spec

1. Read the current conversation, relevant repository evidence, root contract, `GLOSSARY.md`, relevant ADRs, and `docs/agents/domain.md`.
2. Identify the feature seam and preserve the user's intent. Use `$grilling` when a material product or architecture choice remains unclear; resolve it from evidence when authorized.
3. Create `.scratch/<feature-slug>/spec.md` using the local tracker conventions. Include problem, solution, numbered user stories, implementation decisions, testing decisions, out of scope, and evidence-based notes. Stories describe outcomes; implementation decisions own technical choices.
4. State testable acceptance criteria and identify relevant existing gates. Keep paths and code snippets out of user-story prose unless a path itself is the acceptance target.
5. Set `Status: ready-for-agent` when the spec is implementable. Do not claim approval that was not given. Link the relevant sources using repository-relative paths.

Shared contract: [native workflow](../../../docs/agents/native-construction-workflow.md).
