---
name: query
description: "Use when the author asks what the vault knows, records, or connects about a topic, character, mechanic, or event. Searches F-RAG and vault notes before answering, provides exact markdown citations, and files valuable syntheses back to the vault."
---

# Answer from the vault

Use this skill to answer questions about canonical lore, AU divergences, character sheets, and power mechanics strictly from stored vault knowledge.

## 1. Search First
Before answering from memory or general LLM knowledge, query the vault:
```bash
npm run rag:search -- "<query>"
```
When targeting specific zones, inspect:
- `Canon/<Franchise>/Baselines/` for official canon facts.
- `Bible/` for project-specific AU truths and divergences.
- `Manuscript/` for drafted scenes and character dialogue.

## 2. Synthesize with Exact Citations
Answer the author's question directly and concisely:
- Cite exact note links: `[[Canon/<Franchise>/Baselines/Baseline_<Topic>|Baseline - <Topic>]]` or `[[Bible/02_Cast_Characters/<Character>_AU|<Character> AU]]`.
- Quote specific facts and state the authority layer (Canon Baseline vs. Bible AU Divergence).
- If the vault contains no data on the topic, state the absence explicitly and offer `research` or `ingest` to acquire sources.

## 3. File Valuable Answers Back
If the query produces an extensive cross-system synthesis, comparative analysis, or strategic plan not yet recorded in the vault, propose saving it as a workbench note under `Seeds_Scratchpad/` or an analytical dossier in `Bible/`.
