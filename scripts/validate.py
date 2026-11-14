#!/usr/bin/env python3
"""Validate every skill and the plugin manifests in this repo.

Checks: SKILL.md frontmatter has name and description, name matches the folder,
name is lowercase-hyphen, description is at most 1024 characters, body length is
reasonable, every eval case has a prompt, case.yaml and at least one grader, and
the plugin JSON files parse and reference the right fields.

Run from the repo root:  python scripts/validate.py
Exit code is 1 if any check fails.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
errors, warnings = [], []


def err(msg):
    errors.append(msg)


def warn(msg):
    warnings.append(msg)


def frontmatter(text):
    m = re.match(r"^---\r?\n(.*?)\r?\n---\r?\n", text, re.S)
    if not m:
        return None
    data = {}
    for line in m.group(1).splitlines():
        if ":" in line and not line.startswith(" "):
            k, v = line.split(":", 1)
            data[k.strip()] = v.strip()
    return data


skills_dir = ROOT / "skills"
skill_names = []
for skill in sorted(p for p in skills_dir.iterdir() if p.is_dir()):
    md = skill / "SKILL.md"
    if not md.exists():
        err(f"{skill.name}: SKILL.md missing")
        continue
    text = md.read_text(encoding="utf8")
    fm = frontmatter(text)
    if fm is None:
        err(f"{skill.name}: frontmatter missing or malformed")
        continue
    name, desc = fm.get("name", ""), fm.get("description", "")
    skill_names.append(name)
    if name != skill.name:
        err(f"{skill.name}: name '{name}' does not match folder")
    if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", name):
        err(f"{skill.name}: name must be lowercase letters, digits and hyphens")
    if not desc:
        err(f"{skill.name}: description missing")
    if desc and not desc.startswith(('"', "'")) and (": " in desc or " #" in desc):
        err(f"{skill.name}: unquoted description contains ': ' or ' #', which breaks YAML; reword or quote it")
    if len(desc) > 1024:
        err(f"{skill.name}: description is {len(desc)} chars (max 1024)")
    elif len(desc) > 900:
        warn(f"{skill.name}: description is {len(desc)} chars, close to the 1024 limit")
    lines = text.count("\n") + 1
    if lines > 500:
        err(f"{skill.name}: SKILL.md has {lines} lines (keep under 500)")
    elif lines > 200:
        warn(f"{skill.name}: SKILL.md has {lines} lines; consider splitting or moving detail to references/")
    if re.search(r"(?i)(api[_-]?key|secret|password|token)\s*[:=]\s*['\"]?[A-Za-z0-9_\-]{16,}", text):
        err(f"{skill.name}: possible secret in SKILL.md")

    evals = skill / "evals"
    if evals.exists():
        for case in sorted(p for p in evals.iterdir() if p.is_dir()):
            for need in ("prompt.md", "case.yaml"):
                if not (case / need).exists():
                    err(f"{skill.name}/evals/{case.name}: {need} missing")
            if not list((case / "graders").glob("*.md")):
                err(f"{skill.name}/evals/{case.name}: no graders")
    else:
        warn(f"{skill.name}: no evals folder")

for f in (".claude-plugin/plugin.json", ".claude-plugin/marketplace.json"):
    p = ROOT / f
    try:
        data = json.loads(p.read_text(encoding="utf8"))
    except Exception as e:  # noqa: BLE001
        err(f"{f}: invalid JSON ({e})")
        continue
    if f.endswith("plugin.json"):
        for k in ("name", "description", "version"):
            if k not in data:
                err(f"{f}: missing '{k}'")
        plugin_name = data.get("name")
    else:
        for k in ("name", "owner", "plugins"):
            if k not in data:
                err(f"{f}: missing '{k}'")
        for entry in data.get("plugins", []):
            if "name" not in entry or "source" not in entry:
                err(f"{f}: plugin entry needs name and source")

pj = ROOT / ".claude-plugin/plugin.json"
mj = ROOT / ".claude-plugin/marketplace.json"
if pj.exists() and mj.exists():
    try:
        pn = json.loads(pj.read_text(encoding="utf8")).get("name")
        mn = [e.get("name") for e in json.loads(mj.read_text(encoding="utf8")).get("plugins", [])]
        if pn not in mn:
            err(f"plugin.json name '{pn}' is not listed in marketplace.json plugins {mn}")
    except Exception:  # noqa: BLE001
        pass

hooks_json = ROOT / "hooks/hooks.json"
if hooks_json.exists():
    try:
        hd = json.loads(hooks_json.read_text(encoding="utf8"))
        for event, groups in hd.get("hooks", {}).items():
            for g in groups:
                for h in g.get("hooks", []):
                    cmd = h.get("command", "")
                    for m in re.findall(r"\$\{CLAUDE_PLUGIN_ROOT\}/([^\"\s]+)", cmd):
                        if not (ROOT / m).exists():
                            err(f"hooks/hooks.json ({event}): {m} does not exist")
    except Exception as ex:  # noqa: BLE001
        err(f"hooks/hooks.json: not valid JSON or wrong shape ({ex})")

agents_dir = ROOT / "agents"
if agents_dir.exists():
    for md in sorted(agents_dir.rglob("*.md")):
        fm = frontmatter(md.read_text(encoding="utf8"))
        if fm is None:
            err(f"agents/{md.name}: frontmatter missing or malformed")
            continue
        if not fm.get("name") or not fm.get("description"):
            err(f"agents/{md.name}: name and description are required")
        elif ":" in fm["name"]:
            err(f"agents/{md.name}: name must not contain a colon")
        elif fm["name"] != md.stem:
            warn(f"agents/{md.name}: name '{fm['name']}' differs from the file name")

dist = ROOT / "dist"
for s in skill_names:
    if not (dist / f"{s}.skill").exists():
        warn(f"dist/{s}.skill missing (run the packager)")

for f in list(skills_dir.rglob("SKILL.md")) + list((ROOT / "agents").rglob("*.md")):
    txt = f.read_text(encoding="utf8")
    if re.search(r"\bMode \d+\b|deep-engineering", txt):
        err(f"{f.relative_to(ROOT)}: stale reference to a retired mode number or the old deep-engineering skill")

# "mode" as a skill-routing term (modes were retired; skills are the unit). Warn only.
MODE_ROUTING = re.compile(
    r"(?i)\bskills? or modes?\b|\bmodes? or skills?\b"
    r"|(?<!dark )(?<!failure )(?<!test )(?<!debug )(?<!safe )\bmodes? (?:handles?|routes?)\b"
    r"|\bwhich modes? (?:handles?|applies|to use)\b|\bmode \d+\b(?! ?(?:bytes|permissions?))"
)
for f in list(skills_dir.rglob("SKILL.md")) + list((ROOT / "agents").rglob("*.md")):
    for n, line in enumerate(f.read_text(encoding="utf8").splitlines(), 1):
        m = MODE_ROUTING.search(line)
        if m:
            warn(f"{f.relative_to(ROOT)}:{n}: 'mode' used as a routing term ('{m.group(0)}'); say skill instead")

print(f"skills checked: {', '.join(skill_names)}")
for w in warnings:
    print("WARN ", w)
for e in errors:
    print("ERROR", e)
print(f"{len(errors)} error(s), {len(warnings)} warning(s)")
sys.exit(1 if errors else 0)
