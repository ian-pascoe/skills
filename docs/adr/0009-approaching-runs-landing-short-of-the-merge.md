# `approaching` runs `landing` short of the merge

`approaching` takes a change through `landing`'s **Start**, **Build**, **Review**, **Open the PR**, and **Pass checks**, then stops at a person's sign-off instead of merging, as its own core skill with an `approach` wrapper, following [ADR 0002](0002-core-skills-and-wrappers.md) rather than adding a mode to `landing`. It runs `landing` with an override, as `lane-landing` does, so the two can't drift apart on how a change is built, reviewed, and checked. It confirms every merge gate but approvals, since the missing approval is the sign-off it waits for. A change on approach lands later through `landing`, whose **Start** resumes an open PR at **Pass checks**, or through the person merging it.

## Considered Options

- **A "stop before merge" mode on `landing`**: one skill, but ADR 0002 keeps behaviours in core skills with wrappers, and a mode would put the stopping rules in every landing run's context.
- **Copy `landing`'s steps into a new skill**: free to diverge, which is the problem: a fix to review or checks would have to land twice.
- **Wait for the approval, then merge**: that's `landing` on a repo whose merge rules require an approval. The point is to hand the merge to a person.
