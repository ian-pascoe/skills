# @ian-pascoe/skills

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
