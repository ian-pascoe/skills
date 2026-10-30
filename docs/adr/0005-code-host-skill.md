# Code host references live in their own skill

The code host references and the detection that picks one (the hostname table, the probes, the access check) moved out of `landing` into a `code-host` skill, which `landing`, `lane-landing`, and `addressing-pr-review` run by name. This revises where [ADR 0004](0004-host-neutral-landing.md) put them, not how they are written: one file per code host in `skills/code-host/references/`, same headings in the same order, commands from primary sources.

`addressing-pr-review` needs the code host's commands but none of landing's process, and reaching into `landing`'s folder and copying its Start step tied it to how `landing` happens to be laid out. `code-host` is model-invoked so other skills can run it, and so the agent can reach a host's commands for ad-hoc PR work too.

## Considered Options

- **Keep the references in `landing`**: every other skill that touches a PR would depend on `landing`'s folder and the wording of its Start, and installing it would look like it needs `tdd`, `code-review`, and `pr`.
- **A user-invoked `code-host`**: no description to load every turn, but no other skill could run it.

## Consequences

- `landing` requires `code-host`, so installing `landing` alone no longer works.
- Adding a code host is a new reference, a row in `code-host`'s hostname table, and, for a new CLI, its name in `scripts/check-references.ts`, which checks the references in CI.
- `code-host` reports what's missing (an ambiguous host, no reference, no auth, no push access); each skill that runs it decides whether to stop or escalate.
