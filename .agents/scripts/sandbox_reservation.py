#!/usr/bin/env python3
"""sandbox 予約台帳。メインクローンの .agents/state を正本にする。"""

from __future__ import annotations

import argparse
import fcntl
import json
import subprocess
import sys
from collections.abc import Callable
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

LEDGER_RELATIVE = Path(".agents/state/sandbox-reservations.json")
LOCK_SUFFIX = ".lock"
DEFAULT_ORIGIN_REPO = "nijuniinc/bokudeli-event-new"
FIXTURE_VERSION = "pstack-001"
FIXTURE_SCOPE = "fixed ids + member_orders of pstack-user-participant-001"

PrStateFn = Callable[[int], str | None]


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def resolve_main_clone_root(cwd: Path | None = None) -> Path:
    work = cwd or Path.cwd()
    result = subprocess.run(
        ["git", "rev-parse", "--git-common-dir"],
        cwd=work,
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        raise RuntimeError(f"git-common-dir を解決できない: {result.stderr.strip()}")
    git_common = Path(result.stdout.strip())
    if not git_common.is_absolute():
        git_common = (work / git_common).resolve()
    else:
        git_common = git_common.resolve()
    if git_common.name == ".git":
        return git_common.parent
    return git_common.parent


def default_ledger_path(cwd: Path | None = None) -> Path:
    return resolve_main_clone_root(cwd) / LEDGER_RELATIVE


def empty_ledger() -> dict[str, Any]:
    return {"version": 1, "updated_at": utc_now(), "environments": {}, "history": []}


def _load_ledger(path: Path) -> dict[str, Any]:
    if not path.exists():
        return empty_ledger()
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise RuntimeError(f"台帳 JSON が壊れている: {path}") from exc
    if not isinstance(data, dict):
        raise RuntimeError(f"台帳の根が object ではない: {path}")
    data.setdefault("version", 1)
    data.setdefault("environments", {})
    data.setdefault("history", [])
    return data


def _save_ledger(path: Path, ledger: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    ledger["updated_at"] = utc_now()
    path.write_text(json.dumps(ledger, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


@contextmanager
def ledger_lock(path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    lock_path = Path(f"{path}{LOCK_SUFFIX}")
    with lock_path.open("a", encoding="utf-8") as lock_fh:
        fcntl.flock(lock_fh.fileno(), fcntl.LOCK_EX)
        try:
            yield
        finally:
            fcntl.flock(lock_fh.fileno(), fcntl.LOCK_UN)


def update_ledger(path: Path, mutator: Callable[[dict[str, Any]], Any]) -> Any:
    with ledger_lock(path):
        ledger = _load_ledger(path)
        result = mutator(ledger)
        _save_ledger(path, ledger)
        return result


def _env(ledger: dict[str, Any], env_id: str) -> dict[str, Any]:
    environments = ledger["environments"]
    if env_id not in environments:
        raise RuntimeError(f"未知の環境: {env_id}")
    return environments[env_id]


def _reservation_ids(ledger: dict[str, Any]) -> list[str]:
    ids: list[str] = []
    for env in ledger["environments"].values():
        reservation = env.get("reservation")
        if isinstance(reservation, dict) and reservation.get("id"):
            ids.append(str(reservation["id"]))
    for item in ledger.get("history", []):
        if item.get("reservation_id"):
            ids.append(str(item["reservation_id"]))
    return ids


def next_reservation_id(ledger: dict[str, Any], *, now: datetime | None = None) -> str:
    stamp = (now or datetime.now(timezone.utc)).strftime("%Y%m%d")
    prefix = f"pstack-res-{stamp}-"
    highest = 0
    for reservation_id in _reservation_ids(ledger):
        if reservation_id.startswith(prefix):
            suffix = reservation_id[len(prefix) :]
            if suffix.isdigit():
                highest = max(highest, int(suffix))
    return f"{prefix}{highest + 1:03d}"


def _append_history(
    ledger: dict[str, Any],
    *,
    env_id: str,
    reservation: dict[str, Any],
    reason: str,
) -> None:
    ledger.setdefault("history", []).append(
        {
            "reservation_id": reservation.get("id"),
            "generation": reservation.get("generation"),
            "env_id": env_id,
            "branch": reservation.get("branch"),
            "issue": reservation.get("issue"),
            "pr": reservation.get("pr"),
            "ended_at": utc_now(),
            "reason": reason,
        }
    )


def _ok(payload: dict[str, Any]) -> dict[str, Any]:
    return {"ok": True, **payload}


def _err(code: str, message: str, **extra: Any) -> dict[str, Any]:
    return {"ok": False, "error": code, "message": message, **extra}


def fetch_pr_state(pr: int, *, repo: str = DEFAULT_ORIGIN_REPO) -> str | None:
    result = subprocess.run(
        ["gh", "pr", "view", str(pr), "--repo", repo, "--json", "state", "-q", ".state"],
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        return None
    state = result.stdout.strip()
    return state if state else None


def require_idle(env: dict[str, Any]) -> dict[str, Any]:
    """旧 run が環境へ書き込まなくなるまで再割当しない。API 失敗も空きと扱わない。"""
    reservation = env.get("reservation") or {}
    if reservation.get("pending_dispatches"):
        return _err("dispatch_unconfirmed", "発火済み run の終了確認が台帳に無い。予約を保持する")
    repo = env.get("github_repo")
    if not isinstance(repo, str) or repo == "":
        return _err("unknown_repo", "旧デプロイを確認する github_repo が無い")
    result = subprocess.run(
        ["gh", "api", "--paginate", "--slurp", f"repos/{repo}/actions/runs?per_page=100"],
        capture_output=True, text=True, check=False,
    )
    if result.returncode != 0:
        return _err("runs_unavailable", "旧デプロイの終了を確認できない。予約は保持する")
    try:
        pages = json.loads(result.stdout)
        active = [run["id"] for page in pages for run in page["workflow_runs"]
                  if Path(run.get("path", "")).name.startswith("deploy_") and run["status"] != "completed"]
    except (json.JSONDecodeError, KeyError, TypeError):
        return _err("runs_unavailable", "Actions 応答を確認できない。予約は保持する")
    if active:
        return _err("deploy_active", "旧デプロイが残っている。停止または完了を確認する", runs=active)
    return _ok({})


def run_reserved(path: Path, *, env_id: str, reservation_id: str, generation: int, command: list[str]) -> dict[str, Any]:
    # check と副作用の間で switch/release が入らないよう、同じ台帳ロックで実行する。
    with ledger_lock(path):
        checked = check(_load_ledger(path), env_id=env_id, reservation_id=reservation_id, generation=generation)
        if not checked["ok"]:
            return checked
        if not command:
            return _err("empty_command", "実行するコマンドが無い")
        ledger = _load_ledger(path)
        reservation = _env(ledger, env_id)["reservation"]
        if len(command) >= 4 and Path(command[0]).name == "gh" and command[1:3] == ["workflow", "run"]:
            if not reservation.get("target_sha"):
                return _err("no_target_sha", "dispatch 前に record-deploy で対象 SHA を記録する")
            reservation.setdefault("pending_dispatches", []).append({"workflow": command[3], "since": utc_now()})
            _save_ledger(path, ledger)
        result = subprocess.run(command, check=False)
        if result.returncode != 0:
            return _err("command_failed", "予約内のコマンドが失敗した", exit_code=result.returncode)
        return _ok({"env_id": env_id})


def reconcile(
    ledger: dict[str, Any],
    *,
    pr_state_fn: PrStateFn | None = None,
) -> dict[str, Any]:
    lookup = pr_state_fn or fetch_pr_state
    released: list[dict[str, Any]] = []
    for env_id, env in ledger["environments"].items():
        reservation = env.get("reservation")
        if not isinstance(reservation, dict):
            continue
        if env.get("status") != "occupied":
            continue
        pr = reservation.get("pr")
        if not isinstance(pr, int):
            continue
        state = lookup(pr)
        if state in {"MERGED", "CLOSED"}:
            idle = require_idle(env)
            if not idle["ok"]:
                continue
            reason = "reconcile_merged" if state == "MERGED" else "reconcile_closed"
            _append_history(ledger, env_id=env_id, reservation=reservation, reason=reason)
            env["reservation"] = None
            env["status"] = "empty"
            released.append({"env_id": env_id, "pr": pr, "state": state, "reason": reason})
    return _ok({"released": released})


def pick(
    ledger: dict[str, Any],
    *,
    branch: str,
    issue: int | None = None,
    pr: int | None = None,
    owner: str = "",
    pr_state_fn: PrStateFn | None = None,
) -> dict[str, Any]:
    reconcile(ledger, pr_state_fn=pr_state_fn)
    for env_id, env in ledger["environments"].items():
        reservation = env.get("reservation")
        if (
            env.get("status") == "occupied"
            and isinstance(reservation, dict)
            and reservation.get("branch") == branch
        ):
            if pr is not None:
                reservation["pr"] = pr
            if issue is not None:
                reservation["issue"] = issue
            reservation["updated_at"] = utc_now()
            return _ok(
                {
                    "new_assignment": False,
                    "seed": False,
                    "env_id": env_id,
                    "remote": env.get("remote"),
                    "gcloud_project": env.get("gcloud_project"),
                    "github_repo": env.get("github_repo"),
                    "user_url": env.get("user_url"),
                    "reservation": reservation,
                }
            )

    for env_id, env in ledger["environments"].items():
        if env.get("selectable") is True and env.get("status") == "empty":
            if not require_idle(env)["ok"]:
                continue
            reservation = {
                "id": next_reservation_id(ledger),
                "generation": 1,
                "branch": branch,
                "issue": issue,
                "pr": pr,
                "owner": owner,
                "acquired_at": utc_now(),
                "updated_at": utc_now(),
                "release_condition": "PR merge/close or explicit release",
                "target_sha": None,
                "fixture": None,
                "retry": {"count": 0, "workflows": []},
            }
            env["status"] = "occupied"
            env["reservation"] = reservation
            return _ok(
                {
                    "new_assignment": True,
                    "seed": True,
                    "env_id": env_id,
                    "remote": env.get("remote"),
                    "gcloud_project": env.get("gcloud_project"),
                    "github_repo": env.get("github_repo"),
                    "user_url": env.get("user_url"),
                    "reservation": reservation,
                }
            )

    occupied = [
        {
            "env_id": env_id,
            "branch": (env.get("reservation") or {}).get("branch"),
            "selectable": env.get("selectable"),
            "status": env.get("status"),
        }
        for env_id, env in ledger["environments"].items()
    ]
    return _err("no_vacancy", "空きの selectable 環境が無い", occupied=occupied)


def reserve(
    ledger: dict[str, Any],
    *,
    env_id: str,
    branch: str,
    issue: int | None = None,
    pr: int | None = None,
    owner: str = "",
) -> dict[str, Any]:
    env = _env(ledger, env_id)
    reservation = env.get("reservation")
    if env.get("status") == "occupied" and isinstance(reservation, dict):
        if reservation.get("branch") == branch:
            if pr is not None:
                reservation["pr"] = pr
            if issue is not None:
                reservation["issue"] = issue
            reservation["updated_at"] = utc_now()
            return _ok(
                {
                    "new_assignment": False,
                    "seed": False,
                    "env_id": env_id,
                    "remote": env.get("remote"),
                    "gcloud_project": env.get("gcloud_project"),
                    "reservation": reservation,
                }
            )
        return _err(
            "occupied",
            f"{env_id} は {reservation.get('branch')} が占有中",
            reservation=reservation,
        )
    if env.get("selectable") is not True:
        return _err("not_selectable", f"{env_id} は予約候補ではない")

    idle = require_idle(env)
    if not idle["ok"]:
        return idle

    reservation = {
        "id": next_reservation_id(ledger),
        "generation": 1,
        "branch": branch,
        "issue": issue,
        "pr": pr,
        "owner": owner,
        "acquired_at": utc_now(),
        "updated_at": utc_now(),
        "release_condition": "PR merge/close or explicit release",
        "target_sha": None,
        "fixture": None,
        "retry": {"count": 0, "workflows": []},
    }
    env["status"] = "occupied"
    env["reservation"] = reservation
    return _ok(
        {
            "new_assignment": True,
            "seed": True,
            "env_id": env_id,
            "remote": env.get("remote"),
            "gcloud_project": env.get("gcloud_project"),
            "reservation": reservation,
        }
    )


def check(
    ledger: dict[str, Any],
    *,
    env_id: str,
    reservation_id: str,
    generation: int,
) -> dict[str, Any]:
    env = _env(ledger, env_id)
    reservation = env.get("reservation")
    if not isinstance(reservation, dict):
        return _err("no_reservation", f"{env_id} に現行予約が無い")
    if reservation.get("id") != reservation_id:
        return _err("stale_id", "予約 ID が現行と違う", current=reservation)
    if int(reservation.get("generation") or 0) != int(generation):
        return _err("stale_generation", "予約世代が現行と違う", current=reservation)
    return _ok({"env_id": env_id, "reservation": reservation})


def switch(
    ledger: dict[str, Any],
    *,
    env_id: str,
    branch: str,
    issue: int | None = None,
    pr: int | None = None,
    owner: str = "",
) -> dict[str, Any]:
    env = _env(ledger, env_id)
    if env.get("selectable") is not True:
        return _err("not_selectable", f"{env_id} は予約候補ではない")
    idle = require_idle(env)
    if not idle["ok"]:
        return idle
    previous = env.get("reservation")
    previous_generation = 0
    if isinstance(previous, dict):
        previous_generation = int(previous.get("generation") or 0)
        _append_history(ledger, env_id=env_id, reservation=previous, reason="switched")

    reservation = {
        "id": next_reservation_id(ledger),
        "generation": previous_generation + 1 if previous_generation else 1,
        "branch": branch,
        "issue": issue,
        "pr": pr,
        "owner": owner,
        "acquired_at": utc_now(),
        "updated_at": utc_now(),
        "release_condition": "PR merge/close or explicit release",
        "target_sha": None,
        "fixture": None,
        "retry": {"count": 0, "workflows": []},
    }
    env["status"] = "occupied"
    env["reservation"] = reservation
    return _ok(
        {
            "new_assignment": True,
            "seed": True,
            "env_id": env_id,
            "remote": env.get("remote"),
            "gcloud_project": env.get("gcloud_project"),
            "reservation": reservation,
            "previous_reservation_id": previous.get("id") if isinstance(previous, dict) else None,
        }
    )


def release(
    ledger: dict[str, Any],
    *,
    env_id: str,
    reservation_id: str,
) -> dict[str, Any]:
    env = _env(ledger, env_id)
    reservation = env.get("reservation")
    if not isinstance(reservation, dict):
        return _err("no_reservation", f"{env_id} に現行予約が無い")
    if reservation.get("id") != reservation_id:
        return _err("stale_id", "予約 ID が現行と違う", current=reservation)
    idle = require_idle(env)
    if not idle["ok"]:
        return idle
    _append_history(ledger, env_id=env_id, reservation=reservation, reason="released")
    env["reservation"] = None
    env["status"] = "empty"
    return _ok({"env_id": env_id, "released": reservation_id})


def record_deploy(
    ledger: dict[str, Any],
    *,
    env_id: str,
    reservation_id: str,
    generation: int,
    sha: str,
) -> dict[str, Any]:
    checked = check(ledger, env_id=env_id, reservation_id=reservation_id, generation=generation)
    if not checked["ok"]:
        return checked
    reservation = _env(ledger, env_id)["reservation"]
    reservation["target_sha"] = sha
    reservation["updated_at"] = utc_now()
    return _ok({"env_id": env_id, "reservation": reservation})


def record_run(ledger: dict[str, Any], *, env_id: str, reservation_id: str, generation: int, run_id: int) -> dict[str, Any]:
    checked = check(ledger, env_id=env_id, reservation_id=reservation_id, generation=generation)
    if not checked["ok"]:
        return checked
    env = _env(ledger, env_id)
    reservation = env["reservation"]
    recorded = reservation.setdefault("completed_runs", [])
    if run_id in recorded:
        return _ok({"already_recorded": True})
    result = subprocess.run(["gh", "api", f"repos/{env['github_repo']}/actions/runs/{run_id}"], capture_output=True, text=True, check=False)
    if result.returncode != 0:
        return _err("run_unavailable", "run の終了を確認できない")
    try:
        run = json.loads(result.stdout)
        if run["status"] != "completed" or run["head_sha"] != reservation.get("target_sha") or run["head_branch"] != reservation["branch"]:
            return _err("run_mismatch", "対象 SHA・ブランチの終了済み run ではない")
        pending = reservation.get("pending_dispatches", [])
        index = next((i for i, item in enumerate(pending) if item["workflow"] == Path(run["path"]).name and run["created_at"] >= item["since"]), None)
    except (json.JSONDecodeError, KeyError, TypeError):
        return _err("run_unavailable", "run 応答を検証できない")
    if index is None:
        return _err("run_mismatch", "発火記録に一致しない run")
    pending.pop(index)
    recorded.append(run_id)
    return _ok({"env_id": env_id, "run_id": run_id})


def record_fixture(
    ledger: dict[str, Any],
    *,
    env_id: str,
    reservation_id: str,
    generation: int,
    result: str,
    version: str = FIXTURE_VERSION,
    scope: str = FIXTURE_SCOPE,
) -> dict[str, Any]:
    checked = check(ledger, env_id=env_id, reservation_id=reservation_id, generation=generation)
    if not checked["ok"]:
        return checked
    reservation = _env(ledger, env_id)["reservation"]
    reservation["fixture"] = {
        "version": version,
        "scope": scope,
        "result": result,
        "at": utc_now(),
    }
    reservation["updated_at"] = utc_now()
    return _ok({"env_id": env_id, "reservation": reservation})


def record_retry(
    ledger: dict[str, Any],
    *,
    env_id: str,
    reservation_id: str,
    generation: int,
    workflow: str,
    count: int,
) -> dict[str, Any]:
    checked = check(ledger, env_id=env_id, reservation_id=reservation_id, generation=generation)
    if not checked["ok"]:
        return checked
    reservation = _env(ledger, env_id)["reservation"]
    retry = reservation.get("retry")
    if not isinstance(retry, dict):
        retry = {"count": 0, "workflows": []}
        reservation["retry"] = retry
    retry["count"] = count
    workflows = list(retry.get("workflows") or [])
    if workflow not in workflows:
        workflows.append(workflow)
    retry["workflows"] = workflows
    reservation["updated_at"] = utc_now()
    return _ok({"env_id": env_id, "reservation": reservation})


def _print(payload: dict[str, Any]) -> int:
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return 0 if payload.get("ok") else 1


def _optional_int(value: str | None) -> int | None:
    if value is None or value == "":
        return None
    return int(value)


def main() -> int:
    parser = argparse.ArgumentParser(description="sandbox reservation ledger")
    parser.add_argument("--ledger", type=Path, default=None)
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("path", help="Print resolved ledger path")
    sub.add_parser("list", help="Print ledger JSON")
    sub.add_parser("reconcile", help="Release reservations whose PR is MERGED or CLOSED")

    pick_p = sub.add_parser("pick", help="Reuse current branch reservation or take a vacant selectable env")
    pick_p.add_argument("--branch", required=True)
    pick_p.add_argument("--issue", default=None)
    pick_p.add_argument("--pr", default=None)
    pick_p.add_argument("--owner", default="")

    reserve_p = sub.add_parser("reserve", help="Reserve a specific env if empty or same branch")
    reserve_p.add_argument("--env", required=True)
    reserve_p.add_argument("--branch", required=True)
    reserve_p.add_argument("--issue", default=None)
    reserve_p.add_argument("--pr", default=None)
    reserve_p.add_argument("--owner", default="")

    check_p = sub.add_parser("check", help="Verify reservation id and generation")
    check_p.add_argument("--env", required=True)
    check_p.add_argument("--reservation-id", required=True)
    check_p.add_argument("--generation", type=int, required=True)

    run_p = sub.add_parser("run", help="Check reservation and run a command under the ledger lock")
    run_p.add_argument("--env", required=True)
    run_p.add_argument("--reservation-id", required=True)
    run_p.add_argument("--generation", type=int, required=True)
    run_p.add_argument("exec_command", nargs=argparse.REMAINDER)

    switch_p = sub.add_parser("switch", help="Move an env to another branch and bump generation")
    switch_p.add_argument("--env", required=True)
    switch_p.add_argument("--branch", required=True)
    switch_p.add_argument("--issue", default=None)
    switch_p.add_argument("--pr", default=None)
    switch_p.add_argument("--owner", default="")

    release_p = sub.add_parser("release", help="Release a reservation by id")
    release_p.add_argument("--env", required=True)
    release_p.add_argument("--reservation-id", required=True)

    deploy_p = sub.add_parser("record-deploy", help="Store target SHA on the current reservation")
    deploy_p.add_argument("--env", required=True)
    deploy_p.add_argument("--reservation-id", required=True)
    deploy_p.add_argument("--generation", type=int, required=True)
    deploy_p.add_argument("--sha", required=True)

    run_record_p = sub.add_parser("record-run", help="Confirm completed dispatch before handover")
    run_record_p.add_argument("--env", required=True)
    run_record_p.add_argument("--reservation-id", required=True)
    run_record_p.add_argument("--generation", type=int, required=True)
    run_record_p.add_argument("--run-id", type=int, required=True)

    fixture_p = sub.add_parser("record-fixture", help="Store fixture restore result")
    fixture_p.add_argument("--env", required=True)
    fixture_p.add_argument("--reservation-id", required=True)
    fixture_p.add_argument("--generation", type=int, required=True)
    fixture_p.add_argument("--result", required=True)
    fixture_p.add_argument("--version", default=FIXTURE_VERSION)
    fixture_p.add_argument("--scope", default=FIXTURE_SCOPE)

    retry_p = sub.add_parser("record-retry", help="Store transient retry count")
    retry_p.add_argument("--env", required=True)
    retry_p.add_argument("--reservation-id", required=True)
    retry_p.add_argument("--generation", type=int, required=True)
    retry_p.add_argument("--workflow", required=True)
    retry_p.add_argument("--count", type=int, required=True)

    args = parser.parse_args()
    ledger_path = args.ledger or default_ledger_path()

    if args.command == "path":
        print(str(ledger_path))
        return 0

    if args.command == "list":
        with ledger_lock(ledger_path):
            print(json.dumps(_load_ledger(ledger_path), ensure_ascii=False, indent=2))
        return 0

    if args.command == "reconcile":
        return _print(update_ledger(ledger_path, lambda ledger: reconcile(ledger)))

    if args.command == "pick":
        return _print(
            update_ledger(
                ledger_path,
                lambda ledger: pick(
                    ledger,
                    branch=args.branch,
                    issue=_optional_int(args.issue),
                    pr=_optional_int(args.pr),
                    owner=args.owner,
                ),
            )
        )

    if args.command == "reserve":
        return _print(
            update_ledger(
                ledger_path,
                lambda ledger: reserve(
                    ledger,
                    env_id=args.env,
                    branch=args.branch,
                    issue=_optional_int(args.issue),
                    pr=_optional_int(args.pr),
                    owner=args.owner,
                ),
            )
        )

    if args.command == "check":
        with ledger_lock(ledger_path):
            return _print(
                check(
                    _load_ledger(ledger_path),
                    env_id=args.env,
                    reservation_id=args.reservation_id,
                    generation=args.generation,
                )
            )

    if args.command == "run":
        command = args.exec_command
        if command and command[0] == "--":
            command = command[1:]
        return _print(run_reserved(ledger_path, env_id=args.env, reservation_id=args.reservation_id,
                                  generation=args.generation, command=command))

    if args.command == "switch":
        return _print(
            update_ledger(
                ledger_path,
                lambda ledger: switch(
                    ledger,
                    env_id=args.env,
                    branch=args.branch,
                    issue=_optional_int(args.issue),
                    pr=_optional_int(args.pr),
                    owner=args.owner,
                ),
            )
        )

    if args.command == "release":
        return _print(
            update_ledger(
                ledger_path,
                lambda ledger: release(
                    ledger,
                    env_id=args.env,
                    reservation_id=args.reservation_id,
                ),
            )
        )

    if args.command == "record-deploy":
        return _print(
            update_ledger(
                ledger_path,
                lambda ledger: record_deploy(
                    ledger,
                    env_id=args.env,
                    reservation_id=args.reservation_id,
                    generation=args.generation,
                    sha=args.sha,
                ),
            )
        )

    if args.command == "record-run":
        return _print(update_ledger(ledger_path, lambda ledger: record_run(ledger, env_id=args.env,
            reservation_id=args.reservation_id, generation=args.generation, run_id=args.run_id)))

    if args.command == "record-fixture":
        return _print(
            update_ledger(
                ledger_path,
                lambda ledger: record_fixture(
                    ledger,
                    env_id=args.env,
                    reservation_id=args.reservation_id,
                    generation=args.generation,
                    result=args.result,
                    version=args.version,
                    scope=args.scope,
                ),
            )
        )

    if args.command == "record-retry":
        return _print(
            update_ledger(
                ledger_path,
                lambda ledger: record_retry(
                    ledger,
                    env_id=args.env,
                    reservation_id=args.reservation_id,
                    generation=args.generation,
                    workflow=args.workflow,
                    count=args.count,
                ),
            )
        )

    return 1


if __name__ == "__main__":
    sys.exit(main())
