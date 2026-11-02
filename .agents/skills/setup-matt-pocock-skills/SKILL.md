---
name: setup-matt-pocock-skills
description: Bootstrap, inspect, or repair this repository's native Matt Pocock construction workflow without overwriting existing agent contracts or tracker configuration.
---

# Setup Matt Pocock Skills

Setup is idempotent: a second run against a valid installation makes no changes.

1. Inventory `.agents/skills/`, `AGENTS.md`, `CLAUDE.md`, `docs/agents/`, `GLOSSARY.md`, ADRs, tracker shape, `package.json`, and workflow validation before changing anything.
2. Compare discovered components and handoffs with the [native workflow](../../../docs/agents/native-construction-workflow.md). Reuse compatible existing guidance; identify only concrete gaps.
3. Apply the smallest additive repair. Preserve unrelated skills and existing contract text; do not regenerate whole files, rewrite global user configuration, or create a second tracker.
4. Keep both root agent entry points aligned, use repository-relative references, and keep local skill names unique.
5. Run `npm run validate:workflow` and relevant parity/tests. Report detected state, edits, and remaining gaps; rerunning setup on a valid installation must leave it unchanged.
