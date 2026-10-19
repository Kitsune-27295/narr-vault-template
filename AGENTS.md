# AGENTS.md — Narrative Story Bible Framework v2.0
# Operational contract. Every rule file in .agents/rules/ is authoritative.

## 1. Cold-Start Sequence (read in order)
1. vault.yaml      — budgets, locales, scopes
2. AGENTS.md       — this contract
3. CONVENTIONS.md  — curator conventions
4. context/author_voice.md
5. memory/hot.md
6. 08_Ledgers/LDG-Session_Handoff.md

## 2. Zone Map
| Zone | Prefix | Language | Agent writes |
|---|---|---|---|
| 01_Canon_and_Divergence/Sources/ | SRC- | original | NEVER (immutable) |
| 01_Canon_and_Divergence/Baselines/ | CAN- | en-US | yes |
| 01_Canon_and_Divergence/PODs/ | POD- | en-US | yes |
| 02_Story_Bible/ | CHR/PWR/SYS/TEC/ITM/LOC/FAC/TRM/SCP/SHT | en-US | yes |
| 03_Continuity_and_Timeline/ | EVT/ARC/CKL | en-US | yes |
| 04_Manuscript/pt-BR/ | C## | pt-BR | yes (draft) |
| 04_Manuscript/es/ | C## | es | yes (publish) |
| 06_Ideation_and_Unblocking/ | SBX | en-US | yes (sandbox/graveyard) |
| 07_Cosmologies_and_Multiverse/ | SCP | en-US | yes |
| 08_Ledgers/ | LDG | en-US | yes |
| context/ | — | en-US | only on curator request |
| memory/ | — | en-US | yes |

## 3. Operational Workflow & CLI Gates
```pwsh
narr pipeline plan                                # Display authoritative workflow phases
narr prompt render write-chapter -c <N> -p "<POV>" # Assemble prompt for pt-BR drafting
narr prompt validate write-chapter <draft_file>   # Check CJK, fluff, <!-- p:N --> sequence
narr prompt render translate-chapter -c <N>       # Assemble prompt for es publication
narr translate check <N>                          # Verify paragraph parity (MSC004)
narr lint                                         # Pre-commit invariant check (must exit 0)
narr crosscheck                                   # Continuity and Chekhov ledger check
python tools/vault_audit.py                       # Quote, uid, scope, table and link guard (must exit 0)
narr doctor                                       # Environment and multi-agent parity check
```

## 4. Core Axioms (see .agents/rules/ for authoritative specifications)
- Rule 05: Engineering excellence — KISS, SSOT, dual remediation (symptom + root cause)
- Rule 10: Note conventions — zero-space filenames, no CJK outside Sources, flat bidirectional links
- Rule 15: Editorial style — technical objectivity, active voice, short paragraphs, zero AI preambles
- Rule 20: Manuscript — pt-BR draft (<!-- p:N -->), es publish (1:1 parity); strict TRM-Termbase compliance
- Rule 30: Canon & continuity — verbatim evidence, negative boundaries, Sanderson costs/limits
- Rule 40: Git commits — Narrative Conventional Commits; lint-pass gate
- Rule 50: Memory & context — hot.md <=60 lines, AGENTS.md <=200 lines
- Rule 60: Framework governance — neutral template, presets for fandom overlays

## 5. Session Close
```pwsh
narr session close --done "<completed items>" --next "<next priority>" --decided "<key decisions>"
```
