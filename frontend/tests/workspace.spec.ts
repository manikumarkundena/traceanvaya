import { test, expect } from "@playwright/test";

test.describe("TraceAnvaya Platform Verification", () => {
  test("Landing page loads with signature cinematic hero, product showcase and Geist font", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/TraceAnvaya/);

    // Verify signature hero text
    const heading = page.locator("h1");
    await expect(heading).toContainText("Every failure");
    await expect(heading).toContainText("leaves a trace.");
    await expect(heading).toContainText("Find the connection.");

    // Verify product showcase window
    await expect(page.locator("text=TraceAnvaya / Investigation workspace")).toBeVisible();
    await expect(page.locator("text=SYNTHETIC DEMO").first()).toBeVisible();

    // Verify stack badges
    await expect(page.locator("text=Pydantic AI").first()).toBeVisible();
    await expect(page.locator("text=AG-UI Protocol").first()).toBeVisible();
    await expect(page.locator("text=CopilotKit").first()).toBeVisible();

    // Verify dark theme
    const htmlClass = await page.locator("html").getAttribute("class");
    expect(htmlClass).toContain("dark");
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

  test("Workspace page loads without 422 error and initializes investigator", async ({ page }) => {
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

    const runtime422Errors = consoleErrors.filter((e) => e.includes("422"));
    expect(runtime422Errors).toHaveLength(0);
  });

  test("Workspace TEST A — Agent tool execution updates Investigation Canvas", async ({ page }) => {
    await page.goto("/workspace?scenario=scenario-1");

    // Click quick prompt "Analyze root cause of 500 spike"
    const promptButton = page.locator("button:has-text('Analyze root cause of 500 spike')");
    await expect(promptButton).toBeVisible();
    await promptButton.click();

    // Wait for agent reasoning response
    await expect(page.locator("text=Root Cause Analysis & Diagnostic Trace")).toBeVisible({ timeout: 10000 });

    // Verify tool execution badges rendered
    await expect(page.locator("text=tool: search_logs").first()).toBeVisible();

    // Verify canvas status was updated by agent to HYPOTHESIS_FORMED
    await expect(page.locator("text=HYPOTHESIS_FORMED").first()).toBeVisible();
  });

  test("Workspace TEST B — User manual state edit and Human Approval Gate", async ({ page }) => {
    await page.goto("/workspace?scenario=scenario-1");

    // Ensure on Canvas tab
    await page.locator("button:has-text('Canvas (State)')").click();

    // Edit incident title
    const titleInput = page.locator("input[value='Database Connection Pool Exhaustion']");
    await expect(titleInput).toBeVisible();
    await titleInput.fill("Database Pool Starvation Incident");

    // Change severity dropdown to HIGH
    const severitySelect = page.locator("select").nth(1);
    await severitySelect.selectOption("HIGH");

    // Verify header updates to HIGH
    await expect(page.locator("header span:has-text('HIGH')").first()).toBeVisible();

    // Verify Human Approval Gate button is present
    const approveBtn = page.locator("button:has-text('Approve Mitigation')");
    await expect(approveBtn).toBeVisible();
    await approveBtn.click();

    // Verify status transitions to MITIGATED
    await expect(page.locator("header span:has-text('MITIGATED')").first()).toBeVisible();

    // Verify system notification of human approval
    await expect(page.locator("text=Zero shell commands were executed directly")).toBeVisible();
  });
});
