---
"@ian-pascoe/skills": minor
---

New `approaching` skill, with `approach` to run it yourself: like `landing`, it builds a change, reviews it (running `validating-ui` when it touches UI), opens its PR, and gets its checks green, but it stops short of the merge and leaves the PR open for your sign-off. Its ledger names the PR, the head that passed review and checks, and any provisional answer the PR rests on. Once you sign off, merge it yourself, or run `land` on the branch: `landing` resumes at its checks and merges once its gates hold.
