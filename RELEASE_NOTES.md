### Added
- Independent Python framework package `narr` elevated to repository root with `pyproject.toml`.
- Clean seed vault skeleton isolated in `template/`.
- Automated template synchronizer `scripts/sync_vault_template.py` with `.narr-version` injection.
- Security protection `SEC-01` against directory traversal in note and path resolution.
- Strict ontological validation rule `VAL032` (all pages must map strictly to approved narrative types).
- Autonomous self-contained installer `setup-narr.py` with HTTPS wheel download and sha256 checksum verification.
- Comprehensive test suite (60 unit and integration tests passing in < 1.5s).

### Changed
- Standardized CLI entry points and removed coupling with vault runtime directory.
- Elevated code quality: ruff (0 findings) and mypy strict typing (0 errors).

### Fixed
- Fixed 12 functional defects (`DEF-01` through `DEF-12`) across frontmatter, cli, doctor, and lint modules.
