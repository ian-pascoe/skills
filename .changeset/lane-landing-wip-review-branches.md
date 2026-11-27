---
"@ian-pascoe/skills": patch
---

`lane-landing`: when the orchestrator can't read an implementer's worktree, such as one in another container, the implementer pushes each head for review to `wip/<ticket>` for the orchestrator to fetch, instead of pasting its patch into the report. The PR still opens only after review.
