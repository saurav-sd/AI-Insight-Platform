import google.generativeai as genai
from app.core.config import settings
from app.core.config import AI_MODE
from app.services.cache_service import get_cached_response, save_response
from app.services.mock_ai import get_mock_insight


model = genai.GenerativeModel(settings.MODEL_NAME)


# 🔥 Core AI Caller
def call_ai(prompt: str):
    if AI_MODE == "mock":
        return get_mock_insight()

    elif AI_MODE == "gemini":
        response = model.generate_content(prompt)
        return response.text

    elif AI_MODE == "ollama":
        return "Ollama not implemented yet"

    return "Invalid AI mode"


# ⚡ Cache Wrapper
def call_ai_with_cache(prompt: str, db):
    cached = get_cached_response(db, prompt)

    if cached:
        print("⚡ Cache HIT")
        return cached.response

    print("🤖 Cache MISS → calling AI")

    response = call_ai(prompt)

    save_response(db, prompt, response)

    return response


def format_insight_text(raw_text: str):
    lines = raw_text.split("\n")

    insights = []
    suggestions = []
    current = "insights"

    for line in lines:
        line = line.strip()

        if not line:
            continue

        if "suggestion" in line.lower():
            current = "suggestions"
            continue

        # remove "-", "•", etc.
        cleaned = line.lstrip("-• ").strip()

        if current == "insights":
            insights.append(cleaned)
        else:
            suggestions.append(cleaned)

    return {
        "insights": insights,
        "trends": [],
        "issues": [],
        "suggestions": suggestions
    }

def generate_insight(data, db=None):
    prompt = f"""
    You are a product analytics expert.

    Analyze this data:

    {data}

    Return ONLY bullet points:

    Insights:
    - ...

    Suggestions:
    - ...
    """

    if AI_MODE == "mock":
        return get_mock_insight()

    elif AI_MODE == "gemini":
        raw = model.generate_content(prompt).text

        formatted = format_insight_text(raw)  # ✅ FIX

        return formatted