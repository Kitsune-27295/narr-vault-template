---
name: implement
description: Implement a ready local issue from its spec using repository conventions, public-seam TDD, verification, and independent review.
---

# Implement

1. Read the root contract, feature spec, selected ticket, glossary, relevant ADRs, domain guidance, and applicable skill references. For new work, confirm the ticket is ready and unblocked, then set it to `claimed` before work. For a resumed task, fetch the referenced `claimed` ticket and continue its recorded context rather than creating duplicate work.
2. Establish a pinned baseline and inspect the owning code and tests. Follow `$tdd`; make the smallest complete change at the correct architectural layer.
3. Preserve source and manuscript content. Keep internal artifacts in en-US. When changing tools, add tests. Do not add unrelated refactors.
4. Run focused tests during development. Before completion run `npm test`; add `npm run validate:templates`, `npm run validate:links`, `npm run check:agents`, or `npm run validate:workflow` when relevant to the touched contracts.
5. Run `$code-review` against the pinned diff and spec. Fix material findings and repeat affected tests and review. Record any unrelated failures precisely.
6. Update issue status and evidence only after acceptance checks pass. Commit the completed work when the user's standing authorization covers it; use a concise conventional commit.

Shared contract: [native workflow](../../../docs/agents/native-construction-workflow.md).
