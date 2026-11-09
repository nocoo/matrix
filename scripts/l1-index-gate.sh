#!/usr/bin/env bash
# Index-snapshot L1 checks (typecheck, lint, unit coverage). Invoked from .husky/pre-commit
# after checkout-index; cwd must be the snapshot directory.
set -euo pipefail

if [ "${MATRIX_L1_GATE_TIMEOUT_PROBE:-}" = "1" ]; then
	sleep 120
fi

bun run typecheck
bun run lint
rm -rf coverage
bun run test:coverage

if [ ! -f coverage/lcov.info ] || [ ! -s coverage/lcov.info ]; then
	echo "l1-index-gate: coverage report missing (expected coverage/lcov.info)" >&2
	exit 1
fi
