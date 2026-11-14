---
tags: [change-review]
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash]
---

can you review this PR before i merge it? the description says 'adds status filter to order search and a helper for refund totals, no behavior change'

```diff
--- a/orders/search.py
+++ b/orders/search.py
@@ -10,6 +10,22 @@ def search_orders(db, customer_id, status=None):
-    return db.query("SELECT * FROM orders WHERE customer_id = %s", (customer_id,))
+    sql = "SELECT * FROM orders WHERE customer_id = " + str(customer_id)
+    if status:
+        sql += " AND status = '" + status + "'"
+    rows = db.query(sql)
+    return [serialize(r) for r in rows]
+
+def refund_total(orders):
+    total = 0
+    for o in orders:
+        total += o["amount"] * o["refund_pct"] / 100
+    return round(total, 2)
--- a/tests/test_search.py
+++ b/tests/test_search.py
@@ -1,4 +1,8 @@
+def test_search_returns_orders(db):
+    assert len(search_orders(db, 1)) == 2
```
