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

    // Verify simplified tabs (desktop visible tab bar)
    await expect(page.locator("button:visible:has-text('Overview')").first()).toBeVisible();
    await expect(page.locator("button:visible:has-text('Evidence (')").first()).toBeVisible();
    await expect(page.locator("button:visible:has-text('Timeline')").first()).toBeVisible();

    // Verify agent greeting in chat with rendered Markdown (no raw **)
    await expect(page.locator("text=Loaded telemetry for")).toBeVisible();
    await expect(page.locator("text=**Database Connection Pool Exhaustion**")).not.toBeVisible();

    const runtime422Errors = consoleErrors.filter((e) => e.includes("422"));
    expect(runtime422Errors).toHaveLength(0);
  });

  test("Workspace TEST A — Suggested prompt updates Investigation Overview and renders Markdown", async ({ page }) => {
    await page.goto("/workspace?scenario=scenario-1");

    // Click suggested prompt "Analyze the error spike"
    const promptButton = page.locator("button:has-text('Analyze the error spike')");
    await expect(promptButton).toBeVisible();
    await promptButton.click();

    // Wait for agent reasoning response (rendered Markdown heading)
    await expect(page.locator("h4:has-text('Root Cause Analysis')")).toBeVisible({ timeout: 10000 });

    // Verify tool execution badges rendered
    await expect(page.locator("text=search_logs").first()).toBeVisible();

    // Verify status was updated to Hypothesis Formed
    await expect(page.locator("header span:has-text('Hypothesis Formed')").first()).toBeVisible();
  });

  test("Workspace TEST B — User manual state edit and Remediation Review", async ({ page }) => {
    await page.goto("/workspace?scenario=scenario-1");

    // Load example investigation to populate remediation plan for review
    const loadExampleBtn = page.locator("button:has-text('Load example')");
    if (await loadExampleBtn.isVisible()) {
      await loadExampleBtn.click();
    }

    // Edit incident title
    const titleInput = page.locator("#incident-title-input");
    await expect(titleInput).toBeVisible();
    await titleInput.fill("Database Pool Starvation Incident");

    // Change severity dropdown to HIGH
    const severitySelect = page.locator("#incident-severity-select");
    await severitySelect.selectOption("HIGH");

    // Verify header updates to HIGH
    await expect(page.locator("header span:has-text('HIGH')").first()).toBeVisible();

    // Verify Remediation Review button is present and clickable
    const approveBtn = page.locator("button:has-text('Approve Plan')");
    await expect(approveBtn).toBeVisible();
    await approveBtn.click();

    // Verify status transitions to Simulated Mitigation
    await expect(page.locator("header span:has-text('Simulated Mitigation')").first()).toBeVisible();

    // Verify system notification of simulated boundary
    await expect(page.locator("text=No production infrastructure commands were executed")).toBeVisible();
  });
});
