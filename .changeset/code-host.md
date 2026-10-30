---
"@ian-pascoe/skills": minor
---

New `code-host` skill: finds the repo's code host, checks your access, and holds each host's commands for PRs, reviews, checks, and merges. They moved out of `landing`, which now runs `code-host`, so install `code-host` alongside `landing` and `lane-landing`. The agent can also reach it on its own for ad-hoc PR work on any host `landing` covers.
