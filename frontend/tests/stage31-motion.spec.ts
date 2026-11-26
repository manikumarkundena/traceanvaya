import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1280x800", width: 1280, height: 800 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "390x844", width: 390, height: 844 },
  { name: "360x800", width: 360, height: 800 },
] as const;

test.describe("Stage 3.1 Motion, Accessibility & Responsive Verification", () => {
  test("Respects prefers-reduced-motion and keeps all landing sections visible", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("text=SYNTHETIC DEMO").first()).toBeVisible();
    await expect(page.locator("#features")).toBeVisible();
    await expect(page.locator("#workflow")).toBeVisible();
    await expect(page.locator("#architecture")).toBeVisible();
    await expect(page.locator("#scenarios")).toBeVisible();
    await expect(page.locator("text=Open TraceAnvaya Workspace")).toBeVisible();
  });

  for (const vp of VIEWPORTS) {
    test(`No horizontal overflow on landing page at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");
      await expect(page.locator("h1")).toBeVisible();

      const hasOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth
      );
      expect(hasOverflow).toBe(false);
    });
  }

  test("Mobile menu toggle and workspace navigation work cleanly", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const menuButton = page.locator("button[aria-label='Toggle mobile menu']");
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const mobileWorkspaceLink = page.locator("a:has-text('Open Investigation Workspace')");
    await expect(mobileWorkspaceLink).toBeVisible();
  });
});
