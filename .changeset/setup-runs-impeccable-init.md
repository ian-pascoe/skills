---
"@ian-pascoe/skills": patch
---

`setup-ian-pascoe-skills` now works out whether the repo has a UI (web pages, or a desktop or mobile app), asking you when the code leaves it unclear. Only a repo with a UI needs `validating-ui`'s prerequisites: pbakaus's [`impeccable`](https://github.com/pbakaus/impeccable), a driver (`agent-browser` or `agent-desktop`), and `ffmpeg`. For those repos, setup checks for them, offering to install any that are missing, and ends by running `impeccable`'s `init`. `init` interviews you about the product's users, purpose, and constraints and writes `PRODUCT.md`, which `validating-ui`'s audit and critique read. On a rerun, `init` asks only what has gone stale. Repos without a UI need none of these, and setup skips `init`.
