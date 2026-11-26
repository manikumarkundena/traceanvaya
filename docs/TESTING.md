# TraceAnvaya — Testing & Quality Assurance Guide

## 1. Test Architecture

The TraceAnvaya test suite encompasses unit tests, integration tests, protocol verification, and automated regression suites.

```
backend/tests/
  ├── test_health.py           # API health, service discovery, timestamp
  ├── test_log_parser.py       # Secret redaction, regex extraction, anomalies
  ├── test_agent_tools.py      # Pydantic AI tools, shared state TEST A & TEST B
  └── test_database.py         # SQLAlchemy async persistence & relationships
```

---

## 2. Test Execution

### Running Pytest Suite
```bash
cd backend
.\.venv\Scripts\pytest -v
```

### Verified Test Cases

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

---

## 3. Playwright End-to-End Testing

To run the Playwright browser tests across Desktop (1440px), Tablet (1024px), and Mobile (390px):
```bash
cd frontend
npx playwright test
```
