import urllib.request
import urllib.error
import json

def test_copilot_methods():
    methods = [
        "info", 
        "get_info", 
        "runtime_info", 
        "agents", 
        "list_agents", 
        "agent", 
        "generateCopilotResponse",
        "agentRuntimes",
        "agent/info",
        "chat"
    ]
    for method_name in methods:
        req = urllib.request.Request(
            "http://localhost:3000/api/copilotkit",
            method="POST",
            headers={"Content-Type": "application/json"},
            data=json.dumps({"method": method_name}).encode("utf-8")
        )
        try:
            with urllib.request.urlopen(req, timeout=5) as resp:
                print(f"SUCCESS {method_name} -> {resp.status}: {resp.read().decode('utf-8')[:200]}")
        except urllib.error.HTTPError as e:
            print(f"FAILED {method_name} -> {e.code}: {e.read().decode('utf-8', errors='replace')[:200]}")

if __name__ == "__main__":
    test_copilot_methods()
