---
name: ux-research
description: Finds out what users need and whether a design works, before or after building. Use for user interviews, surveys, usability tests, personas, whether people want a feature, why trial users do not convert, and reading feedback. Skip for visual design (frontend-design), polishing a built screen (ui-polish) and deciding requirements with a stakeholder (requirements-interview).
---

# UX Research

Research exists to change a decision. Asking people what they want is a weak way to find out: they describe what they imagine they would do, not what they do. Good research watches behaviour, asks about the past, and says how sure it is.

## 1. Start from the decision

Before any method, get these in a few lines:
- **The decision** this will inform: build or not, which of two designs, what to fix first, who to target. If no decision depends on the answer, don't run the study.
- **The questions** it must answer, as things you could be wrong about ("do new users find the import step?"), not topics ("understand onboarding").
- **What is already known:** analytics, support tickets, sales calls, past studies, competitor behaviour. Look at these first, since they are free and show where to look.
- **The audience:** who the users are, who they are not, and how to reach them. Beware of asking only friendly or easy-to-reach people.
- **The time and budget,** so the method fits.

## 2. Pick the lightest method that can answer it

| You need to know | Use | Rough size |
|---|---|---|
| Why people do or don't do something, what their situation is | Interviews about past behaviour | 5 to 8 per segment |
| Whether people can use a design | Usability test on real tasks, thinking aloud | 5 per round, then fix and repeat |
| How many, how often, how much | Survey or analytics | Hundreds, not a handful |
| Which of two versions performs better | A/B test with a metric chosen in advance | Enough traffic to see the effect (work it out first) |
| Where people look for things | Card sort, tree test | 15 to 30 |
| What happens in real life over time | Diary study or field visit | Few, deep |
| What the feedback pile says | Theme the support tickets, reviews and calls | All of it, sampled honestly |

A few interviews find problems; only a larger sample shows how common they are. Don't present small-sample counts as percentages.

## 3. Write it so it doesn't lead

- **Interview:** open questions about the last time something happened ("tell me about the last time you booked a trip"), not opinions about the future ("would you use a feature that..."). Ask for stories and what they did next. Never pitch the idea during discovery. Listen more than talk, follow up with "why" and "what happened then", and ask to see the real tool, file or workaround.
- **Usability test:** give tasks as goals in the user's words ("find out when your order arrives"), never the name of the button. Don't help or explain; note where they hesitate, misread or fail, and what they say. Test with the real product or a prototype, not a description.
- **Survey:** one question per item, neutral wording, balanced answer options with "none" and "don't know", no leading or double-barrelled questions, and the short ones first. Ask about what people do now, not what they might do. Say what you will do with the data. Pilot with two people before sending. Think about who answers: people who reply are usually the keen ones, so a high yes rate from volunteers says little about everyone else.
- **A/B test:** state the hypothesis, the single main metric, the sample size and the run length before starting, and don't stop early when it looks good.

Get consent, tell people how their data is used, keep notes free of identifying details, and pay or thank participants fairly. Personal data follows the privacy rules that apply (`security-prompter`).

## 4. Analyse honestly

- Write observations (what happened) separately from interpretations (why), and keep a quote or a count behind every finding.
- Group by pattern across participants. One person saying something is a lead; the same behaviour in several is a finding.
- Rate each finding: how many hit it, how badly, and how sure you are. Say plainly what the study can't tell you, such as demand at scale from eight interviews.
- Watch for your own bias: remembering what supports what you hoped, treating the loudest voice as typical, and taking praise ("I'd definitely use that") as evidence of behaviour.
- Personas, journey maps and similar documents come after findings, built from them, and kept short. A persona invented without data is fiction.

## 5. Turn findings into action

For a new feature, prefer the cheapest test of real behaviour over asking: a fake-door button that counts clicks, a prototype, a manual version run by hand for a few users, or a waitlist. Stated interest is a reason to test, not a reason to build.

Report: the decision and questions, who took part and how they were found, the method, the findings ranked with evidence and confidence, what was not answered, and a recommendation tied to the decision with the next step (fix, build, test further or stop). Share the raw notes or recordings where consent allows. Hand design problems to `frontend-design` and `ui-polish`, and requirements to `requirements-interview`, and say how you will check that the change helped (`web-quality`, analytics, or a repeat test).
