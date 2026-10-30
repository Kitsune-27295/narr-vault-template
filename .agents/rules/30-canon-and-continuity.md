# Rule 30: Canon, Continuity & Epistemic Horizons
1. **Literal Quote Verification:** Every `*"..."*` quotation must exist verbatim in the cited frozen source.
2. **Negative Boundaries:** Baselines must include a `## What it does NOT establish` section to prevent extrapolation drift.
3. **Sanderson's Second Law:** Limitations matter more than powers: magic systems (`SYS-`) must document costs and absolute limitations before powers and abilities.
4. **Contradiction Registry:** Any conflict between sources or between canon and fanfic must be logged in `08_Ledgers/LDG-Contradictions.md`.
5. **Anti-Omniscience:** Characters must not act on information they have not learned; audit against `08_Ledgers/LDG-Character_Knowledge.md`.
6. **Domain Dossiers:** A baseline is a single-domain dossier. Its `domain:` id is declared in the registry `01_Canon_and_Divergence/domains.yaml` (and `domains.<name>.yaml`); scope and delegations live there only and exactly one dossier owns each domain (`narr domain new <id>`).
7. **One Owner per Claim:** A fact is written and quoted in the dossier that owns it. Other dossiers give one line and a link. Sources are decomposed claim by claim (`narr ingest route`), never grouped page by page; `narr ingest coverage` shows what no dossier has quoted yet.
8. **Reconcile, Never Choose Silently:** Normalize terms (one canonical term, aliases listed). Separate how a rule really works from what characters of an era knew. Rank media with `canon_authority` in `vault.yaml` and keep adaptation variants in section 5. Every source-vs-source conflict keeps both quotes and goes to `LDG-Contradictions`.
9. **Three Pillars Before a New Domain:** Create a domain only if it has its own rules, an internal taxonomy or scale, and is reused by several characters or arcs. Anything smaller is a section of its parent dossier.
10. **Incremental Upsert:** A new source is routed to the existing dossiers: redundant claims are skipped, complementary ones inserted in the right section, conflicting ones recorded. A dossier is never rewritten from scratch.
