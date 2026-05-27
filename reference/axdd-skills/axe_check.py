#!/usr/bin/env python3
"""AXE Harness Validation Lite — pack, skill, handoff, workunit, secret scan."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    yaml = None  # type: ignore

HARNESS_ROOT = Path(__file__).resolve().parent.parent
SUPPORTED_TOOLS = {"claude-code", "codex", "cursor"}
PACK_REQUIRED_META = ("name", "version", "owner")
WORKUNIT_REQUIRED_SPEC = (
    "requiredRolePacks",
    "requiredHandoffs",
    "requiredArtifacts",
    "closureCriteria",
)
SECRET_PATTERNS = [
    (re.compile(r"AKIA[0-9A-Z]{16}"), "AWS access key pattern"),
    (re.compile(r"ghp_[a-zA-Z0-9]{36}"), "GitHub personal access token"),
    (re.compile(r"(?i)(api[_-]?key|secret|password|token)\s*[:=]\s*['\"]?[a-zA-Z0-9_\-]{8,}"), "generic credential assignment"),
]


def load_yaml(path: Path) -> dict | None:
    if yaml is None:
        print("error: PyYAML required. pip install pyyaml", file=sys.stderr)
        sys.exit(2)
    with path.open(encoding="utf-8") as f:
        return yaml.safe_load(f)


def ok(msg: str) -> None:
    print(f"  OK  {msg}")


def fail(msg: str, errors: list[str]) -> None:
    errors.append(msg)
    print(f"  FAIL  {msg}")


def parse_frontmatter(md_path: Path) -> dict | None:
    text = md_path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        return None
    end = text.find("\n---\n", 4)
    if end < 0:
        return None
    if yaml is None:
        return {}
    return yaml.safe_load(text[4:end]) or {}


def resolve_pack_path(arg: str) -> Path:
    p = Path(arg)
    if not p.is_absolute():
        p = HARNESS_ROOT / p
    return p.resolve()


def validate_pack_path(pack_dir: Path, errors: list[str]) -> None:
    pack_yaml = pack_dir / "pack.yaml"
    if not pack_yaml.is_file():
        fail(f"pack.yaml missing in {pack_dir}", errors)
        return
    data = load_yaml(pack_yaml)
    if not data:
        fail(f"invalid YAML: {pack_yaml}", errors)
        return
    ok(f"pack.yaml exists: {pack_yaml}")

    if data.get("apiVersion") != "axe-harness/v1alpha1":
        fail(f"apiVersion must be axe-harness/v1alpha1", errors)
    if not data.get("kind"):
        fail("kind missing", errors)

    meta = data.get("metadata") or {}
    for key in PACK_REQUIRED_META:
        if not meta.get(key):
            fail(f"metadata.{key} missing", errors)
        else:
            ok(f"metadata.{key}={meta.get(key)}")

    spec = data.get("spec") or {}
    tools = spec.get("supportedTools") or []
    if tools:
        if not (set(tools) & SUPPORTED_TOOLS):
            fail(f"spec.supportedTools must include one of {SUPPORTED_TOOLS}", errors)
        else:
            ok(f"supportedTools: {tools}")

    contents = spec.get("contents") or {}
    if isinstance(contents, dict):
        for key, val in contents.items():
            if key == "skills" and isinstance(val, list):
                for sk in val:
                    sk_path = (pack_dir / sk).resolve()
                    if not (sk_path / "SKILL.md").is_file():
                        fail(f"skill not found: {sk_path}/SKILL.md", errors)
                    else:
                        ok(f"skill: {sk}")
            elif key == "templates" and isinstance(val, list):
                for tpl in val:
                    tpl_path = (pack_dir / tpl).resolve()
                    if not tpl_path.is_file():
                        fail(f"template not found: {tpl_path}", errors)
                    else:
                        ok(f"template: {tpl}")
            elif isinstance(val, str):
                fpath = pack_dir / val
                if not fpath.is_file():
                    fail(f"content file missing: {fpath}", errors)
                else:
                    ok(f"{key}: {val}")


def cmd_validate_pack(args: argparse.Namespace) -> int:
    errors: list[str] = []
    pack_dir = resolve_pack_path(args.path)
    print(f"validate-pack: {pack_dir}")
    validate_pack_path(pack_dir, errors)
    return 1 if errors else 0


def cmd_validate_skill(args: argparse.Namespace) -> int:
    errors: list[str] = []
    skill_dir = resolve_pack_path(args.path)
    skill_md = skill_dir / "SKILL.md"
    print(f"validate-skill: {skill_dir}")
    if not skill_md.is_file():
        fail("SKILL.md missing", errors)
        return 1
    text = skill_md.read_text(encoding="utf-8")
    fm = parse_frontmatter(skill_md)
    if fm is None:
        fail("YAML frontmatter missing or invalid", errors)
        return 1
    name = str(fm.get("name", "")).strip()
    desc = str(fm.get("description", "")).strip()
    parent = skill_dir.name
    if not name:
        fail("frontmatter.name missing", errors)
    elif name != parent:
        fail(f"name '{name}' must match directory '{parent}'", errors)
    else:
        ok(f"name={name}")
    if not desc:
        fail("frontmatter.description missing", errors)
    elif len(desc) > 1024:
        fail(f"description length {len(desc)} > 1024", errors)
    else:
        ok("description present")
    if re.search(r"https?://", text) and "agentskills.io" not in text:
        fail("external URL in skill body (1st phase policy)", errors)
    return 1 if errors else 0


def cmd_validate_handoff(args: argparse.Namespace) -> int:
    errors: list[str] = []
    path = resolve_pack_path(args.path)
    print(f"validate-handoff: {path}")
    if not path.is_file():
        fail("handoff file not found", errors)
        return 1
    fm = parse_frontmatter(path)
    if fm is None:
        fail("frontmatter missing", errors)
        return 1
    required = fm.get("required_sections") or []
    if not required:
        fail("required_sections empty in frontmatter", errors)
        return 1
    body = path.read_text(encoding="utf-8")
    for section in required:
        pattern = rf"^##\s+{re.escape(section)}\s*$"
        if not re.search(pattern, body, re.MULTILINE):
            fail(f"section missing: ## {section}", errors)
        else:
            ok(f"section: {section}")
    return 1 if errors else 0


def cmd_validate_workunit(args: argparse.Namespace) -> int:
    errors: list[str] = []
    wu_dir = resolve_pack_path(args.path)
    wu_yaml = wu_dir / "workunit.yaml"
    lite = getattr(args, "lite", False)
    print(f"validate-workunit{' (Enterprise Lite)' if lite else ''}: {wu_dir}")
    if not wu_yaml.is_file():
        fail("workunit.yaml missing", errors)
        return 1
    data = load_yaml(wu_yaml)
    if not data:
        fail("invalid workunit.yaml", errors)
        return 1
    meta = data.get("metadata") or {}
    for key in PACK_REQUIRED_META:
        if not meta.get(key):
            fail(f"metadata.{key} missing", errors)
    spec = data.get("spec") or {}
    for key in WORKUNIT_REQUIRED_SPEC:
        if key not in spec or not spec[key]:
            fail(f"spec.{key} missing or empty", errors)
        else:
            ok(f"spec.{key}")

    # Enterprise Lite: requiredSkills 추가 검증
    if lite:
        if "requiredSkills" in spec and spec["requiredSkills"]:
            ok(f"spec.requiredSkills ({len(spec['requiredSkills'])} skills)")
            # 각 skill이 ../../skills/<id>/ 에 존재하는지 확인
            skills_root = wu_dir.parent.parent / "skills"
            for sid in spec["requiredSkills"]:
                skill_dir = skills_root / sid
                if not (skill_dir / "SKILL.md").is_file():
                    fail(f"requiredSkill not found: skills/{sid}/SKILL.md", errors)
                else:
                    ok(f"skill: {sid}")
        else:
            fail("spec.requiredSkills missing or empty (Lite mode)", errors)

    # Role pack / Handoff 검사 — Lite 모드에선 폴더 없으면 warn만, 통상 모드에선 fail
    for role in spec.get("requiredRolePacks") or []:
        role_dir = HARNESS_ROOT / "roles" / role
        if not (role_dir / "pack.yaml").is_file():
            if lite:
                print(f"  WARN  role pack placeholder (Lite OK): roles/{role}")
            else:
                fail(f"role pack not found: roles/{role}", errors)
        else:
            ok(f"role pack: {role}")

    for sp in spec.get("solutionPacks") or []:
        sp_dir = HARNESS_ROOT / "solution-packs" / sp
        if not (sp_dir / "pack.yaml").is_file():
            if lite:
                print(f"  WARN  solution pack placeholder (Lite OK): {sp}")
            else:
                fail(f"solution pack not found: solution-packs/{sp}", errors)
        else:
            ok(f"solution pack: {sp}")

    for ho in spec.get("requiredHandoffs") or []:
        ho_path = HARNESS_ROOT / "handoffs" / f"{ho}.md"
        if not ho_path.is_file():
            if lite:
                print(f"  WARN  handoff placeholder (Lite OK): handoffs/{ho}.md")
            else:
                fail(f"handoff not found: handoffs/{ho}.md", errors)
        else:
            ok(f"handoff: {ho}")

    return 1 if errors else 0


def cmd_scan_secrets(args: argparse.Namespace) -> int:
    errors: list[str] = []
    target = resolve_pack_path(args.path)
    print(f"scan-secrets: {target}")
    paths = [target] if target.is_file() else sorted(target.rglob("*"))
    for p in paths:
        if not p.is_file():
            continue
        if p.suffix not in {".md", ".yaml", ".yml", ".env", ".py", ".txt"}:
            continue
        try:
            content = p.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        rel = p.relative_to(HARNESS_ROOT) if HARNESS_ROOT in p.parents else p
        for pat, label in SECRET_PATTERNS:
            if pat.search(content):
                fail(f"{rel}: possible {label}", errors)
    if not errors:
        ok("no obvious secret patterns")
    return 1 if errors else 0


def cmd_doctor(_: argparse.Namespace) -> int:
    print(f"AXE Harness root: {HARNESS_ROOT}")
    checks = [
        ("core/pack.yaml", HARNESS_ROOT / "core" / "pack.yaml"),
        ("roles/pm-pl", HARNESS_ROOT / "roles" / "pm-pl" / "pack.yaml"),
        ("work-units/orderflow-fullstack-light", HARNESS_ROOT / "work-units" / "orderflow-fullstack-light" / "workunit.yaml"),
        ("scripts/axe_check.py", Path(__file__)),
    ]
    errors: list[str] = []
    for label, path in checks:
        if path.is_file():
            ok(label)
        else:
            fail(f"missing {label}", errors)
    if yaml is None:
        fail("PyYAML not installed (pip install pyyaml)", errors)
    else:
        ok("PyYAML available")
    return 1 if errors else 0


def main() -> int:
    parser = argparse.ArgumentParser(description="AXE Harness Validation Lite")
    sub = parser.add_subparsers(dest="command", required=True)

    p_pack = sub.add_parser("validate-pack", help="Validate pack.yaml and contents")
    p_pack.add_argument("path", help="e.g. roles/backend or solution-packs/code-review-pack")
    p_pack.set_defaults(func=cmd_validate_pack)

    p_skill = sub.add_parser("validate-skill", help="Validate SKILL.md frontmatter")
    p_skill.add_argument("path", help="path to skill directory")
    p_skill.set_defaults(func=cmd_validate_skill)

    p_ho = sub.add_parser("validate-handoff", help="Validate handoff contract")
    p_ho.add_argument("path", help="e.g. handoffs/backend-to-qa.md")
    p_ho.set_defaults(func=cmd_validate_handoff)

    p_wu = sub.add_parser("validate-workunit", help="Validate work unit pack")
    p_wu.add_argument("path", help="e.g. work-units/orderflow-fullstack-light")
    p_wu.add_argument(
        "--lite",
        action="store_true",
        help="Enterprise Lite mode: warn (not fail) on missing role/handoff/solution pack files, validate requiredSkills",
    )
    p_wu.set_defaults(func=cmd_validate_workunit)

    p_sec = sub.add_parser("scan-secrets", help="Scan for obvious secret patterns")
    p_sec.add_argument("path", help="file or directory")
    p_sec.set_defaults(func=cmd_scan_secrets)

    sub.add_parser("doctor", help="Environment and skeleton check").set_defaults(func=cmd_doctor)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
