import { test } from "@playwright/test";
import path from "path";
import fs from "fs";

test.describe("Final Release Visual Verification", () => {
  const outputDir = path.resolve(__dirname, "../../screenshots/release");

  test.beforeAll(async () => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  });

  test("Capture all 5 interactive preview states at 1440x900", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForTimeout(800);

    // 1. Investigation (default)
    await page.screenshot({
      path: path.join(outputDir, "preview-1-investigation.png"),
      fullPage: false,
    });

    // 2. Evidence Explorer
    await page.locator("nav[aria-label='Preview workspace sections'] button:has-text('Evidence Explorer')").click();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outputDir, "preview-2-evidence.png"),
      fullPage: false,
    });

    // 3. Incident Replay
    await page.locator("nav[aria-label='Preview workspace sections'] button:has-text('Incident Replay')").click();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outputDir, "preview-3-replay.png"),
      fullPage: false,
    });

    // 4. Remediation (Approved state)
    await page.locator("nav[aria-label='Preview workspace sections'] button:has-text('Remediation')").click();
    await page.locator("button:has-text('Approve Plan')").first().click();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outputDir, "preview-4-remediation.png"),
      fullPage: false,
    });

    // 5. Postmortem Studio
    await page.locator("nav[aria-label='Preview workspace sections'] button:has-text('Postmortem Studio')").click();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outputDir, "preview-5-postmortem.png"),
      fullPage: false,
    });
  });

  test("Capture desktop, tablet, and mobile viewports", async ({ page }) => {
    // 1920x1080 Landing
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/");
    await page.waitForTimeout(700);
    await page.screenshot({
      path: path.join(outputDir, "landing-1920x1080.png"),
      fullPage: false,
    });

    // 768x1024 Tablet Landing
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await page.waitForTimeout(700);
    await page.screenshot({
      path: path.join(outputDir, "landing-768x1024.png"),
      fullPage: false,
    });

    // 390x844 Mobile Landing
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForTimeout(700);
    await page.screenshot({
      path: path.join(outputDir, "landing-390x844.png"),
      fullPage: false,
    });

    // 390x844 Mobile Workspace
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/workspace?scenario=scenario-1");
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(outputDir, "workspace-390x844.png"),
      fullPage: false,
    });
  });
});
