---
"@ian-pascoe/skills": minor
---

New `setup-ian-pascoe-skills` skill, which you run once per repo after `/setup-matt-pocock-skills`: it checks that the mattpocock prerequisites are installed, offering to install any that are missing, then records the repo's code host, push remote, and merge method in its code host config, `docs/agents/code-host.md`. `code-host` now takes the host from that config before detecting it, and reports a config naming a remote the repo doesn't have. `landing` merges with the config's merge method, holding the PR if the repo no longer allows it, and `lane-landing` treats it as settled. Without the config, all three work as before.
