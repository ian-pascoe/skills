# skills

Agent skills by Ian Pascoe.

## Install

```bash
npx skills@latest add ian-pascoe/skills
```

Skills here may depend on each other; when installing single skills with `--skill`, include what they require.

## Skills

| Skill                                                                  | Invoked by    | What it does                                                                                                                                                                     | Requires                                                                                                              |
| ---------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [`escalating-to-user`](skills/escalating-to-user/SKILL.md)             | agent or user | Decides on your behalf, escalating only what needs you and reporting the rest in a ledger.                                                                                       | —                                                                                                                     |
| [`internal-grilling`](skills/internal-grilling/SKILL.md)               | agent or user | Grills a plan internally, answering its own questions down the whole design tree.                                                                                                | [`grilling`](#grilling), [`research`](#research), `escalating-to-user`                                                |
| [`grill-yourself`](skills/grill-yourself/SKILL.md)                     | user          | Runs `internal-grilling`.                                                                                                                                                        | `internal-grilling`                                                                                                   |
| [`grill-yourself-with-docs`](skills/grill-yourself-with-docs/SKILL.md) | user          | `internal-grilling`, writing the glossary and ADRs as decisions settle.                                                                                                          | `internal-grilling`, [`domain-modeling`](#domain-modeling)                                                            |
| [`subagent-grilling`](skills/subagent-grilling/SKILL.md)               | agent or user | Grills a strong-model subagent down the whole design tree in your place, after confirming its model with you.                                                                    | [`grilling`](#grilling), [`research`](#research), `escalating-to-user`, [persistent subagents](#persistent-subagents) |
| [`grill-subagent`](skills/grill-subagent/SKILL.md)                     | user          | Runs `subagent-grilling`.                                                                                                                                                        | `subagent-grilling`                                                                                                   |
| [`grill-subagent-with-docs`](skills/grill-subagent-with-docs/SKILL.md) | user          | `subagent-grilling`, writing the glossary and ADRs as decisions settle.                                                                                                          | `subagent-grilling`, [`domain-modeling`](#domain-modeling)                                                            |
| [`split-grilling`](skills/split-grilling/SKILL.md)                     | agent or user | Grills you on a plan's architecture and itself on the implementation detail, escalating only what needs you.                                                                     | [`grilling`](#grilling), [`codebase-design`](#codebase-design), `internal-grilling`, `escalating-to-user`             |
| [`grill-us`](skills/grill-us/SKILL.md)                                 | user          | Runs `split-grilling`.                                                                                                                                                           | `split-grilling`                                                                                                      |
| [`grill-us-with-docs`](skills/grill-us-with-docs/SKILL.md)             | user          | `split-grilling`, writing the glossary and ADRs as decisions settle.                                                                                                             | `split-grilling`, [`domain-modeling`](#domain-modeling)                                                               |
| [`code-host`](skills/code-host/SKILL.md)                               | agent or user | Finds the repo's code host and holds its commands for PRs, reviews, checks, and merges.                                                                                          | [a code host](#code-host)                                                                                             |
| [`closing-the-loop`](skills/closing-the-loop/SKILL.md)                 | agent or user | Closes the loop on a run: looks back at its friction, decides which environment fixes are worth making, and makes or files them. Forked from `retro` so other skills can run it. | [`writing-for-agents`](#writing-for-agents), `escalating-to-user`, [the tracker config](#setup)                       |
| [`landing`](skills/landing/SKILL.md)                                   | agent or user | Builds a change, reviews it, opens its PR, and merges it once its checks pass.                                                                                                   | [`tdd`](#tdd), [`code-review`](#code-review), [`pr`](#pr), `escalating-to-user`, `code-host`, `closing-the-loop`      |
| [`land`](skills/land/SKILL.md)                                         | user          | Runs `landing`.                                                                                                                                                                  | `landing`                                                                                                             |
| [`lane-landing`](skills/lane-landing/SKILL.md)                         | agent or user | Lands a parent issue's tickets, or a list, in parallel lanes of subagents, pausing once to approve the plan.                                                                     | `code-host`, `landing`, `closing-the-loop`, `escalating-to-user`, [persistent subagents](#persistent-subagents)       |
| [`land-tickets`](skills/land-tickets/SKILL.md)                         | user          | Runs `lane-landing`.                                                                                                                                                             | `lane-landing`                                                                                                        |
| [`addressing-pr-review`](skills/addressing-pr-review/SKILL.md)         | agent or user | Addresses the unresolved review feedback on the current branch's PR, then commits and pushes the fixes.                                                                          | `code-host`                                                                                                           |
| [`address-pr-review`](skills/address-pr-review/SKILL.md)               | user          | Runs `addressing-pr-review`.                                                                                                                                                     | `addressing-pr-review`                                                                                                |
| [`setup-ian-pascoe-skills`](skills/setup-ian-pascoe-skills/SKILL.md)   | user          | Checks the prerequisites and records the repo's code host and merge method for `code-host` and the landing skills.                                                               | [`setup-matt-pocock-skills`](#setup), `code-host`                                                                     |

## Prerequisites

Some skills build on skills from [mattpocock/skills](https://github.com/mattpocock/skills). Install them alongside this repo, leaving them model-invoked (the default) so other skills can reach them:

```bash
npx skills@latest add mattpocock/skills --skill grilling research domain-modeling tdd codebase-design code-review pr writing-for-agents
```

Then set up each repo you use them in: see [Setup](#setup).

### `grilling`

[Source](https://github.com/mattpocock/skills/tree/main/skills/productivity/grilling). The design-tree interview that `internal-grilling` runs as an internal dialogue, `subagent-grilling` runs against a subagent, and `split-grilling` runs with you on the architecture only.

### `research`

[Source](https://github.com/mattpocock/skills/tree/main/skills/engineering/research). Investigates a question against primary sources in a background agent and writes the cited findings to a Markdown file in your repo. `internal-grilling` and `subagent-grilling` run it when a load-bearing decision rests on a public fact.

### `domain-modeling`

[Source](https://github.com/mattpocock/skills/tree/main/skills/engineering/domain-modeling). Builds `GLOSSARY.md` and ADRs as a design is discussed.

### `codebase-design`

[Source](https://github.com/mattpocock/skills/tree/main/skills/engineering/codebase-design). The deep-module vocabulary (module, interface, implementation, seam) that `split-grilling` draws its line between architecture and detail with.

### `tdd`

[Source](https://github.com/mattpocock/skills/tree/main/skills/engineering/tdd). The red-green-refactor loop `landing` builds a change with. It consults [`codebase-design`](#codebase-design) for interface vocabulary, so install that too.

### `code-review`

[Source](https://github.com/mattpocock/skills/tree/main/skills/engineering/code-review). The Standards and Spec review a PR must pass before `landing` merges it. It reads the issue tracker config that `/setup-matt-pocock-skills` writes (see [Setup](#setup)).

### `pr`

[Source](https://github.com/mattpocock/skills/tree/main/skills/engineering/pr). The PR body template `landing` writes with.

### `writing-for-agents`

[Source](https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-for-agents). The reference `closing-the-loop` judges steering files and skills by.

### Code host

`code-host` runs commands on the repo's code host for `landing`, `lane-landing`, and `addressing-pr-review`, so they need a remote they can push to and, for that host, one of:

| Code host                      | Needs                                                                                                                  |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| GitHub (and Enterprise)        | an authenticated [`gh`](https://cli.github.com)                                                                        |
| GitLab (.com and self-managed) | an authenticated [`glab`](https://gitlab.com/gitlab-org/cli)                                                           |
| Bitbucket Cloud                | `curl`, `jq`, and `BITBUCKET_EMAIL` plus `BITBUCKET_API_TOKEN` (an Atlassian API token)                                |
| Azure DevOps Services          | `az` with the `azure-devops` extension, logged in                                                                      |
| Gitea                          | an authenticated [`gt`](https://gitea.com/gitea/cli) on Gitea 28 or newer; below that, `curl`, `jq`, and `GITEA_TOKEN` |
| Forgejo, Codeberg              | `curl`, `jq`, and `FORGEJO_TOKEN`                                                                                      |
| [GitCafe](https://git.cafe)    | an authenticated `cafe` ([`@gitcafe/cli`](https://git.cafe/docs/getting-started/cli.md))                               |

Each host's commands live in [`skills/code-host/references/`](skills/code-host/references). They were researched from primary sources ([findings](docs/research/forge-clis.md)), and only GitHub's have been exercised so far. Bitbucket Data Center and Azure DevOps Server aren't covered.

### Persistent subagents

`subagent-grilling` and `lane-landing` need a harness that can spawn subagents and keep messaging them across turns, such as pi's subagent tools. The subagents load this repo's skills (`escalating-to-user`, `landing`, `closing-the-loop`), so install them where the subagents can see them too.

## Setup

In each repo you use these skills in, run [`/setup-matt-pocock-skills`](https://github.com/mattpocock/skills/tree/main/skills/engineering/setup-matt-pocock-skills), then `/setup-ian-pascoe-skills`. The first writes the issue tracker and domain doc config that `code-review` and the landing skills read; install it like the prerequisites:

```bash
npx skills@latest add mattpocock/skills --skill setup-matt-pocock-skills
```

The second checks the prerequisites and records the repo's code host config, `docs/agents/code-host.md`. Without it the skills still work, detecting the code host on every run.

## License

[MIT](LICENSE). The skills from [mattpocock/skills](https://github.com/mattpocock/skills) installed under `.agents/skills/` are Copyright (c) 2026 Matt Pocock, under [the MIT License](https://github.com/mattpocock/skills/blob/main/LICENSE), as is the [`retro`](https://github.com/mattpocock/skills/tree/main/skills/engineering/retro) skill `closing-the-loop` is forked from.
