"""Install or update the `narr` tool on this machine and wire this narrative vault to it.

    python setup-narr.py                  # install or update `narr`, then set this vault up
    python setup-narr.py --check          # show what is installed and what is newest; change nothing
    python setup-narr.py --tool-only      # install or update `narr` only; leave this vault alone (CI)
    python setup-narr.py --add-to-path    # also put `narr` on your PATH (Windows: the user PATH)
    python setup-narr.py --extra render   # add an optional extra (render, vector); kept on updates

No GitHub account or key is needed. The tool is downloaded over HTTPS from the public template
repository and its sha256 checksum is checked before anything is installed. `narr` lives in one folder
per machine (e.g. AppData/Local/narr), shared by all your narrative vaults; nothing is installed inside
the vault itself. Managed by `narr upgrade`: do not edit by hand.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
import venv
from pathlib import Path

SOURCE = os.environ.get("NARR_SETUP_SOURCE", "https://raw.githubusercontent.com/Kitsune-27295/narr-vault-template/dist")
VAULT = Path(__file__).resolve().parent
WINDOWS = sys.platform == "win32"
EXTRAS = ("render", "vector")  # optional; `capture` is always installed


def tool_home() -> Path:
    if os.environ.get("NARR_HOME"):
        return Path(os.environ["NARR_HOME"])
    if WINDOWS:
        return Path(os.environ.get("LOCALAPPDATA", Path.home() / "AppData" / "Local")) / "narr"
    return Path.home() / ".local" / "share" / "narr"


LONGEST_BELOW_HOME = 130
WINDOWS_MAX_PATH = 259


def path_too_long(home: Path) -> bool:
    return WINDOWS and len(str(home)) + LONGEST_BELOW_HOME > WINDOWS_MAX_PATH


def venv_python(home: Path) -> Path:
    return home / "venv" / ("Scripts" if WINDOWS else "bin") / ("python.exe" if WINDOWS else "python")


def installed(home: Path) -> dict[str, str] | None:
    try:
        data = json.loads((home / "installed.json").read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return None
    return data if isinstance(data, dict) and venv_python(home).exists() else None


def kept_extras(home: Path) -> list[str]:
    try:
        data = json.loads((home / "installed.json").read_text(encoding="utf-8"))
        names = str(data.get("extras", "")).split(",") if isinstance(data, dict) else []
    except (OSError, ValueError):
        names = []
    return [n for n in names if n in EXTRAS]


class ChecksumError(ValueError):
    """A download does not match the sha256 that was published for it."""


def fetch(name: str) -> bytes:
    url = f"{SOURCE}/{name}?cb={time.time_ns()}"
    with urllib.request.urlopen(url, timeout=60) as response:
        return bytes(response.read())


def latest() -> dict[str, str]:
    data = json.loads(fetch("LATEST.json"))
    keys = ("version", "wheel", "sha256", "constraints", "constraints_sha256")
    if not all(isinstance(data.get(k), str) for k in keys):
        raise ValueError("LATEST.json is not in the expected shape")
    return {k: data[k] for k in keys}


def download(name: str, expected: str, folder: Path) -> Path:
    blob = fetch(name)
    if hashlib.sha256(blob).hexdigest() != expected:
        raise ChecksumError(f"{name} does not match its sha256; nothing was installed")
    path = folder / name
    path.write_bytes(blob)
    return path


def run(*args: str | Path) -> None:
    print("$", " ".join(str(a) for a in args), flush=True)
    subprocess.run([str(a) for a in args], check=True)


def install(info: dict[str, str], home: Path, extras: list[str]) -> None:
    python = venv_python(home)
    if not python.exists():
        print(f"creating {home / 'venv'}", flush=True)
        venv.create(home / "venv", with_pip=True)
    with tempfile.TemporaryDirectory() as tmp:
        wheel = download(info["wheel"], info["sha256"], Path(tmp))
        pins = download(info["constraints"], info["constraints_sha256"], Path(tmp))
        before = installed(home)
        run(
            *(python, "-m", "pip", "install", "--quiet", "--upgrade"),
            *("--only-binary", ":all:", "-c", str(pins), f"{wheel}[{','.join(['capture', *extras])}]"),
        )
        if before is None or before.get("sha256") != info["sha256"]:
            run(python, "-m", "pip", "install", "--quiet", "--force-reinstall", "--no-deps", str(wheel))
    record = {**info, "extras": ",".join(extras)}
    (home / "installed.json").write_text(json.dumps(record) + "\n", encoding="utf-8", newline="\n")


def install_with_retries(info: dict[str, str], home: Path, extras: list[str]) -> None:
    for attempt in range(1, 4):
        try:
            install(info, home, extras)
            return
        except ChecksumError:
            if attempt == 3:
                raise
            print(f"checksum mismatch (attempt {attempt} of 3); asking again shortly", flush=True)
            time.sleep(5 * attempt)
            info = latest()


def wire_vault(home: Path) -> None:
    python = venv_python(home)
    if (VAULT / ".git").exists():
        run("git", "-C", str(VAULT), "config", "core.hooksPath", ".githooks")
    # `narr doctor` exits non-zero when a diagnostic fails (for instance an older vault stamp): report it, do not abort the install.
    command = [str(python), "-m", "narr", "doctor", "--vault", str(VAULT)]
    print("$", " ".join(command), flush=True)
    if subprocess.run(command, check=False).returncode != 0:
        print("narr doctor reported problems above; run `narr upgrade` in the vault, then `narr doctor` again.", flush=True)


def add_to_path(home: Path) -> None:
    scripts = venv_python(home).parent
    if sys.platform != "win32":
        print(f'add to your shell profile:  export PATH="{scripts}:$PATH"')
        return
    import winreg

    with winreg.OpenKey(winreg.HKEY_CURRENT_USER, "Environment", 0, winreg.KEY_ALL_ACCESS) as key:
        try:
            current, kind = winreg.QueryValueEx(key, "Path")
        except FileNotFoundError:
            current, kind = "", winreg.REG_EXPAND_SZ
        parts = [p for p in str(current).split(";") if p]
        if str(scripts) not in parts:
            winreg.SetValueEx(key, "Path", 0, kind, ";".join([str(scripts), *parts]))
    print(f"`narr` is on the user PATH ({scripts}); open a new terminal")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n", 1)[0])
    parser.add_argument("--check", action="store_true", help="change nothing, just report")
    parser.add_argument("--tool-only", action="store_true", help="do not wire this vault")
    parser.add_argument("--add-to-path", action="store_true", help="put `narr` on your PATH")
    parser.add_argument("--extra", action="append", choices=EXTRAS, default=[], help="add an optional extra")
    args = parser.parse_args()
    if sys.version_info < (3, 11):  # noqa: UP036 - this file may be run by an older Python
        print(f"narr needs Python 3.11 or newer; this is {sys.version.split()[0]}", file=sys.stderr)
        return 1
    home = tool_home()
    if path_too_long(home):
        print(f"{home} is too long for Windows ({len(str(home))} characters).", file=sys.stderr)
        print("Pick a short folder, for example:  set NARR_HOME=C:\\narr", file=sys.stderr)
        print("then run this script again. Nothing was changed.", file=sys.stderr)
        return 1
    try:
        newest = latest()
    except (OSError, ValueError) as exc:
        print(f"could not read the newest version from {SOURCE}: {exc}", file=sys.stderr)
        print("Check your connection and try again. Nothing was changed.", file=sys.stderr)
        return 1
    have = installed(home)
    kept = kept_extras(home)
    version = (have["version"] if have else "none") + "".join(f" + {name}" for name in kept)
    print(f"installed: {version}   newest: {newest['version']}")
    if args.check:
        return 0
    extras = sorted({*kept, *args.extra})
    if have is None or have.get("sha256") != newest["sha256"] or extras != kept:
        try:
            install_with_retries(newest, home, extras)
        except (ValueError, subprocess.CalledProcessError, OSError) as exc:
            print(f"install failed: {exc}", file=sys.stderr)
            return 1
    else:
        print("the tool is already the newest")
    if args.tool_only:
        return 0
    wire_vault(home)
    if args.add_to_path:
        add_to_path(home)
    print("done. Next: open your AI assistant in this folder and start your story bible!")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
