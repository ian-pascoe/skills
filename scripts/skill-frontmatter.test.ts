// Every skill's frontmatter must parse with `yaml`, the parser `npx skills add`
// uses, which skips a skill whose frontmatter fails or has a blank name or
// description. Some lenient YAML parsers accept frontmatter `yaml` rejects.
import { glob, readFile } from "node:fs/promises";
import { basename, dirname } from "node:path";
import { expect, test } from "vite-plus/test";
import { parse } from "yaml";

const skillFiles = await Array.fromAsync(glob("skills/*/SKILL.md"));

test.each(skillFiles)("%s has frontmatter `npx skills add` can parse", async (path) => {
  const frontmatter = (await readFile(path, "utf8")).match(/^---\n([\s\S]*?)\n---\n/)?.[1];
  if (frontmatter === undefined) throw new Error(`${path} has no frontmatter`);
  const { name, description } = parse(frontmatter);
  expect(name).toBe(basename(dirname(path)));
  expect(description).toBeTypeOf("string");
  expect(description.trim()).not.toBe("");
});
