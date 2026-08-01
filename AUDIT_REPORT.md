# SAT Sharks — Production Readiness Audit

**Scope:** full backend (`backend/src`, ~18.4k LOC) and frontend (`frontend/src`, ~23.5k LOC).
**Verification:** backend typecheck + build pass; frontend typecheck + build pass; 34 unit assertions on changed logic pass; runtime smoke tests pass.
**Constraint honoured:** no UI/UX changes, no business-logic changes except where a bug required it, no breaking API changes.

---

## 1. Critical

### C1 — Plaintext password written to the database (Stripe guest checkout)
`payment.controller.ts` created guest users with `password: Math.random().toString(36).slice(-10) + "A1!"` — stored **unhashed**. The `User` model has no `pre('save')` hashing hook, so `auth.controller.register` was the only path that hashed anything.

Two consequences: a plaintext credential at rest, and — because `bcrypt.compare()` can never match a non-hash — **every paying guest account was permanently impossible to log into**. Customers paid and could not access what they bought.

**Fix:** new `utils/password.ts` as the single hashing authority. Guest passwords now come from `crypto.randomBytes` (CSPRNG, not `Math.random`) and are bcrypt-hashed at cost 12. Recovery is via the now-working reset flow. Proven by unit test: `verifyPassword(pw, pw) === false` (the old shape can never authenticate).

### C2 — Hardcoded JWT signing secrets
`utils/jwt.ts` read `process.env` directly at import time with literal fallbacks `"your_jwt_secret_here"` / `"your_jwt_refresh_secret_here"`. `config/env.ts` only enforces real secrets when `NODE_ENV === "production"`, so any non-production environment signed tokens with a constant committed to the repository — **anyone able to read the repo could mint an `ADMIN` token**.

**Fix:** secrets now come only from the validated `env` module. Dev fallbacks are generated per process via `crypto.randomBytes`, so a missing secret fails visibly instead of failing open. Production additionally rejects identical access/refresh secrets. Added a `typ` claim so a refresh token cannot be replayed as an access token; legacy tokens without the claim still verify, so live sessions survived the change.

### C3 — Reset tokens and session IDs returned by admin user endpoints
Six handlers in `user.controller.ts` used `.select("-password")`. That subtractive projection excluded *only* the password, so every response also carried `resetToken`, `resetTokenExpiry`, and `sessionId`. `GET /api/users` returned this for **every user in one unpaginated response** — a readable, replayable account-takeover primitive.

**Fix:** `password`, `sessionId`, `resetToken`, `resetTokenExpiry` are now `select: false` at the schema level (defence in depth), and all responses use an explicit `USER_PUBLIC_FIELDS` allowlist. Additive allowlists do not silently leak fields added later; subtractive ones do.

### C4 — Password reset tokens stored in cleartext
`resetPassword` persisted the raw emailed token. Any read of the user document — a backup, a log, or C3 above — was directly replayable.

**Fix:** only the SHA-256 digest is stored; the raw value exists solely in the email. Lookup hashes the incoming token and matches on the digest with a server-side expiry check.

### C5 — Password recovery was entirely non-functional
End-to-end dead feature:
- `forgot-password.tsx` — `// Simulate sending email`, no API call at all.
- `reset-password.tsx` — `// Simulate reset`, navigated to login without changing anything.
- Backend had **no endpoint to redeem a token**; `resetPassword` only issued one.

A locked-out user had no recovery path, and both screens reported success. This is also the only recovery route for accounts created by C1.

**Fix:** wired end to end without changing either screen's design — added `POST /api/auth/reset-password/confirm` (validates token + expiry, sets the new hash, clears the token, and clears `sessionId` so all existing devices are logged out), plus a `/forgot-password` alias. Both pages now call the API with submit-disabled states and inline errors. The original `/reset-password` path is retained for backward compatibility.

### C6 — Answer key served to students
`GET /api/questions` (any authenticated user) returned `correctAnswer` and `explanation` for every question — the entire bank's answer key, one request away. `POST /api/sat/:id/start` did the same via `populate("modules.questions")`, so **beginning an exam shipped its answers to the browser**. `GET /api/questions/:id` leaked the same per question.

I verified against the frontend before changing anything: the SAT runner reads only `text`, `options`, `_id`, `imageUrl`; `PracticeContent` takes the answer from the server's grading response (`res.result.correctAnswer`), not the question list. The only consumers of `correctAnswer` are admin screens and post-submission review, which are fed by different endpoints that populate it deliberately.

**Fix:** answers/explanations projected out of all three student-facing paths; `getQuestion` returns them to staff only. Server-side grading is untouched — it re-queries questions separately, which I confirmed. No screen regresses.

### C7 — No rate limiting anywhere
No throttling on any route. `POST /api/auth/login` allowed unlimited credential stuffing; `reset-password` was an email-flood primitive; `POST /api/payment/create-checkout` is unauthenticated and created a live Stripe session per call.

**Fix:** added `express-rate-limit` with per-endpoint budgets — login (10/15min, keyed on IP **+ email** so one attacker cannot lock out every user sharing an IP, and successful logins are not counted), register (10/hr), password reset (5/hr), public writes (20/15min), plus a global 300/min backstop. `ipKeyGenerator` normalises IPv6 so a /56 cannot supply unlimited addresses. `app.set("trust proxy", 1)` was required for correct client IPs behind Railway/Vercel. Verified: 11th register attempt returns 429.

---

## 2. High

| # | Issue | Fix |
|---|---|---|
| H1 | **NoSQL operator injection** — `req.query` values assigned straight into Mongoose filters at 7 sites (`role`, `category`, `status`, `section`, `difficulty`). `?role[$ne]=STUDENT` arrives as `{$ne:"STUDENT"}` and becomes a query operator. | New `utils/query.ts`: `asFilterString` / `asEnumValue` / `asObjectId` coerce to primitives or reject. Operator objects and arrays never reach a filter. |
| H2 | **ReDoS** — `filter.text = { $regex: search }` with unescaped user input. `?search=(a%2B)%2B$` is catastrophic backtracking against an unindexed field; `?search=.*` defeats filtering. | `escapeRegex` + `buildSearchFilter`, with the term capped at 100 chars. |
| H3 | **Draft content exposure** — `getQuestions` let the caller override `status`, so `?status=REVIEW` returned unpublished questions to students. | Status is now fixed to `PUBLISHED` on the student route; admins filter by enum on their own route. |
| H4 | **CORS allowed attacker-controlled origins** — `/^satsharks-frontend(-[a-z0-9-]+)?\.vercel\.app$/` with `credentials: true`. Vercel subdomains are first-come-first-served, so anyone could register `satsharks-frontend-x.vercel.app` and read authenticated responses from logged-in visitors. | Pattern removed. Previews are opt-in via `CORS_ALLOWED_ORIGINS`. Rejection now omits headers instead of throwing (which surfaced as an opaque 500). |
| H5 | **50MB JSON body limit** — a trivial memory-exhaustion DoS. | Reduced to 16MB. Deliberately *not* lower: with Cloudinary unconfigured, `/api/uploads/image` returns a base64 data URL that the admin UI submits inside a JSON body, and a 10MB image inflates to ~14MB. 16MB is the smallest limit that cannot break that flow. `urlencoded` cut to 1MB. |
| H6 | **Authorization decided from stale token claims** — `role`, `status`, `subscription` were read from a 7-day JWT, so a suspended, demoted, or downgraded account kept its privileges until expiry. | `authenticate` re-reads those fields from the database and overwrites the claims before any authorization middleware runs. Suspending a user now also clears `sessionId`, taking effect on their next request. |
| H7 | **Stored XSS via upload** — multer took the extension from `path.extname(file.originalname)` while filtering on the client-supplied `Content-Type`. `payload.html` labelled `application/pdf` was written as `.html` into a directory served with `Access-Control-Allow-Origin: *`. | New `middleware/upload.middleware.ts` derives the extension from the accepted mimetype allowlist — never from user input. `/uploads` now sends `nosniff`, `CSP: default-src 'none'; sandbox`, and `Content-Disposition: attachment` for non-media, plus `dotfiles: deny` and `index: false`. Verified with a probe file. |
| H8 | **Internal errors echoed to clients** in 94 handlers (`error: error.message`), forwarding Mongoose/driver/filesystem detail; one also returned `error.errors` (the full validation tree). | New `utils/http.ts` `sendError()`: maps duplicate-key → 409, validation → 400, cast → 400, everything else → generic 500 with server-side logging. Applied across all controllers. The 3 remaining `.message` uses are our own author-written `ApiError`/`LiveKitNotConfiguredError` messages. |
| H9 | **Event-loop stall** — `fs.readFileSync` on PDFs up to 50MB inside a request handler, blocking every concurrent request. | `fs/promises.readFile`, and `parser.destroy()` moved into `finally` so buffers are freed even when parsing throws. |
| H10 | **Stripe webhook trusted when unconfigured** — relied on `constructEvent` throwing on an empty secret. | Explicit 503 when `STRIPE_WEBHOOK_SECRET` is absent, so a misconfigured deploy can never be coaxed into trusting forged subscription upgrades. Signature failures no longer echo the reason. |
| H11 | **100× overcharge on decimal prices** — `parseInt(price.replace(/[^0-9]/g,"")) * 100` turned `"$29.99"` into 299900 cents ($2,999). A non-string price threw mid-request. | Extracted and unit-tested `parsePriceToCents`: `$29.99`→2999, `$1,299`→129900, `$0`/`Free`/`undefined`/`{}`→null. |
| H12 | **`"password123"` as a default password** — `AuthContext.register` fell back to that literal when no password was passed, creating a trivially guessable account on a real address. | Removed; registration requires a password. Verified the sole caller already guards it, so behaviour is unchanged. |
| H13 | **Full user document loaded on every authenticated request**, unprojected and hydrated. | Narrow `.select(...).lean()` projection. |
| H14 | **No graceful shutdown or process-level handlers** — container stops killed in-flight requests; unhandled rejections were unobserved. | `SIGTERM`/`SIGINT` drain the server and close Mongo with a 10s backstop; `unhandledRejection`/`uncaughtException` are logged. |
| H15 | **`requireActiveUser` failed open and corrupted documents** — `user.save()` on a partially-projected document makes Mongoose validate and write back fields that were never loaded; a thrown DB error fell through to `next()`, granting access. | Targeted idempotent `updateOne`; DB failure now fails closed with 503. |
| H16 | **No API 404 handler** — unknown `/api/*` paths fell through to the HTML-ish default, which the frontend's `res.json()` could not parse. | JSON 404 for `/api/*`. |
| H17 | **Host-header poisoning** — `sitemap.xml`/`robots.txt` built URLs from the `Host` header. | Production uses the configured `FRONTEND_URL`. |

---

## 3. Medium

- **Unbounded queries** on users, uploads, reports, and study materials (full-collection reads with `populate`). Now bounded via `getPagination` with clamped limits. Defaults were set high (200–500) because these admin tables have no pager UI — this removes the unbounded scan without truncating any screen in practice. Response shapes are additive (`pagination` added), so nothing breaks.
- **Missing indexes.** `User` had none beyond `_id`/`email`; the admin list sorted by `createdAt` and the leaderboard by `leaderboardPoints`, both collection scans plus in-memory sorts. Added `createdAt`, `{role, createdAt}`, `leaderboardPoints`, and a sparse `resetToken` index.
  - *Caught and reverted mid-work:* I first added a TTL index on `resetTokenExpiry`. A MongoDB TTL index **deletes the whole document**, not the expired field — that would have silently destroyed user accounts. Expiry is enforced in the query instead, with an explicit comment so it is not reintroduced.
- **Duplicated authorization rule.** `isAdmin` (auth.middleware) and `requireAdmin` (role.middleware) were independent copies; drift would leave one route family weaker. `isAdmin` now delegates. Used `import type` on the back-reference to avoid a require cycle, and verified the affected routes still respond correctly.
- **API client duplication.** Five near-identical ~20-line fetch methods, so every fix had to be applied five times. Collapsed to one `request()` helper; added a 30s `AbortController` timeout (requests could previously hang forever behind a spinner) and SSR-safe, try/catch-guarded token accessors.
- **Context re-render cascade.** `AuthContext` built a new value object every render, re-rendering the whole authenticated tree on any auth state change. Now `useMemo` + `useCallback`. Also added cancellation to the bootstrap effect.
- **KaTeX re-rendered on every keystroke.** `renderFormattedText` is called inline in JSX, so `katex.renderToString` re-ran for every formula on every render — dozens of full LaTeX parses per timer tick in the SAT runner. Added a bounded (500-entry, FIFO) cache keyed on formula + display mode. Inputs are pure, so output is identical.
- **Email not normalised** — `A@b.com` and `a@b.com` could become two accounts, and login was accidentally case-sensitive. Now lowercased/trimmed at the schema and in every auth path.
- **Orphaned files.** `deleteUpload` removed the DB row and left the PDF on disk forever. Now unlinks it (path-confined, tolerant of `ENOENT`).
- **Weak validators.** No `isString()` guards, so `{"email":{"$ne":null}}` passed validation as an object. Added type guards and length bounds throughout. Verified: that payload is now rejected.
- **Unvalidated mass assignment** — `reviewUpload` wrote `req.body.extractedQuestions` verbatim into the document and later published it into the live bank. Added a field-level sanitiser.
- **Crash with zero categories** — `publishUpload` fell back to `categories[0]?._id` on a required field, failing mid-batch. Now fails fast with an actionable message.
- **Stuck state** — a failed extraction left the upload in `PROCESSING` forever. Now transitions to `FAILED`.
- **Business logic in a route file** — `homepage-stats.routes.ts` held two inline handlers. Extracted to a controller; the 37-field editable allowlist is preserved verbatim, and the singleton read/write is now an atomic upsert instead of a `findOne`-then-`create` that could race into two documents.
- **`Math.random()` for upload filenames** — same-millisecond collisions could overwrite. Now `crypto.randomBytes`.
- **Invalid dates** — `updateUserAccessDates` passed `new Date("nonsense")` (Invalid Date) to Mongoose. Now rejected with a clear 400.
- **Mongoose safety** — `strictQuery`/`strict` set (a typo'd or injected field name was silently dropped, matching the whole collection), pool bounded to 20, and post-connection `error`/`disconnected`/`reconnected` handlers added (the process previously served traffic against a dead connection with no log signal).
- **bcrypt cost 10 → 12.**
- **Helmet ordering** — was applied after CORS/body parsing and after the webhook routes, so those responses had no security headers. Now first.
- **Mailer** — defaulted to `satsharks@gmail.com` / `"dummy-app-password"`, making a misconfigured deploy look configured while every send failed silently; and used a `FRONTEND_URL` default of `:8080` while `env.ts` used `:5173`, so dev reset links pointed at the wrong origin. Now explicit `isMailerConfigured`, shared config, HTML-escaped link, and a dev-mode link log.
- **Dead code** — removed the unused `sampleExtracted` fixture in `triggerExtraction`.
- **Repo hygiene** — untracked `backend/dist` (109 compiled files committed to VCS, risking stale deploys); deleted `history.txt` (32MB UTF-16 dump of `git log`, fully redundant), `frontend/lhreport.json` (956KB), and `build-log-workspace.txt`; extended `.gitignore`.
- **32 dead modules in the production build** — `src/scripts/` holds one-off inspection utilities (`inspectTest12Lines`, `findQ27`, `printLogBoundaries`, …) run ad hoc via `tsx` and never imported by the server, yet compiled into `dist/` every build. Added `tsconfig.build.json` excluding them from emit while the base config still typechecks them. Build output dropped from 130 to 98 JS files.

---

## 4. Reviewed and deliberately left alone

Worth recording, so these are not "fixed" later by mistake:

- **`dangerouslySetInnerHTML` in `format.tsx` (3 sites) is not an XSS.** Every input is `katex.renderToString` output. KaTeX escapes its input and runs with `trust: false` by default, so `\href`/`\url` are disabled and the emitted HTML contains no author-controlled markup.
- **LiveKit is the strongest module in the codebase.** `generateJoinToken` correctly layers role, ownership, subscription, schedule-window, status, and capacity checks; the webhook properly verifies signatures via `WebhookReceiver.receive()` over the raw body. No changes needed.
- **SAT attempt ownership is correctly scoped** — every attempt query filters on `student: req.user?.userId`.
- **Access token TTL left at 7 days.** Shortening it is the right end state, but no refresh flow is implemented (the backend returns a `refreshToken` the frontend never stores), so reducing it would log every user out with no recovery — a breaking change. Now configurable via `JWT_ACCESS_TTL`.
- **`ApiResult` index signature left as `any`.** Narrowing it to `unknown` is stricter but broke ~60 call sites; per-endpoint response types should be introduced incrementally, not in a sweep. Methods are now generic so typed wrappers like `liveClassApi` work without casts.

---

## 5. Recommendations (not done — need product decisions or larger changes)

**Security**
1. **Refresh-token flow + shorter access tokens.** Highest-value remaining item. Enables real revocation; currently a compromised token is valid for 7 days.
2. **Move the token out of `localStorage`** into an httpOnly, `SameSite=Strict` cookie. Any XSS today exfiltrates the session. Requires a CSRF token for state-changing requests.
3. **Stop putting base64 images in JSON bodies and the database.** This is what forces the 16MB body limit and bloats documents. Make Cloudinary (or S3) required in production and store URLs only.
4. **Webhook idempotency** — persist processed Stripe event IDs. Currently safe because expiry is absolute, but it will not stay safe as logic grows.
5. **Rotate any credential ever committed**, and confirm `JWT_SECRET`/`JWT_REFRESH_SECRET` are distinct in every environment.
6. **Add admin action audit logging** for role/subscription/access-date changes.

**Reliability & quality**
7. **There are no tests.** Start with the paths this audit touched: auth, grading, price parsing, query sanitisers.
8. **CI** running typecheck + lint + build on every PR. The frontend lint currently takes >10 minutes — worth investigating.
9. **Structured logging with request IDs** (pino) instead of `console.error` + morgan.
10. **Pagination UI** for admin tables, so the bounded limits become true pagination.
11. **`AuthRequest.user` is typed but `req.user?.userId` is still optional**, so `findOne({ student: undefined })` would strip the key and match any record. Middleware guarantees the value; a non-optional authenticated request type would make that structural.
12. **Split the largest files** — `sat.tsx` (1654), `PracticeContent.tsx` (1223), `sat-runner.tsx` (1100).
13. **Bundle**: `xlsx` (698KB) and `livekit-client` (1.05MB) — load both lazily at their point of use.
14. **Add health checks that verify DB connectivity**, not just process liveness.
