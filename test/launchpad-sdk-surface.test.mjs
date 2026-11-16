import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), "utf8");
const forbidden = ["https://api.", "/api/", "curl ", "x-launchpad-key", "x-trader-key"];

test("Launchpad SDK guide exposes SDK methods, not the HTTP API", async () => {
  const guide = await read("guides/launchpad-sdk.mdx");
  assert.deepEqual(forbidden.filter((term) => guide.includes(term)), []);
  for (const method of ["new LaunchpadSDK", ".coins(", ".allCoins(", ".coin(", ".trades(", ".holders(", ".recentTrades(", ".quote("]) {
    assert.ok(guide.includes(method), `missing SDK method example: ${method}`);
  }
});

test("Trader SDK guide documents launchpad trading", async () => {
  const guide = await read("guides/trader-sdk.mdx");
  for (const method of ["trader.launchpad.quote(", "trader.launchpad.buy(", "trader.launchpad.sell(", "waitForIntent(", "positions()"]) {
    assert.ok(guide.includes(method), `missing launchpad method example: ${method}`);
  }
});

test("Launchpad SDK guide is in the navigation", async () => {
  const mint = JSON.parse(await read("mint.json"));
  assert.ok(mint.navigation.some((group) => group.pages.includes("guides/launchpad-sdk")));
});

test("Launchpad API guide documents every read endpoint and is in the navigation", async () => {
  const guide = await read("guides/launchpad-api.mdx");
  for (const term of ["x-launchpad-key", "/coins", "/coins/{coinId}", "/trades", "/holders", "/quote", "/trades/recent", "/config", "X-RateLimit-Remaining", "Retry-After"]) {
    assert.ok(guide.includes(term), `missing: ${term}`);
  }
  assert.ok(!guide.includes("x-trader-key"), "trader HTTP routes stay out of the docs");
  const mint = JSON.parse(await read("mint.json"));
  assert.ok(mint.navigation.some((group) => group.pages.includes("guides/launchpad-api")));
});
