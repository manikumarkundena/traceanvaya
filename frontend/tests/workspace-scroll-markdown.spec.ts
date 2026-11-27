import { test, expect } from "@playwright/test";

test.describe("Workspace Scrolling, Smart Auto-Scroll & Markdown Typography", () => {
  test("Independent panel scrolling, composer visibility, Markdown H4 & nested lists, and mobile layout", async ({
    page,
  }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width: 1440, height: 820 });
    await page.goto("/workspace?scenario=scenario-1");
    await expect(page.locator("text=Live AI")).toBeVisible({ timeout: 10000 });

    // Send a prompt requesting structured headings (####) and nested numbered lists
    const textarea = page.locator("textarea[aria-label='Message input']");
    await textarea.fill(
      "Provide a detailed analysis using a #### Key Findings & Timeline heading and a numbered list (1., 2., 3.) with nested bullet points citing [ev-104], [ev-105], and [ev-110]. Also update findings and propose a remediation."
    );
    await page.locator("button[aria-label='Send message']").click();
    await expect(page.locator("text=Investigator is analyzing")).not.toBeVisible({ timeout: 45000 });
    await expect(page.locator("text=Live AI Provider Error")).not.toBeVisible();

    // Verify #### heading rendered as an actual HTML heading (not raw #### in assistant response)
    await expect(page.locator("h1, h2, h3, h4, h5, h6").filter({ hasText: "Key Findings" }).first()).toBeVisible();
    await expect(page.locator("text=#### Key Findings")).toHaveCount(1); // Only in the user's prompt bubble

    // Verify chat container is scrollable and independent from right canvas
    const chatScroll = page.locator('[aria-label="Investigation conversation"]');
    const canvasScroll = page.locator('[aria-label="Investigation overview"]');

    const chatMetrics = await chatScroll.evaluate((el) => ({
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
      scrollTop: el.scrollTop,
    }));
    expect(chatMetrics.scrollHeight).toBeGreaterThan(chatMetrics.clientHeight);

    // Scroll upward in chat -> Jump to latest appears and right canvas stays at 0
    await chatScroll.evaluate((el) => {
      el.scrollTop = 0;
      el.dispatchEvent(new Event("scroll"));
    });
    const jumpBtn = page.locator('button:has-text("Jump to latest")');
    await expect(jumpBtn).toBeVisible();

    const canvasTopBefore = await canvasScroll.evaluate((el) => el.scrollTop);
    expect(canvasTopBefore).toBe(0);

    // Scroll right canvas independently -> chat scrollTop stays at 0
    await canvasScroll.evaluate((el) => {
      el.scrollTop = 180;
    });
    const chatTopAfterCanvasScroll = await chatScroll.evaluate((el) => el.scrollTop);
    expect(chatTopAfterCanvasScroll).toBe(0);

    // Composer and header remain visible inside viewport
    const headerBox = await page.locator("header").first().boundingBox();
    const composerBox = await textarea.boundingBox();
    expect(headerBox!.y).toBe(0);
    expect(composerBox!.y + composerBox!.height).toBeLessThanOrEqual(820);

    // Click Jump to latest -> scrolls back down and hides button
    await jumpBtn.click();
    await page.waitForTimeout(350);
    await expect(jumpBtn).not.toBeVisible();

    await page.screenshot({ path: "../screenshots/scroll-polish/workspace-desktop-1440.png" });

    // Mobile viewport check (390x844): composer visible, no horizontal overflow
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    const mobileComposerBox = await textarea.boundingBox();
    expect(mobileComposerBox).not.toBeNull();
    expect(mobileComposerBox!.y + mobileComposerBox!.height).toBeLessThanOrEqual(844);

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(hasHorizontalOverflow).toBe(false);

    await page.screenshot({ path: "../screenshots/scroll-polish/workspace-mobile-390.png" });
  });
});
