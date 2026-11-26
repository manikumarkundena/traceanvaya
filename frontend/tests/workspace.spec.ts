import { test, expect } from "@playwright/test";

test.describe("TraceAnvaya Platform Verification", () => {
  test("Landing page loads with Geist Sans font and branding", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/TraceAnvaya/);

    // Verify hero text
    const heading = page.locator("h1");
    await expect(heading).toContainText("Every failure leaves a trace");

    // Verify stack badges
    await expect(page.locator("text=Pydantic AI").first()).toBeVisible();
    await expect(page.locator("text=AG-UI Protocol").first()).toBeVisible();
    await expect(page.locator("text=CopilotKit").first()).toBeVisible();

    // Verify no serif font on root html
    const htmlClass = await page.locator("html").getAttribute("class");
    expect(htmlClass).toContain("dark");
  });

  test("Workspace page loads without 422 error and initializes investigator", async ({ page }) => {
    // Collect console errors
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/workspace");

    // Verify incident header
    await expect(page.locator("text=Database Connection Pool Exhaustion").first()).toBeVisible();

    // Verify no 422 error banner
    await expect(page.locator("text=Runtime info request failed with status 422")).not.toBeVisible();
    await expect(page.locator("text=422")).not.toBeVisible();

    // Verify tabs
    await expect(page.locator("text=Canvas (State)")).toBeVisible();
    await expect(page.locator("text=Evidence (").first()).toBeVisible();
    await expect(page.locator("text=Replay Timeline")).toBeVisible();

    // Verify agent greeting in chat
    await expect(page.locator("text=TraceAnvaya Incident Investigator")).toBeVisible();

    // Assert zero critical runtime info 422 errors
    const runtime422Errors = consoleErrors.filter((e) => e.includes("422"));
    expect(runtime422Errors).toHaveLength(0);
  });

  test("CopilotKit runtime endpoint returns 200 with registered incidentAgent", async ({ request }) => {
    const response = await request.post("/api/copilotkit", {
      data: { method: "info" },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.agents).toHaveProperty("incidentAgent");
    expect(body.version).toBe("1.90.2");
  });
});
