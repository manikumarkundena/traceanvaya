# TraceAnvaya — Design Decisions & Tradeoffs

## 1. Why AG-UI Protocol and CopilotKit?

### The Problem
Traditional AI agent applications suffer from one of two failure modes:
1. **Generic Chat Disconnect**: The LLM streams text in a chat bubble, but the surrounding dashboard remains completely static. The user must manually read and apply changes.
2. **Fragile Custom WebSockets**: Teams invent ad-hoc JSON protocols over WebSockets for tool execution and UI state, resulting in brittle event synchronization, dropped connections, and non-standard streaming.

### The Solution
The open **AG-UI Protocol** (Agent-User Interaction Protocol) provides a standardized, framework-agnostic event model over Server-Sent Events (SSE). By pairing **Pydantic AI** (using `AGUIAdapter` and `StateDeps`) with **CopilotKit** on the frontend, TraceAnvaya gains:
- Bidirectional state synchronization out of the box.
- Standardized tool call streams (`TOOL_CALL_START`, `TOOL_CALL_DELTA`, `TOOL_CALL_END`).
- Streaming token deltas with low latency.
- Full type safety on both ends: Pydantic v2 on the Python backend, TypeScript + Zod on the Next.js frontend.

---

## 2. Shared State: Server-Owned vs Client-Editable

### Separation of Concerns
In incident management, conflating raw telemetry with operator hypotheses causes critical data loss:
- **Durable Server-Owned Telemetry**: Log entries, timestamps, and anomaly detections are immutable. Neither the user nor the AI can alter historical log facts.
- **Client-Editable Investigation State (`InvestigationState`)**: Incident title, assigned severity, active hypotheses, and notes are mutable.
  - When the agent discovers a connection pool exhaustion, it invokes `update_investigation()` or `add_hypothesis()`, directly updating the canvas.
  - When a human engineer reviews the canvas and adjusts the severity from `HIGH` to `CRITICAL` or clarifies the title, this state is sent back to the agent in `StateDeps`. The agent immediately incorporates the human edit on subsequent turns (verifying TEST B).

---

## 3. Human-in-the-Loop vs Autonomous Execution

### Security Boundary
In production environments, autonomous agents must **never** execute destructive infrastructure commands (e.g. killing processes, dropping connections, scaling pods) without supervised human authorization.

TraceAnvaya enforces a strict Human Approval Gate:
1. Agent analyzes the failure and calls `propose_remediation()`.
2. The proposal is registered in the canvas with a risk assessment (`LOW`, `MEDIUM`, `HIGH`) and step-by-step rationale.
3. The platform transitions `active_remediation_approval` to `PENDING`.
4. The human engineer reviews the plan and clicks **Approve** or **Reject**.
5. The decision is recorded in the permanent audit trail without arbitrary shell command execution.

---

## 4. Model Selection & Fallback Architecture

TraceAnvaya is configured to run with:
- **Primary**: Google Gemini (`gemini-2.0-flash` or `gemini-1.5-pro`) via `google-gla`.
- **Secondary**: OpenAI (`gpt-4o`) via `openai`.
- **Deterministic Test Mode**: Pydantic AI's `TestModel` for automated unit and integration tests.
This ensures the platform can be comprehensively verified in zero-cost, offline CI environments without requiring external API keys.
