# ITMS Backend

REST API for the Industrial Training Management System, built with **FastAPI**. It handles authentication, training log storage, student profiles and AI-generated summaries.

## Tech Stack

- **FastAPI**: web framework
- **Pydantic v2**: request/response validation and settings
- **PostgreSQL**: database
- **python-jose**: JWT creation and verification
- **passlib + Argon2**: password hashing
- **google-genai**: Gemini integration for AI summaries

## Project Structure

```
backend/
├── app/
│   ├── core/          # config (Settings), database setup, security (JWT, hashing)
│   ├── crud/          # database operations
│   ├── models/        # database models (User, Log, Summary)
│   ├── routers/       # API routes: auth, user, log, summary
│   ├── schemas/       # Pydantic schemas
│   └── main.py        # application entry point
├── requirements.txt
├── .env.example
└── README.md
```

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a PostgreSQL database for the app:

```bash
psql -U postgres -c "CREATE DATABASE itms;"
```

Then create a `.env` file in `backend/`:

```env
SECRET_KEY=change-me-to-a-long-random-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
DATABASE_URL=postgresql://user:password@localhost:5432/itms
GEMINI_API_KEY=your-gemini-api-key
```

Run the server:

```bash
uvicorn app.main:app --reload
```

- API: `http://localhost:8000`
- Swagger docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

> **Running on Android?** Works in Termux or Pydroid 3. Install the dependencies there and run `uvicorn app.main:app --host 0.0.0.0 --port 8000`.

## API Overview

All routes except register and login require the header `Authorization: Bearer <token>`.

| Area | Method | Endpoint | Description |
|------|--------|----------|-------------|
| Auth | POST | `/auth/register` | Create a new account |
| Auth | POST | `/auth/login` | Log in and receive a JWT |
| User | GET | `/user/me` | Get the current user's profile |
| User | PUT | `/user/me` | Update profile |
| Logs | POST | `/logs` | Create a log entry (with chosen entry date) |
| Logs | GET | `/logs` | List logs, optionally filtered by date |
| Logs | PUT | `/logs/{id}` | Edit a log |
| Logs | DELETE | `/logs/{id}` | Delete a log |
| Summary | POST | `/summaries` | Generate a weekly or monthly AI summary |
| Summary | GET | `/summaries` | List saved summaries |

> Adjust paths above to match your actual routers. `/docs` always shows the exact current routes.

## AI Summaries

- Intervals are **weekly** or **monthly**, based on the real calendar (a working week is about six days).
- The user picks a **start date**; the default is the Monday of the current week.
- An optional **end date** lets users go back and generate a summary for any week they skipped.
- The backend collects the logs in the chosen range and sends them to Gemini to produce the summary.

## Authentication Flow

1. `POST /auth/register` stores the user with an Argon2-hashed password.
2. `POST /auth/login` verifies credentials and returns a signed JWT.
3. The client sends the token in the `Authorization` header on protected routes.

## Notes

- Tables are created on first run (or by your migrations, if you use Alembic). Never commit your `.env` file.
- The PostgreSQL driver (e.g. `psycopg3-binary`) must be listed in `requirements.txt`.
- In production, use a hosted PostgreSQL instance and set `DATABASE_URL` to its connection string.
- Enable CORS for your frontend origin in `main.py` when deploying.