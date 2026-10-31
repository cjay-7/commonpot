# AGENTS.md for CommonPot

Read this file before writing any code. If a rule here conflicts with a request, say so and ask.

## 1. Project context

CommonPot is a shared expense account for households, roommates and small groups. Members log expenses, choose who shares each one, split equally or by exact amounts, and see who owes whom. New expenses appear live for everyone. It never moves real money. It only records payments between members.

PRD: `docs/PRD.md` (the CommonPot proposal posted in #project, 9 user stories). Mockups: `docs/mockups/` (see section 3).

### Tech stack (confirm versions in package.json before using new APIs)
- Next.js (App Router) with TypeScript in strict mode
- Tailwind CSS
- Supabase: Postgres, Auth (JWT) and Realtime
- Vitest for unit and integration tests, Playwright for end to end tests
- GitHub Actions for CI, Vercel for deploy previews and production

### Architecture and folders
```
src/app/            pages and route handlers (api/v1/* is the public REST API)
src/components/     React components, one folder per feature
src/lib/money/      pure money functions (splits, balances, settle-up). No I/O.
src/lib/db/         all Supabase queries. Components never query directly.
src/lib/auth/       session helpers and role checks
tests/unit/         Vitest, mirrors src/lib
tests/e2e/          Playwright flows
supabase/migrations/ SQL migrations, one per schema change
docs/               PRD, mockups, OpenAPI file, sprint notes
```
Key pattern: business rules live in `src/lib/money` as pure functions. Route handlers and components call them. This keeps the hard logic easy to test.

### Commands
- `npm test` runs Vitest once, `npm run typecheck` runs `tsc --noEmit`, `npm run test:coverage` reports coverage. Run all three before opening a PR.

### Function contracts for money code
- Money functions take integer cents and a list of member ids, and return `{ memberId: string, cents: number }[]` sorted by member id.
- Invalid input throws an `Error` whose message includes the offending numbers, for example `exact amounts sum to 900 cents but the total is 1000 cents`.

### Naming and style
- Files: kebab-case. React components: PascalCase. Functions and variables: camelCase. Database columns: snake_case. Constants: UPPER_SNAKE_CASE.
- Functions that return money are named with the unit, for example `splitCents`, `totalCents`.
- No `any`. Prefer small functions with explicit return types.
- Comments explain why, not what.

### Testing strategy
- Write the failing test first, commit it, then write the code (red, green, refactor). Commit history must show tests before implementation.
- Unit tests for everything in `src/lib/money`. Aim for 90% coverage there and 70% overall.
- Integration tests for each API route, including permission failures.
- One Playwright flow per user story that matters (sign up, create group, log expense, see balance).
- Test names read as sentences: `splits 1000 cents among 3 members as 334, 333, 333`.

## 2. Money rules (the most important section)
- Store and compute all amounts as integer cents. Never use floating point for money. Format to dollars only at the display edge.
- Uneven splits: distribute the remainder one cent at a time to members in a stable order (sorted by member id), so the parts always add up to the total exactly.
- Exact splits must sum to the expense total. Reject the request with a clear error if they do not.
- Balances: positive means the member is owed, negative means they owe. All balances in a group sum to zero.
- Settle-up suggests the smallest list of payments that clears all balances. Recording a payment never changes an expense.

## 3. PRD and design references
No finished mockups exist yet. Until `docs/mockups/` has screens, follow these descriptions.
- **Group page:** top shows the group name and the viewer's balance as "You owe $X" or "You are owed $X". Below, a live list of expenses (newest first) with payer, amount and who shares it. A floating "Add expense" button opens the form.
- **Add expense form:** description, amount, paid by (default me), category, split mode (Equally or Exact amounts) and a member checklist. For exact amounts, show the running total and block saving until it matches.
- **Balances view:** one row per member with a color (green owed, red owes). A "Settle up" button lists suggested payments.
- **Charts view:** spending by category (donut) and by month (bars).
- **Admin views:** members and roles, categories and monthly budgets. Budget alerts at 80% and 100%.
- Mobile first, usable at 375px wide. Large tap targets.

Roles: member (log and view), group admin (members, roles, categories, budgets, edit any expense), site admin (platform activity, suspend accounts). Check roles on the server in every route, never only in the UI.

Key user flows to implement exactly:
1. Organizer creates a group, copies an invite link, a roommate opens the link, signs in and joins.
2. A member logs an expense and everyone else's screen updates without a refresh.
3. A member records a settle-up payment and balances change.

## 4. Scrum and workflow
- Every change starts from a GitHub Issue. Reference it in the branch, commits and PR.
- Branch names: `feature/<issue-number>-short-description`, `fix/<number>-...`, `chore/<number>-...`, `docs/<number>-...`.
- Commit messages: `type(scope): summary (#issue)`. Types are feat, fix, test, refactor, docs, chore. Example: `test(money): failing test for 3-way split (#4)`.
- Put test commits before implementation commits for the same issue.
- Pull requests: title includes the issue, body has "Closes #N", a short summary, and how to test. The partner reviews every PR before merge. Never merge your own PR. Never push to main.
- Move the issue on the project board: Sprint Todo, In Progress, In Review, Done.
- Both partners keep this file current. If you learn something the AI got wrong, add a rule here in the same PR.

## 5. Do and don't
Do:
- Validate all input on the server with a schema (zod). Return clear error messages.
- Use Supabase row level security so a user can only read groups they belong to.
- Keep secrets in environment variables. Provide `.env.example` with fake values.
- Add labels and `aria` attributes to form fields and buttons. Keep color contrast readable and never use color as the only signal.
- Handle loading, empty and error states in every screen.

Don't:
- Don't use floats for money, `Date` string parsing without a time zone, or `localStorage` for shared data.
- Don't commit `.env` files, keys or service role tokens. Never expose the service role key to the browser.
- Don't add a dependency without saying why. Prefer what is already installed.
- Don't build features outside the current issue, and don't rewrite files you were not asked to change.
- Don't write implementation before its failing test exists.
