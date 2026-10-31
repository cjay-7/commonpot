# HW3 Reflection: Context Engineering for CommonPot

**Name:** Jay Choudhary  **Partner:** Ge  **Repo:** https://github.com/cjay-7/commonpot

## How the rules file connects the PRD to the code

Our PRD is the CommonPot proposal with nine user stories, and an AI tool can't see it unless I put it in front of the tool. AGENTS.md is how I did that. It restates the parts of the proposal that decide how code should behave. That means the three roles (member, group admin, site admin), the three user flows, and a description of each screen, since we don't have a finished mockup yet. It also turns the hard parts of the PRD into rules. For example, a shared expense account only works if the parts of a split add up to the total, so the file says to use integer cents and to give leftover cents to members in sorted id order.

The before and after test showed what that is worth. I ran issue 5, the split functions, twice in clean folders. With only a one-line description, the agent wrote 9 tests, made no commits, and invented its own folder layout. With AGENTS.md and the issue, it wrote 16 tests, committed the failing tests before the code, used the branch and commit format from the file, and built the exact-amount split that checks the parts add up to the total. The no-rules run never built that, because the short prompt didn't mention it.

## What surprised me

I expected the integer cents rule to make the biggest difference, but both runs already used cents. The surprise was the smaller rules. The sorted id rule means the same three roommates get the same shares no matter what order the code lists them in. Without it, one run gave the extra cent to whoever happened to be first in the list, which could make two screens show different balances. The test first commits also surprised me. Nothing in my short prompt asked for them, and the rules file got them without any reminders.

## What the test can and can't say

The test was one run each, so some of the difference could be luck. The issue text also confounded it, because the with-rules run got the issue's checklist and the other run didn't. Part of what I credit to AGENTS.md may really come from the issue. A fairer test would give both runs the same description and change only the rules file. Both runs also used Claude agents, not Antigravity, and issue 5 is pure logic, so it says nothing about whether the rules help with mockups or screens.

## How Scrum on GitHub helps

The 15 issues, each with a checklist, gave the AI a clear definition of done. That mattered as much as the rules file. Milestones for Sprint 1 and Sprint 2 split the work so the AI isn't asked for everything at once. The board shows Ge and me what is in progress and in review, so we don't both build the same thing.

## What I would change for Sprint 2

- **Real-time rules.** Live updates are new for us, so I'd add rules about cleaning up subscriptions and testing with two browser sessions.
- **API docs.** The OpenAPI file must match the real responses, and any API change updates it in the same pull request.
- **A mockup.** I'd make screens for the group page and the add expense form, save them in `docs/mockups/`, and point the file at them.
- **A work split rule.** Each of us owns specific issues, the partner reviews every pull request, and we both need at least five reviews. This also protects against one person doing everything.

I already changed the file once because of the test. I added the test and typecheck commands and a standard shape for money functions, because the two runs differed on both and the file didn't say.

## Planning with Ge

We were paired by the professor. Ge proposed an expense tracker, and I suggested adding shared groups so it would meet the project's rules about roles, live updates and a public API. Ge wrote up the CommonPot proposal and posted it. I had first thought of reusing my fridge idea from Project 1, but the professor said ideas can't repeat between projects, so we started from Ge's. Agreeing on the idea early let us set up the repo, issues and rules file before writing any code.
