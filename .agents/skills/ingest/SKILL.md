---
name: ingest
description: "Use when the author drops or captures a new source URL, document, or extract, and wants it processed into the vault. Clips the source into Canon/<Franchise>/Sources/ with sidecar metadata and prepares it for baseline compilation."
---

# Ingest one source

Use this skill to process a raw external source into an immutable vault capture with complete provenance sidecars.

## 1. Capture and Inspect
1. Capture the article using the vault clipper:
   ```bash
   npm run clip -- "<url>"
   ```
2. Verify that:
   - Markdown was written to `Canon/<Franchise>/Sources/<Slug>.md`.
   - JSON sidecar was created at `Canon/<Franchise>/Sources/<Slug>.json` with `content_sha256`, `url`, `captured_at`, and infobox metadata.
   - Anti-bot challenge pages (Cloudflare) were not intercepted.

## 2. Extract Atomic Claims
Extract key facts, rules, progression scales, relationships, and entities from the capture. Distinguish settled canonical facts from narrative speculation or filler.

## 3. Route to Baselines
Identify whether the claims belong to:
- An existing baseline in `Canon/<Franchise>/Baselines/` $\rightarrow$ Prepare incremental update.
- A new baseline $\rightarrow$ Scaffold from `TPL_Canon_Baseline.md`.

## 4. Verification
Run source validation:
```bash
npm run validate:sources
```
