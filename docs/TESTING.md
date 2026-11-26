# TraceAnvaya — Testing & Quality Assurance Guide

## 1. Test Architecture

The TraceAnvaya test suite encompasses unit tests, integration tests, protocol verification, and automated regression suites.

```
backend/tests/
  ├── test_health.py                     # API health, service discovery, timestamp
  ├── test_log_parser.py                 # Secret redaction, regex extraction, anomalies
  ├── test_agent_tools.py                # Pydantic AI tools, shared state TEST A & TEST B
  ├── test_database.py                   # SQLAlchemy async persistence & relationships
  └── test_validation_and_streaming.py   # Edge cases, session isolation, official AG-UI protocol events
```

---

## 2. Test Execution

### Running Pytest Suite
```bash
cd backend
.\.venv\Scripts\pytest -v
```

### Verified Test Cases (15/15 PASSED)

| Test Case | Description | Result |
| :--- | :--- | :--- |
| `test_health_endpoint` | Verifies `/api/health` returns healthy status and service identification | **PASSED** |
| `test_secret_redaction` | Verifies JWT tokens, API keys, and Bearer headers are redacted | **PASSED** |
| `test_severity_extraction` | Verifies heuristic severity parser correctly tags CRITICAL, FATAL, ERROR, WARN, INFO | **PASSED** |
| `test_log_parser_json_and_text` | Verifies JSON lines, syslog, and raw text logs are parsed into structured items | **PASSED** |
| `test_tool_search_logs` | Verifies agent tool `search_logs` correctly queries ingested telemetry | **PASSED** |
| `test_bidirectional_state_sync_test_a_and_b` | **TEST A & TEST B**: Agent tool updates state, and manual user state edits are received by agent | **PASSED** |
| `test_human_remediation_approval_workflow` | Verifies remediation proposals transition to PENDING approval without executing shell commands | **PASSED** |
| `test_database_persistence_and_relationships` | Verifies async SQLite/PostgreSQL schema creation, session persistence, and relational queries | **PASSED** |
| `test_empty_log_input` | Boundary test verifying empty log submissions produce clean empty results without exceptions | **PASSED** |
| `test_malformed_unstructured_lines` | Verifies arbitrary unformatted logs are safely ingested with synthesized fallback IDs | **PASSED** |
| `test_secret_redaction_comprehensive` | Comprehensive test verifying sk-live, JWT, and connection passwords are completely redacted | **PASSED** |
| `test_json_lines_parsing_and_anomaly_flagging` | Verifies JSON line logs correctly flag anomalies and parse structured severities | **PASSED** |
| `test_session_state_isolation` | Verifies complete state isolation between concurrent investigation sessions | **PASSED** |
| `test_remediation_proposal_human_gated` | Verifies human approval requirement and status transition on remediation proposals | **PASSED** |
| `test_official_event_types_verified` | Validates official `ag-ui-protocol` events (`STATE_SNAPSHOT`, `STATE_DELTA`) against enum | **PASSED** |

---

## 3. Playwright End-to-End Testing (3/3 PASSED)

Automated browser tests execute against the live application:
```bash
cd frontend
npx playwright test
```

| Playwright Test Case | Target | Verification Criteria | Result |
| :--- | :--- | :--- | :--- |
| `Landing page loads with Geist Sans font` | `GET /` | Headings, stack badges, Geist Sans typography, dark theme | **PASSED** |
| `Workspace page loads without 422 error` | `GET /workspace` | Zero 422 errors in console/UI, tabs loaded, agent initialized | **PASSED** |
| `CopilotKit runtime endpoint returns 200` | `POST /api/copilotkit` | HTTP 200 with registered `incidentAgent` (v1.90.2) | **PASSED** |
