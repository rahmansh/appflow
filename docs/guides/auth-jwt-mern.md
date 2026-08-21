# Guide: JWT Auth in a MERN App (reusable template)

A step-by-step pattern for adding email/password authentication with JWTs
to a MongoDB + Express + React + Node app, where resources need to be
scoped per-user. Written to be copy-pasteable into a new project, using
AppFlow as the worked example.

**The core idea, in one sentence:** a user registers/logs in and gets a
signed token; the frontend attaches that token to every request; the
backend verifies it on protected routes and uses the user id inside it to
scope all queries.

---

## 0. Prerequisites / assumptions

- Express backend with Mongoose models, React frontend with axios and
  React Router — same shape as this repo.
- You have at least one existing resource model you want to scope to a
  user (here: `Job`).

---

## Step 1 — Install dependencies (backend)

```bash
cd server
npm install bcryptjs jsonwebtoken
```

| Package | Purpose |
|---|---|
| `bcryptjs` | Hash passwords before storing. Never store plaintext passwords. |
| `jsonwebtoken` | Sign and verify JWTs. |

---

## Step 2 — Create the `User` model

New file: `server/models/User.js`

Fields:
- `email` — `String`, `required`, `unique`
- `password` — `String`, `required` (this stores the **hash**, not the raw password)

Hash the password before saving — either with a Mongoose `pre('save')`
hook on the schema, or explicitly in the controller before calling
`.create()`. Either works; a pre-save hook is less error-prone because
you can't forget to call it.

**Template checklist for any project:**
- [ ] Unique constraint on the login identifier (email or username)
- [ ] Password field never returned in API responses (`select: false` in
      the schema, or strip it manually before sending `res.json(user)`)
- [ ] Timestamps (`{ timestamps: true }`) for created/updated tracking

---

## Step 3 — Add `userId` to every resource that should be private

Edit each model that should be scoped per-user (here: `server/models/Job.js`):

```js
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
```

This single field is what turns "global data anyone can see" into
"per-user data." Do this for **every** model that holds user-owned data
before writing any queries — retrofitting it later means auditing every
existing query for missing scoping.

---

## Step 4 — Auth controller: register + login

New file: `server/controllers/authController.js`

**`register(req, res)`**
1. Read `email`, `password` from `req.body`
2. Check a user with that email doesn't already exist → 400 if it does
3. Hash the password (if not using a pre-save hook)
4. Create the user
5. Sign a JWT containing the user's id (`{ userId: user._id }`)
6. Return the token (and optionally the user's public fields, never the
   password hash)

**`login(req, res)`**
1. Read `email`, `password` from `req.body`
2. Find the user by email → 401 (not 404 — don't reveal whether the
   email exists) if not found
3. Compare the password with `bcrypt.compare()` → 401 if it doesn't match
4. Sign and return a JWT, same as register

**Template checklist:**
- [ ] Same generic error message/status for "no such user" and "wrong
      password" (avoids leaking which emails are registered)
- [ ] Password minimum length / basic validation before hashing
- [ ] JWT expiry set (e.g. `expiresIn: '7d'`) — don't issue tokens that
      never expire

---

## Step 5 — Auth routes

New file: `server/routes/auth.js`

```
POST /api/auth/register
POST /api/auth/login
```

Wire into the app entry point (`server/index.js`):

```js
app.use('/api/auth', authRoutes);
```

---

## Step 6 — Auth middleware

New file: `server/middleware/auth.js`

Logic:
1. Read the `Authorization` header, expect `Bearer <token>`
2. If missing → 401
3. Verify the token with `jsonwebtoken.verify()` using your secret
4. If invalid/expired → 401
5. On success, attach the decoded user id to the request (`req.userId =
   decoded.userId`) and call `next()`

This file is fully reusable across projects as-is — it doesn't know
anything about jobs, users beyond the id, or any app-specific logic.

---

## Step 7 — Protect routes + scope every query

Edit the routes file for each protected resource (here:
`server/routes/jobs.js`) to apply the middleware:

```js
router.use(authMiddleware); // or apply per-route
```

Edit the controller for each protected resource (here:
`server/controllers/jobController.js`) — **this is the step people skip
and it's the actual security boundary**, not the middleware:

| Operation | Change |
|---|---|
| List | `Model.find({ userId: req.userId })` — never `.find()` with no filter |
| Create | Set `userId: req.userId` on the document you create |
| Update | `Model.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, ...)` — not `findByIdAndUpdate` alone |
| Delete | Same pattern: filter by both `_id` and `userId` |

If you filter by `_id` alone on update/delete, any logged-in user can
modify or delete *any other user's* data just by guessing/enumerating
ids. The middleware only proves *someone* is logged in — the query
filter is what proves they own *this* row.

**Test this with curl/Postman before touching the frontend:**
1. Register two users, grab both tokens
2. Create a resource as user A
3. Try to fetch/update/delete it as user B → must fail (404, not 403 —
   don't reveal that the resource exists for another user)

---

## Step 8 — Frontend: token storage helper

New file: `client/src/services/auth.js`

- `register(email, password)` / `login(email, password)` — call the new
  endpoints, store the returned token
- `logout()` — clear the token
- `getToken()` — read it back

**Where to store the token — pick one and note the tradeoff:**
- `localStorage` — simplest, works everywhere, but readable by any JS on
  the page (XSS risk). Fine for learning/portfolio projects.
- httpOnly cookie — more secure against XSS, but needs backend changes
  (`Set-Cookie`, CORS `credentials`, CSRF consideration). Good follow-up
  once the basic flow works.

---

## Step 9 — Attach the token to every API call

Edit the shared axios instance (`client/src/services/api.js`):

```js
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

This is the piece that makes every existing API call in the app
auth-aware without editing each call site individually — one interceptor
covers all of them.

---

## Step 10 — Login/Register pages

New `client/src/pages/Login.jsx`, `Register.jsx`:
- Simple controlled form (email, password)
- On submit: call the auth service, store token, redirect to the main
  page
- On failure: show the error message from the API response

---

## Step 11 — Protected routes on the frontend

New `client/src/components/ProtectedRoute.jsx`:
- Checks whether a token exists
- If not, redirect to `/login`
- If yes, render the wrapped route

Update the router (`client/src/App.jsx`):
- `/login`, `/register` — public
- Everything else — wrapped in `ProtectedRoute`

---

## Step 12 — Logout

Add a visible logout control that calls `logout()` and redirects to
`/login`. Easy to forget since it's not "core" functionality, but you
can't demo the multi-user behavior without it.

---

## Step 13 — End-to-end verification

- [ ] Register user A → lands on the main page with empty/no data
- [ ] Create a few resources as user A
- [ ] Log out, log back in as user A → data still there
- [ ] Register user B → sees **zero** of user A's data
- [ ] Confirm hitting the API directly with no token → 401
- [ ] Confirm user B cannot update/delete user A's resource by id (test
      via curl with B's token against A's resource id)

---

## Step 14 — Environment / secrets

- Add `JWT_SECRET` to `.env` — a long random string, different per
  environment (dev vs prod), never committed
- Document it in the README's setup instructions alongside `MONGO_URI`

---

## Reusable checklist (copy this into a new project)

- [ ] `User` model with unique login field + hashed password
- [ ] `userId` field added to every model that needs per-user scoping
- [ ] `register` / `login` controllers, generic error messages
- [ ] JWT signed with expiry, secret from env
- [ ] Auth middleware: verify token, attach user id to request
- [ ] Every protected route uses the middleware
- [ ] Every list/update/delete query filters by `userId`, not just `_id`
- [ ] Frontend token storage + axios interceptor
- [ ] Login/Register pages
- [ ] Protected route wrapper on the frontend
- [ ] Logout
- [ ] End-to-end multi-user test before calling it done
- [ ] Secrets documented in `.env` / README, not hardcoded

---

## Common mistakes this template exists to prevent

1. **Scoping only in the middleware, not the query.** Being logged in
   proves identity, not ownership — every query still needs the
   `userId` filter.
2. **Using `findByIdAndUpdate`/`findByIdAndDelete` on protected
   resources.** These only take `_id`. Use `findOneAndUpdate`/
   `findOneAndDelete` with a compound filter instead.
3. **Returning the password hash in API responses.** Strip it or use
   `select: false` on the schema field.
4. **Different error responses for "wrong password" vs "no such user."**
   Leaks which emails are registered.
5. **No token expiry.** A stolen token should not be valid forever.
6. **Forgetting the logout flow** and only testing as a single
   ever-logged-in user, which hides scoping bugs.
