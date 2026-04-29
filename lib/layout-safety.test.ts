import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("no fixed bottom-left floating avatar badge in app layout/components", () => {
  const files = [
    "app/layout.tsx",
    "components/NavBar.tsx",
    "app/page.tsx",
    "app/diary/page.tsx",
    "app/statistics/page.tsx",
    "app/insights/page.tsx",
    "app/settings/page.tsx",
  ];
  files.forEach((file) => {
    const content = readFileSync(file, "utf8");
    const hasFixedBottomLeft = /fixed[\s\S]{0,120}bottom-[^\s"']+[\s\S]{0,120}left-[^\s"']+/m.test(content);
    assert.equal(hasFixedBottomLeft, false, `Floating bottom-left element found in ${file}`);
  });
});
