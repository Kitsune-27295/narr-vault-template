---
name: lore-dossier
description: "Maintain authoritative character, faction, and world entity dossiers with rewritten Summary and strictly append-only Timeline. Use when a character, faction or world entity dossier must be created or updated."
---
# Lore Dossier Maintenance

Use when creating or updating entity records in `02_Story_Bible/` (`CHR-*`, `FAC-*`, `LOC-*`).

## The Golden Architecture
1. **Summary is the Living Truth:**
   Rewrite and polish the summary whenever the entity's active state changes. Summarize:
   - What is true right now.
   - Core traits, active powers, current allegiances, and psychological state.
2. **Timeline is Strictly Append-Only:**
   At the bottom of the note, maintain a chronological timeline:
   - Add one dated line per event, **newest last**.
   - Format: `- [Capítulo / Data]: Evento confirmado [[C01-Capitulo]] ou [[SRC-<id>]]`
   - **Never delete or rewrite past timeline entries.** If an earlier entry was based on misinformation, append a new entry explaining the revelation.
3. **Dialogue & Settei Keys:**
   Update `## 2. Voz e Expressão (Dialogue Keys)` with mannerisms, verbal tics, and active social registers.
4. **Lint:**
   ```bash
   narr lint
   ```
