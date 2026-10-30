# Build on mattpocock's skills by name

`internal-grilling`, `subagent-grilling`, and the `-with-docs` wrappers run mattpocock's `grilling` and `domain-modeling` by name and describe only how they change them, rather than bundling or forking copies. This picks up upstream fixes for free and keeps each skill short, at the cost of users installing those prerequisites alongside this repo (see the README). Don't inline their text into these skills; if upstream changes in a way that breaks them, adapt the override or fork deliberately.
