// Every skill's frontmatter must parse with `yaml`, the parser the `skills`
// installer uses; Bun's own YAML parser accepts some frontmatter it rejects.
import { expect, test } from "bun:test";
import { parse } from "yaml";

const skills = await Array.fromAsync(new Bun.Glob("skills/*/SKILL.md").scan());

test.each(skills)("%s has frontmatter the installer can parse", async (path) => {
  const frontmatter = (await Bun.file(path).text()).match(/^---\n([\s\S]*?)\n---\n/)?.[1];
  expect(frontmatter).toBeDefined();
  const { name, description } = parse(frontmatter ?? "");
  expect(name).toBe(path.split("/")[1]);
  expect(typeof description).toBe("string");
});
