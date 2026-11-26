import { NextRequest } from "next/server";

/**
 * Next.js CopilotRuntime proxy endpoint.
 * Directs CopilotKit frontend events to the Python FastAPI backend
 * running the Pydantic AI agent with AG-UI protocol adapter.
 */
export async function POST(req: NextRequest) {
  const backendUrl = process.env.BACKEND_AGENT_URL || "http://127.0.0.1:8000/agent";
  
  try {
    const body = await req.arrayBuffer();
    const contentType = req.headers.get("content-type") || "application/json";
    const accept = req.headers.get("accept") || "text/event-stream";

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        "Accept": accept,
      },
      body: body,
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(errText, {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Stream AG-UI SSE protocol directly to CopilotKit frontend
    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("content-type") || "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to connect to TraceAnvaya backend agent",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({
      service: "TraceAnvaya CopilotRuntime",
      status: "operational",
      target: "http://127.0.0.1:8000/agent",
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
