# Landing names host operations; each code host's commands live in a reference

_The references and host detection have since moved to the `code-host` skill: see [ADR 0005](0005-code-host-skill.md)._

`landing` and `lane-landing` describe what they do on the code host (post the review report, wait on checks, resolve a review thread, merge, retarget) and look up the commands in `skills/landing/references/<host>.md`, one file per code host with the same headings in the same order. The commands came from primary sources, recorded in [`docs/research/forge-clis.md`](../research/forge-clis.md). This replaced commands written for `gh`, so the skills land on GitHub, GitLab, Bitbucket Cloud, Azure DevOps Services, Gitea, Forgejo, and GitCafe alike.

## Considered Options

- **One skill per code host**: every host would repeat landing's steps, and they would drift apart.
- **A bundled script**: it would be the repo's first code, and every host change would need a release of it rather than an edit to a reference.
- **Each host's native stacked PRs** (GitCafe, `gh stack`): one retarget-merge-rebase procedure runs on every host instead, so it is the one that gets exercised.
- **Community CLIs** where a host has no official one (`fj` for Forgejo): references use the official CLI, then its API passthrough, then `curl` against the REST API, so nothing unvetted runs with the user's token.

## Consequences

- Entering a merge queue that the merge rules require is not "queuing a merge for later". Landing enters it only once its own gates pass, then waits for the result. A queue the host lets some identities skip, like a GitLab merge train with `allow_bypass`, still counts as required: skipping it is the bypass.
- Landing's own gates (a review report for the current head, every check green, no unresolved review thread or blocking verdict, the approvals the rules require) hold on every host. Some hosts don't enforce their rules on every identity: an admin token, a GitCafe bypass actor, or Bitbucket off Premium, whose merge checks only warn.
- A host or edition without a reference (Bitbucket Data Center, Azure DevOps Server) stops landing at Start. Adding one is a new reference, a row in Start's hostname table, and, for a new CLI, its name in `scripts/check-references.ts`, which checks the references in CI.
