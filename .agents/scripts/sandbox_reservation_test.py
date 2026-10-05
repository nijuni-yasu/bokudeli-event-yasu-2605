#!/usr/bin/env python3
"""sandbox_reservation のユニットテスト。実台帳は触らない。"""

from __future__ import annotations

import json
import sys
import tempfile
import unittest
from unittest.mock import patch
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPTS))

import sandbox_reservation as res  # noqa: E402


def sample_ledger() -> dict:
    return {
        "version": 1,
        "updated_at": "2026-10-04T00:00:00Z",
        "environments": {
            "sandbox2603": {
                "id": "sandbox2603",
                "remote": "sandbox2603",
                "github_repo": "nijuni-yasu/bokudeli-event-yasu-2603-2",
                "gcloud_project": "bokudeli-event-yasu-2603",
                "user_url": "https://bokudeli-event-yasu-2603.web.app",
                "selectable": True,
                "status": "occupied",
                "reservation": {
                    "id": "pstack-res-20261004-002",
                    "generation": 1,
                    "branch": "doc/2398-pstack",
                    "issue": 2398,
                    "pr": 2399,
                    "owner": "pstack",
                    "acquired_at": "2026-10-04T00:00:00Z",
                    "updated_at": "2026-10-04T00:00:00Z",
                    "release_condition": "PR merge/close or explicit release",
                    "target_sha": None,
                    "fixture": None,
                    "retry": {"count": 0, "workflows": []},
                },
            },
            "sandbox2606": {
                "id": "sandbox2606",
                "remote": "sandbox2606",
                "selectable": False,
                "status": "switched",
                "reservation": None,
            },
            "sandbox2607": {
                "id": "sandbox2607",
                "remote": "sandbox2607",
                "selectable": False,
                "status": "empty",
                "reservation": None,
            },
        },
        "history": [
            {
                "reservation_id": "pstack-res-20261004-001",
                "generation": 1,
                "env_id": "sandbox2606",
                "branch": "doc/2398-pstack",
                "reason": "switched",
            }
        ],
    }


class SandboxReservationTest(unittest.TestCase):
    def setUp(self) -> None:
        idle = patch.object(res, "require_idle", return_value={"ok": True})
        idle.start()
        self.addCleanup(idle.stop)
        state = patch.object(res, "fetch_pr_state", return_value="OPEN")
        state.start()
        self.addCleanup(state.stop)

    def test_active_runs_prevent_switch_release_and_reconcile(self) -> None:
        with patch.object(res, "require_idle", return_value={"ok": False, "error": "deploy_active"}):
            ledger = sample_ledger()
            self.assertFalse(res.switch(ledger, env_id="sandbox2603", branch="feat/new")["ok"])
            self.assertFalse(res.release(ledger, env_id="sandbox2603", reservation_id="pstack-res-20261004-002")["ok"])
            res.reconcile(ledger, pr_state_fn=lambda _pr: "MERGED")
            self.assertEqual(ledger["environments"]["sandbox2603"]["reservation"]["branch"], "doc/2398-pstack")

    def test_stale_owner_cannot_execute_command_after_switch(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "ledger.json"
            ledger = sample_ledger()
            res.switch(ledger, env_id="sandbox2603", branch="feat/new")
            path.write_text(json.dumps(ledger))
            with patch.object(res.subprocess, "run") as runner:
                result = res.run_reserved(path, env_id="sandbox2603", reservation_id="pstack-res-20261004-002", generation=1, command=["must-not-execute"])
                self.assertFalse(result["ok"])
                runner.assert_not_called()

    def test_run_rejects_other_deploy_destinations(self) -> None:
        commands = [
            ["git", "push", "sandbox2606", "HEAD:doc/2398-pstack"],
            ["git", "push", "sandbox2603", "HEAD:other/branch"],
            ["gh", "workflow", "run", "deploy_user.yml", "--repo", "other/repo", "--ref", "doc/2398-pstack"],
            ["gh", "workflow", "run", "deploy_user.yml", "--repo", "nijuni-yasu/bokudeli-event-yasu-2603-2", "--ref", "other/branch"],
            ["env", "GCLOUD_PROJECT=bokudeli-event-yasu-2606", "node", "seed.mjs"],
        ]
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "ledger.json"
            res._save_ledger(path, sample_ledger())
            with patch.object(res.subprocess, "run") as run:
                for command in commands:
                    result = res.run_reserved(path, env_id="sandbox2603", reservation_id="pstack-res-20261004-002", generation=1, command=command)
                    self.assertEqual(result["error"], "destination_mismatch")
                run.assert_not_called()

    def test_dispatch_is_pending_until_matching_run_completes(self) -> None:
        ledger = sample_ledger()
        reservation = ledger["environments"]["sandbox2603"]["reservation"]
        reservation["target_sha"] = "abc123"
        reservation["pending_dispatches"] = [{"workflow": "deploy_user.yml", "since": "2026-10-04T00:00:00Z"}]
        run = {"status": "in_progress", "head_sha": "abc123", "head_branch": "doc/2398-pstack", "path": ".github/workflows/deploy_user.yml", "created_at": "2026-10-04T00:00:01Z"}
        from subprocess import CompletedProcess
        with patch.object(res.subprocess, "run") as api:
            api.return_value = CompletedProcess([], 0, json.dumps(run), "")
            args = dict(env_id="sandbox2603", reservation_id=reservation["id"], generation=1, run_id=123)
            self.assertFalse(res.record_run(ledger, **args)["ok"])
            self.assertEqual(len(reservation["pending_dispatches"]), 1)
            run["status"] = "completed"
            api.return_value = CompletedProcess([], 0, json.dumps(run), "")
            self.assertTrue(res.record_run(ledger, **args)["ok"])
            self.assertEqual(reservation["pending_dispatches"], [])
            self.assertTrue(res.record_run(ledger, **args)["already_recorded"])

    def test_pick_reuses_same_branch(self) -> None:
        ledger = sample_ledger()
        result = res.pick(ledger, branch="doc/2398-pstack", pr=2399)
        self.assertTrue(result["ok"])
        self.assertFalse(result["new_assignment"])
        self.assertFalse(result["seed"])
        self.assertEqual(result["env_id"], "sandbox2603")
        self.assertEqual(result["reservation"]["id"], "pstack-res-20261004-002")

    def test_pick_vacant_after_reconcile(self) -> None:
        ledger = sample_ledger()
        result = res.pick(
            ledger,
            branch="feat/2400",
            issue=2400,
            pr_state_fn=lambda pr: "MERGED" if pr == 2399 else None,
        )
        self.assertTrue(result["ok"])
        self.assertTrue(result["new_assignment"])
        self.assertTrue(result["seed"])
        self.assertEqual(result["env_id"], "sandbox2603")
        self.assertEqual(result["reservation"]["branch"], "feat/2400")
        self.assertEqual(ledger["environments"]["sandbox2603"]["status"], "occupied")
        self.assertEqual(ledger["history"][-1]["reason"], "reconcile_merged")

    def test_pick_no_vacancy(self) -> None:
        ledger = sample_ledger()
        result = res.pick(ledger, branch="feat/other", pr_state_fn=lambda _pr: "OPEN")
        self.assertFalse(result["ok"])
        self.assertEqual(result["error"], "no_vacancy")

    def test_check_and_stale_generation(self) -> None:
        ledger = sample_ledger()
        ok = res.check(
            ledger,
            env_id="sandbox2603",
            reservation_id="pstack-res-20261004-002",
            generation=1,
        )
        self.assertTrue(ok["ok"])
        stale = res.check(
            ledger,
            env_id="sandbox2603",
            reservation_id="pstack-res-20261004-002",
            generation=2,
        )
        self.assertFalse(stale["ok"])
        self.assertEqual(stale["error"], "stale_generation")

    def test_switch_bumps_generation(self) -> None:
        ledger = sample_ledger()
        result = res.switch(ledger, env_id="sandbox2603", branch="feat/2401", issue=2401)
        self.assertTrue(result["ok"])
        self.assertTrue(result["seed"])
        self.assertEqual(result["reservation"]["generation"], 2)
        self.assertEqual(result["previous_reservation_id"], "pstack-res-20261004-002")
        self.assertEqual(ledger["history"][-1]["reason"], "switched")

    def test_release_then_pick(self) -> None:
        ledger = sample_ledger()
        released = res.release(
            ledger,
            env_id="sandbox2603",
            reservation_id="pstack-res-20261004-002",
        )
        self.assertTrue(released["ok"])
        self.assertEqual(ledger["environments"]["sandbox2603"]["status"], "empty")
        picked = res.pick(ledger, branch="feat/2402")
        self.assertTrue(picked["ok"])
        self.assertTrue(picked["new_assignment"])

    def test_reserve_rejects_other_branch(self) -> None:
        ledger = sample_ledger()
        result = res.reserve(ledger, env_id="sandbox2603", branch="feat/other")
        self.assertFalse(result["ok"])
        self.assertEqual(result["error"], "occupied")

    def test_record_helpers(self) -> None:
        ledger = sample_ledger()
        deploy = res.record_deploy(
            ledger,
            env_id="sandbox2603",
            reservation_id="pstack-res-20261004-002",
            generation=1,
            sha="abc123",
        )
        self.assertTrue(deploy["ok"])
        self.assertEqual(deploy["reservation"]["target_sha"], "abc123")
        res.record_retry(
            ledger,
            env_id="sandbox2603",
            reservation_id="pstack-res-20261004-002",
            generation=1,
            workflow="deploy_user.yml",
            count=2,
        )
        redeploy = res.record_deploy(
            ledger,
            env_id="sandbox2603",
            reservation_id="pstack-res-20261004-002",
            generation=1,
            sha="def456",
        )
        self.assertTrue(redeploy["ok"])
        self.assertEqual(redeploy["reservation"]["retry"], {"count": 0, "workflows": []})
        fixture = res.record_fixture(
            ledger,
            env_id="sandbox2603",
            reservation_id="pstack-res-20261004-002",
            generation=1,
            result="ok",
        )
        self.assertTrue(fixture["ok"])
        self.assertEqual(fixture["reservation"]["fixture"]["version"], "pstack-001")
        retry = res.record_retry(
            ledger,
            env_id="sandbox2603",
            reservation_id="pstack-res-20261004-002",
            generation=1,
            workflow="deploy_user.yml",
            count=1,
        )
        self.assertTrue(retry["ok"])
        self.assertEqual(retry["reservation"]["retry"]["count"], 1)

    def test_cli_uses_temp_ledger(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "sandbox-reservations.json"
            path.write_text(json.dumps(sample_ledger()), encoding="utf-8")
            result = res.update_ledger(
                path,
                lambda ledger: res.release(
                    ledger,
                    env_id="sandbox2603",
                    reservation_id="pstack-res-20261004-002",
                ),
            )
            self.assertTrue(result["ok"])
            stored = json.loads(path.read_text(encoding="utf-8"))
            self.assertEqual(stored["environments"]["sandbox2603"]["status"], "empty")
            self.assertIsNone(stored["environments"]["sandbox2603"]["reservation"])




class IdleCheckTest(unittest.TestCase):
    def test_pending_dispatch_blocks_before_actions_registration(self) -> None:
        env = sample_ledger()["environments"]["sandbox2603"]
        env["reservation"]["pending_dispatches"] = [{"workflow": "deploy_user.yml", "since": "2026-10-04T00:00:00Z"}]
        with patch.object(res.subprocess, "run") as api:
            self.assertEqual(res.require_idle(env)["error"], "dispatch_unconfirmed")
            api.assert_not_called()

    def test_actions_api_failure_is_not_idle(self) -> None:
        from subprocess import CompletedProcess
        with patch.object(res.subprocess, "run", return_value=CompletedProcess([], 1, "", "network error")):
            self.assertEqual(res.require_idle(sample_ledger()["environments"]["sandbox2603"])["error"], "runs_unavailable")


if __name__ == "__main__":
    unittest.main()
