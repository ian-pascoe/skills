---
"@ian-pascoe/skills": patch
---

`landing` now pushes the commit its review report names (`git push origin <sha>:refs/heads/<branch>`), not the branch tip, so a commit made after review can't reach the PR unreviewed, and `lane-landing` tells each implementer which head to push. `landing` also writes the diff under review to a file and hands it to both `code-review` reviewers, so they review the diff even when they have no shell.
