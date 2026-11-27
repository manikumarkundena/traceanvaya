import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
  EmptyAdapter,
} from "@copilotkit/runtime";
import { HttpAgent } from "@ag-ui/client";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Initialize CopilotRuntime with AG-UI HttpAgent pointing to FastAPI Pydantic AI backend
const backendAgentUrl =
  process.env.BACKEND_AGENT_URL ||
  (process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/agent`
    : "http://127.0.0.1:8000/agent");

function createHandler(req: NextRequest) {
  const sessionToken = req.headers.get("x-traceanvaya-session") || "";
  const cookieHeader = req.headers.get("cookie") || "";
  const forwardHeaders: Record<string, string> = {};
  if (sessionToken) forwardHeaders["x-traceanvaya-session"] = sessionToken;
  if (cookieHeader) forwardHeaders["cookie"] = cookieHeader;

  const runtime = new CopilotRuntime({
    agents: {
      incidentAgent: new HttpAgent({
        url: backendAgentUrl,
        headers: forwardHeaders,
      }),
    },
  });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new EmptyAdapter(),
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
}

export const POST = async (req: NextRequest) => {
  return createHandler(req);
};

export const GET = async (req: NextRequest) => {
  return createHandler(req);
};
