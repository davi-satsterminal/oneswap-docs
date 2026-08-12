import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const guideUrl = new URL("../guides/trader-sdk.mdx", import.meta.url);

test("Trader SDK guide exposes SDK methods, not the HTTP API", async () => {
  const guide = await readFile(guideUrl, "utf8");
  const forbidden = ["https://api.", "/api/", "curl ", "x-trader-key", "## Other endpoints"];
  assert.deepEqual(forbidden.filter((term) => guide.includes(term)), []);
  for (const method of ["new TraderSDK", ".pools()", ".balances()", ".quote(", ".swap(", ".history(", ".tokens(", ".intent("]) {
    assert.ok(guide.includes(method), `missing SDK method example: ${method}`);
  }
});
