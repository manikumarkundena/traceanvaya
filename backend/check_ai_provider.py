import pydantic_ai
print("Pydantic AI version:", pydantic_ai.__version__)

for pkg in ["google.generativeai", "google.genai", "openai", "anthropic"]:
    try:
        __import__(pkg)
        print(f"[OK] {pkg} is installed")
    except ImportError:
        print(f"[MISSING] {pkg} is NOT installed")
