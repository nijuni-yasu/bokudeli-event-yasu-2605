#!/usr/bin/env python3
"""parse_failure_policy_functions のユニットテスト。"""

from __future__ import annotations

import importlib.util
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent
MODULE_PATH = SCRIPTS_DIR / "parse_failure_policy_functions.py"

spec = importlib.util.spec_from_file_location("parse_failure_policy_functions", MODULE_PATH)
assert spec and spec.loader
pfp = importlib.util.module_from_spec(spec)
sys.modules["parse_failure_policy_functions"] = pfp
spec.loader.exec_module(pfp)

SAMPLE_INDEX = """\
export const {
  onPartnerMenuSoldOutChanged,
  onChatReactionWritten,
} = Object.assign({}, ...(await Promise.all([])))
"""

FAILURE_LOG = """\
\x1b[33m\x1b[1m⚠  functions:\x1b[22m\x1b[39m The following functions will newly be retried in case of failure: \x1b[1monPartnerMenuSoldOutChanged(asia-northeast1)\x1b[22m
Error: Pass the --force option to deploy functions with a failure policy
"""

MULTI_LOG = """\
The following functions will newly be retried in case of failure: onPartnerMenuSoldOutChanged(asia-northeast1), onChatReactionWritten(asia-northeast1)
Error: Pass the --force option to deploy functions with a failure policy
"""

# sandbox CI 実ログ（関数名の直後にピリオド＋課金説明が続く）
REAL_CLI_LOG = """\
⚠  functions: The following functions will newly be retried in case of failure: onPartnerMenuSoldOutChanged(asia-northeast1). Retried executions are billed as any other execution, and functions are retried repeatedly until they either successfully execute or the maximum retry period has elapsed, which can be up to 7 days. For safety, you might want to ensure that your functions are idempotent; see https://firebase.google.com/docs/functions/retries to learn more.

Error: Pass the --force option to deploy functions with a failure policy
"""

ORPHAN_LOG = """\
The following functions are found in your project but do not exist in your local source
Command aborted.
"""


class ParseFailurePolicyFunctionsTest(unittest.TestCase):
    def test_extract_strips_ansi_and_region(self) -> None:
        self.assertEqual(
            pfp.extract_function_names(FAILURE_LOG),
            ["onPartnerMenuSoldOutChanged"],
        )

    def test_extract_multiple_names(self) -> None:
        self.assertEqual(
            pfp.extract_function_names(MULTI_LOG),
            ["onPartnerMenuSoldOutChanged", "onChatReactionWritten"],
        )

    def test_extract_real_cli_line_with_trailing_sentence(self) -> None:
        self.assertEqual(
            pfp.extract_function_names(REAL_CLI_LOG),
            ["onPartnerMenuSoldOutChanged"],
        )
        self.assertEqual(
            pfp.parse_named_only_args(
                REAL_CLI_LOG,
                {"onPartnerMenuSoldOutChanged", "onChatReactionWritten"},
            ),
            "--only functions:onPartnerMenuSoldOutChanged",
        )

    def test_parse_named_only_args(self) -> None:
        args = pfp.parse_named_only_args(
            FAILURE_LOG,
            {"onPartnerMenuSoldOutChanged", "onChatReactionWritten"},
        )
        self.assertEqual(args, "--only functions:onPartnerMenuSoldOutChanged")
        self.assertNotEqual(args, "--only functions")

    def test_parse_named_only_args_multiple(self) -> None:
        args = pfp.parse_named_only_args(
            MULTI_LOG,
            {"onPartnerMenuSoldOutChanged", "onChatReactionWritten"},
        )
        self.assertEqual(
            args,
            "--only functions:onPartnerMenuSoldOutChanged,functions:onChatReactionWritten",
        )

    def test_rejects_name_not_in_exports(self) -> None:
        with self.assertRaises(ValueError) as ctx:
            pfp.parse_named_only_args(FAILURE_LOG, {"onChatReactionWritten"})
        self.assertIn("index.ts", str(ctx.exception))

    def test_rejects_orphan_log(self) -> None:
        with self.assertRaises(ValueError):
            pfp.parse_named_only_args(ORPHAN_LOG, {"onPartnerMenuSoldOutChanged"})

    def test_main_prints_only_args(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            log_path = root / "log.txt"
            index_path = root / "index.ts"
            log_path.write_text(FAILURE_LOG, encoding="utf-8")
            index_path.write_text(SAMPLE_INDEX, encoding="utf-8")
            self.assertEqual(
                pfp.main(["--log", str(log_path), "--index", str(index_path)]),
                0,
            )


if __name__ == "__main__":
    unittest.main()
