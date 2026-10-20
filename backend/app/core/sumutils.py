from calendar import monthrange
from datetime import date, datetime, time, timedelta
from google import genai
from google.genai import errors

from typing import List, Tuple
import logging

from app.core.exceptions import InvalidDateRange
from app.models.log import Log
from app.core.config import settings


logger = logging.getLogger(__name__)

client = genai.Client(api_key=settings.GEMINI_API_KEY)  # use your actual setting name

def get_default_week_start(today: date | None = None) -> date:
    today = today or date.today()
    return today - timedelta(days=today.weekday())




MAX_DAYS = {"weekly": 7, "monthly": 31}

def get_interval_bounds(start_date, interval_type, end_date=None):
    if interval_type not in MAX_DAYS:
        raise InvalidDateRange("Interval must be 'weekly' or 'monthly'.")

    if end_date is None:  # fall back to the old automatic behaviour
        if interval_type == "weekly":
            end_date = get_default_week_start(start_date) + timedelta(days=5)
        else:
            end_date = date(start_date.year, start_date.month,
                            monthrange(start_date.year, start_date.month)[1])

    if end_date < start_date:
        raise InvalidDateRange("End date can't be before the start date.")

    if (end_date - start_date).days + 1 > MAX_DAYS[interval_type]:
        raise InvalidDateRange(
            f"A {interval_type} summary can cover at most {MAX_DAYS[interval_type]} days."
        )

    return start_date, end_date  # both INCLUSIVE


def generate_with_fallback(contents, config, retries=3):
    last_err = None
    for model in settings.model_chain:
        for attempt in range(retries):
            try:
                return client.models.generate_content(
                    model=model, contents=contents, config=config
                )
            except errors.ServerError as e:            # 5xx: overloaded, back off and retry
                last_err = e
                logger.warning("%s unavailable (attempt %d): %s", model, attempt + 1, e)
                time.sleep(2 ** attempt)
            except errors.ClientError as e:
                if e.code in (403, 404, 429):          # no access, retired, or rate limited: next model
                    last_err = e
                    logger.warning("%s skipped (%s)", model, e.code)
                    break
                raise                                   # bad request etc.: retrying won't help
    raise last_err


def summarize_data(logs: List[Log]) -> Optional[str]:
    entries = [
        f"{log.date:%a %d %b}: {log.daily_activity.strip()}"  # adjust date field name
        for log in logs if log.daily_activity
    ]
    if not entries:
        return "No data available for this interval."

    try:
        response = generate_with_fallback(
            contents="Summarize these industrial training log entries:\n" + "\n".join(entries),
            config={
                "system_instruction": (
                    "You summarize a student's industrial training logbook. "
                    "Highlight main tasks, skills practiced, and progress. Be concise."
                ),
            },
        )
    except Exception:
        logger.exception("Gemini summary failed")
        return None

    return (response.text or "").strip()