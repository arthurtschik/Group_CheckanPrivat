#!/usr/bin/env python3
"""Copies the public files into a clone of the public repository arthurtschik/Group_Checkan.

    python3 build/publish.py [PFAD_ZUM_OEFFENTLICHEN_CLONE]      # default: ../group_checkan

The public repository only holds the download page (GitHub Pages from main /docs), a short README,
SECURITY.md and the releases. Source code, build scripts, tests and release notes stay in this private
repository. Files in the public clone that are not in the list below are removed (except .git), so nothing
private can be left behind there. Commit and push the public clone afterwards.
"""
import os, shutil, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DEST = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "..", "group_checkan"))

# public path -> source path (relative to this repository)
FILES = {
    "README.md": "public/README.md",
    "SECURITY.md": "SECURITY.md",
    "docs/index.html": "docs/index.html",
    "docs/datenschutz.html": "docs/datenschutz.html",
    "docs/nutzungsbedingungen.html": "docs/nutzungsbedingungen.html",
    "docs/.nojekyll": "docs/.nojekyll",
    "docs/assets/app.js": "docs/assets/app.js",
    "docs/assets/style.css": "docs/assets/style.css",
    "docs/assets/logo.png": "docs/assets/logo.png",
    "docs/assets/favicon.png": "docs/assets/favicon.png",
    "docs/assets/apple-touch-icon.png": "docs/assets/apple-touch-icon.png",
}


def main():
    if not os.path.isdir(os.path.join(DEST, ".git")):
        raise SystemExit(f"{DEST} is not a git clone of the public repository")
    if os.path.samefile(DEST, ROOT):
        raise SystemExit("destination is this (private) repository")
    keep = set(FILES)
    for dirpath, dirnames, filenames in os.walk(DEST):
        if ".git" in dirnames:
            dirnames.remove(".git")
        for f in filenames:
            rel = os.path.relpath(os.path.join(dirpath, f), DEST).replace(os.sep, "/")
            if rel not in keep:
                os.remove(os.path.join(dirpath, f))
                print("removed", rel)
    for dst, src in FILES.items():
        s, d = os.path.join(ROOT, src), os.path.join(DEST, dst)
        if not os.path.isfile(s):
            raise SystemExit(f"missing {src}")
        os.makedirs(os.path.dirname(d), exist_ok=True)
        shutil.copyfile(s, d)
    for dirpath, dirnames, filenames in os.walk(DEST, topdown=False):   # drop empty folders
        if ".git" not in dirpath.split(os.sep) and dirpath != DEST and not os.listdir(dirpath):
            os.rmdir(dirpath)
    print(f"copied {len(FILES)} files to {DEST}")


if __name__ == "__main__":
    main()
