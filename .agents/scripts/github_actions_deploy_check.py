#!/usr/bin/env python3
"""GitHub Actions deploy watch — RUN_ID 特定と結果 JSON 構築。"""

from __future__ import annotations

import json
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Any


@dataclass
class WorkflowRunTarget:
    workflow: str
    run_id: int | None


def discover_run_id(
    *,
    owner: str,
    repo: str,
    ref: str,
    since: str,
    workflow: str,
    target_sha: str,
    retries: int = 10,
    sleep_sec: int = 3,
    gh_run: list[str] | None = None,
) -> int | None:
    """Return databaseId for workflow_dispatch run created at or after since."""
    import time

    for _ in range(retries):
        cmd = gh_run or [
            "gh",
            "run",
            "list",
            "--repo",
            f"{owner}/{repo}",
            "--workflow",
            workflow,
            "--branch",
            ref,
            "--event",
            "workflow_dispatch",
            "--created",
            f">={since}",
            "--limit",
            "100",
            "--json",
            "databaseId,headSha",
        ]
        proc = subprocess.run(cmd, capture_output=True, text=True, check=False)
        if proc.returncode == 0 and proc.stdout.strip():
            try:
                rows = json.loads(proc.stdout)
            except json.JSONDecodeError:
                rows = []
            for row in rows if isinstance(rows, list) else []:
                if isinstance(row, dict) and row.get("headSha") == target_sha:
                    run_id = row.get("databaseId")
                    if isinstance(run_id, int):
                        return run_id
        time.sleep(sleep_sec)
    return None


def fetch_run_url(*, owner: str, repo: str, run_id: int) -> str | None:
    proc = subprocess.run(
        [
            "gh",
            "run",
            "view",
            str(run_id),
            "--repo",
            f"{owner}/{repo}",
            "--json",
            "url",
        ],
        capture_output=True,
        text=True,
        check=False,
    )
    if proc.returncode != 0:
        return None
    try:
        data = json.loads(proc.stdout)
    except json.JSONDecodeError:
        return None
    url = data.get("url")
    return url if isinstance(url, str) else None


def watch_run(*, owner: str, repo: str, run_id: int) -> bool:
    proc = subprocess.run(
        [
            "gh",
            "run",
            "watch",
            str(run_id),
            "--repo",
            f"{owner}/{repo}",
            "--exit-status",
        ],
        capture_output=True,
        text=True,
        check=False,
    )
    return proc.returncode == 0


def build_results_payload(
    *,
    deploy_id: str,
    owner: str,
    repo: str,
    ref: str,
    since: str,
    target_sha: str,
    workflows: list[str],
    runs: list[dict[str, Any]],
) -> dict[str, Any]:
    any_failed = any(r.get("success") is False for r in runs)
    any_missing = (
        not workflows or len(runs) != len(workflows)
        or {r.get("workflow") for r in runs} != set(workflows)
        or any(r.get("run_id") is None or r.get("headSha") != target_sha
               or r.get("status") != "completed" or not isinstance(r.get("success"), bool) for r in runs)
    )

    if any_missing:
        overall = "partial"
    elif any_failed:
        overall = "failure"
    else:
        overall = "success"

    return {
        "deploy_id": deploy_id,
        "owner": owner,
        "repo": repo,
        "ref": ref,
        "since": since,
        "target_sha": target_sha,
        "workflows": workflows,
        "overall_status": overall,
        "runs": runs,
    }


def write_results(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def validate_results_payload(payload: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    for key in ("deploy_id", "owner", "repo", "ref", "since", "target_sha", "overall_status", "runs"):
        if key not in payload:
            errors.append(f"missing key: {key}")
    runs = payload.get("runs")
    if not isinstance(runs, list):
        errors.append("runs must be a list")
    else:
        for i, run in enumerate(runs):
            if not isinstance(run, dict):
                errors.append(f"runs[{i}] must be an object")
                continue
            if "workflow" not in run:
                errors.append(f"runs[{i}] missing workflow")
    return errors


def main() -> int:
    import argparse

    parser = argparse.ArgumentParser(description="GitHub Actions deploy check helpers")
    sub = parser.add_subparsers(dest="command", required=True)

    disc = sub.add_parser("discover-run-id")
    disc.add_argument("--owner", required=True)
    disc.add_argument("--repo", required=True)
    disc.add_argument("--ref", required=True)
    disc.add_argument("--since", required=True)
    disc.add_argument("--workflow", required=True)
    disc.add_argument("--target-sha", required=True)

    url_p = sub.add_parser("fetch-run-url")
    url_p.add_argument("--owner", required=True)
    url_p.add_argument("--repo", required=True)
    url_p.add_argument("--run-id", type=int, required=True)

    write_p = sub.add_parser("write-results")
    write_p.add_argument("--output", type=Path, required=True)
    write_p.add_argument("--deploy-id", required=True)
    write_p.add_argument("--owner", required=True)
    write_p.add_argument("--repo", required=True)
    write_p.add_argument("--ref", required=True)
    write_p.add_argument("--since", required=True)
    write_p.add_argument("--target-sha", required=True)
    write_p.add_argument("--runs-json", required=True, help="Path to runs JSON file")

    args = parser.parse_args()

    if args.command == "discover-run-id":
        run_id = discover_run_id(
            owner=args.owner,
            repo=args.repo,
            ref=args.ref,
            since=args.since,
            workflow=args.workflow,
            target_sha=args.target_sha,
        )
        print(run_id or "")
    elif args.command == "fetch-run-url":
        url = fetch_run_url(owner=args.owner, repo=args.repo, run_id=args.run_id)
        print(url or "")
    elif args.command == "write-results":
        runs = json.loads(Path(args.runs_json).read_text(encoding="utf-8"))
        for run in runs:
            if run.get("run_id") is None:
                continue
            proc = subprocess.run(["gh", "run", "view", str(run["run_id"]), "--repo",
                                   f"{args.owner}/{args.repo}", "--json", "headSha,status,conclusion,url"],
                                  capture_output=True, text=True, check=False)
            try:
                metadata = json.loads(proc.stdout) if proc.returncode == 0 else {}
            except json.JSONDecodeError:
                metadata = {}
            if not isinstance(metadata, dict):
                metadata = {}
            run.update({key: metadata.get(key) for key in ("headSha", "status", "conclusion", "url")})
            run["success"] = (run.get("success") is True and run.get("headSha") == args.target_sha
                              and run.get("status") == "completed" and run.get("conclusion") == "success")
        workflows = [str(r.get("workflow")) for r in runs if isinstance(r, dict)]
        payload = build_results_payload(
            deploy_id=args.deploy_id,
            owner=args.owner,
            repo=args.repo,
            ref=args.ref,
            since=args.since,
            target_sha=args.target_sha,
            workflows=workflows,
            runs=runs,
        )
        write_results(args.output, payload)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
