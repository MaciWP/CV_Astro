---
title: "Building an orchestration layer for Claude Code: an honest retrospective"
description: "I wanted 5–10 agents working in parallel, dividing the work and talking to each other. It launched one, cost far more tokens, ran slower, and the skills wouldn't even load. Here is what went wrong, why, and the iterative flow I landed on instead."
pubDate: 2026-06-18
tags: ["claude-code", "ai-agents", "orchestration", "developer-tools", "retrospective"]
draft: false
heroImage: "/images/blog/orchestration.svg"
heroImageAlt: "Abstract diagram: a lead node fanning out into parallel agents that converge into a single result"
---

<!--
  OWNER NOTE (not rendered): drafted from your own account, the plan/retro
  documents in the poneglyph repo, and our development conversations. Read it end
  to end — it's your story and your voice; correct anything that rings false.
  No metric here is invented:
    - "112k tokens / 8m15s / zero parallelism" is from plan 007's retro (one
      delegated skill run).
    - "~278k tokens for zero verdicts" is from plan 017's retro (a late review
      panel that hit the session limit).
  Both are real and yours — keep or cut them as you prefer. Nothing is public
  until you `git push`.
-->

For a while, most of my work with [Claude Code](https://www.anthropic.com/claude-code) went into an orchestration layer I was building on top of it. The next step seemed obvious. Instead of one assistant working through a task, it would split the work into small pieces and run **five or ten agents in parallel**. Each agent would get its own focused context and its own slice of the work, and they would talk to each other to coordinate. I expected more throughput, less context bloat and faster results.

I got the opposite on all three counts. It cost more, ran slower, and the quality went down. Here is what happened.

## The plan

I wanted a team. A "lead" agent would plan the work and split it. Independent pieces would run as separate agents at the same time, each with an isolated context so the main conversation stayed clean, and they would hand off to each other wherever one piece depended on another. On paper, that turns a single assistant into something that scales.

Claude Code has the building blocks: **subagents** for delegation, **skills** for reusable instructions and **hooks** for scripts that run on events. I wired them into logic that decided when to split the work and which skill each step should use.

## What actually happened

This is how I described it at the time:

> I thought the next level was having 5 or 10 agents in parallel to go much faster, but it has a lot of drawbacks. There's no communication between them. Often the main session wanted to do the work and I had to force myself to change how I worked — and when I finally managed it, only one agent got invoked, so it spent more tokens, many more, and didn't improve anything: slower, more expensive, lower quality. In the end I removed them all.

Four things broke.

1. **It ran one agent at a time.** I expected a fan-out, and the system kept launching a single agent and waiting for it. There was no concurrency and no speed-up, only an extra layer between me and the work.
2. **Token cost multiplied.** Every delegation sends the context to the agent again and summarizes the result back. One delegated run of a single skill cost about 112k tokens and over eight minutes with no parallelism at all, much of it spent re-reading files the main session already had. Another time, a review panel I launched late used about 278k tokens and returned nothing, because the agents hit the session limit before giving a verdict.
3. **The agents couldn't talk to each other.** My whole idea of a team depended on coordination, and it wasn't really there.
4. **Skills didn't load.** Agents ignored the skill that should have guided a step. The orchestration skill that was supposed to run everything often never loaded either. The behaviour only happened because I had also written it into the always-loaded config.

## Why it failed

The symptoms have different causes, and calling it all "agents don't work" hides that.

**Summaries lose detail.** When an agent writes code and hands back a summary, part of the detail stays behind. The lead then reviews code it never saw being written. For work that is mostly writing, quality drops because of how delegation works, even when every call is correct.

**Context has a price.** Every agent pays again to get its bearings. A fan-out of five pays five times for context the main session already had. Isolation helps an agent that only reads, and it costs an agent that writes.

**Skills don't load deterministically.** Claude Code doesn't pick a skill from an index. The model compares your request with each skill's description, and it tends to load too few. Nothing forces a skill to load; a hook can only remind the model. A skill loaded in the main session also **does not carry over to a subagent**, so my delegated agents started without the instructions they needed. My fix at the time was rules telling agents to read the skill files by hand, which was the weakest option. The one that works best, which I found later, is simple: write descriptions that say when to use the skill ("Use when…", with concrete triggers). That change does more for activation than any hook.

**The bottleneck was me.** Even if ten agents had written code in parallel, I review and decide one thing at a time, because I care about quality more than speed. Parallel generation would only have moved the queue to my desk. I was optimizing a part of the system that wasn't the constraint.

## The part I couldn't do: measure it

There is a gap I should admit. I concluded that it cost more because it was obvious, not because I measured it properly, and I skipped measurement more than once. That is the hard problem here. These systems are non-deterministic: the same task delegated twice won't cost or behave the same, so a clean before-and-after is hard to get. I need that instrumentation anyway, because deciding by doctrine only works until the doctrine is wrong.

## What I changed

I stopped asking agents to write. The system now runs on two rules.

1. **Inline first.** All building and writing happens in the main session, with direct edits. Handing a write task to a single agent is never worth it. Agents are only for read-only work that can run in parallel, and only when there are enough independent pieces to justify it.
2. **A structured flow with human checkpoints.** Work moves through explicit phases (scope, plan, design checks, build, review, retrospective), and I approve the step from one phase to the next. Each step is slower on paper, but the work converges, I can debug it, and it doesn't burn tokens explaining itself again. The risk is ceremony: a many-step flow can overload a small task. So the weight of the process now depends on the size of the work.

## What actually worked

Agents did fail at writing, but they are good at reading and checking, and that half works today. I fanned out independent reviewers and had one agent try to refute another's finding. It caught real mistakes every time I ran it: wrong figures, stale numbers, a claim with the wrong source. A reviewer with fresh context changed real outcomes instead of approving whatever it was shown. Running those reviewers in parallel costs very little, and the result is better.

## Where I think this goes

I still believe in the team idea. Agents that split the work and talk to each other is the future I'd bet on. Right now it is also the least mature part: agents barely communicate, they can't take on specialized roles or delegate further, and the whole mode is experimental and expensive. So I won't force it. I'll keep the writing inline, let agents do the reading and checking where they already work well, and measure the cost so I can see when delegation pays off. When the tooling and my measurements are ready, I'll try the team model again.

The system this post is about is [Poneglyph](https://github.com/MaciWP/poneglyph), and it's public.
