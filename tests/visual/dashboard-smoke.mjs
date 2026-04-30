import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const OUTPUT_DIR = join(process.cwd(), "tests", "visual");
const widths = [1440, 1280, 1024, 900, 768, 414];
const storageStatePath = join(process.cwd(), "tests", "visual", "storage-state.json");

mkdirSync(OUTPUT_DIR, { recursive: true });

for (const width of widths) {
  const outputPath = join(OUTPUT_DIR, `dashboard-${width}.png`);
  execSync(
    `npx playwright screenshot --browser chromium --viewport-size "${width},1000" --load-storage "${storageStatePath}" --wait-for-timeout 1000 --full-page http://localhost:3000/app "${outputPath}"`,
    { stdio: "inherit" },
  );
}
