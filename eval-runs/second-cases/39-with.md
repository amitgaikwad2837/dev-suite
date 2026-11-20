## Security review: JWT login and file upload

**Model I reviewed against (assumed, since I only have two snippets):** a Python web app (Flask-style, given `request.json` and `request.files`). Actors are anonymous visitors, logged-in users and admins. The token carries identity and role and is the trust boundary for authorization. Uploaded files land in a web-served directory (`/var/www/static/`). I have not seen the rest of the app.

### Findings

**1. Critical: client-controlled role signed into the token**
- Location: login snippet, `'role': request.json.get('role', 'user')`
- Exploit: the role comes straight from the request body. Anyone can POST `{"role": "admin"}` at login and get a validly signed admin token. No authentication is needed to escalate.
- Fix: never take the role from the client. Look it up server-side from the user record after verifying credentials, and put it in the token (or better, only the user id and re-load the role on each request).

**2. Critical: hardcoded, weak signing secret**
- Location: `'secret123'` in `jwt.encode(...)`
- Exploit: the secret is committed in source and trivially guessable. Anyone who sees the code or brute-forces it can forge tokens for any user and role, which makes finding 1 unnecessary for an attacker.
- Fix: load a long random key (32+ bytes) from an environment variable or secret manager, rotate the existing one (treat `secret123` as compromised, and this invalidates all tokens issued so far), and keep it out of the repo and logs.

**3. Critical: arbitrary file write through the upload filename (path traversal)**
- Location: `f.save('/var/www/static/' + f.filename)`
- Exploit: `filename` is attacker-controlled. A name like `../../../etc/cron.d/x` or `../app/routes.py` writes outside the upload directory. Even without traversal, an uploader can overwrite any existing static file (e.g. `app.js`, `index.html`).
- Fix: do not use the client filename for the path. Generate a random name (e.g. `uuid4().hex`) and keep only an allowlisted extension. If you must preserve the name, use `werkzeug.utils.secure_filename` and then verify the resolved path stays inside the upload directory.

**3b. Critical or High: uploads stored in a web-served directory with no type check (stored XSS and possible code execution)**
- Location: same line, destination `/var/www/static/`
- Exploit: an uploaded `.html` or `.svg` is served from your origin, giving stored XSS against other users. If the server executes anything in that tree (PHP, CGI, a template engine), an uploaded script becomes remote code execution. Whether the endpoint requires login is not visible here, so if it does not, it is Critical; if it does, High.
- Fix: store uploads outside the web root or in object storage, serve them through a handler or a separate cookieless domain with `Content-Disposition: attachment` and `X-Content-Type-Options: nosniff`. Allowlist extensions and verify content type by sniffing the bytes, not the `Content-Type` header. Add a size limit (`MAX_CONTENT_LENGTH`) and require authentication on the endpoint.

**4. Medium: token hardening gaps**
- Location: `jwt.encode({...})` payload
- Issue: there is no `exp` (the token never expires), no `iat`, and no `aud`/`iss`. A stolen token works forever.
- Fix: add a short `exp` (e.g. 15 to 60 minutes) with a refresh mechanism. On the verifying side, always pass `algorithms=['HS256']` explicitly to `jwt.decode` so the algorithm cannot be downgraded (including `none`), and check `exp`.

**5. Low: no size or rate limits visible**
- Location: upload and login routes
- Issue: unbounded uploads can fill the disk; login has no visible rate limiting.
- Fix: size cap on uploads, rate limit and lockout on login.

### Suspected / could not verify
- Whether `jwt.decode` and the routes that consume the token ever enforce the role check, and whether they pin the algorithm. Not shown.
- Whether the upload route requires authentication, and whether the web server executes files under `/var/www/static/`.
- How `u` is authenticated (password hashing, reset flow) is not shown.
- CSRF, CORS and cookie settings, and whether the token is stored in a cookie or returned to JS.

### Coverage statement
I examined only the two snippets you pasted: the login token issuance and the upload save line. I did not examine the rest of the application, the verification side of the JWT, other routes, dependencies, deployment or web server config. Silence on anything else should not be read as safe.

### Fix priority
1. Rotate the secret and move it out of code (invalidates all existing tokens).
2. Stop reading `role` from the request.
3. Replace `f.filename` with a generated name and store outside the web root.
4. Add `exp`, pin the algorithm on decode, and add upload size and type limits.

If you paste the verification code and the route definitions, I can trace the rest of the authorization flow.
