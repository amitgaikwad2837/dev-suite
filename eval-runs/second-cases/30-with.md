Here is the tidied note:

> Export is up to 3x faster (12s -> 4s on 10k rows).
>
> `--format=csv` now defaults to utf-8 instead of latin-1. If you rely on latin-1 output, check your downstream tools.

What I changed:
- Dropped "revolutionized", "all-new", "super excited", "seamless upgrade" and the closing request for feedback. The note reads the same without them.
- Led with the speed result, then the encoding change, so users see what changed first.
- Kept `12s -> 4s on 10k rows`, "up to 3x" and `--format=csv` exactly as you wrote them.

One addition for you to check: the second sentence under the encoding line ("If you rely on latin-1 output, check your downstream tools") is mine, not yours. A changed default can break people who depend on the old one. Delete it if you don't want it, or replace it with the real way to get latin-1 back if there is one.

I could not verify the numbers or the default change. The 12s and 4s match "3x" as stated, but I have no benchmark to confirm them.
