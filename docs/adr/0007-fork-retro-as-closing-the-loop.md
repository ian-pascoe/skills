# Fork `retro` as `closing-the-loop` so landing can run it

The landing skills end each run with a retrospective: they keep a friction log as they go, then run `closing-the-loop` on it, which files the fixes worth making and reports them in the ledger. `closing-the-loop` is a deliberate fork of mattpocock's `retro`, the exception [ADR 0001](0001-build-on-mattpocock-skills-by-name.md) allows when upstream doesn't fit. `retro` is user-invoked, so no skill can start it, as with `implement` in [ADR 0003](0003-land-each-ticket-on-tdd-code-review-and-pr.md). It also only proposes, leaving the user to decide what is worth fixing. The fork decides that itself, against a fixed bar (traced, environmental, recurring, cheaper than the friction), and routes each fix it keeps: into the current work only when its spec already covers the fix, otherwise to a follow-up ticket in a repo the user owns, an issue on the outside repo that owns the cause, or a drafted proposal for the user's own setup, such as their global `AGENTS.md` or dotfiles.

## Considered Options

- **Recommend `/retro` in the ledger**: no fork, but the user has to remember to run it after every hard run, and the retro runs late, when context is fullest.
- **Run `closing-the-loop` without a log**: upstream warns that by the end of a session the agent forgets the struggles from mid-run and invents generic advice. Logging each moment as it happens ties every candidate to a commit, check, or finding.
- **Only propose, as `retro` does**: safe, but the decision of what's worth fixing goes back to the user on every run. Filing tickets with the `needs-triage` role keeps that decision reviewable without blocking on it.
- **Fix kept candidates in the current change**: widens a reviewed change after the fact. Only fixes the caller's current scope already covers go in, and landing passes none.
- **Write a held change's fix onto its PR for the run that resumes it**: tried and dropped, since each way of reading it back left a resume path that missed it.

## Consequences

- Tickets filed in this repo land as `needs-triage`, so `lane-landing` won't pick them up until a person triages them.
- Outside issues post publicly in the user's name, and the tracker doc that `setup-matt-pocock-skills` writes holds filing to the user's own repos. So an outside issue has a stricter bar (the cause is upstream's, reproducible without this repo, no existing issue, the repo accepts issues), is escalated as a draft that the user's yes files, overriding the doc for that issue, and stays a draft for a repo the tracker doc rules out, such as `mattpocock/skills`.
- A fix goes into the current work only when the caller passes it as the current scope and its spec already covers the fix. Landing runs the retro once the change has landed or is held, and passes no current scope, so every fix it keeps for the repo is a follow-up ticket, a held change's included.
- A doubtful candidate is dropped, on the bet that friction which recurs reaches a later run's log.
- The fork won't receive upstream fixes to `retro`'s categories. Compare the two when upstream changes `retro`.
- `lane-landing`'s implementers send their log entries with each report, so one `closing-the-loop` run on the orchestrator's log covers every lane.
