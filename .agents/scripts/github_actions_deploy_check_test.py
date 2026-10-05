#!/usr/bin/env python3
"""別 SHA のデプロイを今回の成功にしない回帰テスト。"""
import json
import unittest
from unittest.mock import patch
from types import SimpleNamespace
import github_actions_deploy_check as check


class DeployCheckTest(unittest.TestCase):
    def test_discovery_skips_newer_run_with_other_sha(self):
        response = SimpleNamespace(returncode=0, stdout=json.dumps([
            {"databaseId": 2, "headSha": "other"},
            {"databaseId": 1, "headSha": "expected"},
        ]))
        with patch.object(check.subprocess, "run", return_value=response):
            found = check.discover_run_id(owner="owner", repo="repo", ref="feat/1", since="2026-10-05T00:00:00Z",
                                          workflow="deploy_user.yml", target_sha="expected", retries=1, sleep_sec=0)
        self.assertEqual(found, 1)

    def test_results_require_matching_sha_and_completed_runs(self):
        good = {"workflow": "deploy_user.yml", "run_id": 1, "headSha": "expected",
                "status": "completed", "conclusion": "success", "success": True}
        for override, expected in (({}, "success"), ({"headSha": "other"}, "partial"),
                                   ({"headSha": None}, "partial"), ({"status": "in_progress"}, "partial"),
                                   ({"success": False, "conclusion": "failure"}, "failure"),
                                   ({"success": None}, "partial")):
            with self.subTest(override=override):
                payload = check.build_results_payload(deploy_id="id", owner="owner", repo="repo", ref="feat/1",
                    since="2026-10-05T00:00:00Z", target_sha="expected", workflows=["deploy_user.yml"],
                    runs=[{**good, **override}])
                self.assertEqual(payload["overall_status"], expected)
                self.assertEqual(payload["target_sha"], "expected")

    def test_missing_workflow_is_not_success(self):
        payload = check.build_results_payload(deploy_id="id", owner="owner", repo="repo", ref="feat/1",
            since="2026-10-05T00:00:00Z", target_sha="expected", workflows=["deploy_user.yml"], runs=[])
        self.assertEqual(payload["overall_status"], "partial")


if __name__ == "__main__":
    unittest.main()
