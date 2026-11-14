---
tags: [deep-engineering]
max_turns: 30
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

can you security review this flask app before we ship? @app.route('/invoice/<id>') def inv(id): return db.execute(f"SELECT * FROM invoices WHERE id={id}").fetchone(); and there's an /admin/export route that only checks a 'role' cookie. also we load yaml from user uploads with yaml.load
