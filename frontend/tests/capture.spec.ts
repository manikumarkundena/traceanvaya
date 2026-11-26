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

test.describe("Stage 3.3 Editorial Minimalism & Cinematic Scroll Capture", () => {
  const outputDir = path.resolve(__dirname, "../../screenshots/stage-3.3");

  test.beforeAll(async () => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  });

  for (const vp of VIEWPORTS) {
    test(`Capture landing full-page at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");
      await page.waitForTimeout(1000);
      await page.screenshot({
        path: path.join(outputDir, `landing-${vp.name}-fullpage.png`),
        fullPage: true,
      });
    });

    test(`Capture landing first-viewport at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");
      await page.waitForTimeout(800);
      await page.screenshot({
        path: path.join(outputDir, `landing-${vp.name}-viewport.png`),
        fullPage: false,
      });
    });
  }

  test("Capture detailed sections at 1440x900", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForTimeout(1000);

    // Feature bento section
    const features = page.locator("#features");
    await features.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await features.screenshot({ path: path.join(outputDir, "section-feature-bento.png") });

    // Workflow lifecycle section
    const workflow = page.locator("#workflow");
    await workflow.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await workflow.screenshot({ path: path.join(outputDir, "section-workflow.png") });

    // Architecture section
    const architecture = page.locator("#architecture");
    await architecture.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await architecture.screenshot({ path: path.join(outputDir, "section-architecture.png") });

    // Scenario library section
    const scenarios = page.locator("#scenarios");
    await scenarios.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await scenarios.screenshot({ path: path.join(outputDir, "section-scenarios.png") });
  });

  test("Capture workspace verification at 1440x900", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/workspace");
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(outputDir, `workspace-1440x900.png`),
      fullPage: false,
    });
  });

  test("Capture flagship motion showcase video clip", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForTimeout(1500);

    // Hover over CTA buttons
    const cta = page.locator("a:has-text('Start investigating')").first();
    await cta.hover();
    await page.waitForTimeout(600);

    // Scroll smoothly to Feature Bento
    await page.locator("#features").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Hover over AI Investigator dominant card
    const card = page.locator("text=AI Investigator").first();
    await card.hover();
    await page.waitForTimeout(800);

    // Scroll to Protocol & Architecture Diagram
    await page.locator("#architecture").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Scroll to Scenario Library
    await page.locator("#scenarios").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    // Navigate to Investigation Workspace
    await page.goto("/workspace");
    await page.waitForTimeout(1200);

    // Trigger state edit
    const input = page.locator("input[value='Database Connection Pool Exhaustion']");
    if (await input.isVisible()) {
      await input.fill("Database Pool Exhaustion — Stage 3.3 Editorial");
      await page.waitForTimeout(600);
    }
  });
});
