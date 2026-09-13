# Arbindra's AI Chat

A full-stack chat app — React/Vite frontend + Express/MongoDB backend —
talking to the OpenAI API with streamed responses.

This is a modernized rebuild of the original project. See `CHANGES.md` for
exactly what changed and why.

## Structure

```
backend/    Express + TypeScript + MongoDB API (streams replies via SSE)
frontend/   React + TypeScript + Vite + MUI
```

## Quick start

```bash
# Backend
cd backend
npm install
cp .env.example .env   # fill in MongoDB URL, OpenAI key, secrets
npm run dev             # http://localhost:5000

# Frontend (separate terminal)
cd frontend
npm install
cp .env.example .env   # VITE_API_URL — defaults to localhost:5000 already
npm run dev             # http://localhost:5173
```

Open http://localhost:5173, sign up, and start chatting.

## Deploying

Each folder deploys independently (e.g. two separate Vercel projects, as
the original was set up). Whichever host you use:

- Backend: set every variable from `backend/.env.example` in your host's
  environment settings, especially `NODE_ENV=production` and `CLIENT_URL`
  (your deployed frontend's exact origin — auth cookies won't work across
  domains without this being set correctly, see `backend/README.md`).
- Frontend: set `VITE_API_URL` to your deployed backend's `/api/v1` URL.

## What model it uses

`OPENAI_MODEL` in the backend `.env` (defaults to `gpt-5-mini`). OpenAI's
lineup moves fast — this is a one-line env change whenever you want to
point it at something else.
