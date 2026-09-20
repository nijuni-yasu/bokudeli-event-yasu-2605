#!/usr/bin/env python3
"""failure policy ログから、名前指定 --only 引数を組み立てる。

全体デプロイ（`--only functions`）へ `--force` を付けてはならない。
対象は index.ts に export がある関数名だけ。
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

_SCRIPTS_DIR = Path(__file__).resolve().parent
if str(_SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS_DIR))

from verify_functions_deploy_list import parse_index_exports

FAILURE_POLICY_ERROR = "Pass the --force option to deploy functions with a failure policy"
RETRY_LINE_RE = re.compile(r"will newly be retried in case of failure:\s*(.+)", re.IGNORECASE)
ANSI_RE = re.compile(r"\x1b\[[0-9;]*m")
# CLI は `name(region). Retried executions...` と同一行に説明文を続ける。
FUNC_TOKEN_RE = re.compile(r"^([A-Za-z_][A-Za-z0-9_]*)(?:\([^)]*\))?")


def strip_ansi(text: str) -> str:
    return ANSI_RE.sub("", text)


def extract_function_names(log: str) -> list[str]:
    names: list[str] = []
    seen: set[str] = set()
    for raw_line in strip_ansi(log).splitlines():
        match = RETRY_LINE_RE.search(raw_line)
        if match is None:
            continue
        rest = match.group(1).strip()
        while rest:
            rest = rest.lstrip()
            token_match = FUNC_TOKEN_RE.match(rest)
            if token_match is None:
                break
            name = token_match.group(1)
            rest = rest[token_match.end() :].lstrip()
            if name not in seen:
                seen.add(name)
                names.append(name)
            if rest.startswith(","):
                rest = rest[1:]
                continue
            break
    return names


def build_named_only_args(names: list[str], exports: set[str]) -> str:
    if not names:
        raise ValueError("failure policy ログから関数名を抽出できませんでした。")
    unknown = [name for name in names if name not in exports]
    if unknown:
        raise ValueError(
            "failure policy 対象が index.ts の export にありません: " + ", ".join(unknown)
        )
    return "--only " + ",".join(f"functions:{name}" for name in names)


def parse_named_only_args(log: str, exports: set[str]) -> str:
    if FAILURE_POLICY_ERROR not in strip_ansi(log):
        raise ValueError("failure policy の --force 要求がログにありません。")
    return build_named_only_args(extract_function_names(log), exports)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--log", required=True, type=Path)
    parser.add_argument("--index", required=True, type=Path)
    args = parser.parse_args(argv)

    try:
        log = args.log.read_text(encoding="utf-8")
        exports = parse_index_exports(args.index)
        print(parse_named_only_args(log, exports))
    except (OSError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
