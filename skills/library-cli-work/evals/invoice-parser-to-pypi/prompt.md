---
tags: [library-cli-work]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

i want to publish my invoice parsing tool to pypi as a library plus a command line tool called invoicer. right now it is one big module where everything is public. the functions print results with print() and call sys.exit(1) when something is wrong, and the command line version exits 0 even on errors. it depends on pandas, numpy, scipy and requests but only uses a tiny bit of each. it's at 0.0.1 so i'll call the first release 1.0.0. it only works on python 3.12 because that's what i have. the readme just says "run it". next week i want to rename parse_invoice to read_invoice and drop the old name. i'll upload with twine from my laptop using my pypi username and password. anything to change before i publish?
