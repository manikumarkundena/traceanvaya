import { test, expect } from "@playwright/test";

test.describe("Custom Multi-Service Investigation End-to-End (Live Gemini + CopilotKit + AG-UI)", () => {
  test("Create custom investigation with 3 log sources, analyze via Live AI, edit state, approve remediation & verify isolation", async ({
    browser,
  }) => {
    test.setTimeout(90000);
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    const aguiEvents: string[] = [];
    page.on("response", async (res) => {
      if (res.url().includes("/api/copilotkit") && res.status() === 200) {
        const ct = res.headers()["content-type"] || "";
        if (ct.includes("text/event-stream")) {
          const text = await res.text().catch(() => "");
          for (const line of text.split("\n")) {
            if (line.startsWith("data:")) {
              try {
                const evt = JSON.parse(line.slice(5).trim());
                if (evt.type && !aguiEvents.includes(evt.type)) {
                  aguiEvents.push(evt.type);
                }
              } catch {
                // ignore
              }
            }
          }
        }
      }
    });

    // 1. Open custom investigation entry
    await page.goto("/workspace?new=1");
    await expect(page.locator("text=Live AI")).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h2:has-text("Investigate your own incident")')).toBeVisible();

    await page.fill("#custom-project-input", "NovaPay Checkout");
    await page.fill("#custom-title-input", "NovaPay Checkout 504 Cascade");
    await page.fill("#custom-service-input", "checkout-api");
    await page.selectOption("#custom-severity-select", "UNKNOWN");
    await page.fill("#custom-desc-input", "504 errors on /api/pay after inventory release");

    const sourceSelect = page.locator('select[aria-label="Source label"]');
    const logTextarea = page.locator('textarea[placeholder*="Paste log lines"]');

    // Add Source 1: Frontend
    await sourceSelect.selectOption("Frontend");
    await logTextarea.fill(
      "2026-11-27T11:15:05Z ERROR [web-checkout] trace_id=req-99142 POST /api/pay returned 504 Gateway Timeout (5012ms)"
    );
    await page.click('button:has-text("Add pasted source")');

    // Add Source 2: Backend
    await sourceSelect.selectOption("Backend");
    await logTextarea.fill(
      "2026-11-27T11:15:03Z ERROR [checkout-api] trace_id=req-99142 DB statement timeout waiting for orders_lock after 5000ms"
    );
    await page.click('button:has-text("Add pasted source")');

    // Add Source 3: Database (includes credential to verify sanitized preview)
    await sourceSelect.selectOption("Database");
    await logTextarea.fill(
      "2026-11-27T11:15:01Z CRITICAL [orders-postgres] trace_id=req-99142 Deadlock on orders_table using postgresql://novapay:supersecret99@db.internal:5432/orders"
    );
    await page.click('button:has-text("Add pasted source")');

    // Inspect sanitized preview before submitting
    await page.click('button:has-text("Preview sanitized logs")');
    await expect(page.locator("text=[REDACTED_DB_PASS]")).toBeVisible();
    await page.screenshot({ path: "../screenshots/custom-e2e/custom-1-modal-sanitized.png" });

    // Submit custom investigation
    await page.click('button:has-text("Start Custom Investigation")');
    await expect(page.locator("#incident-title-input")).toHaveValue("NovaPay Checkout 504 Cascade");

    // 2. Verify zero predefined scenario evidence is present & inspect Evidence tab
    await page.locator('button:has-text("Evidence (3)"):visible').click();
    await expect(page.locator("text=HikariPool-1")).not.toBeVisible();
    await expect(page.locator("text=Deadlock on orders_table").first()).toBeVisible();
    await page.screenshot({ path: "../screenshots/custom-e2e/custom-2-evidence-sources.png" });

    // Switch back to Overview & ask Live Gemini to investigate
    await page.locator('button:has-text("Overview"):visible').click();
    const textarea = page.locator("textarea[aria-label='Message input']");
    await textarea.fill(
      "Analyze the 3 custom log sources, correlate trace req-99142 across Frontend, Backend, and Database, update the investigation findings, and add a root-cause hypothesis."
    );
    await page.locator("button[aria-label='Send message']").click();

    await expect(page.locator("text=Investigator is analyzing")).not.toBeVisible({ timeout: 35000 });
    await expect(page.locator("text=Live AI Provider Error")).not.toBeVisible();
    await page.screenshot({ path: "../screenshots/custom-e2e/custom-3-live-investigation.png" });

    // 3. Check Timeline Replay
    await page.locator('button:has-text("Timeline"):visible').click();
    await expect(page.locator("text=Step 1 of 3")).toBeVisible();
    await page.locator('button[aria-label="Step forward"]').click();
    await expect(page.locator("text=Step 2 of 3")).toBeVisible();

    // 4. Manual state edit + Turn 2 requesting remediation
    await page.locator('button:has-text("Overview"):visible').click();
    const titleInput = page.locator("#incident-title-input");
    await titleInput.fill("Custom Edited: NovaPay Deadlock 504");
    await titleInput.blur();
    await page.waitForTimeout(400);

    await page.waitForTimeout(2000);
    await textarea.fill(
      "Confirm the current incident title and propose a remediation plan for this deadlock."
    );
    await page.locator("button[aria-label='Send message']").click();
    await expect(page.locator("text=Investigator is analyzing")).not.toBeVisible({ timeout: 45000 });
    await expect(page.locator("text=NovaPay Deadlock 504").first()).toBeVisible({
      timeout: 15000,
    });

    // Approve proposed remediation (simulated audit log, no shell execution)
    const approveBtn = page.locator('button:has-text("Approve Plan")');
    await expect(approveBtn).toBeVisible({ timeout: 5000 });
    await approveBtn.click();
    await expect(page.locator("text=MITIGATED").first()).toBeVisible({ timeout: 5000 });

    // 5. Open Postmortem Studio
    await page.click('button:has-text("Postmortem Studio")');
    await expect(page.locator("text=EXPORT READY")).toBeVisible();
    await expect(page.locator("text=NovaPay Deadlock 504").last()).toBeVisible();
    await page.screenshot({ path: "../screenshots/custom-e2e/custom-4-postmortem.png" });
    await page.click('button:has-text("Close Studio")');

    // 6. Verify isolation in a second independent browser context
    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();
    await pageB.goto("/workspace?scenario=scenario-1");
    await expect(pageB.locator("#incident-title-input")).toHaveValue("Database Connection Pool Exhaustion");
    await contextB.close();

    console.log("CUSTOM_AGUI_EVENTS:", JSON.stringify(aguiEvents));
    expect(aguiEvents).toContain("RUN_STARTED");
    expect(aguiEvents).toContain("STATE_SNAPSHOT");
    expect(aguiEvents).toContain("RUN_FINISHED");

    await context.close();
  });
});
