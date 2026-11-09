#!/usr/bin/env bash
# Repeatable 6DQ L1 pre-commit gate probes (isolated worktree; cleaned up on exit).
set -euo pipefail

ROOT=$(git rev-parse --show-toplevel)
export PATH="$ROOT/node_modules/.bin:${HOME}/.bun/bin:${HOME}/.local/bin:${PATH:-}"

for tool in git bun timeout; do
	command -v "$tool" >/dev/null 2>&1 || {
		echo "l1-gate-self-test: $tool is required" >&2
		exit 1
	}
done

ensure_gitleaks() {
	if command -v gitleaks >/dev/null 2>&1; then
		return
	fi
	local tools_dir="$ROOT/.cache/l1-gate-tools"
	mkdir -p "$tools_dir"
	local bin="$tools_dir/gitleaks"
	if [ ! -x "$bin" ]; then
		local arch
		arch=$(uname -m)
		case "$arch" in
		x86_64) arch=linux_x64 ;;
		aarch64 | arm64) arch=linux_arm64 ;;
		*)
			echo "l1-gate-self-test: unsupported arch for gitleaks bootstrap: $arch" >&2
			exit 1
			;;
		esac
		curl -fsSL "https://github.com/gitleaks/gitleaks/releases/download/v8.24.2/gitleaks_8.24.2_${arch}.tar.gz" |
			tar -xz -C "$tools_dir" gitleaks
		chmod +x "$bin"
	fi
	export PATH="$tools_dir:$PATH"
}
ensure_gitleaks

WORKTREE=
cleanup() {
	status=$?
	if [ -n "$WORKTREE" ] && [ -d "$WORKTREE" ]; then
		git -C "$ROOT" worktree remove -f "$WORKTREE" 2>/dev/null || rm -rf "$WORKTREE"
		WORKTREE=
	fi
	exit "$status"
}
trap cleanup EXIT

WORKTREE=$(mktemp -d "${TMPDIR:-/tmp}/matrix-l1-gate-XXXXXX")
git -C "$ROOT" worktree add --detach "$WORKTREE" HEAD >/dev/null
sync_gate_files() {
	mkdir -p "$WORKTREE/scripts" "$WORKTREE/.husky"
	for sync in scripts/l1-index-gate.sh scripts/l1-gate-self-test.sh .husky/pre-commit; do
		cp "$ROOT/$sync" "$WORKTREE/$sync"
	done
	chmod +x "$WORKTREE/scripts/l1-index-gate.sh" "$WORKTREE/scripts/l1-gate-self-test.sh"
}
sync_gate_files
if [ ! -d "$ROOT/node_modules" ]; then
	echo "l1-gate-self-test: node_modules is required" >&2
	exit 1
fi
ln -s "$ROOT/node_modules" "$WORKTREE/node_modules"

PASS=0
FAIL=0
SCENARIOS=()

log() {
	printf '%s\n' "$*" >&2
}

wt() {
	(cd "$WORKTREE" && "$@")
}

reset_clean() {
	wt git reset --hard HEAD >/dev/null
	wt git clean -fdq >/dev/null
}

run_hook() {
	sync_gate_files
	# shellcheck disable=SC2091
	(
		cd "$WORKTREE"
		env -u GIT_DIR -u GIT_WORK_TREE \
			MATRIX_L1_GATE_TIMEOUT_PROBE="${MATRIX_L1_GATE_TIMEOUT_PROBE:-}" \
			L1_PRECOMMIT_TIMEOUT_SEC="${L1_PRECOMMIT_TIMEOUT_SEC:-}" \
			bash .husky/pre-commit
	)
}

expect_reject() {
	local name=$1
	shift
	reset_clean
	if [ "$#" -gt 0 ]; then
		"$@"
	fi
	log "  probe: $name (expect reject)"
	set +e
	run_hook >/dev/null 2>&1
	code=$?
	set -e
	if [ "$code" -eq 0 ]; then
		log "  FAIL: $name — hook exited 0"
		FAIL=$((FAIL + 1))
		SCENARIOS+=("$name: FAIL (accepted bad snapshot)")
	else
		log "  ok: rejected (exit $code)"
		PASS=$((PASS + 1))
		SCENARIOS+=("$name: reject exit $code")
	fi
}

expect_accept() {
	local name=$1
	shift
	reset_clean
	if [ "$#" -gt 0 ]; then
		"$@"
	fi
	log "  probe: $name (expect accept)"
	set +e
	run_hook >/dev/null 2>&1
	code=$?
	set -e
	if [ "$code" -ne 0 ]; then
		log "  FAIL: $name — hook exited $code"
		FAIL=$((FAIL + 1))
		SCENARIOS+=("$name: FAIL (rejected healthy snapshot)")
	fi
	log "  ok: accepted"
	PASS=$((PASS + 1))
	SCENARIOS+=("$name: accept")
}

probe_ut_fail() {
	wt bash -c 'echo "expect(true).toBe(false);" >> src/test/lib/date.test.ts'
	wt git add src/test/lib/date.test.ts
}

probe_coverage_insufficient() {
	wt perl -i -pe 's/branches: 95/branches: 100/' vitest.config.ts
	wt git add vitest.config.ts
}

probe_coverage_functions_only() {
	wt perl -i -pe 's/functions: 95/functions: 100/' vitest.config.ts
	wt bash -c 'printf "%s\n" "export function l1UncoveredGateProbe(): string { return \"probe\"; }" >> src/lib/utils.ts'
	wt git add vitest.config.ts src/lib/utils.ts
}

probe_lint_error() {
	wt bash -c 'printf "%s\n" "export const l1LintBreak = (;" >> src/lib/utils.ts'
	wt git add src/lib/utils.ts
}

probe_biome_warning_only() {
	wt bash -c 'cat >> src/lib/utils.ts << EOF

export function l1BiomeWarningOnlyProbe(): string {
	// @ts-ignore
	return 1 as unknown as string;
}
EOF'
	wt git add src/lib/utils.ts
}

probe_type_error() {
	wt bash -c 'printf "%s\n" "export const l1TypeBreak: number = \"x\";" >> src/lib/utils.ts'
	wt git add src/lib/utils.ts
}

probe_test_only() {
	wt bash -c 'printf "%s\n" "it.only(\"l1 gate probe only\", () => { expect(true).toBe(true); });" >> src/test/lib/date.test.ts'
	wt git add src/test/lib/date.test.ts
}

probe_test_skip() {
	wt bash -c 'printf "%s\n" "it.skip(\"l1 gate probe skip\", () => { expect(true).toBe(true); });" >> src/test/lib/date.test.ts'
	wt git add src/test/lib/date.test.ts
}

probe_index_not_worktree() {
	wt bash -c 'echo "expect(true).toBe(false);" >> src/test/lib/date.test.ts'
	wt git add src/test/lib/date.test.ts
	wt git restore --source=HEAD --worktree src/test/lib/date.test.ts
}

probe_timeout() {
	:
}

probe_missing_bun() {
	:
}

probe_missing_gitleaks() {
	:
}

probe_missing_coverage_report() {
	wt sed -i 's/vitest run --coverage/vitest run/' package.json
	wt git add package.json
}

log "=== L1 pre-commit gate self-test (worktree) ==="

expect_accept healthy
expect_reject ut-fail probe_ut_fail
expect_reject coverage-all probe_coverage_insufficient
expect_reject coverage-functions-only probe_coverage_functions_only
expect_reject lint-error probe_lint_error
expect_reject biome-warning-only probe_biome_warning_only
expect_reject type-error probe_type_error
expect_reject vitest-only probe_test_only
expect_reject vitest-skip probe_test_skip
expect_reject index-bad-worktree-good probe_index_not_worktree
expect_reject missing-coverage-report probe_missing_coverage_report

reset_clean
log "  probe: timeout (expect reject)"
export MATRIX_L1_GATE_TIMEOUT_PROBE=1
export L1_PRECOMMIT_TIMEOUT_SEC=2
set +e
run_hook >/dev/null 2>&1
code=$?
unset MATRIX_L1_GATE_TIMEOUT_PROBE
unset L1_PRECOMMIT_TIMEOUT_SEC
set -e
if [ "$code" -eq 0 ]; then
	log "  FAIL: timeout — hook exited 0"
	FAIL=$((FAIL + 1))
	SCENARIOS+=("timeout: FAIL")
else
	log "  ok: rejected (exit $code)"
	PASS=$((PASS + 1))
	SCENARIOS+=("timeout: reject exit $code")
fi

reset_clean
log "  probe: missing-bun (expect reject)"
set +e
PATH="/usr/bin:/bin" run_hook >/dev/null 2>&1
code=$?
set -e
if [ "$code" -eq 0 ]; then
	log "  FAIL: missing-bun"
	FAIL=$((FAIL + 1))
	SCENARIOS+=("missing-bun: FAIL")
else
	PASS=$((PASS + 1))
	SCENARIOS+=("missing-bun: reject exit $code")
fi

reset_clean
log "  probe: missing-gitleaks (expect reject)"
set +e
PATH="$ROOT/node_modules/.bin:${HOME}/.bun/bin:/usr/bin:/bin" run_hook >/dev/null 2>&1
code=$?
set -e
if [ "$code" -eq 0 ]; then
	log "  FAIL: missing-gitleaks"
	FAIL=$((FAIL + 1))
	SCENARIOS+=("missing-gitleaks: FAIL")
else
	PASS=$((PASS + 1))
	SCENARIOS+=("missing-gitleaks: reject exit $code")
fi

elapsed_start=$(date +%s%N 2>/dev/null || date +%s)
expect_accept healthy-timing
elapsed_end=$(date +%s%N 2>/dev/null || date +%s)
if date --version >/dev/null 2>&1; then
	elapsed_ms=$(( (elapsed_end - elapsed_start) / 1000000 ))
	log "  healthy hook elapsed ~${elapsed_ms}ms (target <30s)"
fi

log ""
log "=== summary: $PASS passed, $FAIL failed ==="
for line in "${SCENARIOS[@]}"; do
	log "  - $line"
done

if [ "$FAIL" -gt 0 ]; then
	exit 1
fi
