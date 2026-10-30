# skills

Agent skills by Ian Pascoe.

## Install

```bash
npx skills@latest add ian-pascoe/skills
```

Skills here may depend on each other; when installing single skills with `--skill`, include what they require.

## Skills

| Skill                                                                  | Invoked by    | What it does                                                                                                  | Requires                                                                                   |
| ---------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [`escalate-to-user`](skills/escalate-to-user/SKILL.md)                 | agent or user | Decides on your behalf, escalating only what needs you and reporting the rest in a ledger.                    | —                                                                                          |
| [`internal-grilling`](skills/internal-grilling/SKILL.md)               | agent or user | Grills a plan internally, answering its own questions down the whole design tree.                             | [`grilling`](#grilling), `escalate-to-user`                                                |
| [`grill-yourself`](skills/grill-yourself/SKILL.md)                     | user          | Runs `internal-grilling`.                                                                                     | `internal-grilling`                                                                        |
| [`grill-yourself-with-docs`](skills/grill-yourself-with-docs/SKILL.md) | user          | `internal-grilling`, writing the glossary and ADRs as decisions settle.                                       | `internal-grilling`, [`domain-modeling`](#domain-modeling)                                 |
| [`subagent-grilling`](skills/subagent-grilling/SKILL.md)               | agent or user | Grills a strong-model subagent down the whole design tree in your place, after confirming its model with you. | [`grilling`](#grilling), `escalate-to-user`, [persistent subagents](#persistent-subagents) |
| [`grill-agent`](skills/grill-agent/SKILL.md)                           | user          | Runs `subagent-grilling`.                                                                                     | `subagent-grilling`                                                                        |
| [`grill-agent-with-docs`](skills/grill-agent-with-docs/SKILL.md)       | user          | `subagent-grilling`, writing the glossary and ADRs as decisions settle.                                       | `subagent-grilling`, [`domain-modeling`](#domain-modeling)                                 |

## Prerequisites

Some skills build on skills from [mattpocock/skills](https://github.com/mattpocock/skills). Install them alongside this repo, leaving them model-invoked (the default) so other skills can reach them:

```bash
npx skills@latest add mattpocock/skills --skill grilling domain-modeling
```

### `grilling`

[Source](https://github.com/mattpocock/skills/tree/main/skills/productivity/grilling). The design-tree interview that `internal-grilling` runs as an internal dialogue and `subagent-grilling` runs against a subagent.

### `domain-modeling`

[Source](https://github.com/mattpocock/skills/tree/main/skills/engineering/domain-modeling). Builds `GLOSSARY.md` and ADRs as a design is discussed.

### Persistent subagents

`subagent-grilling` needs a harness that can spawn a subagent and keep sending it rounds across turns, such as pi's subagent tools. The subagent loads `escalate-to-user`, so it needs this repo's skills installed too.
