# Validate UI inside landing's review

When a change touches UI, `landing`'s **Review** first runs `validating-ui`, then `code-review` on the diff with its fixes. `validating-ui` runs each touched surface at the fixed point and the head; has impeccable's `audit` and then its `critique` review the head, each in its own subagent so neither anchors the other; fixes the findings worth fixing; and only then captures base and head screenshots and a short demo of the change's main flow working, so the evidence shows the fixed head. A UI finding blocks only when the change introduced it (present at the head, absent at the base) at P0 or P1, when it is a render failure the change introduced, or when the head fails an acceptance criterion the spec sets for the UI; the rest are advisory, fixed when they stay inside the spec. Blockers it leaves open join `code-review`'s, and its UI report rides in the review report naming the head it validated, with the screenshots and demo on the PR.

Screenshots and demos reach the PR through the code host: each code host reference has an **Attach media** heading with the host's upload, where it has one, whether it plays video, and its URL for a committed file. A demo goes up as video where the host plays it (GitHub, GitLab, Gitea, Forgejo), otherwise as a GIF. Where a host can't upload, the evidence is committed under `<branch>/<head>/` on the repo's one `ui-evidence` branch, which shares no history with the code, and linked at that commit.

## Considered Options

- **Run it once after Build**: cheaper, but a review fix that touches UI would merge unvalidated. Running it in Review sends every fix back through it, limited to the surfaces the fix touches.
- **Run it after `code-review`**: its fixes would reach the PR unreviewed. Running it first puts them in the diff `code-review` sees.
- **Hand every finding back to the caller to fix**: `audit` and `critique` only document, and the agent that just read their reports and has the app running is best placed to fix them.
- **Capture before fixing**: the evidence would show problems the PR no longer has.
- **Block on the reports' whole findings**: both score the entire surface, so a one-line change would inherit every older problem on the page and widen into a redesign. Comparing against the base keeps the bar on what the change did, as `code-review` keeps baseline smells advisory.
- **Run `audit` and `critique` in the validating agent**: their findings would anchor each other and the fixes, and their reports would crowd its context. Subagents keep them independent.
- **Keep the evidence local, shown only in the ledger**: reviewers on the PR would never see it.
- **Commit the evidence to the change's branch**: it would enter the diff, its review, and the default branch.
- **A branch per PR branch**: never races, but leaves a branch behind for every PR that needs it. One `ui-evidence` branch keeps the branch list clean; parallel lanes that race to push it rebase and retry, which never conflicts, since each writes only its own directory.

## Consequences

- In a repo with a UI, `setup-ian-pascoe-skills` checks for `impeccable` and runs its `init`, so `audit` and `critique` read a `PRODUCT.md` the user confirmed rather than guessing the product from the code.
- A desktop app on a non-web toolkit skips `audit` and `critique`, since `impeccable` reaches desktop windows only over CDP, reviews a web view without CDP from source, and its native path covers only mobile platforms; `agent-desktop` still drives its walk, screenshots, and demo, and the hand back names the skip.
- A missing prerequisite skips only the part that needs it, and the hand back names it.
- Landing needs `impeccable`, a driver (`agent-browser` or `agent-desktop`), and `ffmpeg` only in repos whose changes touch UI.
- In `lane-landing`, each implementer runs `validating-ui` after Build, since its fixes belong in the implementer's worktree, and the orchestrator's review takes its results.
- `critique` spawns its own two assessments where its subagent can; where it can't, it runs its delegated, single-context path and says so.
- Validation starts the app twice, so it needs a free port and its own driver session when lanes run in parallel.
- A surface that won't run is reviewed from source and logged as friction, which `closing-the-loop` can turn into a fix to how the repo runs.
- The `ui-evidence` branch outlives every PR it serves, since the links point into it, and a plain clone fetches it; prune its old directories when their PRs no longer need them, keeping the commits the links name.
- Only GitHub's `--attach` and GitLab's upload are documented end to end; the other hosts' uploads and committed-file rendering carry **Unverified** marks until a run exercises them.
