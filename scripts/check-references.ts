// Checks that landing's code host references follow their heading template and
// that the skills pointing into them stay in step. `bun run check:references`.

const REFERENCES_DIR = "skills/landing/references/";
const LANDING = "skills/landing/SKILL.md";

/** Skills whose parenthesised bold spans, like (**Checks**), point to reference headings. */
const POINTING_SKILLS = [LANDING, "skills/lane-landing/SKILL.md"];

const HEADINGS = [
  "Detect & auth",
  "Who am I",
  "Default branch",
  "Find PRs",
  "Open PR",
  "Edit PR body",
  "Comment",
  "List comments",
  "Checks",
  "Review threads",
  "Blocking verdicts",
  "Approvals & readiness",
  "Bypass check",
  "Merge methods & merge queue",
  "Merge",
  "Read back",
  "Delete branch",
  "Retarget",
  "Closing tickets",
  "Quirks",
];

const HEADER_FIELDS = ["Hosts", "Tool", "Exercised", "Sources", "Placeholders"];

/**
 * The only places a reference may hold landing before merging. Each hold
 * guards a merge call whose behaviour is unverified, so adding or dropping
 * one is a deliberate edit here, not a side effect of rewording.
 */
const MERGE_PATH_HOLDS: Record<string, number> = { "gitlab.md": 1 };
const MERGE_PATH_MARKER = "**Unverified (merge path)**";

/** A code host CLI running a subcommand, or GitHub-only API terms and merge flags. */
const HOST_COMMAND =
  /\b(?:gh|glab|cafe|gt|tea|fj|az) (?:pr|mr|api|run|ci|repo|repos|devops|stack|issue|auth)\b|graphql|--admin\b|--auto\b/gi;

/** Repo-relative path → file content. Returns one line per problem. */
export function checkReferences(files: Record<string, string>): string[] {
  return [
    ...Object.entries(files).flatMap(([path, content]) => [
      ...(referenceName(path) === undefined ? [] : checkReference(path, content)),
      ...checkMergePathHolds(path, content),
      ...(/^skills\/[^/]+\/SKILL\.md$/.test(path) ? checkHostCommands(path, content) : []),
    ]),
    ...checkHostnameTable(files),
    ...POINTING_SKILLS.flatMap((path) => checkPointers(path, files[path] ?? "")),
  ];
}

function referenceName(path: string): string | undefined {
  return path.startsWith(REFERENCES_DIR) ? path.slice(REFERENCES_DIR.length) : undefined;
}

function checkReference(path: string, content: string): string[] {
  const problems: string[] = [];
  const headings = [...content.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
  if (headings.join("\n") !== HEADINGS.join("\n")) {
    problems.push(`${path}: headings must be, in order: ${HEADINGS.join(", ")}`);
  }
  const headerLines = (content.split(/^## /m)[0] ?? "").split("\n");
  for (const field of HEADER_FIELDS) {
    const line = `- **${field}:**`;
    if (!headerLines.some((l) => l.startsWith(line))) {
      problems.push(`${path}: header is missing ${line}`);
    }
  }
  return problems;
}

function checkMergePathHolds(path: string, content: string): string[] {
  const name = referenceName(path);
  const expected = name === undefined ? 0 : (MERGE_PATH_HOLDS[name] ?? 0);
  const found = content.split(MERGE_PATH_MARKER).length - 1;
  if (found === expected) return [];
  const holds = expected === 1 ? "hold" : "holds";
  return [`${path}: expected ${expected} ${MERGE_PATH_MARKER} ${holds}, found ${found}`];
}

function checkHostCommands(path: string, content: string): string[] {
  return [...content.matchAll(HOST_COMMAND)].map(
    (m) => `${path}: host command ${m[0]} belongs in a code host reference`,
  );
}

function checkPointers(path: string, content: string): string[] {
  const headings = new Set(HEADINGS);
  const problems: string[] = [];
  for (const group of content.matchAll(/\([^()\n]*\*\*[^()\n]*\)/g)) {
    for (const span of group[0].matchAll(/\*\*([^*]+)\*\*/g)) {
      const name = span[1] ?? "";
      if (!headings.has(name)) {
        problems.push(`${path}: (**${name}**) points to no reference heading`);
      }
    }
  }
  for (const m of content.matchAll(/\bunder \*\*([^*]+)\*\*/g)) {
    problems.push(`${path}: write the pointer under **${m[1]}** as (**${m[1]}**)`);
  }
  return problems;
}

function checkHostnameTable(files: Record<string, string>): string[] {
  const references = new Set(Object.keys(files).flatMap((path) => referenceName(path) ?? []));
  const rows = (files[LANDING] ?? "")
    .split("\n")
    .filter((line) => line.startsWith("|"))
    .flatMap((line) => [...line.matchAll(/`([\w-]+\.md)`/g)].map((m) => m[1] ?? ""));
  const problems: string[] = [];
  for (const name of references) {
    if (!rows.includes(name)) {
      problems.push(`${LANDING}: Start's hostname table has no row for ${name}`);
    }
  }
  for (const name of new Set(rows)) {
    if (!references.has(name)) {
      problems.push(
        `${LANDING}: Start's hostname table names ${name}, which isn't in ${REFERENCES_DIR}`,
      );
    } else if (rows.indexOf(name) !== rows.lastIndexOf(name)) {
      problems.push(`${LANDING}: Start's hostname table lists ${name} more than once`);
    }
  }
  return problems;
}

if (import.meta.main) {
  const files: Record<string, string> = {};
  for await (const path of new Bun.Glob("skills/**/*.md").scan()) {
    files[path] = await Bun.file(path).text();
  }
  const problems = checkReferences(files);
  for (const problem of problems) console.error(problem);
  if (problems.length > 0) process.exit(1);
  console.log(`references ok (${Object.keys(files).length} files checked)`);
}
