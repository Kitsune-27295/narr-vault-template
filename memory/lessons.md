# Lessons Learned (lessons.md)

## Operational & Architectural Lessons
- 2026-10-16: Always enforce UTF-8 with ASCII-safe fallbacks on Windows console to prevent cp1252 charmap encoding errors.
- 2026-10-16: Maintain 10/90 Iceberg ratio: never build extensive lore that does not support current or upcoming 3 chapters.
- Treat a green `narr lint` as proof of structure, not truth. Run `python tools/vault_audit.py` before every commit.
- Reserve `*"..."*` for text copied verbatim from a frozen source. Invented mottos, chants and dialogue use plain quotes.
- Remove sample rows from ledgers on day one; they pass `crosscheck` and mislead later sessions.
- Mark every invention in the note that holds it, and register every canon exceedance in the point-of-divergence register.
- Count a term in the frozen sources before ruling on a spelling.

