---
name: landing
description: Land a change by building it, passing code-review, opening its PR, and merging it once CI passes. Use when the user asks for a change to be landed or merged, not just implemented.
---

Land the **change** the user approved: a ticket they name, or the plan just settled in the conversation. It is landed when its PR is merged into the default branch and its tickets are closed. Run the `tdd`, `code-review`, and `pr` skills where named, and decide along the way under `escalating-to-user`; each holds except where this skill overrides it. Each round of fixes, for review or CI, is one cycle; after three cycles, hold the change and escalate.

## Start

If the user names a ticket, fetch it from the issue tracker and state its title. Otherwise the spec is the plan settled in the conversation, or the PR body's `## Plan` on a resumed PR: land it without filing a ticket.

Work in the current checkout. If HEAD is detached or on the default branch, branch from the up-to-date default branch as `<ticket>-<slug>`, or `<slug>` without a ticket; otherwise keep the current branch. If the branch already has an open PR, go to **Pass CI** if the latest review report on the PR covers its current diff (it names the current head, or `git range-diff` shows only `=` against the head it names), otherwise to **Review**.

## Build

Build with `tdd`. Seams named in the plan or ticket count as agreed; otherwise choose them yourself and list them in the PR body.

Typecheck and run single test files as you go, and the full suite once at the end. Commit only the paths the change touches, and report any other dirty files.

## Review

Review every diff before the push that carries it, so CI runs only on reviewed code; every later fix comes back through this section. The PR's **target** is the default branch, or the branch a stacked change stacks on. Fetch, then run `code-review` with `origin/<target>` as the fixed point. Blocking findings are every Spec finding and every hard violation of a documented standard; baseline smells are advisory, so fix the ones you agree with and list the rest in the PR. Clear each blocker by fixing it, or by dismissing it with a reason recorded as a decision, escalating a dismissal only the user can judge. Review again after fixes, until no blockers remain.

Post each passing report as a plain PR comment (`gh pr comment`) naming the head commit it reviewed, with its dismissals and their reasons, so a later run can tell which diff was reviewed; the first waits for **Open the PR**.

## Open the PR

Push. If the branch has no PR yet, open one against its target, writing its body with `pr`. Add `Closes #<n>` for each ticket; without one, add the settled plan under `## Plan`. Then post the review report.

## Pass CI

The PR is ready to merge once its current diff has passed review and its current head has passed CI.

**CI.** Wait with `gh pr checks --watch`. On a failure, read the logs: rerun once if it looks flaky, otherwise fix it and take the fix through **Review** and **Open the PR**. If the same check is red on the default branch too, it isn't this change's to fix: escalate. With no CI configured, treat it as green and say so.

**Review threads.** Treat every unresolved review thread as a finding: act on the user's, fix a bot's or dismiss it with a reply, and fix another person's when you agree, taking each fix through **Review** and **Open the PR**. Resolve a thread (GraphQL `resolveReviewThread`) once it is fixed or a bot's is answered. Leave a person's thread you disagree with open, and escalate.

**Freshness.** If the default branch has moved since CI ran, rebase onto it, push with `--force-with-lease`, and wait for CI again; a rebase is not a fix cycle. A rebase that leaves the diff unchanged (`git range-diff` shows only `=`) keeps the review; one with hand-resolved conflicts goes through **Review** first.

## Merge

Hold a PR whose merge rests on a provisional answer until the user confirms that answer. Merge the rest with `gh pr merge --delete-branch` and the method the repo allows, preferring squash, so the repo's own rules gate it: never `--admin` or `--auto`. If anything other than pending checks blocks the merge, hold the PR and escalate. Merge only this run's PRs: those it opened or resumed.

## Present the ledger

Present the ledger after acting rather than before: the change landed, or held with its escalations and any open PR, every decision including dismissed findings, and any dirty files left out.
