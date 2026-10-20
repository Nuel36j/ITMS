from google import genai
from app.core.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

candidates = [
    "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",
]

for name in candidates:
    try:
        r = client.models.generate_content(model=name, contents="Say OK")
        print(f"WORKS   {name}: {r.text.strip()[:30]}")
    except Exception as e:
        print(f"FAILS   {name}: {str(e)[:120]}")