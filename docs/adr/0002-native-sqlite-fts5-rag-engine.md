# ADR 0002: Native SQLite FTS5 for Fiction-Conscious RAG (F-RAG)

## Status
Accepted

## Context
Standard RAG frameworks rely on heavy external vector databases (Pinecone, Chroma, pgvector), requiring network dependencies, Python bridges, or heavy native binary compilation. Furthermore, vector similarity search lacks deterministic lexical precision for fictional terminology (e.g. Japanese romanizations, Chinese Pinyin) and fails to enforce alternate-universe divergence precedence over canonical lore.

## Decision
We implement a zero-dependency, local Fiction-Conscious RAG (F-RAG) engine in Node.js ESM utilizing Node v24's built-in `node:sqlite` (`DatabaseSync`):
1. **FTS5 Full-Text Search:** Uses SQLite FTS5 with `unicode61 remove_diacritics 2` tokenization and BM25 weighted ranking (`title` 5.0, `aliases` 3.0, `tags` 2.0, `content` 1.0).
2. **5-Tier Context Assembly:** Enforces strict priority ordering: Tier 1 (Active Scene/POV) -> Tier 2 (AU Divergence PODs) -> Tier 3 (Character Profiles & Voices) -> Tier 4 (System Mechanics & Hard Constraints) -> Tier 5 (Canon Background Lore).
3. **Divergence Safety:** Injects explicit `[!WARNING] AU OVERRIDE` banners so LLMs never revert to default canon when an AU POD is active.
4. **Token Budget Packing:** Respects strict user-defined token limits (`--budget <tokens>`) with graceful boundary truncation.

## Consequences
- **Positive:** Zero external binary dependencies, instant sub-millisecond execution, complete offline local execution, and strict adherence to fanfiction AU divergence logic.
- **Negative:** Lexical search requires matching terms or aliases rather than purely abstract semantic embeddings.
- **Mitigation:** Comprehensive frontmatter `aliases` and `tags` extraction covers multilingual synonyms and terminology variations.

