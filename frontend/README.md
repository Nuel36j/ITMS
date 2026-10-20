# ITMS Frontend

The web client for the Industrial Training Management System, built with **Next.js (App Router)** and **Tailwind CSS v4**. It provides the landing page, authentication, dashboard, activity logs, student profile and AI summary screens.

## Tech Stack

- **Next.js** (App Router) + **React**
- **Tailwind CSS v4**
- **Zustand**: global state (including the dark/light theme)
- Talks to the ITMS FastAPI backend over REST

## Design

The UI follows the "Training Logbook" look: dark teal sidebar, cream background, serif headings and amber action buttons. A dark/light mode toggle is available on the landing page navbar, the login and signup forms, the profile settings page, and in the sidebar just above the logout link.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Log in |
| `/register` | Create an account |
| `/dashboard` | Overview of your training progress |
| `/logs` | Activity log: create, filter by date, edit, delete entries |
| `/profile` | Student profile and settings |
| `/ai` | AI summary: weekly or monthly, with optional end date |

## Project Structure

```
frontend/
├── app/
│   ├── ai/            # AI summary page
│   ├── dashboard/     # overview
│   ├── login/
│   ├── logs/          # activity log
│   ├── profile/
│   └── register/
├── components/
│   ├── auth/          # login/register forms
│   ├── layout/        # sidebar, navbar
│   └── ui/            # reusable UI elements
├── lib/               # API helpers and utilities
├── types/             # TypeScript types
└── README.md
```

## Setup

### Prerequisites

- Node.js 18+
- The ITMS backend running (see [`../backend/README.md`](../backend/README.md))

### Install and run

```bash
cd frontend
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

### Other scripts

```bash
npm run build     # production build
npm run start     # run the production build
npm run lint      # lint the code
```

## Key Features

- **Auth**: JWT stored client-side and attached to API requests
- **Activity logs**: create form with a custom date of entry, filter by date, inline edit and delete
- **AI summary**: choose weekly or monthly, pick a start date (defaults to the Monday of the current week), and optionally set an end date to backfill skipped weeks
- **Theming**: dark/light mode persisted via Zustand

## Deployment

Deploy to Vercel or any Node host. Set `NEXT_PUBLIC_API_URL` to your deployed backend URL, and make sure the backend allows your frontend origin via CORS.