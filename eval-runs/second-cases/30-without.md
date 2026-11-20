Here's a tidied version. The numbers and code are unchanged.

**Faster exports, and a new CSV default**

Export is now up to 3x faster. On 10k rows it drops from 12s to 4s.

`--format=csv` now defaults to utf-8 instead of latin-1. If you rely on latin-1 output, check your downstream tools.

Tell us what you think.

What I changed:
- Cut the marketing phrases ("revolutionized", "super excited", "seamless upgrade"). They add nothing a reader can check.
- Led with what changed and gave each change its own short paragraph.
- Wrote "12s to 4s" in words instead of the arrow. If you prefer "12s -> 4s", swap it back; the values are the same.
- Added one line about the encoding default, because it can change output for people who depended on latin-1. Delete it if you don't want to say that. I left the encoding claim itself exactly as you wrote it.

One thing to check: "up to 3x" is what you stated, and 12s to 4s is exactly 3x, so it matches. I didn't verify the figures against your benchmarks.
