from typing import Any, Dict, List, Optional, Tuple
from app.core.config import settings


def normalize_ollama_v1_url(base_url: str) -> str:
    cleaned = (base_url or "http://localhost:11434").strip().rstrip("/")
    if not cleaned.endswith("/v1"):
        cleaned = f"{cleaned}/v1"
    return cleaned


def is_provider_configured(provider_id: str) -> bool:
    pid = (provider_id or "").strip().lower()
    if pid == "gemini":
        return bool(settings.GEMINI_API_KEY.strip())
    if pid == "openai":
        return bool(settings.OPENAI_API_KEY.strip())
    if pid == "ollama":
        return bool(settings.OLLAMA_ENABLED or settings.AI_PROVIDER.strip().lower() == "ollama")
    return False


def get_model_name_for_provider(provider_id: str) -> str:
    pid = (provider_id or "").strip().lower()
    if pid == "gemini":
        if settings.AI_PROVIDER.strip().lower() == "gemini" and settings.AI_MODEL.strip():
            return settings.AI_MODEL.strip()
        return "gemini-3.5-flash-lite"
    if pid == "openai":
        if (
            settings.AI_PROVIDER.strip().lower() == "openai"
            and settings.AI_MODEL.strip()
            and not settings.AI_MODEL.strip().startswith("gemini")
        ):
            return settings.AI_MODEL.strip()
        return settings.OPENAI_MODEL.strip() or "gpt-4o-mini"
    if pid == "ollama":
        return settings.OLLAMA_MODEL.strip() or "llama3.1:8b"
    return "deterministic-demo"


def resolve_active_provider(requested_provider: Optional[str] = None) -> Tuple[str, str, str]:
    """
    Resolve (provider_id, model_name, mode) from requested_provider or server defaults.
    Returns mode in {"live", "local_ollama", "demo"}.
    """
    candidates: List[str] = []
    if requested_provider:
        candidates.append(requested_provider.strip().lower())
    else:
        candidates.append(settings.AI_PROVIDER.strip().lower())
        candidates.extend(["gemini", "openai", "ollama"])

    for pid in candidates:
        if pid in ("gemini", "openai") and is_provider_configured(pid):
            return pid, get_model_name_for_provider(pid), "live"
        if pid == "ollama" and is_provider_configured("ollama"):
            return "ollama", get_model_name_for_provider("ollama"), "local_ollama"

    return "demo", "deterministic-demo", "demo"


def get_provider_catalog(session_provider: Optional[str] = None) -> Dict[str, Any]:
    active_provider, active_model, mode = resolve_active_provider(session_provider)

    providers = [
        {
            "id": "gemini",
            "label": "Google Gemini",
            "configured": is_provider_configured("gemini"),
            "model": get_model_name_for_provider("gemini"),
            "kind": "hosted",
            "description": "Cloud inference via GEMINI_API_KEY (default hosted provider).",
        },
        {
            "id": "openai",
            "label": "OpenAI",
            "configured": is_provider_configured("openai"),
            "model": get_model_name_for_provider("openai"),
            "kind": "hosted",
            "description": "Cloud inference via OPENAI_API_KEY with tool-capable chat models.",
        },
        {
            "id": "ollama",
            "label": "Local Ollama",
            "configured": is_provider_configured("ollama"),
            "model": get_model_name_for_provider("ollama"),
            "kind": "local",
            "description": "Local inference via server-configured OLLAMA_BASE_URL (not reachable from remote hosted backends).",
        },
    ]

    return {
        "active_provider": active_provider,
        "active_model": active_model,
        "mode": mode,
        "ai_configured": mode in ("live", "local_ollama"),
        "providers": providers,
    }


def create_agent_model(requested_provider: Optional[str] = None):
    """
    Build a Pydantic AI model instance for the resolved provider, or TestModel for offline tests.
    Never allows caller-supplied base URLs or API keys.
    """
    pid, model_name, mode = resolve_active_provider(requested_provider)

    if pid == "gemini" and mode == "live":
        from pydantic_ai.models.google import GoogleModel
        from pydantic_ai.providers.google import GoogleProvider

        return GoogleModel(
            model_name,
            provider=GoogleProvider(api_key=settings.GEMINI_API_KEY),
        )

    if pid == "openai" and mode == "live":
        from pydantic_ai.models.openai import OpenAIChatModel
        from pydantic_ai.providers.openai import OpenAIProvider

        return OpenAIChatModel(
            model_name,
            provider=OpenAIProvider(api_key=settings.OPENAI_API_KEY),
        )

    if pid == "ollama" and mode == "local_ollama":
        from pydantic_ai.models.openai import OpenAIChatModel
        from pydantic_ai.providers.ollama import OllamaProvider

        return OpenAIChatModel(
            model_name,
            provider=OllamaProvider(base_url=normalize_ollama_v1_url(settings.OLLAMA_BASE_URL)),
        )

    # Offline / test-only fallback when no live provider is configured
    from pydantic_ai.models.test import TestModel

    return TestModel(
        custom_output_text=(
            "I have analyzed the evidence records. The logs indicate a critical failure in the affected service. "
            "Please review the Findings and Hypotheses panels for evidence-grounded details."
        )
    )
