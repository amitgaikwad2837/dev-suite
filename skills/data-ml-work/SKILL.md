---
name: data-ml-work
description: Does machine learning and data analysis work you can trust. Use for training or evaluating a model, accuracy that looks too good, leakage, train and test splits, baselines, metrics, forecasting, A/B test readouts and analysing a dataset. Skip for plain app code (new-app-build), pipelines into a warehouse (data-engineering) and designing a user study (ux-research).
---

# Data and ML Work

Most bad models are not bad because of the algorithm. They answer the wrong question, learn from data they won't have at prediction time, or are scored in a way that hides failure. The work is to make those three problems hard to commit.

## 1. Frame the question

Get these in a few lines, asking only what you can't find in the data or docs:
- **The decision** the output feeds, and who acts on it. A churn score nobody acts on is worthless; a score that triggers a costly offer has to be precise.
- **The prediction target** in one sentence, with its time frame: "customers who cancel within 30 days of the snapshot date".
- **When it runs:** what information exists at the moment of prediction, and how fast the answer must come.
- **The metric** and why: the cost of each kind of error, which sets precision against recall, and what the current process achieves. Accuracy is a poor metric when one class is rare.
- **Success:** the number that makes it worth shipping, and what happens if it isn't reached. Check that ML is needed: a rule, a query or a better dashboard often does the job.

## 2. Look at the data before modelling

- Where it came from, how it was collected, how much there is, and what each column means. Ask who knows the odd columns.
- Missing values, duplicates, impossible values, units, time zones and changes in how a field was filled in over time. Plot distributions and look at real rows.
- The target: how it is labelled, how noisy the labels are, and the class balance.
- Who or what is missing from the data, and whether it matches the population the model will run on.
- Privacy and rights: personal data, consent, protected attributes, and whether the use is allowed (`security-prompter`). Keep raw data out of the repo and logs.

## 3. Prevent leakage and set the baseline

Leakage is when the model sees something at training time that it won't have at prediction time, and it produces great scores and a useless model. Check every feature against the question "would I know this at the moment of prediction?". Typical culprits: fields filled in after the outcome (a cancellation reason, a refund flag), aggregates computed over the whole dataset including the future, IDs and timestamps that encode the label, and duplicates that appear in both train and test.

- **Split to match use.** If the model predicts the future, split by time: train on the past, validate on later data. Group splits by customer, patient or session so one entity isn't in both sides. Fit scalers, encoders and imputers on training data only, ideally inside one pipeline.
- **Keep a test set untouched** until the final check, and don't tune on it.
- **Start with a baseline:** the majority class, a simple rule, last period's value, or logistic regression. A complex model has to beat it by enough to be worth the cost. A score that is too good (a very high accuracy or AUC on a hard problem) is a reason to look for leakage before celebrating.

## 4. Model and evaluate honestly

- Change one thing at a time and keep a log: data version, features, parameters, code commit, random seed and the score. Results that can't be reproduced aren't results.
- Choose the metric from step 1, report it with its uncertainty (cross-validation spread or a confidence interval), and compare against the baseline. For rare classes use precision, recall, a precision-recall curve and a threshold chosen from the cost of errors.
- Check calibration if people will read the scores as probabilities.
- **Look at the errors:** the worst misses, results by segment (region, new versus old customers, groups the model may treat unfairly), and what the model relies on (feature importance, a few explained examples). A good average can hide a bad segment.
- Test it on data that looks like production, including messy and recent data, not only the tidy sample.
- Prefer the simpler model that is nearly as good: it is easier to explain, test and run.

## 5. Put it to work and keep it working

- **Pipeline:** the same feature code for training and for serving, tested, with the data and model versions recorded (`test-strategy`, `release-engineering`).
- **Rollout:** shadow mode or a small share of traffic first, with a human check or a fallback rule, and a way to turn it off. Measure the effect on the real decision with an A/B test where possible, since model scores and business results are different things.
- **Monitoring:** input distributions, prediction distributions, missing data, latency, and the true outcome when it arrives (`observability`). Alert on drift, not only on errors.
- **Retraining:** when and how, who owns it, and how a new model is compared with the current one before it replaces it.
- **Documentation:** a short model card covering the purpose, data, metric, limits, known biases and the owner (`plain-writing`).

Report: the question and metric, data findings and fixes, leakage checks, the baseline and the final score with uncertainty, the error analysis, what can't be claimed, the deployment and monitoring plan, and the next step.

## Related skills

- `llm-app-work`: apps that call a language model
- `data-engineering`: pipelines that feed the model
