---
"@ian-pascoe/skills": minor
---

Add `landing`, which builds a change, passes it through code-review before opening its PR, and merges it once CI passes, and `lane-landing`, which lands a parent issue's tickets or a list in parallel lanes of implementer subagents after you approve the lane plan. `land` and `land-tickets` are wrappers you invoke to run them. `landing` needs mattpocock's `tdd` (with the `codebase-design` it consults), `code-review`, and `pr` skills installed.
