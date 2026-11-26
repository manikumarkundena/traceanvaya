import { EvidenceItem, InvestigationState } from "./types";

export interface ScenarioPreset {
  id: string;
  title: string;
  severity: string;
  service: string;
  evidence: EvidenceItem[];
  exampleCompleted: {
    findings: string[];
    hypotheses: string[];
    selected_evidence_ids: string[];
    proposed_remediations: string[];
    notes: string;
  };
}

export const SCENARIO_PRESETS: Record<string, ScenarioPreset> = {
  "scenario-1": {
    id: "scenario-1",
    title: "Database Connection Pool Exhaustion",
    severity: "CRITICAL",
    service: "order-billing-service",
    evidence: [
      {
        id: "ev-101",
        timestamp: "2026-11-26T14:15:02Z",
        service: "ingress-lb",
        severity: "INFO",
        message: "GET /api/v1/orders/health 200 OK - 2ms",
        metadata: { client_ip: "10.0.4.12" },
        raw_log: '{"id":"ev-101","service":"ingress-lb","severity":"INFO","message":"GET /api/v1/orders/health 200 OK"}',
        is_anomaly: false,
        correlated_ids: [],
      },
      {
        id: "ev-104",
        timestamp: "2026-11-26T14:15:32Z",
        service: "order-billing-service",
        severity: "WARN",
        message: "Slow query detected: SELECT * FROM ledger_entries WHERE reconciled=false FOR UPDATE (14200ms)",
        metadata: { query_hash: "a8f9c1", lock_mode: "exclusive", pid: 41920 },
        raw_log: '{"id":"ev-104","service":"order-billing-service","severity":"WARN","message":"Slow query detected (14200ms)","pid":41920}',
        is_anomaly: true,
        correlated_ids: ["ev-105", "ev-106"],
      },
      {
        id: "ev-105",
        timestamp: "2026-11-26T14:15:45Z",
        service: "order-billing-service",
        severity: "ERROR",
        message: "HikariPool-1: Connection lease timeout! Requestor thread Thread-142 waited 30002ms",
        metadata: { pool: "HikariPool-1", timeout_ms: 30000 },
        raw_log: '{"id":"ev-105","service":"order-billing-service","severity":"ERROR","message":"Connection lease timeout after 30002ms"}',
        is_anomaly: true,
        correlated_ids: ["ev-104", "ev-106"],
      },
      {
        id: "ev-106",
        timestamp: "2026-11-26T14:15:46Z",
        service: "order-billing-service",
        severity: "FATAL",
        message: "java.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available",
        metadata: { exception: "SQLTransientConnectionException" },
        raw_log: '{"id":"ev-106","service":"order-billing-service","severity":"FATAL","message":"SQLTransientConnectionException: HikariPool-1 unavailable"}',
        is_anomaly: true,
        correlated_ids: ["ev-104", "ev-105"],
      },
      {
        id: "ev-110",
        timestamp: "2026-11-26T14:16:15Z",
        service: "ingress-lb",
        severity: "CRITICAL",
        message: "HTTP 500 error spike: 42% of traffic to /api/v1/checkout returning 500 Internal Server Error",
        metadata: { error_rate: 0.42 },
        raw_log: '{"id":"ev-110","service":"ingress-lb","severity":"CRITICAL","message":"HTTP 500 error spike: 42% on /api/v1/checkout"}',
        is_anomaly: true,
        correlated_ids: ["ev-105", "ev-106"],
      },
    ],
    exampleCompleted: {
      findings: [
        "HikariCP connection pool exhausted on order-billing-service ([ev-105], [ev-106]).",
        "Unindexed batch reconciliation query ([ev-104]) held exclusive locks for 14,200ms.",
        "Checkout endpoint cascaded into a 42% HTTP 500 error spike ([ev-110]).",
      ],
      hypotheses: [
        "HikariPool-1 exhaustion caused by exclusive row-level lock on ledger_entries held by batch PID 41920.",
      ],
      selected_evidence_ids: ["ev-104", "ev-105", "ev-106", "ev-110"],
      proposed_remediations: [
        "[HIGH] Terminate locking batch process pid=41920 and increase HikariCP maximumPoolSize from 20 to 40.",
      ],
      notes: "Review HikariCP timeout configuration and add index on ledger_entries(reconciled).",
    },
  },
  "scenario-2": {
    id: "scenario-2",
    title: "Payment Gateway Timeout & Cascade",
    severity: "HIGH",
    service: "checkout-gateway",
    evidence: [
      {
        id: "ev-201",
        timestamp: "2026-11-26T15:02:10Z",
        service: "checkout-gateway",
        severity: "INFO",
        message: "POST /api/v1/payments/authorize 200 OK - 145ms",
        metadata: { provider: "stripe-upstream" },
        raw_log: '{"id":"ev-201","service":"checkout-gateway","severity":"INFO","message":"Payment authorize 200 OK (145ms)"}',
        is_anomaly: false,
        correlated_ids: [],
      },
      {
        id: "ev-203",
        timestamp: "2026-11-26T15:03:05Z",
        service: "checkout-gateway",
        severity: "WARN",
        message: "Upstream payment provider latency spike: p99=14800ms (threshold=2000ms)",
        metadata: { p99_ms: 14800 },
        raw_log: '{"id":"ev-203","service":"checkout-gateway","severity":"WARN","message":"Upstream payment latency p99=14800ms"}',
        is_anomaly: true,
        correlated_ids: ["ev-204", "ev-207"],
      },
      {
        id: "ev-204",
        timestamp: "2026-11-26T15:03:22Z",
        service: "checkout-gateway",
        severity: "ERROR",
        message: "Thread pool 'payment-worker' saturated (200/200 active threads); circuit breaker not tripped",
        metadata: { active_threads: 200, max_threads: 200 },
        raw_log: '{"id":"ev-204","service":"checkout-gateway","severity":"ERROR","message":"Thread pool payment-worker saturated 200/200"}',
        is_anomaly: true,
        correlated_ids: ["ev-203", "ev-207"],
      },
      {
        id: "ev-207",
        timestamp: "2026-11-26T15:03:40Z",
        service: "ingress-lb",
        severity: "CRITICAL",
        message: "HTTP 504 Gateway Timeout rate exceeded 35% on /api/v1/checkout",
        metadata: { status_code: 504, error_rate: 0.35 },
        raw_log: '{"id":"ev-207","service":"ingress-lb","severity":"CRITICAL","message":"HTTP 504 Gateway Timeout 35% on /api/v1/checkout"}',
        is_anomaly: true,
        correlated_ids: ["ev-203", "ev-204"],
      },
    ],
    exampleCompleted: {
      findings: [
        "Upstream payment provider latency spiked to 14,800ms ([ev-203]).",
        "Worker thread pool saturated at 200/200 active threads without circuit breaker trip ([ev-204]).",
        "Ingress load balancer returned 35% HTTP 504 Gateway Timeouts ([ev-207]).",
      ],
      hypotheses: [
        "Missing circuit breaker and overly permissive upstream timeout caused thread-pool exhaustion across checkout-gateway.",
      ],
      selected_evidence_ids: ["ev-203", "ev-204", "ev-207"],
      proposed_remediations: [
        "[MEDIUM] Enforce 3,000ms upstream client timeout and enable circuit breaker fallback at 25% error threshold.",
      ],
      notes: "Audit Resilience4j timeout and bulkhead settings for payment-worker.",
    },
  },
  "scenario-3": {
    id: "scenario-3",
    title: "Auth Token Refresh Storm",
    severity: "HIGH",
    service: "auth-service",
    evidence: [
      {
        id: "ev-301",
        timestamp: "2026-11-26T16:10:00Z",
        service: "auth-service",
        severity: "INFO",
        message: "POST /oauth/token 200 OK - client_id=mobile-ios-4.2",
        metadata: { client: "mobile-ios-4.2" },
        raw_log: '{"id":"ev-301","service":"auth-service","severity":"INFO","message":"Token refresh 200 OK"}',
        is_anomaly: false,
        correlated_ids: [],
      },
      {
        id: "ev-304",
        timestamp: "2026-11-26T16:10:42Z",
        service: "auth-service",
        severity: "WARN",
        message: "Burst refresh traffic detected from mobile-ios-4.2: 18,400 req/min (zero backoff)",
        metadata: { rpm: 18400, client: "mobile-ios-4.2" },
        raw_log: '{"id":"ev-304","service":"auth-service","severity":"WARN","message":"Burst refresh traffic 18400 req/min from mobile-ios-4.2"}',
        is_anomaly: true,
        correlated_ids: ["ev-307", "ev-312"],
      },
      {
        id: "ev-307",
        timestamp: "2026-11-26T16:10:55Z",
        service: "redis-rate-limiter",
        severity: "ERROR",
        message: "Redis rate-limit bucket exhausted for namespace auth:refresh (CPU 94%)",
        metadata: { redis_cpu: 0.94 },
        raw_log: '{"id":"ev-307","service":"redis-rate-limiter","severity":"ERROR","message":"Redis rate-limit bucket exhausted (CPU 94%)"}',
        is_anomaly: true,
        correlated_ids: ["ev-304", "ev-312"],
      },
      {
        id: "ev-312",
        timestamp: "2026-11-26T16:11:08Z",
        service: "auth-service",
        severity: "CRITICAL",
        message: "HTTP 429 Too Many Requests affecting legitimate user logins (28% rejection rate)",
        metadata: { rejection_rate: 0.28 },
        raw_log: '{"id":"ev-312","service":"auth-service","severity":"CRITICAL","message":"HTTP 429 Too Many Requests affecting 28% of logins"}',
        is_anomaly: true,
        correlated_ids: ["ev-304", "ev-307"],
      },
    ],
    exampleCompleted: {
      findings: [
        "Mobile client v4.2 triggered zero-backoff token refresh retry storm at 18,400 req/min ([ev-304]).",
        "Redis rate-limiter reached 94% CPU and exhausted token buckets ([ev-307]).",
        "28% of legitimate login requests rejected with HTTP 429 ([ev-312]).",
      ],
      hypotheses: [
        "Unthrottled mobile client retry loop overwhelmed shared Redis rate-limiting counters.",
      ],
      selected_evidence_ids: ["ev-304", "ev-307", "ev-312"],
      proposed_remediations: [
        "[MEDIUM] Isolate refresh rate-limit key for mobile-ios-4.2 and enforce Retry-After header with jitter.",
      ],
      notes: "Coordinate mobile client hotfix to add exponential backoff on 401/429 responses.",
    },
  },
};

export function createInitialCanvasState(
  sessionId: string,
  scenarioKey: string
): InvestigationState {
  const preset = SCENARIO_PRESETS[scenarioKey];
  if (!preset) {
    return {
      session_id: sessionId,
      incident_title: "Untitled Investigation",
      severity: "MEDIUM",
      status: "INVESTIGATING",
      affected_service: "unassigned",
      selected_evidence_ids: [],
      findings: [],
      hypotheses: [],
      proposed_remediations: [],
      active_remediation_approval: "NONE",
      notes: "",
    };
  }

  return {
    session_id: sessionId,
    incident_title: preset.title,
    severity: preset.severity,
    status: "INVESTIGATING",
    affected_service: preset.service,
    selected_evidence_ids: [],
    findings: [],
    hypotheses: [],
    proposed_remediations: [],
    active_remediation_approval: "NONE",
    notes: "",
  };
}
