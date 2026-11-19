---
tags: [security-review]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

review this python: token = jwt.encode({'user': u.id, 'role': request.json.get('role', 'user')}, 'secret123', algorithm='HS256') for login, and for uploads: f = request.files['f']; f.save('/var/www/static/' + f.filename)
