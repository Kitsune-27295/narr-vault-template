# narr vault template

An empty, ready-to-use vault for `narr`, a local-first serialized fiction story bible and continuity engine driven by AI agents. Your manuscripts, canon baselines, worldbuilding lore, and continuity memory live in your own repository, in plain markdown, under your own git history. Nothing here needs any account other than your GitHub account, and nobody has to approve anything.

## 1. Start your own (about 5 minutes)

You need Python 3.12+ and git.

1. Press **Use this template → Create a new repository** above, and make the new repository **private** (or public if you are writing in the open).
2. Clone your new repository, then inside the folder run:
   ```bash
   python setup-narr.py
   ```
   It downloads the `narr` tool over HTTPS (the file's sha256 checksum is verified), installs it once per machine (all your story bibles share it in `AppData/Local/narr` or `~/.local/share/narr`), sets up this vault's hooks, and runs a health check. Add `--add-to-path` to be able to type `narr` in any terminal.
3. Open your favorite AI coding assistant (Antigravity, Claude Code, etc.) in the folder and say "faz o onboarding".

## 2. Updates arrive by themselves

Every Monday a workflow in your repository checks for a newer framework version. If there is one, it opens **one pull request**, "Update narr to X", that lists exactly which files change.

1. Review it, then **merge**.
2. On your machine: `git pull`, then `python setup-narr.py` (updates the tool).

That is all. The pull request only ever touches the framework's own files (skills, rules, conventions, templates). **Your manuscripts, canon sources, lore, character sheets, and memory are never touched**, and a file you edited yourself is listed as `kept` and left exactly as it is.

Once per repository, so the workflow may open pull requests: **Settings → Actions → General → "Allow GitHub Actions to create and approve pull requests"**. If you skip it, the workflow tells you so in its log.

Want it now instead of Monday? **Actions → narr-update → Run workflow**. Without GitHub Actions: `python setup-narr.py && narr upgrade`, then review with `git diff` and commit.

## What is in this repository

Everything is generated and published here automatically from the `narr` framework. Do not edit this template repository directly: the next publish will overwrite it. `.narr-version` records which `narr` version produced it.

`.github/workflows/validate.yml`, `release.yml`, and `update-vault.yml` belong to this template repository. They do nothing in your copy; you may delete them. `narr-update.yml` is yours: it is the weekly update workflow.
