---
name: split-grilling
description: Grill the user on a plan's architecture and yourself on its implementation detail, escalating only the detail that needs the user. Use when the user wants to settle a plan's architecture together and leave the detail to you.
---

Split the `grilling` skill's design tree in two: the user answers the **architecture**, you answer the **detail**. Run `grilling` with the user on the architecture, then `internal-grilling` on the detail. Both skills hold except where this skill overrides them.

## Draw the line

Sort every decision on the tree with the `codebase-design` skill's vocabulary:

- **Architecture** is anything a caller or user sees across a seam: where the modules and their seams go, each module's interface, the data model, external contracts and user-visible behaviour, domain terms, and the technologies and dependencies the plan takes on.
- **Detail** is anything inside one module's implementation.

A decision that straddles the line is architecture.

## Grill the user on the architecture

Run `grilling` rounds with the user, asking only the architecture on the frontier and holding the detail back. When an architecture question waits on a detail, decide that detail yourself and state it in the round.

A question the user hands back ("you decide") becomes detail: take your recommended answer. A detail the user asks to weigh in on becomes architecture.

The phase is done when no architecture is left on the frontier.

## Grill yourself on the detail

Run `internal-grilling` over the rest of the tree, taking the user's architecture answers as settled. A detail that would change one of those answers is architecture again: escalate it.

## Present the ledger

Present `internal-grilling`'s ledger with the whole design tree as its decisions, marking each architecture decision as the user's answer.
