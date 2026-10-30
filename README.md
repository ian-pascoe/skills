# skills

Agent skills by Ian Pascoe.

## Install

```bash
npx skills@latest add ian-pascoe/skills
```

Skills here may depend on each other; when installing single skills with `--skill`, include what they require.

## Skills

| Skill                                                                  | Invoked by    | What it does                                                                                                  | Requires                                                                                           |
| ---------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [`escalating-to-user`](skills/escalating-to-user/SKILL.md)             | agent or user | Decides on your behalf, escalating only what needs you and reporting the rest in a ledger.                    | —                                                                                                  |
| [`internal-grilling`](skills/internal-grilling/SKILL.md)               | agent or user | Grills a plan internally, answering its own questions down the whole design tree.                             | [`grilling`](#grilling), `escalating-to-user`                                                      |
| [`grill-yourself`](skills/grill-yourself/SKILL.md)                     | user          | Runs `internal-grilling`.                                                                                     | `internal-grilling`                                                                                |
| [`grill-yourself-with-docs`](skills/grill-yourself-with-docs/SKILL.md) | user          | `internal-grilling`, writing the glossary and ADRs as decisions settle.                                       | `internal-grilling`, [`domain-modeling`](#domain-modeling)                                         |
| [`subagent-grilling`](skills/subagent-grilling/SKILL.md)               | agent or user | Grills a strong-model subagent down the whole design tree in your place, after confirming its model with you. | [`grilling`](#grilling), `escalating-to-user`, [persistent subagents](#persistent-subagents)       |
| [`grill-subagent`](skills/grill-subagent/SKILL.md)                     | user          | Runs `subagent-grilling`.                                                                                     | `subagent-grilling`                                                                                |
| [`grill-subagent-with-docs`](skills/grill-subagent-with-docs/SKILL.md) | user          | `subagent-grilling`, writing the glossary and ADRs as decisions settle.                                       | `subagent-grilling`, [`domain-modeling`](#domain-modeling)                                         |
| [`landing`](skills/landing/SKILL.md)                                   | agent or user | Builds a change, reviews it, opens its PR, and merges it once CI passes.                                      | [`tdd`](#tdd), [`code-review`](#code-review), [`pr`](#pr), `escalating-to-user`, [GitHub](#github) |
| [`land`](skills/land/SKILL.md)                                         | user          | Runs `landing`.                                                                                               | `landing`                                                                                          |
| [`lane-landing`](skills/lane-landing/SKILL.md)                         | agent or user | Lands a parent issue's tickets, or a list, in parallel lanes of subagents, pausing once to approve the plan.  | `landing`, `escalating-to-user`, [persistent subagents](#persistent-subagents)                     |
| [`land-tickets`](skills/land-tickets/SKILL.md)                         | user          | Runs `lane-landing`.                                                                                          | `lane-landing`                                                                                     |

## Prerequisites

Some skills build on skills from [mattpocock/skills](https://github.com/mattpocock/skills). Install them alongside this repo, leaving them model-invoked (the default) so other skills can reach them:

```bash
npx skills@latest add mattpocock/skills --skill grilling domain-modeling tdd codebase-design code-review pr
```

### `grilling`

[Source](https://github.com/mattpocock/skills/tree/main/skills/productivity/grilling). The design-tree interview that `internal-grilling` runs as an internal dialogue and `subagent-grilling` runs against a subagent.

### `domain-modeling`

[Source](https://github.com/mattpocock/skills/tree/main/skills/engineering/domain-modeling). Builds `GLOSSARY.md` and ADRs as a design is discussed.

### `tdd`

[Source](https://github.com/mattpocock/skills/tree/main/skills/engineering/tdd). The red-green-refactor loop `landing` builds a change with. It consults [`codebase-design`](https://github.com/mattpocock/skills/tree/main/skills/engineering/codebase-design) for interface vocabulary, so install that too.

### `code-review`

[Source](https://github.com/mattpocock/skills/tree/main/skills/engineering/code-review). The Standards and Spec review a PR must pass before `landing` merges it. It reads the issue tracker config that `/setup-matt-pocock-skills` writes, so run that once in each repo you land in.

### `pr`

[Source](https://github.com/mattpocock/skills/tree/main/skills/engineering/pr). The PR body template `landing` writes with.

### GitHub

`landing` opens, reviews, and merges PRs with the [`gh`](https://cli.github.com) CLI, so it needs a GitHub repo and an authenticated `gh`.

### Persistent subagents

`subagent-grilling` and `lane-landing` need a harness that can spawn subagents and keep messaging them across turns, such as pi's subagent tools. The subagents load this repo's skills (`escalating-to-user`, `landing`), so install them where the subagents can see them too.
