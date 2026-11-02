# Narrative Vault Framework (template)

A project-agnostic **Obsidian vault + deterministic CLI toolchain** for long-form narrative work: original fiction, fanfiction, and multiverse or crossover projects. It gives a human author a structured vault and gives AI agents a contract, a retrieval engine, and validators.

This archive contains the **framework only**. It carries no canon, characters, plot, or manuscript from any project.

## What you get
- **Layered vault:** `Canon/` (frozen sources and baselines) -> `Bible/` (story ground truth in 10 modules) -> `Manuscript/` (drafts and translations), plus `Ledgers/`, `Sandbox/`, `Craft/`, `Research/`, `context/`, `memory/`, `eval/`, `00_Cockpit/`, `99_System/`.
- **Toolchain (Node.js ESM):** web clipper, modular ingestor, Fiction-Conscious RAG on SQLite FTS5, template/link/ledger validators, `doctor`, `brief`, `session:close`.
- **Agent contract:** `AGENTS.md` and `CLAUDE.md` (kept in parity by a test), native skills in `.agents/skills/`.
- **Templates, ADRs, and the SNIA metadata schema** (`docs/schema/information-architecture.md`).

## Quick start
1. Install Node.js 24 or newer, then run `npm install`.
2. Copy this folder, open it as an Obsidian vault.
3. Edit `vault.yaml` (title, source universes, epoch, languages), `context/author.md`, and `context/languages.md`.
4. Adapt `99_System/franchise-rules.json` to the wikis of your source universes.
5. Run `npm run doctor`, `npm test`, then `npm run brief`. Run `npm run rag:sync` before `npm run rag:eval` or `rag:search`.
6. Capture and compile canon: `npm run clip -- <url>`, `npm run ingest -- <path>`.

## Defaults you can change
The shipped language pair is **pt-BR (drafting) -> es (publication)** with **en-US** for everything else; the `Manuscript/pt-BR/` and `Manuscript/es/` folder names are referenced by the tools and tests, so renaming them means updating `tools/vault/ledger-validator.js`, the Cockpit queries, and the tests together.

See `ARCHITECTURE.md`, `MANIFEST.md`, `EXCLUSIONS.md`, and `CHANGELOG.md`.
