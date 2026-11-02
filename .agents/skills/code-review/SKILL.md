---
name: code-review
description: Review a pinned implementation diff independently against repository standards and its originating spec; report actionable findings and verify fixes.
---

# Code Review

1. Pin the base revision and inspect the complete diff. Read the matching spec/ticket, root contract, relevant ADRs, and tests. Do not modify files while reviewing.
2. Run two independent read-only passes: **Standards** checks correctness, security, regressions, maintainability, and project contracts; **Spec** checks every story, decision, acceptance criterion, and scope boundary.
3. When agent delegation is available, run the two passes with independent agents in parallel. Give each only the baseline/diff, its review lens, relevant standards or spec, and ask for findings only. Do not preload the implementation rationale.
4. Report each axis separately. Each finding includes severity, file/line, concrete impact, and a corrective action. Omit speculative or style-only comments. If clean, state that no findings were found. If agents were unavailable, disclose separate local passes.
5. After fixes, inspect the changed diff and rerun the checks affected by findings. Review is complete only when material findings are resolved or explicitly accepted with evidence.

Shared contract: [native workflow](../../../docs/agents/native-construction-workflow.md).
