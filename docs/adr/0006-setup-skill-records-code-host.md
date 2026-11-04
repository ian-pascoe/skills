# A setup skill records the repo's code host; commands stay in references

`setup-ian-pascoe-skills` checks the prerequisites, then writes `docs/agents/code-host.md`, holding only per-repo facts: the code host, its code host reference, the push remote, and optionally the merge method. `code-host` takes the host from what it was told, then that doc, then the tracker doc, then the hostname table, so the doc settles ambiguous and self-hosted hostnames once per repo. Its commands stay in `code-host`'s references. This revises how [ADR 0005](0005-code-host-skill.md) finds the host, not where the commands live.

## Considered Options

- **Copy the code host reference into the repo**, as `setup-matt-pocock-skills` copies its tracker templates: the copies would miss every later fix to the references, most of which are still unexercised, and `check-references.ts` can't check them there.
- **Run `setup-matt-pocock-skills` from this skill**: it is user-invoked, so no skill can start it; setup stops and sends the user to it when `docs/agents/issue-tracker.md` is missing.
- **Have `code-host` write the doc**: an agent-invoked skill would write config into repos unasked.

## Consequences

- The doc is optional: without it, `code-host` detects the host as before, so repos that never ran setup keep working.
- Auth and push access belong to a machine, not a repo, so the doc leaves them out and `code-host` checks them on every run.
- A doc naming a remote that no longer exists is reported as missing, not silently replaced by detection.
- A recorded merge method replaces `landing`'s squash-first order and settles that decision in `lane-landing`'s plan.
