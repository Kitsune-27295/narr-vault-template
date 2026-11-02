---
name: grilling
description: Clarify a substantial feature or design before specification; inspect repository evidence, identify choices and trade-offs, and produce a grounded decision summary.
---

# Grilling

Use for feature discovery and design clarification, not for a simple task with an already clear implementation.

1. Read the applicable root contract, relevant feature context, glossary, ADRs, and existing implementation before proposing decisions.
2. Separate established facts from assumptions. Identify the user goal, smallest useful seam, constraints, alternatives, risks, and observable success criteria.
3. Resolve choices autonomously when repository evidence and the user's standing authorization establish a sound answer. Ask one focused question only for materially unresolved decisions; do not ask the user to repeat documented context.
4. Present a concise design tree or decision summary, including rejected alternatives where they materially affect the design. Confirm through the conversation when the standing authorization does not cover an unresolved choice.
5. Hand off the agreed result to `$to-spec` when a durable feature plan is needed.

Shared contract: [native workflow](../../../docs/agents/native-construction-workflow.md).
