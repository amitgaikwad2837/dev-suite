---
name: llm-app-work
description: Builds applications that call a language model (chatbots, RAG, agents with tools, extraction) so they are tested, safe and affordable. Use for adding an AI feature, prompts, structured output, embeddings, prompt injection, hallucinations, evaluating answers, token cost and model upgrades. Skip for training your own model (data-ml-work) and ordinary API design (api-design).
---

# LLM App Work

A model call that works on five hand-picked questions fails in production in ways you did not try: it makes things up, follows instructions hidden in a document, returns broken JSON, gets slow or expensive, and changes behaviour when the provider updates the model. So build the test set first, treat every piece of text going in as hostile, and give the model only the power you would give a stranger.

## 1. Decide what the model is for

- Write the task in one sentence, what a good answer looks like, and what a bad answer costs (a wrong refund is worse than a vague reply).
- Use ordinary code for anything deterministic (maths, lookups, permissions, formatting). Use the model for language, judgement and fuzzy matching.
- Name the fallback when the model is down, slow or unsure: a plain answer, a human handoff or an error.

## 2. Build the eval set before tuning prompts

- Collect 30 to 100 realistic inputs from real data or the people who will use it: typical, hard, ambiguous, out of scope and adversarial ones. Write what a correct result is, or the rule for judging it.
- Score automatically where you can (exact match, schema checks, required facts, forbidden content). Use a model as judge only after checking it against human labels on a sample.
- Run the set on every change to the prompt, the retrieval, the model or its settings. Record scores so a regression is visible. Trying five questions by hand is not a test.

## 3. Prompts and structured output

- Put instructions, examples and the task data in clearly separated parts. Show a few real examples of the format wanted.
- For machine-read output use the provider's structured-output or tool-call feature, validate against a schema, and on failure retry once with the error, then fall back. Never trust `json.loads` on raw text alone.
- Keep the context small. Retrieve the few relevant passages instead of pasting everything, which costs more, is slower and often makes answers worse.
- Pin an exact model version, not a moving alias, and rerun the eval set before moving to a newer one.

## 4. Treat all input as untrusted

- Text from users, web pages, files, emails and retrieved documents can contain instructions (prompt injection). A line in the system prompt saying "never reveal this" or "only do this when appropriate" is not a control.
- Give tools the least power. Check permissions, limits and amounts in code on the server, outside the model. Actions that spend money, delete or send messages need a limit and often a human approval.
- Never run model output as code, SQL or a shell command without validation, and escape it before showing it as HTML.
- Keep secrets out of prompts. Never put the provider API key in a browser or mobile app; call the model from your server, with per-user rate limits (`security-review`).
- Decide what personal data may be sent to the provider and what may be logged (`data-engineering` for retention).

## 5. Make it reliable and affordable

- Set timeouts, retry with backoff on rate limits and server errors, and make tool calls safe to repeat (`api-design`).
- Track tokens, cost and latency per request and per user, and set a spending cap and an alert. Cache repeated work, use a smaller model for easy steps, and stream long answers.
- For retrieval, test the retrieval apart from the answer: is the right passage found? Show sources so users can check.
- For agents, bound the loop (maximum steps, time and cost), log every step and tool call, and stop for a person when unsure.

## 6. Watch it in production

Log inputs, outputs and tool calls with personal data handled on purpose. Collect a simple thumbs up or down and review the failures weekly, adding them to the eval set. Alert on error rate, cost, latency and a drop in quality score (`observability`). Keep a kill switch that turns the feature off without a deploy.

## 7. Launch in steps

Red-team it before launch with the injection and abuse cases. Release to staff or a small share first, with a human handoff and a clear note that answers come from an AI. Widen only when the eval scores and the live feedback hold (`launch-gate`).

## 8. Hand over

Report the task and the measure, the eval set size and scores, the injection tests run, the limits on tools, the cost per request, the model version pinned, what was not tested, and what needs the user's decision (spend cap, data sent to the provider).

## Related skills

- `data-ml-work`: training your own model
