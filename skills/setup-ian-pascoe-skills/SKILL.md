---
name: setup-ian-pascoe-skills
description: Configure this repo for Ian Pascoe's skills: check their prerequisites and record its code host. Run once per repo, after setup-matt-pocock-skills.
disable-model-invocation: true
---

Configure this repo for the skills from `ian-pascoe/skills`: check their prerequisites, then record the repo's code host in `docs/agents/code-host.md`, which `code-host` reads before detecting the host itself. Explore, show the user what you'll write, and write once they confirm.

## 1. Check prerequisites

These skills run mattpocock's `grilling`, `research`, `domain-modeling`, `tdd`, `codebase-design`, `code-review`, and `pr` by name. List any missing from your available skills, and offer the command that installs them at the scope this skill is installed at, adding `-g` when it sits in a user-level skills folder rather than this repo's:

```bash
npx skills@latest add mattpocock/skills --skill <missing skills> [-g] -y
```

Run it once the user agrees; otherwise leave the command with them and carry on.

Then read `docs/agents/issue-tracker.md`. If it's missing, stop and tell the user to run `/setup-matt-pocock-skills` first, then this again: its tracker doc and `## Agent skills` block are what this skill builds on.

Done when every prerequisite is installed or its command is with the user, and the tracker doc exists.

## 2. Find the code host

Run `code-host`, setting aside any existing `docs/agents/code-host.md` so it detects the host afresh; when the result differs from the doc, say so. Ask the user about an ambiguous host, recommending one. Stop on no remote or a host no reference covers. Missing auth or push access belongs to this machine, not the repo: note it for the report and carry on.

Read which merge methods the repo allows (**Merge methods & merge queue**) and recommend the first of squash, merge commit, and rebase it allows. The user may pick another, or none to leave the choice to each run.

Done when you hold the host, its code host reference, its push remote, and a recommended merge method.

## 3. Confirm and write

Show the user drafts of the doc and the `## Agent skills` entry, and write them once they confirm or edit them.

`docs/agents/code-host.md`, leaving out the merge method line when the user chose none:

```md
# Code host: <host>

- **Reference:** `<reference file>`
- **Push remote:** `<remote>`
- **Merge method:** <squash | merge commit | rebase>
```

A `### Code host` entry in the `## Agent skills` block, in whichever of `CLAUDE.md` or `AGENTS.md` holds it, after `### Issue tracker`:

```md
### Code host

<Host>, via `<remote>`. See `docs/agents/code-host.md`.
```

On a rerun, update the doc and the entry in place, keeping the user's edits around them.

## 4. Report

Tell the user what you wrote, any access still missing on this machine, and any prerequisites left to install. `code-host` reads the doc from now on, and `landing` and `lane-landing` its merge method; they can edit it directly, or rerun this skill to detect afresh.
