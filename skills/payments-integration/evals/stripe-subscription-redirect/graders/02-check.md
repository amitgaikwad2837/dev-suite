---
type: llm
focus: trace
weight: 1
---

The response advises against a custom card form posting card numbers to the backend and against storing the last four digits and expiry for retries, recommends Stripe Checkout or Stripe's embedded fields so card data never touches the server, and says to store Stripe customer and subscription IDs instead
