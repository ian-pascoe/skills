---
"@ian-pascoe/skills": minor
---

New `addressing-pr-review` skill, with `address-pr-review` to run it yourself: addresses the unresolved review threads on the current branch's PR, plus changes a reviewer asked for outside any thread, then commits and pushes the fixes and resolves the threads. It fixes or dismisses a bot's findings, fixes another person's when it agrees and holds the rest for you, and reports every finding's outcome. It works on any code host `code-host` covers, so install `code-host` alongside it.
