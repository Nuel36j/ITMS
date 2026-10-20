class InvalidDateRange(Exception):
    """Start/end dates don't make sense."""

class DuplicateSummary(Exception):
    def __init__(self, message: str, summary_id: int):
        super().__init__(message)
        self.summary_id = summary_id

class SummaryGenerationFailed(Exception):
    pass

class InvalidLogDate(Exception):
    """Date isn't allowed (e.g. a Sunday)."""

class DuplicateLog(Exception):
    """A log already exists for that day."""