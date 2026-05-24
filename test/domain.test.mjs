import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const forbiddenDomain = ["oneswap", "xyz"].join(".");
const textExtensions = new Set([
  ".css",
  ".html",
  ".json",
  ".md",
  ".mdx",
  ".svg",
  ".txt",
  ".yaml",
  ".yml",
]);
const skippedDirectories = new Set([
  ".git",
  ".mintlify",
  "node_modules",
]);

async function* walkTextFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (!skippedDirectories.has(entry.name)) {
        yield* walkTextFiles(absolutePath);
      }
      continue;
    }

    if (entry.isFile() && textExtensions.has(path.extname(entry.name))) {
      yield absolutePath;
    }
  }
}

test("docs do not reference the retired OneSwap domain", async () => {
  const offenders = [];

  for await (const absolutePath of walkTextFiles(repositoryRoot)) {
    const contents = await readFile(absolutePath, "utf8");

    if (contents.includes(forbiddenDomain)) {
      offenders.push(path.relative(repositoryRoot, absolutePath));
    }
  }

  assert.deepEqual(offenders, []);
});
