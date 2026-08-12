import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skippedDirectories = new Set([".git", ".mintlify", "node_modules"]);
const publishedExtensions = new Set([".md", ".mdx", ".json"]);
const internalPoolTerms = [
  new RegExp(["hidden", "pools?"].join("\\s+"), "i"),
  new RegExp(["private", "pools?"].join("\\s+"), "i"),
  new RegExp(["private", "pool"].join("-"), "i"),
  new RegExp(["pool", "allowlist"].join("\\s+"), "i"),
];

async function* publishedFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory() && !skippedDirectories.has(entry.name)) {
      yield* publishedFiles(absolutePath);
    } else if (entry.isFile() && publishedExtensions.has(path.extname(entry.name))) {
      yield absolutePath;
    }
  }
}

test("published docs do not expose internal pool visibility controls", async () => {
  const offenders = [];
  for await (const absolutePath of publishedFiles(repositoryRoot)) {
    const contents = await readFile(absolutePath, "utf8");
    if (internalPoolTerms.some((term) => term.test(contents))) {
      offenders.push(path.relative(repositoryRoot, absolutePath));
    }
  }
  assert.deepEqual(offenders, []);
});
