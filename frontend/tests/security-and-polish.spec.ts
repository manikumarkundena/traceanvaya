import { test, expect } from "@playwright/test";

test.describe("Production Security, Sticky Navbar & Visual Polish", () => {
  test("Two independent browser contexts maintain isolated investigation sessions", async ({ browser }) => {
    const contextA = await browser.newContext();
    const contextB = await browser.newContext();

    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    await pageA.goto("/workspace?scenario=scenario-1");
    await pageB.goto("/workspace?scenario=scenario-1");

    const titleInputA = pageA.locator("#incident-title-input");
    const titleInputB = pageB.locator("#incident-title-input");

    await expect(titleInputA).toHaveValue("Database Connection Pool Exhaustion");
    await expect(titleInputB).toHaveValue("Database Connection Pool Exhaustion");

    // Context A edits its incident title and blurs to sync to backend
    await titleInputA.fill("Context A Isolated Outage");
    await titleInputA.blur();
    await pageA.waitForTimeout(500);

    // Reload Context B and confirm it still has its own isolated state
    await pageB.reload();
    await expect(titleInputB).toHaveValue("Database Connection Pool Exhaustion");

    await contextA.close();
    await contextB.close();
  });

  test("Sticky navbar stays visible while scrolling and anchor links navigate cleanly", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(600);

    await page.screenshot({ path: "../screenshots/polish-audit/after-desktop-1440.png" });

    // Scroll down to Lifecycle section
    const lifecycleLink = page.locator('nav[aria-label="Primary"] a[href="#workflow"]');
    await lifecycleLink.click();
    await page.waitForTimeout(700);

    const header = page.locator("header").first();
    const box = await header.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeLessThan(30);

    await page.screenshot({ path: "../screenshots/polish-audit/after-scrolled-navbar.png" });

    // Back-to-top button appears after substantial scroll
    const backToTop = page.locator('button[aria-label="Back to top"]');
    await expect(backToTop).toBeVisible();
    await backToTop.click();
    await page.waitForTimeout(600);

    // Mobile screenshot
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(400);
    await page.screenshot({ path: "../screenshots/polish-audit/after-mobile-390.png" });

    // Workspace screenshot
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/workspace?scenario=scenario-1");
    await expect(page.locator("#incident-title-input")).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: "../screenshots/polish-audit/after-workspace-1440.png" });
  });
});
