# HW3 before/after test: issue #5, integer-cent split functions

## Method
- **Feature:** issue #5 "Write integer-cent split functions (tests first)".
- **Same conditions for both runs:** a fresh, empty folder, a separate agent with no memory of the other run, TypeScript with Vitest, no access to anything outside its folder. Each run was done once.
- **Without rules:** the agent got only this description and no AGENTS.md, issue text or PRD: "I'm building CommonPot, a Next.js TypeScript expense-splitting app for roommates. Implement the feature that splits an expense amount among members, with tests."
- **With rules:** the agent got AGENTS.md, README.md and the issue text (docs/issue-5.md), and was told to follow AGENTS.md exactly.
- **Tool:** both runs used Claude subagents, not Antigravity.
- **Checked by me:** I re-ran both test suites and type checks and read the git history. Results below are from those runs.

## Results

| | Without rules | With rules |
|---|---|---|
| Tests | 9, all pass | 16, all pass |
| Type check (`tsc`) | clean | clean (strict mode) |
| Git history | none (no repo) | 3 commits, failing test commit before implementation |
| Commit format | none | `test(money): ... (#5)`, `feat(money): ... (#5)` |
| Branch | none | `feature/5-integer-cent-splits` |
| Source file | `lib/splitExpense.ts` | `src/lib/money/split.ts` |
| Test file | `lib/splitExpense.test.ts` (next to source) | `tests/unit/money/split.test.ts` (mirrors src, as AGENTS.md says) |
| Function names | `splitExpense` | `splitCents`, `exactSplitCents` |
| Money in integer cents | yes | yes |
| Exact-amount split that must sum to total | not built | built and rejects sums that are too high or too low |
| Who gets the extra cent | the first members in the order passed in | members in sorted id order, so the result does not depend on input order |
| Return shape | object keyed by name | array of `{ memberId, cents }` sorted by id |
| Error messages | generic ("amountCents must be a non-negative integer") | include the numbers ("exact amounts sum to 900 cents but the total is 1000 cents") |
| Sum check | 7 members, 7 totals | every total from 0 to 500 with 1 to 9 members (4,500 cases) |

## Differences, by the assignment's categories
- **Code consistency with project patterns.** With rules, files landed in the folders AGENTS.md defines and the names follow its `splitCents` style with a unit in the name. Without rules, the agent invented its own layout (`lib/`, tests beside code).
- **Understanding the intent.** The brief prompt never said "exact amounts", so the no-rules run built only the equal split and the exact-amount rule in the issue was missed. The with-rules run read the issue and the PRD stories and built both. Part of this gain comes from the issue text, not only AGENTS.md. See the caveat below.
- **Naming and architecture.** The stable sort order is a rule in AGENTS.md. Without it, the same members get different shares depending on the order they are passed in, which can make balances differ between screens.
- **Test quality.** 16 tests vs 9, with one property-style test over 4,500 combinations and error-message checks. The no-rules tests were reasonable but covered fewer cases.
- **Workflow.** The with-rules run committed the failing test before the implementation, using the required commit format. The no-rules run made no commits.

## What did not differ
Both runs used integer cents and both rejected negative, fractional and empty input. The "never use floats" rule I thought would show the biggest difference made none, because the model already does this. The value of the rules was in conventions and completeness.

## Limits of this test
- One run per condition, so differences could partly be luck.
- The with-rules run also had the issue's acceptance checklist. A fairer test would give both runs the same one-line description and change only the rules file.
- The feature is pure logic, so this test says nothing about how well rules help with mockups or UI.

## What I changed in AGENTS.md because of the test
1. Added a **Commands** section. The agent had to guess the test and type-check scripts.
2. Added **Function contracts for money code** (argument and return shape, error message style), since the first runs differed on both and the rules did not say.
