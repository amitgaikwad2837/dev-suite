Adding a rule per bug report won't fix this. A prompt rule like "don't invent parameters" tells the model what you want, but it doesn't change why it invents them. Fourteen rules is also a sign you're patching symptoms: rules start to conflict, they dilute each other, and you have no way to tell whether rule 15 broke something that rule 6 fixed.

Why it happens, usually one or more of these:

1. Retrieval misses the page. The right reference chunk wasn't retrieved, so the model fills the gap from general knowledge of what an API like yours "would" have. This is the most common cause.
2. Chunking splits things badly. Parameter tables get separated from the endpoint name, so the model sees a name with no list, or a list with no name.
3. The model is allowed to answer without support. Nothing forces it to say "I don't see that in the docs."
4. Similar APIs in training data. The model blends in parameters from other products.

What I would do, in order:

**1. Build an eval set first (a day or two of work, and the most valuable step).**
Collect every wrong answer reported so far, plus a few dozen real questions. For each, record the question and the correct parameters, taken from your OpenAPI spec or docs source. Run the bot on all of them and score it. Without this, you can't tell whether any change helps or hurts. Every future bug report becomes a new test case instead of a new prompt rule.

**2. Diagnose each failure by splitting retrieval from generation.**
For each failing case, check whether the correct doc chunk was in the retrieved context.
- If it wasn't, this is a retrieval problem. Look at chunking (keep each endpoint with its full parameter table), hybrid search (keyword plus embeddings, since parameter names are exact tokens that embeddings handle poorly), metadata filters by endpoint or version, and reranking.
- If it was there and the model still invented something, it's a generation problem. Go to step 3.

**3. Constrain generation instead of asking nicely.**
- Require grounding: answer only from the provided context, and quote or cite the doc section for each parameter. Citations make invention visible and checkable.
- Give an explicit way out: "If the retrieved docs don't list this parameter, say so and link the reference page."
- Use structured output for parameter answers, with each parameter paired with a source chunk ID.

**4. Add a deterministic check after generation.**
This is the real fix for invented parameters. Since you have a closed set of valid parameters (the spec), extract the parameter names from the answer, including those in code blocks, and verify them against the spec for that endpoint. If one doesn't exist, either regenerate with the error fed back, strip it, or fall back to "see the reference." A validator catches the whole class of bug, whereas a prompt rule only covers the one case someone reported.

**5. Clean up the prompt.**
Once the eval and validator exist, collapse the 14 rules into a short set of general principles (answer from context only, cite sources, say when unsure). Remove rules one at a time and check against the eval set. Keep only the ones that measurably help. Many of them are probably redundant or are quietly causing other problems.

**6. Keep it from regressing.**
Run the eval in CI on any change to the prompt, chunking, embedding model or LLM version. Log production answers, and sample the ones where the validator fired or the user gave a thumbs-down. Those become new eval cases.

If you only do two things, do the eval set and the spec-based parameter validator. Together they take you from "someone complained, we tweaked the prompt" to measurable, testable behavior.

If you tell me how your docs are stored (OpenAPI spec? markdown?), how you chunk and retrieve, and which model you use, I can suggest specific changes and help sketch the validator and eval harness.
