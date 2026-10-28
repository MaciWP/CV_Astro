---
title: "Claude Code hooks: turning written rules into ones the agent can't skip"
description: "My Claude Code setup ignored its written rules, so I measured how often and moved the costly ones into hooks. What the data showed and the hook that blocked me."
pubDate: 2026-10-26
tags: ["claude-code", "hooks", "ai-agents", "developer-tools"]
draft: false
---

<!--
  OWNER NOTE (not rendered): every number below comes from the header comments
  of the hooks in the poneglyph repo (.claude/hooks/*.ts), measured on 14 days of
  your own transcripts. The remote-git-gate story happened on 2026-10-13 while
  shipping this site. Correct anything that reads wrong, then set draft: false.
-->

After [the orchestration experiment](/blog/building-a-claude-code-orchestrator) I kept one thing: a personal layer on top of [Claude Code](https://www.anthropic.com/claude-code) that I call Poneglyph. It is [public on GitHub](https://github.com/MaciWP/poneglyph). It holds a `CLAUDE.md` with my working rules, an output style, 21 skills and a set of hooks. This post is about the hooks, because they are the part that changed how the agent behaves.

## Written rules are suggestions

My `CLAUDE.md` says things like "answer every skill suggestion before starting", "write progress notes in Spanish" and "ask decisions through the question tool". I assumed the model followed them. Then I counted, over 14 days of real transcripts:

| Rule | How often it was followed |
|---|---|
| Answer the skill router before starting | 39 % |
| Progress notes in Spanish | 80 % |
| Load the config skill before editing config | 62 % |
| Ask decisions through the question tool | ~20 % |

Even worse: in 36 of the 60 misses on the first rule, the model had already read the note it was ignoring. More text in the prompt would not fix that. So I stopped adding rules and started asking a different question for each one: can a script check it?

## Hooks that save money

The first hooks I wrote were about cost, because cost is easy to measure.

**Headless runs on the wrong model.** On 2026-09-03 my main session launched 82 `claude -p` runs in one day. 44 of them ran on Opus because nobody passed `--model`, and 29 on Fable on purpose. The rule "pick the cheap model for background work" was already written down. `headless-model-gate.ts` now checks every `claude -p` command before it runs.

**Subagents past the price step.** Haiku bills a request whose prompt passes 100k tokens at 5x. Over 14 days, 13 % of my Haiku subagent requests went past it, the largest at 248k. `haiku-context-brake.ts` narrows a file read that would carry a Haiku agent past 90k, and Haiku now compacts near 87k.

**Context full of file dumps.** Tool results were 56 % of the conversation context. The heaviest commands were `cat` (365k characters, including the same 28 KB plan read four times in one session) and `sed -n` (273k). `bash-output-shaper.ts` keeps whole-file dumps and unbounded listings out of the context.

## Hooks that gate

Some rules protect things I can't undo. The clearest one: the agent only pushes, opens pull requests, merges or deletes remote branches when I asked for that in the current message. `remote-git-gate.ts` reads my last message and blocks the command otherwise.

It works, and on 2026-10-13 it was too strict with me. While shipping this site I approved a merge by picking an option in the question tool, and the hook blocked it: it only reads what I type. Then I typed "abre las PR" ("open the PRs") and it blocked that too, because it matched the singular "abre la PR". I had to type the exact phrase. A gate that blocks the person it protects has a bug: it should understand what I mean, and for now it only matches exact words. I'm leaving it strict until I fix that properly, because a gate that is too loose is worse.

Not every hook should block. `security-gate.ts` scans recently changed files for secrets and only warns. A false positive there would stop work for no reason, and a warning is enough for me to look.

## Routing skills with a cheap model

With 21 skills, the agent has to know which one fits a prompt. My first attempt used keyword hints. On a held-out evaluation they scored 0.07, with false positives. Now `prompt-router.ts` sends each prompt to a cheap model, asynchronously, while the main model already works. It returns up to three skills and fixes misheard words from dictation. It scores about 0.8 on the same evaluation.

## What I'd tell someone starting

- Count before you write a rule. My transcripts showed which rules failed, and they weren't the ones I expected.
- Move a rule into a hook only when a script can check it cheaply and reliably. Everything else stays as text.
- Decide for each hook whether it warns or blocks. Block only what you can't undo.
- Test the gate against yourself. Mine taught me that it has to accept every way I give an order, not just one phrase.
