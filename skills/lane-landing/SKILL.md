---
name: lane-landing
description: Land many tickets in parallel lanes of implementer subagents, reviewing each before its PR opens and merging it once CI passes. Use when the user asks for a parent issue's tickets, or a list of tickets, to be landed or merged, not just implemented.
---

Land a set of tickets as the **orchestrator**: plan them into **lanes**, have **implementer** subagents build them, and take each through the `landing` skill's review, CI, and merge yourself. A lane is an ordered chain of tickets, linked by blocked-by edges, that land one after another; lanes land in parallel. Each ticket lands on the default branch on its own, with no integration branch. Run `landing` and `escalating-to-user`; both hold except where this skill overrides them.

## Gather the tickets

Take a parent issue (its open sub-issues, recursing into children that have their own) or an explicit list, which is in scope as given. A `wayfinder:map` issue holds decisions rather than builds: decline it and say why.

From a parent, leave out children triaged as `needs-triage`, `needs-info`, `ready-for-human`, or `wontfix`, children with an open PR authored by another account, and children blocked by tickets outside the run.

GitHub is the run's only state, so a rerun resumes: closed tickets have landed, open PRs of yours that close in-scope tickets resume at **Review** or **Pass CI**, as `landing`'s **Start** sends them, once the plan lists them, and the rerun removes worktrees left by landed tickets.

## Plan the lanes

Group the tickets into lanes along their blocked-by edges. A ticket blocked from another lane waits for that blocker to land. Propose seams for each ticket.

Present the plan as an `escalating-to-user` ledger worded so "yes" approves it, and start nothing until the user confirms. Its decisions cover:

- the lanes, each with its tickets in order, by title and link
- the waits across lanes
- the seams for each ticket
- the excluded tickets and why
- the open PRs being resumed
- the repo's merge method
- the implementer model, by default the harness's implementation tier
- the lane cap, by default three lanes building at once

## Run the lanes

A ticket is ready once its blockers have landed. It may start sooner, stacked on its in-lane blocker, once the blocker has passed review. Keep one ticket building per lane, up to the lane cap; a ticket stops building once it has passed review.

For each ready ticket, spawn a fresh implementer in its own worktree on a new branch `<ticket>-<slug>`, cut from the default branch, or from its blocker's branch when stacking, where its PR targets that branch. Brief it with pointers to the ticket, its seams, and the lane plan. It runs `landing`'s **Start** and **Build**, ending there even on a branch with an open PR, and reports its branch. It fixes the findings and CI failures you send it and reports each fix, holding every push until you tell it that diff passed review; then it runs **Open the PR**. It never merges. It brings you the decisions it would escalate, and you make the call.

Run `landing`'s **Review** on each reported branch and fix yourself, and **Pass CI** and **Merge** on each PR, sending blocking findings and CI failures to its implementer. Release a stacked ticket to **Open the PR** once its blocker's PR is open. Hold new tickets while a check is red on the default branch, until it is green.

Restack a child before merging the PR it stacks on, waiting until the child's implementer is idle and working in the child's worktree:

1. Record the tip of the PR's branch.
2. Retarget the child: `gh pr edit <child> --base <default>`.
3. Merge the PR.
4. Rebase the child: `git fetch`, then `git rebase --onto origin/<default> <tip>`. A rebase with hand-resolved conflicts goes through **Review**. Then push with `--force-with-lease`.

When a branch with a child stacked on it gains fix commits, rebase the child onto it from the old tip the same way.

When a ticket lands, remove its worktree and local branch and end its implementer. A held ticket keeps its branch, worktree, and any open PR; end its implementer, and a later run briefs a fresh one.

## Finish

When every in-scope ticket has landed, comment a summary on the parent listing any children left open, and close the parent once none are. Present the ledger: landed PRs, held tickets with their escalations, open PRs, and worktree paths, and every decision including dismissed findings.
