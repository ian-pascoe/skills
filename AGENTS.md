Use Bun, not Node: `bun <file>`, `bun test`, `bun run <script>`, `bunx <package>`, `bun install`.

## Local skills

Agents working in this repo load skills from `.agents/skills/`. Each skill in `skills/` is symlinked there, so adding, renaming, or removing a skill means updating its link too: `ln -s ../../skills/<name> .agents/skills/<name>`. Skills from other repos that these depend on are installed there with `npx skills add`, tracked in `skills-lock.json`. Don't run `npx skills add` on this repo's own skills: it replaces the symlinks with copies that go stale.

Claude Code loads skills from `.claude/skills/`, where every skill in `.agents/skills/` has a link: `ln -s ../../.agents/skills/<name> .claude/skills/<name>`.

## Changesets

The repo is versioned as one private package with [Changesets](https://changesets.dev); releases are git tags and GitHub releases.

Every change a skill user would notice gets a changeset: run `bun changeset`. Write it for skill users, naming the skill that changed. A changeset that removes or renames a skill names what replaces it. Changes that only touch repo tooling, CI, or docs need none.

Pick the bump by what a skill user would notice:

- `major`: a skill is removed or renamed, or how it is invoked or what it requires changes incompatibly. While below 1.0, use `minor` instead.
- `minor`: a new skill.
- `patch`: a behaviour change to an existing skill.

CI runs `bun run verify`. Its `check:references` step (`scripts/check-references.ts`) holds `landing`'s code host references to one heading list and checks that every (**Heading**) pointer in `landing` and `lane-landing` names one of those headings.

## Agent skills

### Issue tracker

Issues live in GitHub Issues on `ian-pascoe/skills`, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default labels are used as-is: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
