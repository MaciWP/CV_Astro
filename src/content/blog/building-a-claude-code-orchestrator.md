---
title: "Building an orchestration layer for Claude Code: an honest retrospective"
description: "I wanted 5–10 agents working in parallel, dividing the work and talking to each other. It launched one, cost far more tokens, ran slower, and the skills wouldn't even load. Here is what went wrong, why, and the iterative flow I landed on instead."
pubDate: 2026-06-18
tags: ["claude-code", "ai-agents", "orchestration", "developer-tools", "retrospective"]
draft: false
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

For a while, the centerpiece of my work with [Claude Code](https://www.anthropic.com/claude-code) was an orchestration layer I was building on top of it. The idea felt like the obvious next level: instead of one assistant working through a task, have it break the work into atomic pieces and run **five or ten agents in parallel** — each with its own focused context, each owning a well-defined slice, talking to each other to coordinate. More throughput, less context bloat, faster results.

It did the opposite of all three. It cost more, it ran slower, and the quality went down. This is the honest write-up.

## The dream

The shape I was after was a team, not a tool. A "lead" would plan the work and split it; independent pieces would run as separate agents at the same time; each agent would get an isolated context so the main conversation stayed clean; and they'd communicate to hand off the parts that depend on each other. On paper, that's how you turn a single assistant into something that scales.

Claude Code gives you the building blocks — **subagents** for delegation, **skills** for reusable instructions, **hooks** for event-driven scripts. I wired them together into logic that decided when to split work and which skill each step should use.

## What actually happened

The reality, in my own words at the time:

> I thought the next level was having 5 or 10 agents in parallel to go much faster, but it has a lot of drawbacks. There's no communication between them. Often the main session wanted to do the work and I had to force myself to change how I worked — and when I finally managed it, only one agent got invoked, so it spent more tokens, many more, and didn't improve anything: slower, more expensive, lower quality. In the end I removed them all.

Concretely, four things broke:

- **It serialized to a single agent.** Where I expected a fan-out, the system kept launching *one* agent and waiting for it. No concurrency, no speed-up — just an extra layer between me and the work.
- **Token cost multiplied.** Every delegation re-sends context to the agent and summarizes the result back. One delegated run of a single skill cost ~112k tokens and over eight minutes for *zero* parallelism, much of it re-reading files the main session already had. Another time, a review panel I launched late burned ~278k tokens and returned nothing, because the agents hit the session limit before producing a verdict.
- **The agents couldn't talk to each other.** The one thing my "team" idea depended on — coordination — wasn't really there.
- **Skills wouldn't activate.** Agents ignored the skill that should have governed a step. The irony peaked when I realized the orchestration skill *meant to run the whole thing* often never loaded at all — the behavior only happened because I'd also written it into the always-loaded config.

## Why it failed

The interesting part is the diagnosis, because the symptoms have *different* root causes. Lumping them into "agents don't work" hides that.

**The summary bottleneck.** When an agent writes code and hands back a summary, detail is lost in the summary. The lead then has to review code it never "saw born." For write-heavy work, quality drops *by design* — not because of a bad invocation.

**The economics of context.** Each agent re-pays the cost of orienting itself. A fan-out of five pays five times for the context the main session already had amortized. Isolation helps a *reader*; it taxes a *writer*.

**Skills are non-deterministic on purpose.** Claude Code doesn't pick a skill from an index — the model semantically matches your request against each skill's description, and it tends to *under*-trigger. No mechanism forces activation; a hook can only nudge. And a skill loaded in the main session **does not carry over to a spawned subagent** — so my delegated agents started without the very instructions they needed. My fix at the time (rules telling agents to read the skill files manually) was the lowest-leverage option available. The highest-leverage one, which I found later, is almost embarrassing: write more directive descriptions ("Use when…", with concrete triggers). That single change moves activation more than any hook.

**And the reframe that reorganized everything:** even if ten agents *did* generate code in parallel, the bottleneck of the system is *me*. Quality-first means I review and decide serially. Parallelizing the generation doesn't speed the system up — it just moves the queue to me. I was optimizing the part that wasn't the constraint.

## The part I couldn't do: measure it

I want to be honest about a gap. I concluded "it cost more" because it was *obvious*, not because I measured it cleanly. I waived measurement more than once. And that's the genuinely hard problem: these systems are non-deterministic, so the same task delegated twice doesn't cost or behave the same way, and a clean before/after is hard to pin down. I'll need that instrumentation anyway — deciding by doctrine instead of by data only works until the doctrine is wrong.

## What I changed

I stopped trying to make agents do the writing. The system now runs on two rules:

1. **Inline-first.** All build and write work happens in the main session, with direct edits. One agent is never worth it. Agents are reserved for genuinely parallel, *read-only* work, and only when there are enough independent units to justify it.
2. **A structured, iterative flow instead of a swarm.** Work moves through explicit phases — scope, plan, design checks, build, review, retrospective — each with a human gate. Slower per step on paper, but it converges, it's debuggable, and it doesn't burn tokens re-explaining itself. (The trap here is ceremony: a many-step flow can over-process a small task. The fix is adaptive triage — match the weight of the process to the size of the work.)

## What actually worked

Not everything about agents failed — I'd pointed them at the wrong half of the problem. The half that works *today* is the read-only, verification side. Fanning out independent reviewers and having one agent try to *refute* another's finding caught real mistakes every single time I ran it: wrong figures, stale numbers, a miscited claim. That kind of adversarial verification isn't ceremony — it's where the rigor actually lives. An independent reviewer with fresh context changed real outcomes instead of rubber-stamping them. Parallelism there is close to free, and it makes the output better.

## Where I think this goes

I haven't given up on the team idea — agents that divide the work and communicate is still the version of the future I'd bet on. But I'll be honest about the state of it: that's the *least* mature part right now. Cross-agent communication is minimal, agents can't yet take on specialized roles or delegate further, and the whole mode is experimental and expensive. So my plan isn't to force it. It's to keep the writing inline, let agents do the reading and the checking where they already shine, instrument the cost so I can *see* when delegation pays — and pick the team model back up when the tooling, and my measurements, are ready for it.

<!-- TODO: optional — once the poneglyph repo is public, link it here as "the system this post is about." And if you want, name the iterative flow explicitly. -->
