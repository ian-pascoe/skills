---
"@ian-pascoe/skills": patch
---

`landing` now runs `validating-ui` at the start of its review when a change touches UI, so `code-review` sees its fixes: blockers it leaves open take fix cycles like `code-review`'s, its UI report goes in the review report with the base and head screenshots and a demo on the PR, and the ledger shows each surface's head beside its base, and its demos. In `lane-landing`, each implementer runs `validating-ui` after building, and the orchestrator's review takes its results. `code-host`'s references gain an Attach media section with each host's upload, whether it plays video, and its committed-file URL.
