---
"@ian-pascoe/skills": minor
---

New `split-grilling` skill, with `grill-us` and `grill-us-with-docs` to run it yourself. It splits a plan's design tree between you and the agent. First it grills you, round by round, on the architecture: anything a caller or user sees across a seam, like module seams and interfaces, the data model, external contracts, domain terms, and technology choices. Once the architecture is settled, it grills itself on the implementation detail inside each module, escalating only the detail that needs you, and presents a single ledger. Tell it "you decide" to hand a question back, or ask to weigh in on a detail. `grill-us-with-docs` also writes the glossary and ADRs as decisions settle. It requires mattpocock's `codebase-design`: `npx skills@latest add mattpocock/skills --skill codebase-design`.
