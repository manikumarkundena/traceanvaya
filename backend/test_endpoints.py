import urllib.request
import urllib.error
import json

def test_endpoint(name, url, method="GET", headers=None, data=None):
    try:
        req = urllib.request.Request(url, method=method, headers=headers or {})
        if data:
            req.data = data.encode("utf-8")
        with urllib.request.urlopen(req, timeout=5) as resp:
            content = resp.read().decode("utf-8")
            print(f"[{name}] SUCCESS Status: {resp.status}, Content-Type: {resp.headers.get('content-type')}")
            print(f"[{name}] Body snippet: {content[:200]}")
            return resp.status
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        print(f"[{name}] HTTP Error {e.code}: {body[:250]}")
        return e.code
    except Exception as e:
        print(f"[{name}] Exception: {e}")
        return None

if __name__ == "__main__":
    print("Testing Frontend & CopilotKit Endpoints...")
    test_endpoint("Landing Page", "http://localhost:3000/")
    test_endpoint("Workspace Page", "http://localhost:3000/workspace")
    test_endpoint("CopilotKit GET Info", "http://localhost:3000/api/copilotkit/info")
    test_endpoint("CopilotKit GET Root", "http://localhost:3000/api/copilotkit")
    test_endpoint("CopilotKit POST Info Op", "http://localhost:3000/api/copilotkit", method="POST", headers={"Content-Type": "application/json"}, data=json.dumps({"operation": "info"}))
    test_endpoint("CopilotKit POST Empty", "http://localhost:3000/api/copilotkit", method="POST", headers={"Content-Type": "application/json"}, data="{}")
