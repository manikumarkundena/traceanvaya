import { test } from "@playwright/test";
import path from "path";
import fs from "fs";

test.describe("Final Portfolio Deliverables Visual Capture", () => {
  const outputDir = path.resolve(__dirname, "../../screenshots/final");

  test.beforeAll(async () => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  });

  test("Capture landing desktop and mobile viewports", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(outputDir, "landing-1440x900-viewport.png"),
      fullPage: false,
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(outputDir, "landing-mobile-390x844.png"),
      fullPage: false,
    });
  });

  test("Capture complete workspace journey screenshots", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/workspace?scenario=scenario-1");
    await page.waitForTimeout(1000);

    // 1. Workspace initial state
    await page.screenshot({
      path: path.join(outputDir, "workspace-initial-1440x900.png"),
      fullPage: false,
    });

    // 2. Active investigation (click suggested prompt)
    await page.locator("button:has-text('Analyze the error spike')").click();
    await page.locator("h4:has-text('Root Cause Analysis')").waitFor({ state: "visible", timeout: 10000 });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(outputDir, "workspace-active-investigation.png"),
      fullPage: false,
    });

    // 3. Remediation review (click Propose a remediation plan)
    await page.locator("button:has-text('Propose a remediation plan')").click();
    await page.locator("button:has-text('Approve Plan')").waitFor({ state: "visible", timeout: 10000 });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(outputDir, "workspace-remediation-review.png"),
      fullPage: false,
    });

    // 4. Evidence Explorer
    await page.locator("button:visible:has-text('Evidence (')").first().click();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(outputDir, "workspace-evidence-explorer.png"),
      fullPage: false,
    });

    // 5. Replay Timeline
    await page.locator("button:visible:has-text('Timeline')").first().click();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(outputDir, "workspace-replay-timeline.png"),
      fullPage: false,
    });

    // 6. Postmortem Studio
    await page.locator("button:has-text('Postmortem Studio')").click();
    await page.locator("text=EXPORT READY").waitFor({ state: "visible", timeout: 5000 });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(outputDir, "workspace-postmortem-studio.png"),
      fullPage: false,
    });
  });

  test("Capture mobile workspace screenshot", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/workspace?scenario=scenario-1");
    await page.waitForTimeout(900);
    await page.screenshot({
      path: path.join(outputDir, "workspace-mobile-390x844.png"),
      fullPage: false,
    });
  });
});
