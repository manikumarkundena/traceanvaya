import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

test.describe("Live Gemini AI + CopilotKit + AG-UI End-to-End Investigation", () => {
  const outputDir = path.resolve(__dirname, "../../screenshots/live-verification");

  test.beforeAll(() => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  });

  test("Complete live investigation via CopilotKit agent/run and Gemini 2.5 Flash", async ({ page }) => {
    test.setTimeout(90000);

    const copilotRequests: Array<{ method?: string; agentId?: string; stateTitle?: string }> = [];
    const sseEventTypes = new Set<string>();

    page.on("request", (req) => {
      if (req.url().includes("/api/copilotkit") && req.method() === "POST") {
        try {
          const payload = req.postDataJSON();
          copilotRequests.push({
            method: payload?.method,
            agentId: payload?.params?.agentId,
            stateTitle: payload?.body?.state?.incident_title,
          });
        } catch {
          // ignore
        }
      }
    });

    page.on("response", async (res) => {
      if (res.url().includes("/api/copilotkit") && res.status() === 200) {
        const ct = res.headers()["content-type"] || "";
        if (ct.includes("text/event-stream")) {
          try {
            const body = await res.text();
            for (const line of body.split("\n")) {
              if (line.startsWith("data:")) {
                const jsonStr = line.slice(5).trim();
                if (jsonStr && jsonStr !== "[DONE]") {
                  const evt = JSON.parse(jsonStr);
                  if (evt.type) sseEventTypes.add(evt.type);
                }
              }
            }
          } catch {
            // ignore
          }
        }
      }
    });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/workspace?scenario=scenario-1");

    // 1. Verify Live AI mode badge is active (not Demo Mode)
    await expect(page.locator("text=Live AI")).toBeVisible({ timeout: 10000 });

    // 2. Ask Gemini to analyze the incident, call tools, and update state
    const textarea = page.locator("textarea[aria-label='Message input']");
    await textarea.fill(
      "Analyze the error spike using search_logs, then call update_investigation and add_hypothesis with the root cause and evidence IDs."
    );
    await textarea.press("Enter");

    // Wait for tool execution & generation to complete
    await expect(page.locator("text=Investigator is analyzing telemetry")).toBeVisible({ timeout: 5000 });
    await expect(page.locator("text=Investigator is analyzing telemetry")).not.toBeVisible({ timeout: 45000 });

    // Verify no error banners occurred
    await expect(page.locator("text=Live AI Provider Error")).not.toBeVisible();
    await expect(page.locator("text=Authentication Error")).not.toBeVisible();
    await expect(page.locator("text=Quota / Rate Limit Exceeded")).not.toBeVisible();

    // Capture live investigation screenshot
    await page.screenshot({
      path: path.join(outputDir, "live-1-investigation.png"),
      fullPage: false,
    });

    // 3. Reverse shared-state direction: User edits Incident title -> Agent observes it
    const titleInput = page.locator("#incident-title-input");
    await titleInput.fill("Live Edited: Checkout Pool Outage");
    await page.waitForTimeout(500);

    await textarea.fill(
      "Confirm the exact current incident title from our shared state, and call propose_remediation with a safe mitigation plan."
    );
    await textarea.press("Enter");

    await expect(page.locator("text=Investigator is analyzing telemetry")).toBeVisible({ timeout: 5000 });
    await expect(page.locator("text=Investigator is analyzing telemetry")).not.toBeVisible({ timeout: 45000 });

    // Verify Gemini observed the edited incident title and no error occurred
    await expect(page.locator("text=Quota / Rate Limit Exceeded")).not.toBeVisible();
    await expect(page.locator("text=Live AI Provider Error")).not.toBeVisible();
    await expect(page.locator("text=Live Edited: Checkout Pool Outage").last()).toBeVisible({ timeout: 10000 });

    // Capture live remediation & state sync screenshot
    await page.screenshot({
      path: path.join(outputDir, "live-2-state-sync-and-remediation.png"),
      fullPage: false,
    });

    // 4. Open Postmortem Studio
    await page.locator("button:has-text('Postmortem Studio')").click();
    await expect(page.locator("text=EXPORT READY")).toBeVisible({ timeout: 5000 });
    await page.screenshot({
      path: path.join(outputDir, "live-3-postmortem.png"),
      fullPage: false,
    });

    // 5. Log & assert CopilotKit + AG-UI participation + STATE_SNAPSHOT
    console.log("COPILOTKIT_REQUESTS:", JSON.stringify(copilotRequests));
    console.log("AGUI_SSE_EVENTS:", JSON.stringify(Array.from(sseEventTypes)));

    expect(copilotRequests.some((r) => r.method === "agent/run" && r.agentId === "incidentAgent")).toBe(true);
    expect(copilotRequests.some((r) => r.stateTitle === "Live Edited: Checkout Pool Outage")).toBe(true);
    expect(sseEventTypes.has("RUN_STARTED")).toBe(true);
    expect(sseEventTypes.has("TEXT_MESSAGE_CONTENT")).toBe(true);
    expect(sseEventTypes.has("TOOL_CALL_START")).toBe(true);
    expect(sseEventTypes.has("STATE_SNAPSHOT")).toBe(true);
    expect(sseEventTypes.has("RUN_FINISHED")).toBe(true);
  });
});
