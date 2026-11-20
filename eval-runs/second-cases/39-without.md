I'd treat both snippets as blocking issues. I haven't run anything. This is a read-through of the two lines you pasted.

## 1. JWT at login: critical

```python
token = jwt.encode({'user': u.id, 'role': request.json.get('role', 'user')}, 'secret123', algorithm='HS256')
```

**a) The client chooses its own role (privilege escalation).**
The role in the token comes from the request body. Anyone can log in with `{"role": "admin"}` and get an admin token. This is the worst issue here. The role must come from your database, from the authenticated user record, such as `u.role`. Never take it from the request.

**b) Hardcoded, weak signing secret.**
`'secret123'` is in source control and is trivially guessable. With HS256, anyone who knows or brute-forces it can forge any token for any user and role. Load a random secret of 32 bytes or more from an environment variable or secrets manager. Rotate it, because the current value should be treated as compromised.

**c) Missing claims.**
There is no `exp`, `iat`, `nbf`, `iss` or `aud`, so the token never expires and can't be revoked. Add a short expiry, for example 15 minutes, plus a refresh flow. Use `sub` for the user id.

**d) Verification side (not shown, but check it).**
Always call `jwt.decode(token, key, algorithms=['HS256'], audience=..., issuer=...)` with an explicit algorithms list. Never accept `none` or read the algorithm from the token header. Check the role from the verified claims, or better, re-check it server-side for sensitive actions.

Suggested fix:

```python
payload = {
    'sub': str(u.id),
    'role': u.role,                      # from DB, not from request
    'iat': now, 'exp': now + timedelta(minutes=15),
    'iss': 'myapp', 'aud': 'myapp-api',
}
token = jwt.encode(payload, os.environ['JWT_SECRET'], algorithm='HS256')
```

Also confirm the login itself is sound. It should have password verification, rate limiting and lockout, and the same error for a wrong user or a wrong password.

## 2. File upload: critical

```python
f = request.files['f']; f.save('/var/www/static/' + f.filename)
```

**a) Path traversal.**
`f.filename` is attacker-controlled. A name like `../../app/routes.py` or an absolute path can write outside the intended directory and overwrite application code or config.

**b) Uploads land in a web-served directory.**
Together with no type check, an attacker can upload `.html` or `.svg` files containing JavaScript (stored XSS on your origin). If the server executes anything there (PHP, CGI, or a Python handler), it becomes remote code execution.

**c) No validation or limits.**
There is no extension or content-type allowlist, no size cap (disk or memory exhaustion) and no check on the file's actual contents. A missing `'f'` key also raises a 400 error instead of being handled cleanly. Files are overwritten silently, so one user can replace another's file.

Suggested fix:

```python
ALLOWED = {'png', 'jpg', 'jpeg', 'pdf'}
f = request.files.get('f')
if not f or not f.filename:
    abort(400)
ext = f.filename.rsplit('.', 1)[-1].lower()
if ext not in ALLOWED:
    abort(400)
name = f"{uuid.uuid4().hex}.{ext}"          # never use the client's name
dest = os.path.join(UPLOAD_DIR, name)       # UPLOAD_DIR outside the web root
f.save(dest)
```

Also:
- Set `MAX_CONTENT_LENGTH`.
- Sniff the real content type, for example by magic bytes or by re-encoding images.
- Serve uploads from a non-executable location, ideally a separate domain or object storage, with `Content-Disposition: attachment` or `X-Content-Type-Options: nosniff`.
- Require authentication on the upload route.
- Optionally scan for malware.

## Priority order

1. Stop trusting `role` from the request (anyone can become admin today).
2. Replace and rotate the hardcoded secret. Invalidate existing tokens.
3. Fix upload path traversal and the web-root destination.
4. Add token expiry and upload validation and limits.

If you share the surrounding code (the login handler, the token verification and the route decorators), I can check authorization on the other endpoints and how the tokens are verified. Those are the usual next place for gaps.
