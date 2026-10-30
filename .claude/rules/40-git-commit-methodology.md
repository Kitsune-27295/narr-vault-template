# Rule 40: Git Commits & Quality Gates
1. Commits follow Narrative Conventional Commits: `<type>(<scope>): <imperative description>`.
2. Types: `canon`, `source`, `bible`, `timeline`, `manuscript`, `pod`, `ledger`, `meta`, `fix`, `refactor`, `chore`.
3. Every commit must pass `narr lint` and `python tools/vault_audit.py` with exit code 0.
