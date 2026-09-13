# AI Chat — backend

Express + TypeScript + MongoDB API for the chat app, backed by the OpenAI API
with streamed responses.

## Setup

```bash
npm install
cp .env.example .env   # then fill in real values
npm run dev             # http://localhost:5000
```

## Scripts

- `npm run dev` — watch mode (tsc --watch + nodemon)
- `npm run build` — compile to `dist/`
- `npm start` — run the compiled build

## API

All routes are prefixed with `/api/v1`.

| Method | Route             | Auth | Description                                  |
| ------ | ----------------- | ---- | --------------------------------------------- |
| POST   | `/user/signup`     | –    | Create an account, sets an auth cookie        |
| POST   | `/user/login`      | –    | Log in, sets an auth cookie                   |
| GET    | `/user/auth-status`| ✅   | Check whether the current cookie is valid     |
| GET    | `/user/logout`     | ✅   | Clear the auth cookie                         |
| POST   | `/chat/new`        | ✅   | Send a message, get a streamed (SSE) reply    |
| GET    | `/chat/all-chats`  | ✅   | Fetch the signed-in user's chat history       |
| DELETE | `/chat/delete`     | ✅   | Clear the signed-in user's chat history       |

`POST /chat/new` streams `text/event-stream` events shaped like
`{"delta": "..."}` (a chunk of text), `{"done": true}` (stream finished and
saved), or `{"error": "..."}`.

## Notes on deploying frontend + backend to separate domains

Auth uses a signed, `httpOnly` cookie. For that cookie to survive a
cross-site request (frontend and backend on different domains, e.g. two
separate Vercel projects), the backend sets `sameSite: "none"` and
`secure: true` whenever `NODE_ENV=production` — make sure that env var is
actually set to `production` on your host. Also set `CLIENT_URL` to your
deployed frontend's exact origin (comma-separate multiple origins if you
need both a preview and production URL).
