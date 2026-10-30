---
"@ian-pascoe/skills": minor
---

First release. Grill a plan without answering every question yourself:

- `grill-yourself` and `grill-yourself-with-docs` have the agent grill itself down the plan's design tree (via `internal-grilling`), the latter writing the glossary and ADRs as decisions settle.
- `grill-subagent` and `grill-subagent-with-docs` have the agent grill a strong-model subagent in your place (via `subagent-grilling`), after confirming its model with you.
- `escalating-to-user` decides on your behalf, escalating only what needs you and reporting the rest in a ledger.

The grilling skills require `grilling` (and the `-with-docs` ones `domain-modeling`) from [mattpocock/skills](https://github.com/mattpocock/skills), and the `grill-subagent` ones a harness with persistent subagents, such as pi.
