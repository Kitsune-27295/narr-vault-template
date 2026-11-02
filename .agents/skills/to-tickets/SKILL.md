---
name: to-tickets
description: Break a ready repository spec into ordered, independently verifiable vertical-slice tickets in the local Markdown tracker.
---

# To Tickets

1. Read the feature spec and tracker guidance. Check that the spec is implementable; return to `$to-spec` or `$grilling` if a material ambiguity blocks decomposition.
2. Create `.scratch/<feature-slug>/issues/NN-<slug>.md`, one ticket per vertical slice, numbered from `01`. Keep each ticket small enough to implement and verify independently.
3. Record a clear outcome, acceptance checks, relevant context, and `Blocked by: NN` where needed. Use only documented status values; new tickets begin `ready-for-agent`.
4. Order tickets so prerequisites precede dependents. Avoid ticketing already completed work and avoid duplicate plans.
5. Verify the graph: every blocker exists, there are no cycles, and each ticket maps to the spec. Append comments/evidence under the documented heading as work proceeds.

Shared contract: [native workflow](../../../docs/agents/native-construction-workflow.md). Tracker: [issue conventions](../../../docs/agents/issue-tracker.md).
