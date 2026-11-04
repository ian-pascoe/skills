// Every skill's frontmatter must parse with `yaml`, the parser `npx skills add`
// uses, which skips a skill whose frontmatter fails or has a blank name or
// description. Bun's own YAML parser accepts some frontmatter `yaml` rejects.
import { basename, dirname } from "node:path";
import { expect, test } from "bun:test";
import { parse } from "yaml";

const skillFiles = await Array.fromAsync(new Bun.Glob("skills/*/SKILL.md").scan());

test.each(skillFiles)("%s has frontmatter `npx skills add` can parse", async (path) => {
  const frontmatter = (await Bun.file(path).text()).match(/^---\n([\s\S]*?)\n---\n/)?.[1];
  if (frontmatter === undefined) throw new Error(`${path} has no frontmatter`);
  const { name, description } = parse(frontmatter);
  expect(name).toBe(basename(dirname(path)));
  expect(description).toBeString();
  expect(description.trim()).not.toBe("");
});
