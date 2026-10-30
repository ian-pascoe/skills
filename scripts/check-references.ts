// Checks that landing's code host references follow their template and that
// the skills pointing into them stay in step. `bun run check:references`.

export const REFERENCES_DIR = "skills/landing/references/";
export const LANDING = "skills/landing/SKILL.md";

/** Skills whose parenthesised bold spans, like (**Checks**), point to reference headings. */
export const POINTING_SKILLS = [LANDING, "skills/lane-landing/SKILL.md"] as const;

export const HEADINGS = [
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
] as const;

export const HEADER_FIELDS = ["Hosts", "Tool", "Exercised", "Sources", "Placeholders"] as const;

/**
 * The only places a reference may hold landing before merging. Each hold
 * guards a merge call whose behaviour is unverified, so adding or dropping
 * one is a deliberate edit here, not a side effect of rewording.
 */
export const MERGE_PATH_HOLDS: Record<string, number> = { "gitlab.md": 1 };

const MERGE_PATH_MARKER = "**Unverified (merge path)**";

/** Repo-relative path → file content. Returns one line per problem. */
export function checkReferences(files: Record<string, string>): string[] {
  const problems: string[] = [];
  for (const [path, content] of Object.entries(files)) {
    if (!path.startsWith(REFERENCES_DIR)) continue;
    const headings = [...content.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
    if (headings.join("\n") !== HEADINGS.join("\n")) {
      problems.push(`${path}: headings must be, in order: ${HEADINGS.join(", ")}`);
    }
    const header = content.split(/^## /m)[0] ?? "";
    for (const field of HEADER_FIELDS) {
      const line = `- **${field}:**`;
      if (!header.split("\n").some((l) => l.startsWith(line))) {
        problems.push(`${path}: header is missing ${line}`);
      }
    }
    const expected = MERGE_PATH_HOLDS[path.slice(REFERENCES_DIR.length)] ?? 0;
    const found = content.split(MERGE_PATH_MARKER).length - 1;
    if (found !== expected) {
      const holds = expected === 1 ? "hold" : "holds";
      problems.push(`${path}: expected ${expected} ${MERGE_PATH_MARKER} ${holds}, found ${found}`);
    }
  }
  problems.push(...checkHostnameTable(files), ...checkPointers(files), ...checkHostCommands(files));
  return problems;
}

/** A code host CLI with a subcommand, an API passthrough, or a GitHub-only term. */
const HOST_COMMAND = /`(?:gh|glab|cafe|gt|tea|fj|az|curl) [^`]*`|GraphQL|--admin\b|--auto\b/g;

function checkHostCommands(files: Record<string, string>): string[] {
  const problems: string[] = [];
  for (const [path, content] of Object.entries(files)) {
    if (!/^skills\/[^/]+\/SKILL\.md$/.test(path)) continue;
    for (const match of content.matchAll(HOST_COMMAND)) {
      problems.push(`${path}: host command ${match[0]} belongs in a code host reference`);
    }
  }
  return problems;
}

function checkPointers(files: Record<string, string>): string[] {
  const headings = new Set<string>(HEADINGS);
  const problems: string[] = [];
  for (const path of POINTING_SKILLS) {
    for (const group of (files[path] ?? "").matchAll(/\([^)]*\*\*[^)]*\)/g)) {
      for (const span of group[0].matchAll(/\*\*([^*]+)\*\*/g)) {
        const name = span[1] ?? "";
        if (!headings.has(name))
          problems.push(`${path}: (**${name}**) points to no reference heading`);
      }
    }
  }
  return problems;
}

function checkHostnameTable(files: Record<string, string>): string[] {
  const references = new Set(
    Object.keys(files)
      .filter((path) => path.startsWith(REFERENCES_DIR))
      .map((path) => path.slice(REFERENCES_DIR.length)),
  );
  const rows = new Set(
    (files[LANDING] ?? "")
      .split("\n")
      .filter((line) => line.startsWith("|"))
      .flatMap((line) => [...line.matchAll(/`([\w-]+\.md)`/g)].map((m) => m[1] ?? "")),
  );
  const problems: string[] = [];
  for (const name of references) {
    if (!rows.has(name)) problems.push(`${LANDING}: Start's hostname table has no row for ${name}`);
  }
  for (const name of rows) {
    if (!references.has(name)) {
      problems.push(
        `${LANDING}: Start's hostname table names ${name}, which isn't in ${REFERENCES_DIR}`,
      );
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
