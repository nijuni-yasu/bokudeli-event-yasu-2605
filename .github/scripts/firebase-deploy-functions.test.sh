#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SCRIPT="${ROOT}/.github/scripts/firebase-deploy-functions.sh"
failures=0

assert_no_full_force() {
  local calls_log="$1"
  while IFS= read -r line; do
    if [[ "${line}" == *"<--force>"* ]] && [[ "${line}" == *"<--only><functions>"* ]]; then
      echo "FAIL: 全体デプロイに --force が付いている: ${line}" >&2
      return 1
    fi
  done <"${calls_log}"
}

run_case() {
  local name="$1"
  local mode="$2"
  local expect_code="$3"
  shift 3

  local tmp
  tmp="$(mktemp -d)"
  cat >"${tmp}/index.ts" <<'EOF'
export const {
  onPartnerMenuSoldOutChanged,
} = Object.assign({}, ...(await Promise.all([])))
EOF

  cat >"${tmp}/firebase" <<EOF
#!/usr/bin/env bash
{
  for _arg in "\$@"; do
    printf '<%s>' "\${_arg}"
  done
  printf '\\n'
} >> "${tmp}/calls.log"
mode="${mode}"
count=0
if [[ -f "${tmp}/calls.log" ]]; then
  count="\$(wc -l < "${tmp}/calls.log" | tr -d ' ')"
fi
case "\${mode}" in
  success)
    exit 0
    ;;
  failure_policy)
    if [[ "\${count}" -eq 1 ]]; then
      echo "⚠  functions: The following functions will newly be retried in case of failure: onPartnerMenuSoldOutChanged(asia-northeast1). Retried executions are billed as any other execution, and functions are retried repeatedly until they either successfully execute or the maximum retry period has elapsed."
      echo "Error: Pass the --force option to deploy functions with a failure policy"
      exit 1
    fi
    exit 0
    ;;
  orphan)
    echo "The following functions are found in your project but do not exist in your local source"
    echo "Command aborted."
    exit 1
    ;;
  *)
    echo "unknown mock mode: \${mode}" >&2
    exit 2
    ;;
esac
EOF
  chmod +x "${tmp}/firebase"

  set +e
  FIREBASE_BIN="${tmp}/firebase" \
    INDEX_TS="${tmp}/index.ts" \
    "${SCRIPT}" --project test-project >"${tmp}/stdout" 2>"${tmp}/stderr"
  actual="$?"
  set -e

  if [[ "${actual}" -ne "${expect_code}" ]]; then
    echo "FAIL ${name}: exit ${actual} (expected ${expect_code})" >&2
    cat "${tmp}/stderr" >&2
    failures=$((failures + 1))
    rm -rf "${tmp}"
    return
  fi

  CALLS_LOG="${tmp}/calls.log"
  if [[ -f "${CALLS_LOG}" ]]; then
    if ! assert_no_full_force "${CALLS_LOG}"; then
      failures=$((failures + 1))
      rm -rf "${tmp}"
      return
    fi
  fi

  for check in "$@"; do
    if ! eval "${check}"; then
      echo "FAIL ${name}: check failed: ${check}" >&2
      echo "--- calls ---" >&2
      cat "${CALLS_LOG}" >&2 || true
      failures=$((failures + 1))
      rm -rf "${tmp}"
      return
    fi
  done

  echo "OK ${name}"
  rm -rf "${tmp}"
}

calls_count() {
  local n="$1"
  [[ "$(wc -l <"${CALLS_LOG}" | tr -d ' ')" -eq "${n}" ]]
}

first_call_no_force() {
  local first
  first="$(head -n 1 "${CALLS_LOG}")"
  [[ "${first}" != *"<--force>"* ]] && [[ "${first}" == *"<--only><functions>"* ]]
}

second_call_named_force() {
  local second
  second="$(sed -n '2p' "${CALLS_LOG}")"
  [[ "${second}" == *"<--force>"* ]] &&
    [[ "${second}" == *"<--only><functions:onPartnerMenuSoldOutChanged>"* ]] &&
    [[ "${second}" != *"<--only functions:"* ]]
}

third_call_full_no_force() {
  local third
  third="$(sed -n '3p' "${CALLS_LOG}")"
  [[ "${third}" != *"<--force>"* ]] && [[ "${third}" == *"<--only><functions>"* ]]
}

run_case success success 0 \
  'calls_count 1' \
  'first_call_no_force'

run_case failure_policy failure_policy 0 \
  'calls_count 3' \
  'first_call_no_force' \
  'second_call_named_force' \
  'third_call_full_no_force'

run_case orphan orphan 1 \
  'calls_count 1' \
  'first_call_no_force'

if [[ "${failures}" -ne 0 ]]; then
  echo "${failures} test(s) failed" >&2
  exit 1
fi
echo "All firebase-deploy-functions tests passed"
