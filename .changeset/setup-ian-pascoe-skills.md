---
"@ian-pascoe/skills": minor
---

New `setup-ian-pascoe-skills` skill, which you run once per repo after `/setup-matt-pocock-skills`: it checks that the mattpocock prerequisites are installed, offering to install any that are missing, then records the repo's code host, push remote, and merge method in `docs/agents/code-host.md`. `code-host` now takes the host from that doc before detecting it, and reports a doc naming a remote the repo doesn't have. `landing` merges with the doc's merge method, and `lane-landing` treats it as settled. Without the doc, all three work as before.
