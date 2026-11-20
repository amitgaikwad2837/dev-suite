Adding a 15th rule won't fix this. Each rule patches one reported question, the model doesn't treat rules as hard controls, and you have no way to tell whether rule 14 broke something that rules 3 and 9 used to handle. Stop patching and put a measurement and some structural controls in place.

## 1. Build an eval set first (this week)

- Collect 50 to 100 real questions. Start with every wrong-answer report you've had, since each one is already a test case. Add typical questions, ambiguous ones, questions about parameters that don't exist, and out-of-scope ones.
- For each question, write what a correct answer looks like. For "invented parameter" cases that is easy to check automatically: extract every parameter name in the answer and compare it against the real list from your API spec or OpenAPI file. Anything not in the spec is a failure. No model judge is needed.
- Run the set on every change to the prompt, the retrieval, the chunking or the model. Record the scores. Right now you have no number, so you can't say whether any of the 14 rules helped.

## 2. Find out where the invention happens

Test retrieval separately from the answer. For each failing case, check whether the right doc page was retrieved.

- **Right passage retrieved, but the model invented a parameter anyway.** This is a generation problem. See point 3.
- **Right passage not retrieved.** The model is filling a gap from what it knows about similar APIs. Fix chunking, search, or add keyword/hybrid search so exact parameter names match. Changing the prompt won't help here.

My guess is that most of your failures are the second kind, but the eval will tell you.

## 3. Structural fixes that replace most of the rules

- **Validate in code after generation.** Extract parameter names from the answer and check them against the real parameter list from your spec. If one doesn't exist, retry once with the error, then fall back to "I couldn't find that in the docs, here is the closest page." This is a real control. A prompt rule is only a request.
- **Ground the answer.** Ask for the answer plus a quote or reference to the retrieved passage supporting each parameter, with citations in a structured output field. Check in code that each cited parameter appears in the retrieved text. Show sources to users so they can verify.
- **Give it a way to say no.** If nothing retrieved mentions the parameter, the correct output is "not documented." Include that case in your eval set.
- **Keep the context small and relevant.** Retrieve a few good passages rather than pasting everything. Include the reference page for the endpoint being asked about when you can detect it.
- **Pin an exact model version** and rerun the eval set before upgrading. A moving alias can change behaviour without any edit on your side.

## 4. Clean up the prompt

Once the eval set exists, cut the 14 rules down. Merge duplicates, remove rules that were never tied to a failing case, and keep only those that measurably help. Remove one rule at a time and see whether the score moves. A shorter prompt with clear separate sections (instructions, examples, retrieved docs) usually performs better than a long list of patches. From now on, a reported wrong answer becomes a new eval case first, and a prompt change only happens if it improves the set without lowering other scores.

## 5. Production

Log question, retrieved passages and answer, with personal data handled on purpose. Add a thumbs up/down, review the downvotes weekly and add them to the eval set. Alert if the validator rejects more than a normal share of answers. Keep a switch to turn the bot off without a deploy. Also treat retrieved docs as untrusted text (they could contain instructions), and keep the provider key on your server only.

## What I'd do in order

1. Export the reported wrong answers and build the eval set with the spec-based parameter check.
2. Measure the current score and the retrieval hit rate.
3. Add the post-generation validator and fallback.
4. Fix retrieval if that's where the misses are.
5. Prune the prompt against the scores.

I haven't run any of this, so I can't say what your current failure rate is or how much each step will move it. If you can share the prompt, how docs are chunked and a few of the reported bad answers, I can say more specifically which of the two causes is likely and draft the validator. Decisions for you: what the bot should say when it can't find something, and whether answers with unverified parameters should be blocked or shown with a warning.
