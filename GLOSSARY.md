# Skills

Agent skills that let the agent or a subagent make a user's design decisions and hand back only the few that need the user. The grilling terms (design tree, round, frontier) are as `grilling` defines them.

## Skills

**Core skill**:
A skill holding one behaviour, which agents and other skills can start by name.
_Avoid_: base skill

**Wrapper**:
A skill only the user can start, which just runs one or more core skills under a short command.
_Avoid_: alias, shortcut, command

**Prerequisite**:
A skill from another repo that this repo's skills run by name without bundling it.
_Avoid_: vendored skill, dependency

## Escalation

**Escalation**:
A decision handed to the user because it passes both escalation tests.
_Avoid_: question, ask

**Escalation tests**:
The two tests a decision must pass to be escalated: user-held or split, and load-bearing.

**Decision**:
A call the agent makes itself, recorded with its rationale and the strongest alternative it rejected.
_Avoid_: assumption

**Provisional answer**:
The recommended answer to an escalation, assumed until the user replies.
_Avoid_: default, placeholder

**Durable work**:
Work that outlives the session (docs, commits, published changes), held while it rests on a provisional answer.

**Ledger**:
The single report a user reviews in place of answering every question: escalations, the calls worth a glance, and every decision.
_Avoid_: summary, report

## Subagent grilling

**Interviewee**:
The subagent that answers a grilling in the user's place.
_Avoid_: agent, grillee, answerer

## Landing

**Change**:
The work one PR lands: a ticket, or a plan settled in the conversation.
_Avoid_: task, feature, work item, slice, patch

**Ticket**:
A unit of work tracked on the repo's issue tracker.
_Avoid_: issue (except for the tracker's own object), task

**Land**:
Take an approved change through building, a PR, review, and CI until it is landed.
_Avoid_: ship, release, deliver

**Landed**:
A change whose PR is merged into the default branch and whose tickets are closed.
_Avoid_: merged, shipped, done

**Lane**:
An ordered chain of tickets, linked by blocked-by edges, that land one after another; lanes land in parallel.
_Avoid_: track, stream, workstream, queue, stack

**Implementer**:
The subagent that builds one ticket, opens its PR, and fixes its findings, but never merges.
_Avoid_: worker, agent, builder, coder

**Orchestrator**:
The agent that plans the lanes, dispatches implementers, and reviews, restacks, and merges every PR.
_Avoid_: coordinator, manager, lead
