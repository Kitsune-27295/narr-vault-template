---
name: tdd
description: Develop or repair repository behavior with a red-green-refactor loop through public interfaces and project-specific validation.
---

# Test-Driven Development

1. Read repository guidance, the relevant spec/ticket, glossary, and touching ADRs. Identify the public behavior and smallest observable seam.
2. Write or update a focused test that expresses the required behavior; run it and confirm it fails for the intended reason.
3. Implement the minimum change to pass. Rerun the focused test, then refactor without changing the contract and rerun it.
4. Cover meaningful edge cases and regression behavior. Do not test private implementation details when a public interface can demonstrate the behavior.
5. Run the project gates appropriate to the change; tool changes must be covered by tests and `npm test` is required before delivery.

Shared contract: [native workflow](../../../docs/agents/native-construction-workflow.md).
