import { expect, test } from "bun:test";
import { checkReferences, HEADINGS } from "./check-references.ts";

const header = [
  "- **Hosts:** example.com",
  "- **Tool:** `ex` 1.0, checked 2026-10-30",
  "- **Exercised:** not yet",
  "- **Sources:** https://example.com/docs",
  "- **Placeholders:** `<n>` PR number",
].join("\n");

function reference(title: string, headings: readonly string[] = HEADINGS, extra = ""): string {
  return [
    `# ${title}`,
    header,
    ...headings.map((h) => `## ${h}\n\nText.${h === "Merge" ? extra : ""}`),
  ].join("\n\n");
}

const MERGE_PATH = "\n\n**Unverified (merge path)**: hold before merging and escalate.";

const landing = `## Start

| Hostname     | Reference    |
| ------------ | ------------ |
| \`github.com\` | \`github.md\` |
| \`gitlab.com\` | \`gitlab.md\` |

Check auth under **Detect & auth**, then open it (**Open PR**).
`;

const laneLanding = "Retarget the child's PR (**Retarget**).\n";

function repo(overrides: Record<string, string | undefined> = {}): Record<string, string> {
  const files: Record<string, string | undefined> = {
    "skills/landing/SKILL.md": landing,
    "skills/lane-landing/SKILL.md": laneLanding,
    "skills/landing/references/github.md": reference("GitHub"),
    "skills/landing/references/gitlab.md": reference("GitLab", HEADINGS, MERGE_PATH),
    ...overrides,
  };
  return Object.fromEntries(
    Object.entries(files).filter((entry): entry is [string, string] => entry[1] !== undefined),
  );
}

test("a repo whose references follow the template has no problems", () => {
  expect(checkReferences(repo())).toEqual([]);
});

test("a reference missing a heading is reported", () => {
  const headings = HEADINGS.filter((h) => h !== "Retarget");
  const problems = checkReferences(
    repo({ "skills/landing/references/github.md": reference("GitHub", headings) }),
  );
  expect(problems).toEqual([
    "skills/landing/references/github.md: headings must be, in order: " + HEADINGS.join(", "),
  ]);
});

test("a reference missing a header line is reported", () => {
  const content = reference("GitHub").replace("- **Exercised:** not yet\n", "");
  expect(checkReferences(repo({ "skills/landing/references/github.md": content }))).toEqual([
    "skills/landing/references/github.md: header is missing - **Exercised:**",
  ]);
});

test("a dropped merge-path hold is reported", () => {
  expect(
    checkReferences(repo({ "skills/landing/references/gitlab.md": reference("GitLab") })),
  ).toEqual([
    "skills/landing/references/gitlab.md: expected 1 **Unverified (merge path)** hold, found 0",
  ]);
});

test("a merge-path hold outside the expected references is reported", () => {
  const content = reference("GitHub", HEADINGS, MERGE_PATH);
  expect(checkReferences(repo({ "skills/landing/references/github.md": content }))).toEqual([
    "skills/landing/references/github.md: expected 0 **Unverified (merge path)** holds, found 1",
  ]);
});

test("a reference missing from Start's hostname table is reported", () => {
  const files = repo({ "skills/landing/references/gitea.md": reference("Gitea") });
  expect(checkReferences(files)).toEqual([
    "skills/landing/SKILL.md: Start's hostname table has no row for gitea.md",
  ]);
});

test("a hostname table row naming no reference is reported", () => {
  const files = repo({ "skills/landing/references/gitlab.md": undefined });
  expect(checkReferences(files)).toEqual([
    "skills/landing/SKILL.md: Start's hostname table names gitlab.md, which isn't in skills/landing/references/",
  ]);
});

test("a pointer to a heading the references don't have is reported", () => {
  const files = repo({
    "skills/lane-landing/SKILL.md":
      "Retarget it (**Retarget PR**), then wait (**Checks**, **Merge rules**).\n",
  });
  expect(checkReferences(files)).toEqual([
    "skills/lane-landing/SKILL.md: (**Retarget PR**) points to no reference heading",
    "skills/lane-landing/SKILL.md: (**Merge rules**) points to no reference heading",
  ]);
});

test("a host command in a skill outside the references is reported", () => {
  const files = repo({
    "skills/land/SKILL.md": "Post it with `gh pr comment`, then resolve it over GraphQL.\n",
  });
  expect(checkReferences(files)).toEqual([
    "skills/land/SKILL.md: host command `gh pr comment` belongs in a code host reference",
    "skills/land/SKILL.md: host command GraphQL belongs in a code host reference",
  ]);
});

test("naming a host's CLI without a command is fine", () => {
  const files = repo({
    "skills/land/SKILL.md": "Ask whichever CLI (`gh`, `glab`, `cafe`) knows the repo.\n",
  });
  expect(checkReferences(files)).toEqual([]);
});
