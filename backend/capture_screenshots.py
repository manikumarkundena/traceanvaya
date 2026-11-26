import os
import subprocess

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUTPUT_DIR = r"C:\Users\ragav\.gemini\antigravity\brain\2cc6cf64-1bdb-4e84-80f1-a6cbe15929e7"
REPO_DOCS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "docs", "screenshots"))

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(REPO_DOCS_DIR, exist_ok=True)

targets = [
    ("landing_desktop_1440.png", "1440,900", "http://localhost:3000/"),
    ("landing_desktop_1920.png", "1920,1080", "http://localhost:3000/"),
    ("landing_tablet_1024.png", "1024,768", "http://localhost:3000/"),
    ("landing_mobile_390.png", "390,844", "http://localhost:3000/"),
    ("workspace_desktop_1440.png", "1440,900", "http://localhost:3000/workspace"),
    ("workspace_scenario_loaded.png", "1440,900", "http://localhost:3000/workspace?scenario=scenario-1"),
    ("workspace_mobile_390.png", "390,844", "http://localhost:3000/workspace"),
]

for filename, size, url in targets:
    out_file = os.path.join(OUTPUT_DIR, filename)
    repo_file = os.path.join(REPO_DOCS_DIR, filename)
    cmd = [
        CHROME_PATH,
        "--headless=new",
        "--disable-gpu",
        f"--window-size={size}",
        "--virtual-time-budget=3000",
        f"--screenshot={out_file}",
        url,
    ]
    print(f"Capturing {filename} ({size}) from {url}...")
    try:
        res = subprocess.run(cmd, timeout=25, capture_output=True)
        if os.path.exists(out_file) and os.path.getsize(out_file) > 0:
            print(f"  -> Success: {out_file} ({os.path.getsize(out_file)} bytes)")
            with open(out_file, "rb") as sf, open(repo_file, "wb") as df:
                df.write(sf.read())
        else:
            print(f"  -> File missing or empty: {res.stderr.decode()}")
    except Exception as e:
        print(f"  -> Error: {e}")

print("Stage 3 Screenshot capture complete!")
