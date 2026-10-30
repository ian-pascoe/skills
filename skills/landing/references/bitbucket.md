# Bitbucket Cloud

- **Hosts:** Bitbucket Cloud only (`bitbucket.org`). Bitbucket Data Center is not covered; `landing` stops at Start.
- **Tool:** REST via curl (no official Bitbucket CLI; `acli` has no Bitbucket commands), checked 2026-10-30
- **Exercised:** not yet
- **Sources:** https://api.bitbucket.org/swagger.json, https://developer.atlassian.com/cloud/bitbucket/oauth-2, https://developer.atlassian.com/cloud/bitbucket/rest/intro/#filtering, https://support.atlassian.com/bitbucket-cloud/docs/suggest-or-require-checks-before-a-merge/, https://support.atlassian.com/bitbucket-cloud/docs/enable-an-issue-tracker/, https://developer.atlassian.com/cloud/acli/reference/commands/

Placeholders: `W` workspace, `R` repo slug, `<n>` PR id. Base `https://api.bitbucket.org/2.0`. Every call below is `curl -u "$BITBUCKET_EMAIL:$BITBUCKET_API_TOKEN" …`; write `AUTH` for that prefix. Send JSON with `-H 'Content-Type: application/json'`.

## Detect & auth

- Remote host `bitbucket.org` (`git@bitbucket.org:W/R.git` or `https://bitbucket.org/W/R.git`). Any other host is not covered.
- Credentials: Basic auth, username = Atlassian email (`BITBUCKET_EMAIL`), password = API token (`BITBUCKET_API_TOKEN`). App passwords are deprecated. Token scopes needed: `pullrequest`, `pullrequest:write`, `pipeline`, `pipeline:write`, `repository:write`.
- Auth check: `AUTH https://api.bitbucket.org/2.0/user` (200 = ok).
- Push access: no permission query read. Learned from the first push.

## Who am I

`AUTH https://api.bitbucket.org/2.0/user` → `.uuid`, `.display_name`. Compare by `uuid`; `username` is not guaranteed on current accounts. **Unverified**: check the `/user` response before first use.

## Default branch

`AUTH https://api.bitbucket.org/2.0/repositories/W/R` → `.mainbranch.name`

## Find PRs

- Open PR for `<b>`: `AUTH -G "https://api.bitbucket.org/2.0/repositories/W/R/pullrequests" --data-urlencode 'state=OPEN' --data-urlencode 'q=source.branch.name="<b>"'` → `.values[]`: `.id`, `.author`, `.source.commit.hash` (head), `.destination.branch.name` (base). The `q` syntax is **Unverified**: check https://developer.atlassian.com/cloud/bitbucket/rest/intro/#filtering before first use; fallback: list `state=OPEN` and filter `.source.branch.name` client-side.
- PRs for a commit: `GET /repositories/W/R/commit/<sha>/pullrequests`.
- PRs that close `<ticket>`: no verified closing keywords (see Closing tickets). Search PR bodies: list `state=OPEN` and grep `.description` for the closing keyword + `<ticket>`.

## Open PR

`jq -n --rawfile d body.md --arg t "<title>" --arg s "<b>" --arg d2 "<t>" '{title:$t,description:$d,source:{branch:{name:$s}},destination:{branch:{name:$d2}},close_source_branch:true}' | AUTH -H 'Content-Type: application/json' -d @- https://api.bitbucket.org/2.0/repositories/W/R/pullrequests`

`POST /repositories/W/R/pullrequests`. `destination` defaults to the main branch if omitted; always pass `<t>`. Returns the PR with `.id`.

## Edit PR body

`jq -n --rawfile d body.md '{description:$d}' | AUTH -X PUT -H 'Content-Type: application/json' -d @- https://api.bitbucket.org/2.0/repositories/W/R/pullrequests/<n>`

Only open PRs can be mutated. **Unverified**: check the PUT body shape in the API page before first use.

## Comment

**Unsupported** → no top-level comment form is verified as not counting as an open thread (a top-level comment has `resolution` null, so it reads as unresolved). Put a `## Review` section in the PR body via Edit PR body.

## List comments

`AUTH "https://api.bitbucket.org/2.0/repositories/W/R/pullrequests/<n>/comments"` (paginated; follow `.next`). Oldest first by default (`sort` param). Returns global comments, inline comments, and replies: keep entries with no `inline` and no `parent`. Fields: `.user.display_name`, `.content.raw`, `.created_on`.

## Checks

- Wait on PR checks: no blocking watch. Poll `GET /repositories/W/R/pullrequests/<n>/statuses`; each `.values[].state` is `SUCCESSFUL`, `FAILED`, `INPROGRESS`, or `STOPPED`. Pending = any `INPROGRESS`; pass = all `SUCCESSFUL`; fail = any `FAILED` or `STOPPED`. Statuses aggregate Pipelines and third parties; there is no single rollup beyond this.
- Checks on a commit: **Unverified**: check the API page (`/repositories/W/R/commit/<sha>/statuses`) before first use.
- CI config in the repo: **Unverified**: check the Bitbucket Pipelines docs for the config path before first use.
- Failing job logs: `GET /repositories/W/R/pipelines/<uuid>/steps`, then `GET …/pipelines/<uuid>/steps/<step>/log` (supports `Range`).
- Rerun failed: **Unsupported** → start a fresh pipeline: `AUTH -H 'Content-Type: application/json' -d '{"target":{"type":"pipeline_ref_target","ref_type":"branch","ref_name":"<b>"}}' https://api.bitbucket.org/2.0/repositories/W/R/pipelines` (needs `pipeline:write`). It may not report to the PR's check. Stop a pipeline: `POST …/pipelines/<uuid>/stopPipeline`.

## Review threads

- List unresolved: `GET …/pullrequests/<n>/comments`; keep entries with no `parent` and `resolution` null (`resolution` is null when open). Include inline comments.
- Reply: `POST …/pullrequests/<n>/comments` with `{"content":{"raw":"<text>"},"parent":{"id":<comment id>}}`. **Unverified**: check the `comment` schema before first use.
- Resolve: `POST …/pullrequests/<n>/comments/<comment_id>/resolve` (unresolve = `DELETE` on the same path).

## Blocking verdicts

`GET …/pullrequests/<n>` → `.participants[]` with `.state` of `approved` or `changes_requested`. Any `changes_requested` blocks. The `require_no_changes_requested` branch restriction enforces it only where checks are binding (see Approvals & readiness).

## Approvals & readiness

- Required approvals: `GET /repositories/W/R/branch-restrictions`, entry with `kind` `require_approvals_to_merge` → `.value` (count). Related kinds: `require_default_reviewer_approvals_to_merge`, `require_passing_builds_to_merge`, `require_no_changes_requested`, `require_tasks_to_be_completed`, `require_all_comments_resolved`, `restrict_merges`, `enforce_merge_checks`.
- Current approvals: count `.participants[]` with `.approved` true on the PR. The author's own approval doesn't count.
- Readiness: `GET …/pullrequests/<n>/mergeability/checks` → `.values[]` of `{type, status, required, blocking}`. Types: `pullrequest_state_check`, `current_user_permission_check`, `git_mergeability_check` (`reason`: `clean`, `conflicts`, `merge_impossible`), `standard_merge_check` (one per branch restriction), `custom_pre_merge_check`, `custom_on_merge_check`, `merge_queue_check`.
- Binding checks: every `standard_merge_check`, and any check with `required` or `blocking` true. Status: `PASSED` = ok, `PENDING` = wait, `FAILED` or `UNKNOWN` = hold. `SKIPPED` on a non-binding check is ignorable. `UNKNOWN` does not mean mergeable.
- The list is not exhaustive (dependency-merge requirements are omitted). Also check approvals, `changes_requested`, statuses, and threads yourself.
- Off Premium, merge checks are advisory: the merge call can succeed with failing checks. Gate on the above; don't rely on a 4xx from the merge call.

## Bypass check

Off Premium every merge check is advisory, so anyone with merge access can merge past failing checks: treat the checks above as binding anyway. On Premium, "Prevent a merge with unresolved merge checks" (`enforce_merge_checks` restriction) makes them binding. Whether repo admins bypass `restrict_merges` is **Unverified**: check the branch-permissions docs before relying on it. The merge API has no bypass parameter.

## Merge methods & merge queue

`merge_strategy` values (default `merge_commit`):

| Bitbucket                             | Map            |
| ------------------------------------- | -------------- |
| `squash`, `squash_fast_forward`       | `squash`       |
| `merge_commit`                        | `merge commit` |
| `fast_forward`, `rebase_fast_forward` | `rebase`       |
| `rebase_merge`                        | `rebase`       |

Allowed methods: **Unverified**: check the repo's branch-merge settings or API page before first use. Merge queue: a `merge_queue_check` in `mergeability/checks`; an active queue on the destination means merge is added to the queue.

## Merge

No pin; re-read `source.commit.hash` and `mergeability/checks` just before merging, and merge only if the hash equals `<sha>`.

`jq -n '{type:"pullrequest_merge_parameters",merge_strategy:"squash",close_source_branch:true}' | AUTH -H 'Content-Type: application/json' -d @- https://api.bitbucket.org/2.0/repositories/W/R/pullrequests/<n>/merge`

- Always pass `merge_strategy` and `close_source_branch` explicitly. Optional `message`.
- Do not add `?async=true` (it can time out into a 202; plain merge can also return 202).
- No bypass or auto-merge parameter exists in the merge API.
- The UI-only "allow auto merge when builds pass" (`allow_auto_merge_when_builds_pass`) queues a merge for later: never use it.

## Read back

- 200 = merged. Confirm: `GET …/pullrequests/<n>` → `.state` = `MERGED`, `.merge_commit`.
- 202 = queued (merge queue) or long-running. Poll the `Location` header: `GET …/pullrequests/<n>/merge/task-status/<task_id>` until it completes. The PR has `.queued` (boolean). Don't treat 202 as merged. In a required queue, 202 + `.queued` true = queued.
- Auto-merge: UI only; not readable or cancellable by API. No dequeue endpoint found.

## Delete branch

Set `close_source_branch: true` in the merge body (omitted = the value from PR creation, default false). Also set it on create. Already gone is fine.

## Retarget

`jq -n --arg t "<t>" '{destination:{branch:{name:$t}}}' | AUTH -X PUT -H 'Content-Type: application/json' -d @- https://api.bitbucket.org/2.0/repositories/W/R/pullrequests/<n>`

Only open PRs. The payload shape is inferred from the PR schema. **Unverified**: check the API page before first use.

## Closing tickets

**Unverified**: no PR-body closing keywords are confirmed for Bitbucket Cloud. The Issues service moves issues via `<issue#> <command>` keywords in commit messages (https://support.atlassian.com/bitbucket-cloud/docs/enable-an-issue-tracker/); exact keywords and whether they fire only on the default branch are unconfirmed. Jira keys link through the Jira integration, not keywords. Check the Atlassian docs before first use; otherwise close `<ticket>` manually after merge.

## Quirks

- No official CLI: don't use community CLIs.
- Merge checks are advisory off Premium (see Approvals & readiness).
- Lists are paginated: follow `.next`.
- `UNKNOWN` check status is not mergeable.
- No native stacked PRs.
