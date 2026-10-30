# Rule 60: Framework Governance & Presets
1. The framework template is neutral and agnostic. Fields true for every story (provenance, `canon_status`, `source_refs`) belong to the baseline, not to a preset.
2. Fandom-specific entities, cultivation properties and seed lore live only in `Meta/Presets/<name>/`. Story content (characters, plot, decisions) never goes into a preset.
3. Presets are applied with `narr preset apply <name>...`. Application is atomic, never overwrites a vault file, and is recorded in `Meta/preset-lock.json`.
4. Adopt a preset update with `narr preset update <name>` (preview), then `--apply`. A file you edited is kept; when both sides changed, the upstream version lands beside it as `*.preset-new`. Resolve by hand.
5. Promote a vault specialization with `narr preset export`, edit and validate it (`narr preset validate --strict`), then add it to the shared catalog through the test-suite. Say what a preset's content is based on (`provenance.basis`) and never present `inferred` content as canon.
6. Full contract: `packages/narr-fiction/docs/PRESETS.md` in the framework repository.
