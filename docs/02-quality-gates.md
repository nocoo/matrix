# 02 · Quality Gates & Local Hooks

Detailed local Git hook mechanics and self-test probe expectations for Matrix. High-level contract and CI slot references live in [AGENTS.md](../AGENTS.md) and `.github/workflows/quality-slots.yml`.

## L1 Pre-Commit Gate (Index Snapshot)

`.husky/pre-commit` validates the staged Git index rather than the working tree so unstaged fixes cannot mask a broken commit:

1. Require `git`, `bun`, and `gitleaks` on `PATH`.
2. Run `gitleaks protect --staged --no-banner` (`G1`).
3. Materialize the staged index into a temp snapshot via `git checkout-index --all --prefix="$snapshot/"` and verify staged `package.json` and `bun.lock` match the installed worktree copies.
4. Execute `scripts/l1-index-gate.sh` inside the snapshot under a timeout (`L1_PRECOMMIT_TIMEOUT_SEC`, default `30`s):
   - `bun run typecheck` (`S1`)
   - `bun run lint` (`S2`: `biome check --error-on-warnings .`)
   - `bun run test:coverage` (`L1`: Vitest thresholds 95/95/95/95 for statements/branches/functions/lines on `src/components/ui/**/*.{ts,tsx}` excluding `index.ts`, plus `src/lib/**/*.{ts,tsx}`)
   - Assert `coverage/lcov.info` exists and is non-empty.

## L1 Gate Self-Test (`bun run gate:l1-self-test`)

`scripts/l1-gate-self-test.sh` creates a detached temporary worktree, runs `.husky/pre-commit` across each scenario, and cleans up on exit. Negative probes must exit non-zero; a healthy index must pass.

| Scenario                                                               | Expected |
| ---------------------------------------------------------------------- | -------- |
| Healthy index snapshot                                                 | accept   |
| Unit test failure                                                      | reject   |
| Coverage threshold miss (any metric, including functions-only)         | reject   |
| Biome error                                                            | reject   |
| Biome warning only (`@ts-ignore`; TypeScript still clean)              | reject   |
| Type error                                                             | reject   |
| `it.only` / `it.skip`                                                  | reject   |
| Staged bad / worktree good (index-only gate)                           | reject   |
| `L1_PRECOMMIT_TIMEOUT_SEC` exceeded (`MATRIX_L1_GATE_TIMEOUT_PROBE=1`) | reject   |
| Missing `bun` or `gitleaks`                                            | reject   |
| Tests pass but coverage artifact missing                               | reject   |

## Pre-Push Gate & Known Gaps

`.husky/pre-push` runs working-tree `bun run build && bun run test:coverage && bun run lint`, followed by `osv-scanner scan --lockfile=bun.lock --config=osv-scanner.toml` (`G2`).

- **Known masking caveat**: `.husky/pre-push` does not set `set -e`, so a `build`, `test:coverage`, or `lint` failure in the `&&` chain can be masked if the trailing `osv-scanner` command succeeds.
- **Governance targets**: check-only unified L1 on the staged index `<30s`; stdin pushed-ref `B1`/`L3`/`G2` `<3min`.
- **Policy**: never bypass commit/push hooks or lower the four-metric 95% coverage contract to silence a regression.
