# Architecture Flow: Bidirectional Governance

## 1. Core State Machine

```
   [Active Story Vault]
           │
           ▼
    [Change Detected]
           │
           ├─ Universal Infrastructure? ──► [Sanitize to Neutral] ──► [Merge to Template Core] ──► [Run 4-Gate Audit]
           │                                                                                              │
           └─ Fandom Lore? ──────────────► [Package to Preset]   ──► [Merge to Meta/Presets] ────────────┤
                                                                                                          ▼
                                                                                                [Sync to .agents & .claude]
                                                                                                          │
                                                                                                          ▼
                                                                                                 [Pass narr doctor]
```

## 2. Invariants Checklist
- [ ] No fandom entity names in `NARRATIVE_STORY_BIBLE_TEMPLATE_v2` core pages.
- [ ] Multi-agent parity check passes: `narr doctor` outputs `Multi-Agent Parity: Synchronized`.
- [ ] All unit tests pass cleanly: `pytest tools/tests/unit -v`.
- [ ] Zero unreferenced sources: `narr ingest pending` outputs 0 pending.
