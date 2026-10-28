---
title: "Agentic OS: three decisions behind a cockpit for several coding agents"
description: "I run Claude Code, Codex and Grok side by side, so I built a local app that shows which one needs me. Why the terminals live in their own process, why agent state comes from the harness's files, and why every piece of state has one owner."
pubDate: 2026-11-09
tags: ["ai-agents", "claude-code", "typescript", "bun", "architecture"]
draft: true
---

<!--
  OWNER NOTE (not rendered): every fact below comes from the public repo
  MaciWP/agentic-os: README.md and docs/adr/0003-terminals.md,
  0008-agent-state-resume-usage.md and 0013-state-ownership.md, read on
  2026-10-26. No employer data. pubDate is a placeholder for week 3 of the
  visibility plan; set the real date when you publish. Check the first two
  paragraphs: they describe your day in your voice, and only you can confirm
  them.
-->

On a normal day I have several coding agents running at once: Claude Code on one ticket, Codex on another, a third one reviewing a pull request. Each runs in its own terminal, and each stops now and then to wait for me. What cost me time was finding out which one had finished, which one was asking for a permission, and which one was still working.

So I built [Agentic OS](https://github.com/MaciWP/agentic-os), a local app that puts my tickets, pull requests, notes, saved prompts and the agent terminals in one window. It answers one question: what needs me now? It is a single-user app on `localhost`, built with Bun, Hono, SQLite and React 19, and every architectural decision has an ADR in the repo, 16 so far. Three of them shaped the rest.

## 1. The terminals live in their own process

A PTY that lives inside the web server dies with it, and while I work on the app, `bun --watch` restarts the server on every save. Losing every agent on each save was not an option.

So the terminals belong to a separate PTY host process. The server starts it detached, in its own session, so a Ctrl+C on the server never reaches it, and the next server reuses it. The host listens only on 127.0.0.1, every request needs its token, and it refuses any request that carries an `Origin` header, so no web page can reach it. When the server restarts, from `bun --watch`, a Ctrl+C or a crash, the agents keep running and the browser reattaches.

Reattaching is the part that needed care. The host keeps each screen in a server-side `@xterm/headless`, 5,000 lines deep. Output, resize and attach run through one serial queue per terminal, so an attach serializes the screen at that moment and then forwards everything after it. A new window gets no gaps and no duplicates. A splitter holds back a trailing escape sequence or UTF-8 character until it is complete, so a snapshot never cuts a character in half.

The browser never sends a path or a command. It sends a harness id and a location id, and the server maps them to a fixed argv and a directory resolved with `realpath`. A WebSocket upgrade needs an exact Host and Origin, because browsers apply no CORS to WebSockets, and then a one-use token: 32 random bytes, valid for 30 seconds, bound to the terminal and the Origin.

The ADR also states what this does not give me. Terminals survive a server restart, not a host restart. The working directory is only where an agent starts and gives no isolation: agent terminals run with permission bypass, and the UI says so.

## 2. Agent state comes from the harness's own files

At first the app guessed whether an agent was working by counting output bytes. Output bytes say when the terminal is busy, which is only a rough hint of what the agent is doing.

Now the server reads what each harness already writes about itself, and injects nothing into a launch. For Claude Code that is `~/.claude/sessions/<pid>.json`. For Codex it is the session file under `~/.codex/sessions` that the terminal's process holds open, found with one `lsof` call for every running Codex. That replaced a match by folder and start time, which gave several Codex terminals in one folder no session at all and missed resumed ones.

The result is three states: `working`, `needs_you` and unknown. Unknown falls back to the old byte count. The limits are written down too. Codex records no approval request, so a Codex waiting on a permission reads as working. Grok exposes a session id but no working or needs-you state, so it stays unknown.

The same files give the session id, and it follows `/clear`. That is the id the app resumes after a host restart, so an agent's terminal comes back where it was.

## 3. Every piece of state has one owner

An architecture review of the app found state with no clear owner: twelve web files reading and writing browser storage under unprefixed names, module-level variables, and SQLite tables written from two processes. State with two writers drifts. State with no stated owner gets a second writer by accident.

The rule since then: one module owns each piece of state and is the only code that writes it. Everything else reads through the owner's functions, or over HTTP when it lives in another process. The server is the truth and the browser keeps caches and preferences, so losing browser storage loses a preference, never a record. Each browser storage key is declared once with a zod schema and a default, and reads never throw. Secrets live only in the macOS Keychain, and the PTY host never reaches it.

A rule like this only holds if something checks it, so a test enforces the browser storage and store rules and lists the files that have not moved yet.

## What I would keep

The habit I would keep is the ADR for each decision. Each one records the options it rejected and why, and states what the decision does not give me, like the limits above. When a rejected option looks attractive again, the reasoning is already written down.

The repo has more than 2,000 unit tests and 44 Playwright end-to-end specs, and `bun run check` runs the type check, Biome and the unit tests. The code is public to read at [github.com/MaciWP/agentic-os](https://github.com/MaciWP/agentic-os).

Also on this blog: [Claude Code hooks: turning written rules into ones the agent can't skip](/blog/claude-code-hooks-that-enforce-the-rules) and [Building an orchestration layer for Claude Code: an honest retrospective](/blog/building-a-claude-code-orchestrator).
