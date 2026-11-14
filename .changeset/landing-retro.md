---
"@ian-pascoe/skills": minor
---

`landing` and `lane-landing` now end with a retro, and require the new `closing-the-loop` skill and mattpocock's `writing-for-agents`: `npx skills@latest add mattpocock/skills --skill writing-for-agents`. They keep a friction log during the run (long searches, mistakes a check or reviewer should have caught, red checks, fix cycles, escalations), then run `closing-the-loop` on it. It files follow-up tickets for the fixes worth making, escalates drafted issues for outside repos, and its report closes the ledger. A smooth run files nothing. `setup-ian-pascoe-skills` now checks for `writing-for-agents` among the prerequisites.
