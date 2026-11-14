---
"@ian-pascoe/skills": minor
---

New `closing-the-loop` skill: triages the friction a run hit into fixes to the agent's environment, such as checks, coding standards, navigation pointers, and steering files. It keeps only fixes that pass a fixed bar: traced to a moment in the run, caused by the environment, likely to recur, and cheaper than the friction they prevent. It records why it dropped the rest. Each kept fix goes into the current work only when that work's spec already covers it. Otherwise it becomes a `needs-triage` ticket on the tracker of a repo you own, a drafted issue for the outside repo that owns the cause, filed once you confirm it, or a drafted proposal. It is forked from mattpocock's `retro`, which only the user can start, so that other skills can run it. It requires mattpocock's `writing-for-agents`: `npx skills@latest add mattpocock/skills --skill writing-for-agents`.
