#!/usr/bin/env bash
# default codebase を --only functions（--force なし）でデプロイする。
# failure policy（retry: true の初回）だけ、index.ts にある関数名を絞って --force する。
# 全体デプロイへ --force は付けない（orphan の無確認削除を防ぐ）。
set -euo pipefail

usage() {
  echo "Usage: $0 --project PROJECT_ID" >&2
  exit 2
}

PROJECT_ID=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --project)
      [[ $# -ge 2 ]] || usage
      PROJECT_ID="$2"
      shift 2
      ;;
    -h | --help)
      usage
      ;;
    *)
      echo "ERROR: unknown argument: $1" >&2
      usage
      ;;
  esac
done

[[ -n "$PROJECT_ID" ]] || usage

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
FIREBASE_BIN="${FIREBASE_BIN:-firebase}"
INDEX_TS="${INDEX_TS:-${REPO_ROOT}/functions/default/src/index.ts}"
PARSE_PY="${PARSE_PY:-${REPO_ROOT}/.agents/scripts/parse_failure_policy_functions.py}"

LOG="$(mktemp)"
trap 'rm -f "$LOG"' EXIT

set +e
"${FIREBASE_BIN}" --project "${PROJECT_ID}" deploy --only functions 2>&1 | tee "${LOG}"
code="${PIPESTATUS[0]}"
set -e

if [[ "${code}" -eq 0 ]]; then
  exit 0
fi

if ! grep -Fq "Pass the --force option to deploy functions with a failure policy" "${LOG}"; then
  exit "${code}"
fi

set +e
ONLY_ARGS="$(
  PYTHONPATH="${REPO_ROOT}/.agents/scripts${PYTHONPATH:+:${PYTHONPATH}}" \
    python3 "${PARSE_PY}" --log "${LOG}" --index "${INDEX_TS}"
)"
parse_code="$?"
set -e

if [[ "${parse_code}" -ne 0 || -z "${ONLY_ARGS}" ]]; then
  echo "ERROR: failure policy だが、名前指定 --force の対象を解決できませんでした。" >&2
  exit "${code}"
fi

if [[ "${ONLY_ARGS}" == "--only functions" || "${ONLY_ARGS}" != --only\ functions:* ]]; then
  echo "ERROR: 全体デプロイへの --force は禁止です: ${ONLY_ARGS}" >&2
  exit 1
fi

echo "failure policy: 対象関数のみ --force でデプロイします: ${ONLY_ARGS}"
"${FIREBASE_BIN}" --project "${PROJECT_ID}" deploy --force "${ONLY_ARGS}"
"${FIREBASE_BIN}" --project "${PROJECT_ID}" deploy --only functions
