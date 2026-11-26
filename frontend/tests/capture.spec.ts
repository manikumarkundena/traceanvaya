import { test } from "@playwright/test";
import path from "path";
import fs from "fs";

const VIEWPORTS = [
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1280x800", width: 1280, height: 800 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "390x844", width: 390, height: 844 },
  { name: "360x800", width: 360, height: 800 },
];

test.describe("Stage 3.1 Visual & Responsive Artifact Capture", () => {
  const outputDir = path.resolve(__dirname, "../../screenshots/stage-3.1");

  test.beforeAll(async () => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  });

  for (const vp of VIEWPORTS) {
    test(`Capture landing page at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");
      await page.waitForTimeout(1400); // Allow hero reveals & living constellation to settle
      await page.screenshot({
        path: path.join(outputDir, `landing-${vp.name}.png`),
        fullPage: true,
      });
    });

    test(`Capture workspace at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/workspace");
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: path.join(outputDir, `workspace-${vp.name}.png`),
        fullPage: false,
      });
    });
  }

  test("Capture video clip demonstrating hero motion, living constellation, and hover effects", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForTimeout(2000);

    // Hover over CTA buttons
    const cta = page.locator("a:has-text('Start investigating')").first();
    await cta.hover();
    await page.waitForTimeout(800);

    // Scroll to Tech Strip and Feature Bento
    await page.locator("#features").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);

    // Hover over AI Investigator card
    const card = page.locator("text=AI Investigator").first();
    await card.hover();
    await page.waitForTimeout(1000);

    // Scroll to Protocol & Architecture
    await page.locator("#architecture").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    // Navigate to Workspace
    await page.goto("/workspace");
    await page.waitForTimeout(1500);

    // Trigger state edit
    const input = page.locator("input[value='Database Connection Pool Exhaustion']");
    if (await input.isVisible()) {
      await input.fill("Database Pool Exhaustion - Live Motion Test");
      await page.waitForTimeout(800);
    }
  });
});
