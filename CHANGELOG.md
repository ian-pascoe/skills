# @ian-pascoe/skills

## 0.3.1

### Patch Changes

- [#8](https://github.com/ian-pascoe/skills/pull/8) [`577ea60`](https://github.com/ian-pascoe/skills/commit/577ea60a05792ca7ce54e932b688c21b4fdaf267) Thanks [@ian-pascoe](https://github.com/ian-pascoe)! - `landing` and `lane-landing` (and the `land` and `land-tickets` wrappers) now land on GitLab, Bitbucket Cloud, Azure DevOps Services, Gitea, Forgejo and Codeberg, and GitCafe as well as GitHub. Each code host's commands live in `landing`'s references, and the README lists the CLI or token each host needs. On every host, GitHub included, `landing` now:

  - checks that it can push to the repo, at Start where the host can tell;
  - escalates checks that haven't moved for an hour, and keeps waiting;
  - gates each merge on the approvals the rules require and on its own review and checks, even where the host wouldn't;
  - confirms each merge happened and merged the reviewed head;
  - closes any ticket the host left open.

  It prefers squash, then a merge commit, then rebase. Bitbucket Data Center and Azure DevOps Server aren't covered yet; `landing` stops at Start on them.

## 0.3.0

### Minor Changes

- [#6](https://github.com/ian-pascoe/skills/pull/6) [`d7a6080`](https://github.com/ian-pascoe/skills/commit/d7a608093060d0a4c45d65b6d8f2a45b770b1b2e) Thanks [@ian-pascoe](https://github.com/ian-pascoe)! - `internal-grilling` and `subagent-grilling` (and the `grill-yourself` and `grill-subagent` wrappers) now settle a load-bearing decision that rests on a public fact, like a library API, a vendor limit, or a spec, with mattpocock's `research` skill, and the ledger links the findings file it writes into your repo. Install `research` alongside `grilling`: `npx skills@latest add mattpocock/skills --skill research`.

### Patch Changes

- [#6](https://github.com/ian-pascoe/skills/pull/6) [`d7a6080`](https://github.com/ian-pascoe/skills/commit/d7a608093060d0a4c45d65b6d8f2a45b770b1b2e) Thanks [@ian-pascoe](https://github.com/ian-pascoe)! - `escalating-to-user` now looks up the facts it can find, public ones included (library APIs, vendor limits, specs), and decides on them instead of escalating them to you.

## 0.2.0

### Minor Changes

- [#2](https://github.com/ian-pascoe/skills/pull/2) [`ffaa657`](https://github.com/ian-pascoe/skills/commit/ffaa657e4338e631787a11829e89a1f212e4a8bc) Thanks [@ian-pascoe](https://github.com/ian-pascoe)! - Add `landing`, which builds a change, passes it through code-review before opening its PR, and merges it once CI passes, and `lane-landing`, which lands a parent issue's tickets or a list in parallel lanes of implementer subagents after you approve the lane plan. `land` and `land-tickets` are wrappers you invoke to run them. `landing` needs mattpocock's `tdd` (with the `codebase-design` it consults), `code-review`, and `pr` skills installed.

## 0.1.0

### Minor Changes

- [`4d0c664`](https://github.com/ian-pascoe/skills/commit/4d0c664a54833bb37b20a733ef998668cedb233c) Thanks [@ian-pascoe](https://github.com/ian-pascoe)! - First release. Grill a plan without answering every question yourself:

  - `grill-yourself` and `grill-yourself-with-docs` have the agent grill itself down the plan's design tree (via `internal-grilling`), the latter writing the glossary and ADRs as decisions settle.
  - `grill-subagent` and `grill-subagent-with-docs` have the agent grill a strong-model subagent in your place (via `subagent-grilling`), after confirming its model with you.
  - `escalating-to-user` decides on your behalf, escalating only what needs you and reporting the rest in a ledger.

  The grilling skills require `grilling` (and the `-with-docs` ones `domain-modeling`) from [mattpocock/skills](https://github.com/mattpocock/skills), and the `grill-subagent` ones a harness with persistent subagents, such as pi.
