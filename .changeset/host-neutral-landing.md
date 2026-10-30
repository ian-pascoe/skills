---
"@ian-pascoe/skills": patch
---

`landing` and `lane-landing` (and the `land` and `land-tickets` wrappers) now land on GitLab, Bitbucket Cloud, Azure DevOps Services, Gitea, Forgejo and Codeberg, and GitCafe as well as GitHub. Each code host's commands live in `landing`'s references, and the README lists the CLI or token each host needs. On every host, GitHub included, `landing` now:

- checks at Start that it can push to the repo;
- escalates checks that haven't moved for an hour, and keeps waiting;
- gates each merge on the approvals the rules require and on its own review and checks, even where the host wouldn't;
- confirms each merge happened and merged the reviewed head;
- closes any ticket the host left open.

It prefers squash, then a merge commit, then rebase. Bitbucket Data Center and Azure DevOps Server aren't covered yet; `landing` stops at Start on them.
