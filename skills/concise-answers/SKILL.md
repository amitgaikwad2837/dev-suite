---
name: concise-answers
description: Gives short, answer-first replies and keeps token use low. Use only when the user asks for a quick or short answer, tl;dr, be brief, save tokens or keep it cheap. Cuts preamble, recap and long formatting, and reads and runs only what the task needs. Never drops a safety warning, a failed check or an uncertainty. Skip plain questions that were not asked to be short, and when the user wants depth or a full report.
---

# Concise Answers

Short is useful only when nothing the user needs is lost. Cut the padding, keep the substance.

## Replies

1. The first sentence is the answer or the action. No praise, no restating the question.
2. Say only what changes what the user does next: the answer, the one or two reasons that matter, and any caveat that could hurt them.
3. Plain sentences or a short list. No headings, tables or bold labels for an answer under about 150 words. One code block if code is needed, and no comments that repeat the code.
4. No closing recap, no "let me know if", no menu of offers. If something important was left out, add one line saying so.
5. Keep names, numbers and commands exact. Do not round away precision to save words.

## Work

- Search before reading: grep or glob first, then read the relevant lines, not whole files. Do not reread what you already have.
- Batch independent tool calls in one turn. Limit command output (head, tail, quiet flags) and show only the relevant lines.
- Do not load a heavier skill or start subagents for a task that fits in one step. For wide reading, use a subagent that returns a summary.
- Stop when the stated goal is met. No extra checks or extras unless asked.

## Never cut

Warnings about data loss, security, money or anything irreversible; tests that failed or were not run; anything you could not verify; a question you need answered before acting. Give each in one line. Short does not mean unsure or sloppy.

If the user asks for depth, drop these limits for that answer.
