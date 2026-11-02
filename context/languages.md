---
note_type: context
title: Bilingual Translation & Language Discipline Pipeline
uid: CTX-LANGUAGES
status: active
aliases:
  - languages
  - CTX-LANGUAGES
tags:
  - '#context/language-rules'
created: '2026-11-02'
updated: '2026-11-02'
---

# 🌐 Bilingual Translation & Language Discipline Pipeline

## 1. Universal Language Rules

1. **System & Vault Lore (Strictly en-US):**
   - Every file outside `Manuscript/` is written in **US English (`en-US`)**: `vault.yaml`, `Bible/`, `Canon/Baselines/`, `Ledgers/`, `Sandbox/`, `Craft/`, `Research/`, `memory/`, `context/`, `docs/`, and `tools/`.
2. **Manuscript Drafting (pt-BR):**
   - Working creative prose is drafted exclusively in **Brazilian Portuguese (`pt-BR`)** in `Manuscript/pt-BR/`.
3. **Manuscript Publication (es):**
   - Translated and adapted publication chapters are produced in **Spanish (`es`)** in `Manuscript/es/` for AO3 release.
4. **Verbatim Quotations:**
   - Literal quotations from captured sources (`Canon/*/Sources/`) remain in their captured language and are demarcated with `*"..."*`.

## 2. Zero-CJK Invariant Policy

- **Prohibition:** No Hanzi, Kanji, or CJK characters are permitted in any live operational note, ledger, template, or manuscript file.
- **Romanization:** All Japanese, Chinese, or foreign terms are rendered in standard romanization (Hepburn / Pinyin) with italics on first mention (for example a term set in italics on first mention).
- **Sole Exception:** Frozen raw source files in `Canon/<Franchise>/Sources/`.

## 3. Paragraph Alignment Pipeline (pt-BR → es)

1. **Master Drafting:** Scenes in `Manuscript/pt-BR/` use numbered paragraph comments (`<!-- p:1 -->`, `<!-- p:2 -->`, ...) to anchor paragraphs.
2. **Translation Parity:** The Spanish edition in `Manuscript/es/` mirrors paragraph structure 1:1 using the matching paragraph anchors.
3. **Terminology Check:** Align terms with `[[99_System/Lexicon_PT_ES/Glossary_Terms_PT_ES|Glossary Terms PT-ES]]` and dialogue registers with `[[99_System/Lexicon_PT_ES/Character_Voice_Guide_ES|Character Voice Guide ES]]`.

