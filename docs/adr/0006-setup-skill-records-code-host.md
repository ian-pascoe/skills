# A setup skill records the repo's code host; commands stay in references

`setup-ian-pascoe-skills` checks the prerequisites, then writes the repo's code host config, `docs/agents/code-host.md`, holding only per-repo facts: the code host, its code host reference, the push remote, and optionally the merge method. `code-host` takes the host from what it was told, then that config, then the tracker doc, then the hostname table, so the config settles ambiguous and self-hosted hostnames once per repo. Its commands stay in `code-host`'s references. This revises how [ADR 0005](0005-code-host-skill.md) finds the host, not where the commands live. It also adds a third kind of skill beside [ADR 0002](0002-core-skills-and-wrappers.md)'s core skills and wrappers: a setup skill, user-invoked like a wrapper but holding its own behaviour, since only the user should decide when a repo's config gets written.

## Considered Options

- **Copy the code host reference into the repo**, as `setup-matt-pocock-skills` copies its tracker templates: the copies would miss every later fix to the references, most of which are still unexercised, and `check-references.ts` can't check them there.
- **Run `setup-matt-pocock-skills` from this skill**: it is user-invoked, so no skill can start it; setup stops and sends the user to it when `docs/agents/issue-tracker.md` is missing.
- **Have `code-host` write the config, with setup as its wrapper**: an agent-invoked skill would write config into repos unasked.

## Consequences

- The config is optional: without it, `code-host` detects the host as before, so repos that never ran setup keep working.
- Auth and push access belong to a machine, not a repo, so the config leaves them out and `code-host` checks them on every run.
- A config naming a remote that no longer exists is stale, and `code-host` reports it rather than detecting past it.
- A recorded merge method replaces `landing`'s squash-first order, held for the user if the repo stops allowing it, and settles that decision in `lane-landing`'s plan.
