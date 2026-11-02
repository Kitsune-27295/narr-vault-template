# Architecture

## Layers and data flow

```mermaid
flowchart LR
    W["Web sources"] -->|"npm run clip"| S["Canon/<Franchise>/Sources<br/>frozen captures + SHA-256 sidecars"]
    S -->|"npm run ingest"| B["Canon/<Franchise>/Baselines<br/>subject dossiers"]
    B -->|"single-link provenance"| BI["Bible/<br/>10 story modules"]
    SB["Sandbox/<br/>draft - review - approved"] -.->|"promotion by the author"| BI
    BI --> M["Manuscript/pt-BR<br/>drafts"]
    M --> E["Manuscript/es<br/>publication"]
    BI --> R["F-RAG<br/>SQLite FTS5"]
    B --> R
    R --> A["Agents"]
    L["Ledgers/<br/>continuity"] --> A
```

## Responsibilities

| Layer | Owns | Never does |
|---|---|---|
| `Canon/` | Evidence from the adapted works | Hold story decisions |
| `Bible/` | The story's ground truth and divergences | Copy canon text (it links a single baseline) |
| `Manuscript/` | Prose | Get rewritten by agents without authorization |
| `Ledgers/` | Plants, payoffs, decisions, threads, contradictions, handoffs | Duplicate Bible content |
| `Sandbox/` | Upstream experiments | Get linked from the vault |
| `context/`, `memory/` | Voice, language rules, in-flight state | Exceed their size budgets |
| `tools/`, `tests/` | Deterministic validation and retrieval | Change without a test |

## Agent session lifecycle

```mermaid
stateDiagram-v2
    [*] --> ColdStart
    ColdStart --> Work: vault.yaml, context, memory/hot, last handoff row
    Work --> Work: validate, test
    Work --> SessionClose
    SessionClose --> [*]: hot.md, journal, learnings, ledgers, handoff row
```

## Extension points
- `vault.yaml`: story identity, tiers, thresholds, budgets.
- `99_System/franchise-rules.json`: URL-to-franchise routing and default canon tier.
- `99_System/Templates/`: typed note templates validated by `npm run validate:templates`.
- `.agents/skills/`: add or adjust agent skills; run `npm run validate:workflow` for the construction workflow set.
- `eval/queries.yaml`: golden retrieval queries for `npm run rag:eval`.
