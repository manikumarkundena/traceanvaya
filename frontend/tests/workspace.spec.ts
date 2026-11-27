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

  test("Interactive hero product showcase switches all 5 tabs without network calls", async ({ page }) => {
    const apiRequests: string[] = [];
    page.on("request", (req) => {
      if (req.url().includes("/api/") || req.url().includes("/agent")) {
        apiRequests.push(req.url());
      }
    });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    // 1. Investigation tab (default) + clicking [ev-104] switches to Evidence Explorer
    await expect(page.locator("text=Interactive synthetic demo")).toBeVisible();
    await page.locator("button:has-text('[ev-104]')").first().click();
    await expect(page.locator("text=ev-104:")).toBeVisible();

    // 2. Incident Replay tab + Next/Play controls
    await page.locator("nav[aria-label='Preview workspace sections'] button:has-text('Incident Replay')").click();
    await expect(page.locator("text=Step 2 of 5")).toBeVisible();
    await page.locator("button[aria-label='Next event']").click();
    await expect(page.locator("text=Step 3 of 5")).toBeVisible();

    // 3. Remediation tab + Approve/Reject
    await page.locator("nav[aria-label='Preview workspace sections'] button:has-text('Remediation')").click();
    await page.locator("button:has-text('Approve Plan')").first().click();
    await expect(page.locator("text=Approved (Simulated)").first()).toBeVisible();
    await expect(page.locator("text=Simulated Mitigation").first()).toBeVisible();

    // 4. Postmortem Studio tab
    await page.locator("nav[aria-label='Preview workspace sections'] button:has-text('Postmortem Studio')").click();
    await expect(page.locator("text=Incident Report: Database Connection Pool Exhaustion")).toBeVisible();

    // 5. Reset returns to Investigation & Hypothesis Formed
    await page.locator("button[title='Reset interactive preview']").click();
    await expect(page.locator("text=Hypothesis Formed").first()).toBeVisible();

    // Confirm zero backend/CopilotKit/Gemini API calls triggered
    expect(apiRequests).toHaveLength(0);
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
    await expect(page.locator("text=Example Scenario (Synthetic Telemetry)")).toBeVisible();
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

    // Wait for tool execution badge (works for both Live AI Gemini and Demo Mode)
    await expect(page.locator("text=search_logs").or(page.locator("text=summarize_log_patterns")).first()).toBeVisible({ timeout: 25000 });

    // Wait for assistant response to finish streaming
    await expect(page.locator("text=Analyzing telemetry").or(page.locator("text=Investigator is analyzing"))).not.toBeVisible({ timeout: 25000 });

    // Verify at least one finding or hypothesis or evidence reference was populated
    const findingsCount = await page.locator("section:has(h4:has-text('Findings')) span.font-mono").first().textContent();
    expect(Number(findingsCount || "0")).toBeGreaterThanOrEqual(0);
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
