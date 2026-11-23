# @ian-pascoe/skills

## 0.8.1

### Patch Changes

- [#26](https://github.com/ian-pascoe/skills/pull/26) [`e037e46`](https://github.com/ian-pascoe/skills/commit/e037e46e3f973c9dd7305fdb3177f70008fb925e) Thanks [@ian-pascoe](https://github.com/ian-pascoe)! - `lane-landing`: each implementer's branch is cut from the default branch's freshly fetched remote head, so a worktree copied from a stale orchestrator checkout no longer starts on old code.

## 0.8.0

### Minor Changes

- [#24](https://github.com/ian-pascoe/skills/pull/24) [`9d093dd`](https://github.com/ian-pascoe/skills/commit/9d093dd72ad4743890cdf55e4e71c6e17941f740) Thanks [@ian-pascoe](https://github.com/ian-pascoe)! - New `approaching` skill, with `approach` to run it yourself: like `landing`, it builds a change, reviews it (running `validating-ui` when it touches UI), opens its PR, and gets its checks green, but it stops short of the merge and leaves the PR open for your sign-off. Its ledger names the PR, the head that passed review and checks, and any provisional answer the PR rests on. Once you sign off, merge it yourself, or run `land` on the branch: `landing` resumes at its checks and merges once its gates hold.

- [#24](https://github.com/ian-pascoe/skills/pull/24) [`9d093dd`](https://github.com/ian-pascoe/skills/commit/9d093dd72ad4743890cdf55e4e71c6e17941f740) Thanks [@ian-pascoe](https://github.com/ian-pascoe)! - New `validating-ui` skill: validates the UI a change touches. It runs each surface the change touches at the base and the head, has impeccable's `audit` and then its `critique` review the head, each in its own subagent, and fixes what's worth fixing: every problem the change introduced at P0 or P1, every render failure it introduced, every acceptance criterion the UI fails, and the advisory findings it agrees with that stay inside the change's spec. Then it screenshots the base and the fixed head at the sizes they ship at and records a short demo of the change's main flow working. It hands back the findings, the evidence, and a `## UI` report showing each surface's base beside its head, and posts the screenshots and demo to the PR: uploaded where the code host allows, the demo as video where the host plays it and otherwise as a GIF, or committed to the repo's one `ui-evidence` branch and linked. It requires [`impeccable`](https://github.com/pbakaus/impeccable), plus [`agent-browser`](https://github.com/vercel-labs/agent-browser) for web pages and Electron apps or [`agent-desktop`](https://github.com/vercel-labs/agent-desktop) for native desktop apps, and `ffmpeg` for demos; see the README's UI validation section. On GitHub, uploading needs `gh` 2.105.0 or newer for `--attach`.

### Patch Changes

- [#24](https://github.com/ian-pascoe/skills/pull/24) [`9d093dd`](https://github.com/ian-pascoe/skills/commit/9d093dd72ad4743890cdf55e4e71c6e17941f740) Thanks [@ian-pascoe](https://github.com/ian-pascoe)! - `landing` now runs `validating-ui` at the start of its review when a change touches UI, so `code-review` sees its fixes: blockers it leaves open take fix cycles like `code-review`'s, its UI report goes in the review report with the base and head screenshots and a demo on the PR, and the ledger shows each surface's head beside its base, and its demos. In `lane-landing`, each implementer runs `validating-ui` after building, and the orchestrator's review takes its results. `code-host`'s references gain an Attach media section with each host's upload, whether it plays video, and its committed-file URL.

- [#24](https://github.com/ian-pascoe/skills/pull/24) [`9d093dd`](https://github.com/ian-pascoe/skills/commit/9d093dd72ad4743890cdf55e4e71c6e17941f740) Thanks [@ian-pascoe](https://github.com/ian-pascoe)! - `setup-ian-pascoe-skills` now works out whether the repo has a UI (web pages, or a desktop or mobile app), asking you when the code leaves it unclear. Only a repo with a UI needs `validating-ui`'s prerequisites: pbakaus's [`impeccable`](https://github.com/pbakaus/impeccable), a driver (`agent-browser` or `agent-desktop`), and `ffmpeg`. For those repos, setup checks for them, offering to install any that are missing, and ends by running `impeccable`'s `init`. `init` interviews you about the product's users, purpose, and constraints and writes `PRODUCT.md`, which `validating-ui`'s audit and critique read. On a rerun, `init` asks only what has gone stale. Repos without a UI need none of these, and setup skips `init`.

## 0.7.0

### Minor Changes

- [#22](https://github.com/ian-pascoe/skills/pull/22) [`e0500e8`](https://github.com/ian-pascoe/skills/commit/e0500e86c486041dcc053fc73578e1c7743aaab3) Thanks [@ian-pascoe](https://github.com/ian-pascoe)! - New `split-grilling` skill, with `grill-us` and `grill-us-with-docs` to run it yourself. It splits a plan's design tree between you and the agent. First it grills you, round by round, on the architecture: anything reaching past one module's implementation, like module seams and interfaces, the data model, external contracts, domain terms, and technology choices. Once the architecture is settled, it grills itself on the implementation detail inside each module, escalating only the detail that needs you and any architecture that turns up late, and presents a single ledger with your answers in it. Tell it "you decide" to hand a question back, or ask to weigh in on any detail, in a round or in the ledger. `grill-us-with-docs` also writes the glossary and ADRs as decisions settle. It requires mattpocock's `codebase-design`: `npx skills@latest add mattpocock/skills --skill codebase-design`.

## 0.6.0

### Minor Changes

- [#20](https://github.com/ian-pascoe/skills/pull/20) [`46a6540`](https://github.com/ian-pascoe/skills/commit/46a6540aa3aeaaf1ae458cc0eb3c9fba6318badd) Thanks [@ian-pascoe](https://github.com/ian-pascoe)! - New `closing-the-loop` skill: triages the friction a run hit into fixes to the agent's environment, such as checks, coding standards, navigation pointers, and steering files. It keeps only fixes that pass a fixed bar: traced to a moment in the run, caused by the environment, likely to recur, and cheaper than the friction they prevent. It records why it dropped the rest. Each kept fix goes into the current work only when that work's spec already covers it. Otherwise it becomes a `needs-triage` ticket on the tracker of a repo you own, a drafted issue for the outside repo that owns the cause, filed once you confirm it, or a drafted proposal. It is forked from mattpocock's `retro`, which only the user can start, so that other skills can run it. It requires mattpocock's `writing-for-agents`: `npx skills@latest add mattpocock/skills --skill writing-for-agents`.

- [#20](https://github.com/ian-pascoe/skills/pull/20) [`46a6540`](https://github.com/ian-pascoe/skills/commit/46a6540aa3aeaaf1ae458cc0eb3c9fba6318badd) Thanks [@ian-pascoe](https://github.com/ian-pascoe)! - `landing` and `lane-landing` now end with a retro, and require the new `closing-the-loop` skill and mattpocock's `writing-for-agents`: `npx skills@latest add mattpocock/skills --skill writing-for-agents`. They keep a friction log during the run (long searches, mistakes a check or reviewer should have caught, red checks, fix cycles, escalations), then run `closing-the-loop` on it. It files follow-up tickets for the fixes worth making, escalates drafted issues for outside repos, and its report closes the ledger. A smooth run files nothing. `setup-ian-pascoe-skills` now checks for `writing-for-agents` among the prerequisites.

## 0.5.1

### Patch Changes

- [#16](https://github.com/ian-pascoe/skills/pull/16) [`3d527ca`](https://github.com/ian-pascoe/skills/commit/3d527caad3b2e03816324824c8dcf4e52126b03c) Thanks [@ian-pascoe](https://github.com/ian-pascoe)! - `setup-ian-pascoe-skills` now installs: `npx skills add` skipped it because its description didn't parse as YAML.

## 0.5.0

### Minor Changes

- [#14](https://github.com/ian-pascoe/skills/pull/14) [`9777611`](https://github.com/ian-pascoe/skills/commit/977761188e27c107e4c820f3cfb26d1389ef278a) Thanks [@ian-pascoe](https://github.com/ian-pascoe)! - New `setup-ian-pascoe-skills` skill, which you run once per repo after `/setup-matt-pocock-skills`: it checks that the mattpocock prerequisites are installed, offering to install any that are missing, then records the repo's code host, push remote, and merge method in its code host config, `docs/agents/code-host.md`. `code-host` now takes the host from that config before detecting it, and reports a config naming a remote the repo doesn't have. `landing` merges with the config's merge method, holding the PR if the repo no longer allows it, and `lane-landing` treats it as settled. Without the config, all three work as before.

## 0.4.0

### Minor Changes

- [#12](https://github.com/ian-pascoe/skills/pull/12) [`3850060`](https://github.com/ian-pascoe/skills/commit/3850060723c964c9f0cc48be99854b79d92d5612) Thanks [@ian-pascoe](https://github.com/ian-pascoe)! - New `addressing-pr-review` skill, with `address-pr-review` to run it yourself: addresses the unresolved review threads on the current branch's PR, plus changes a reviewer asked for outside any thread, then commits and pushes the fixes and resolves the threads. It fixes or dismisses a bot's findings, fixes another person's when it agrees and holds the rest for you, and reports every finding's outcome. It works on any code host `code-host` covers, so install `code-host` alongside it.

- [#12](https://github.com/ian-pascoe/skills/pull/12) [`3850060`](https://github.com/ian-pascoe/skills/commit/3850060723c964c9f0cc48be99854b79d92d5612) Thanks [@ian-pascoe](https://github.com/ian-pascoe)! - New `code-host` skill: finds the repo's code host, checks your access, and holds each host's commands for PRs, reviews, checks, and merges. They moved out of `landing`, which now runs `code-host`, so install `code-host` alongside `landing` and `lane-landing`. The agent can also reach it on its own for ad-hoc PR work on any code host it covers.

## 0.3.2

### Patch Changes

- [#10](https://github.com/ian-pascoe/skills/pull/10) [`67fb2a1`](https://github.com/ian-pascoe/skills/commit/67fb2a1a2cb58224d90d11bac4714aa6fec26f09) Thanks [@ian-pascoe](https://github.com/ian-pascoe)! - `landing` now pushes the commit its review report names (`git push <remote> <sha>:refs/heads/<branch>`), not the branch tip, so a commit made after review can't reach the PR unreviewed, and `lane-landing` tells each implementer which head to push. `landing` also writes the diff under review to a file and hands it to both `code-review` reviewers, so they review the diff even when they have no shell.

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
