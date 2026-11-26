import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
  EmptyAdapter,
} from "@copilotkit/runtime";
import { HttpAgent } from "@ag-ui/client";

// Initialize CopilotRuntime with AG-UI HttpAgent pointing to FastAPI Pydantic AI backend
const backendAgentUrl =
  process.env.BACKEND_AGENT_URL || "http://127.0.0.1:8000/agent";

const runtime = new CopilotRuntime({
  agents: {
    incidentAgent: new HttpAgent({
      url: backendAgentUrl,
    }),
  },
});

const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
  runtime,
  serviceAdapter: new EmptyAdapter(),
  endpoint: "/api/copilotkit",
});

export const POST = async (req: NextRequest) => {
  return handleRequest(req);
};

export const GET = async (req: NextRequest) => {
  return handleRequest(req);
};
