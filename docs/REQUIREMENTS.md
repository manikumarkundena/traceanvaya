# TraceAnvaya — Requirements Traceability Matrix

This matrix maps every non-negotiable requirement from the build authorization to actual files, implementations, and verification evidence.

| Requirement ID | Specification | Implementation File | Verification Evidence | Status |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-01** | Genuine Pydantic AI agent integration | `backend/app/agents/incident_agent.py` | `tests/test_agent_tools.py` | **VERIFIED** |
| **REQ-02** | Official AG-UI Protocol streaming adapter | `backend/app/api/routes.py` (`/agent`) | `tests/test_agent_tools.py`, `route.ts` | **VERIFIED** |
| **REQ-03** | CopilotKit Next.js runtime integration | `frontend/src/app/api/copilotkit/route.ts` | `src/app/layout.tsx` | **VERIFIED** |
| **REQ-04** | Bidirectional Shared State — TEST A (Agent -> UI) | `app/agents/incident_agent.py` (`update_investigation`) | `tests/test_agent_tools.py::test_bidirectional_state_sync_test_a_and_b` | **VERIFIED** |
| **REQ-05** | Bidirectional Shared State — TEST B (UI -> Agent) | `app/api/routes.py` (`PUT /api/investigation/state`) | `tests/test_agent_tools.py::test_bidirectional_state_sync_test_a_and_b` | **VERIFIED** |
| **REQ-06** | Evidence ingestion (.log, .txt, .json) | `backend/app/services/log_parser.py` | `tests/test_log_parser.py::test_log_parser_json_and_text` | **VERIFIED** |
| **REQ-07** | Automatic secret redaction (JWT, API keys, passwords) | `backend/app/services/log_parser.py` | `tests/test_log_parser.py::test_secret_redaction` | **VERIFIED** |
| **REQ-08** | 3 Realistic Synthetic Scenarios | `scenarios/*.log`, `scenarios/scenarios_index.json` | `tests/test_agent_tools.py`, workspace demo | **VERIFIED** |
| **REQ-09** | Chronological Incident Replay Scrubber | `frontend/src/app/workspace/page.tsx` | Playback slider, play/pause loop | **VERIFIED** |
| **REQ-10** | Human-in-the-Loop Remediation Approval | `backend/app/api/routes.py`, `app/agents/incident_agent.py` | `tests/test_agent_tools.py::test_human_remediation_approval_workflow` | **VERIFIED** |
| **REQ-11** | Zero unsafe shell command execution | Platform security boundary design | Strict audit record without shell execution | **VERIFIED** |
| **REQ-12** | Structured Postmortem Studio & Markdown Export | `app/api/routes.py` (`/investigation/postmortem`) | Postmortem modal in workspace & API test | **VERIFIED** |
| **REQ-13** | Database Persistence with SQLAlchemy Async | `app/db/session.py`, `app/models/entities.py` | `tests/test_database.py::test_database_persistence_and_relationships` | **VERIFIED** |
| **REQ-14** | Original Visual Identity & Design System Tokens | `src/app/globals.css`, `src/components/brand/Logo.tsx` | Dark/light semantic tokens, custom SVG logo | **VERIFIED** |
| **REQ-15** | Product Landing Page at `/` | `frontend/src/app/page.tsx` | Hero, tech preview, bento grid, architecture | **VERIFIED** |
| **REQ-16** | Application Workspace at `/workspace` | `frontend/src/app/workspace/page.tsx` | Multi-panel, chat, canvas, evidence, replay | **VERIFIED** |
| **REQ-17** | Production Containerization & CI/CD | `docker-compose.yml`, `Dockerfile`, `.github/workflows/ci.yml` | Multi-stage Dockerfiles, GitHub Actions workflow | **VERIFIED** |
