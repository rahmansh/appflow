# Practice: Rebuild JWT Auth From Scratch

Goal: don't re-read the existing auth code. **Build it blind on a
throwaway branch**, then diff against the real implementation to see
what you missed. That comparison is where the learning actually happens
— re-reading code you already saw teaches far less than reconstructing
it and finding the gaps yourself.

Reference only if truly stuck: [`docs/guides/auth-jwt-mern.md`](../guides/auth-jwt-mern.md).
Try each item for a few minutes before peeking.

---

## Setup

```bash
git checkout -b practice/auth-rebuild
```

Work directly on `server/models/User.js`, `authController.js`, etc. —
you're about to overwrite the real ones, which is fine, that's what the
branch is for. When you're done, `git diff main` shows you exactly what
you got right, missed, or did differently.

---

## Part 1 — Backend

### 1. `User` model
- [ ] Write the schema: what two fields, minimum?
- [ ] Which field needs `unique: true`? Why does that matter for login,
      not just for data cleanliness?
- [ ] Which field should have `select: false`? What happens if you
      forget this?
- [ ] Write the pre-save hook that hashes the password. **Don't look up
      the syntax first** — try it from memory, run it, read whatever
      error Mongoose gives you, and fix it. (There's a real gotcha
      waiting for you here depending on your Mongoose version — figuring
      it out yourself is the point.)
- [ ] Write a method to compare a plaintext password against the stored
      hash. Where should this method live — on the schema, or inline in
      the controller? Why?

### 2. Register endpoint
Without looking anything up, list every check you think a `register`
endpoint needs before creating a user. Then write it.

- [ ] What should happen if email or password is missing from the body?
- [ ] What should happen if the email is already taken?
- [ ] What should you return to the client on success — and specifically,
      what should you make sure you *don't* return?

### 3. Login endpoint
- [ ] What should happen if the email doesn't exist?
- [ ] What should happen if the password is wrong?
- [ ] Should those two cases return different error messages? Why or
      why not — think about it from an attacker's perspective before
      you check the answer.

### 4. Signing a JWT
- [ ] What goes inside the token payload? (Hint: as little as possible
      — what's the one piece of information every protected route
      actually needs?)
- [ ] Where does the signing secret come from, and why must it never be
      hardcoded in a file that gets committed?
- [ ] Should the token expire? What's a reasonable expiry for a
      portfolio project vs. a bank?

### 5. Auth middleware
Write this without looking at the existing `middleware/auth.js`.

- [ ] Where does the token arrive on an incoming request — what header,
      what format?
- [ ] What are the two distinct failure cases, and what status code
      fits both?
- [ ] On success, what do you attach to the request object so later
      route handlers can use it?

### 6. Protecting + scoping the job routes
This is the part most likely to go wrong — pay attention.

- [ ] Apply your middleware to the job routes.
- [ ] Now go into `jobController.js` and update **all four** operations.
      For each one, ask: *"if I only check `_id` here, could a
      different logged-in user affect this document?"*
- [ ] Specifically: what Mongoose method do you need for update/delete
      that takes more than just an id? (You will likely reach for the
      wrong one first — that's expected, not a failure.)

**Self-check before moving on:** register two different users with
curl, create a resource as user A, then try to read/update/delete it
as user B. If B can touch it, go back — this is the one part of the
whole exercise that actually matters for real-world security.

---

## Part 2 — Frontend

### 7. Token storage
- [ ] Where will you store the token? What's the tradeoff of your
      choice vs. the alternative (localStorage vs. httpOnly cookie)?
- [ ] Write `getToken` / `logout` helpers.

### 8. Attaching the token automatically
- [ ] Without editing every single API call function, how can you
      make *every* request carry the token? (This is a general
      pattern, not an auth-specific trick — where else have you seen
      "one place all requests pass through"?)

### 9. Handling auth failures gracefully
- [ ] What should happen in the UI if a request comes back 401 —
      token missing, expired, or invalid? Where's the best single
      place to handle that so you don't repeat it on every page?

### 10. Login / Register pages
- [ ] Build minimal forms. What's the minimum client-side validation
      worth doing, given the backend already validates too?

### 11. Protecting frontend routes
- [ ] Write a wrapper component that redirects to `/login` if there's
      no token. Where does it need to be checked — once at app
      startup, or every time a protected page renders? Why?

### 12. Logout
- [ ] Easy to forget since it's not "core" — but you can't verify
      multi-user isolation without it. Add it.

---

## Part 3 — Verify like it's a real feature, not a demo

- [ ] Register user A, add data, log out
- [ ] Register user B — confirm **zero** of A's data is visible
- [ ] Confirm A's data is untouched afterward
- [ ] Confirm hitting a protected route with no token → 401
- [ ] Confirm a garbage/tampered token → 401 (try editing one character
      of a real token and reusing it)
- [ ] Confirm the frontend actually redirects to `/login` in every
      case above — not just that the API rejects it

---

## Part 4 — Compare and reflect

```bash
git diff main -- server/ client/src
```

Go through the diff and for anything you did differently from the real
implementation, ask **"is mine wrong, or just different?"** — not
everything that differs is a mistake. Places worth specifically
comparing:

- Did you scope every job query by `userId`, or just some of them?
- Did you use `findOneAndUpdate`/`findOneAndDelete` with a compound
  filter, or `findByIdAndUpdate`/`findByIdAndDelete`?
- Did your login endpoint leak whether an email exists?
- Did you remember `select: false` on the password field?
- Did you handle the 401-redirect case on the frontend at all?

When you're done comparing, discard the branch (or keep it around as a
reference of "attempt #1") — the real implementation on `main` is what
stays.

```bash
git checkout main
git branch -D practice/auth-rebuild   # only once you're done comparing
```
