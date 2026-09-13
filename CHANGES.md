# What changed from the original

## Bugs fixed
- **Every chat message had the same ID.** `User.ts` had `default:
  randomUUID()` — called once when the schema loaded, not per message.
  Fixed to `default: randomUUID` (a function reference).
- **Auth cookies were hardcoded to `domain: "localhost"`**, which silently
  breaks login on any deployed environment where frontend and backend are
  on different domains. Cookie options are now environment-aware
  (`secure`/`sameSite` driven by `NODE_ENV`), with no hardcoded domain.
- **`GET /api/v1/user/` had no auth guard** and returned every user
  document, including hashed passwords. Now requires login; the password
  field also has `select: false` at the schema level as a second layer of
  defense.
- **Crash on single-word names** — `name.split(" ")[1][0]` threw if a user
  signed up with just one name. Replaced with a safe `getInitials` helper.
- **Fake code-block detection** — the old `isCodeBlock` heuristic just
  checked for characters like `=`, `;`, `{`. Replaced with real Markdown
  parsing (`react-markdown` + `remark-gfm`) and proper fenced-code
  detection, so ordinary sentences with punctuation no longer render as
  code.
- Several endpoints returned HTTP 200 with an "ERROR" message body on
  failure, which meant the frontend's error handling never actually
  triggered. Error responses now use real status codes (401/403/409/500).

## Security / hardening
- CORS origin and the frontend's API base URL were hardcoded to specific
  URLs; both are now environment variables.
- Added rate limiting (`express-rate-limit`) on the chat endpoint as a
  basic guard against runaway OpenAI spend.
- Message length is capped server-side (4000 chars).

## Modernized
- `openai` SDK: v3.3.0 (the old `Configuration`/`OpenAIApi` pattern) → v7,
  with the current client and a configurable model (`OPENAI_MODEL`,
  defaults to `gpt-5-mini` — `gpt-3.5-turbo` is long past current
  practice).
- Chat replies now **stream** token-by-token over Server-Sent Events,
  instead of appearing all at once after the full generation finishes.
- Express 4 → 5, Mongoose 7 → 9, React 18 → 19, MUI 5 → 9, Vite 4 → 8,
  react-router-dom 6 → 7 — all bumped to their current majors and
  verified with a real `npm install` + build in this environment.
  (TypeScript was deliberately kept on a stable 5.x line rather than the
  very new major-7 compiler, for build reliability.)
- ESLint's old `.eslintrc.cjs` replaced with a flat `eslint.config.js`
  (the old format isn't supported by current ESLint).

## Fresh look
- New visual identity: a custom inline SVG mark replaces the old app's use
  of OpenAI's own logo image, and every other image asset — the whole app
  now ships with **zero raster images** (the old `public/` folder had
  12MB+ of unused dead photos, including one untouched 12MB file that
  wasn't referenced anywhere in the code).
- Full redesign: refined indigo palette, Inter typeface, light/dark mode
  toggle (persisted), redesigned Home/Login/Signup/Chat/404 pages.
- Streaming text renders live with a blinking cursor; code blocks get real
  syntax highlighting; Enter to send, Shift+Enter for a newline,
  auto-growing input, auto-scroll that respects manual scroll-up.
- Fixed the non-responsive fixed-400px-width input field; default
  "Vite + React + TS" browser tab title/favicon replaced.

## Performance
- Route-level code splitting (Home/Login/Signup/Chat/404 are separate
  bundles) so visiting the landing page doesn't download the chat page's
  markdown/syntax-highlighting weight.
- The syntax highlighter specifically is lazy-loaded and only registers a
  curated set of common languages rather than the library's full ~250
  language catalog — it only loads at all once a reply actually contains
  a code block, and falls back to plain readable text for anything
  outside that set.
- Known remaining limitation: the syntax-highlighting chunk itself is
  still large (~310KB gzipped) once it does load, due to how its
  underlying library (`refractor`) bundles under Vite — this is a
  characteristic of that dependency, not something fixable from the
  registration pattern used here. It no longer blocks any other page's
  load, which was the main goal.

## Verified in this environment
Both apps were actually installed and built here (not just written):
`npm install` + `tsc` + production build succeeded cleanly for both, the
backend boots correctly, and the built frontend was served and returned
HTTP 200. ESLint runs clean (two expected warnings about Fast Refresh in
the two context files, which is a normal trade-off for that pattern).
What wasn't possible to verify in this sandbox: an actual MongoDB
connection, an actual OpenAI API call, and visual/pixel rendering in a
real browser — those need your real credentials and a live browser to
check.
