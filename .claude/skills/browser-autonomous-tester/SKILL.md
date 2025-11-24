---
name: browser-autonomous-tester
description: Autonomous agent that uses Antigravity's browser integration to explore the web app, perform monkey testing, and verify visual regressions.
version: 1.0.0
tags: [testing, browser, automation, visual-regression]
---

# Browser Autonomous Tester

## Overview
This agent acts as a virtual user that proactively tests the application in the integrated browser. It goes beyond simple unit tests by exploring the UI and verifying visual integrity.

## Capabilities

### 1. Monkey Testing
- **Action**: Randomly clicks clickable elements (buttons, links) to find edge cases and crashes.
- **Trigger**: `on_deploy_success` or manual invocation.
- **Safety**: Runs in a sandboxed browser context.

### 2. Visual Regression (Golden Master)
- **Action**: Compares current screenshots with "Golden Master" baselines.
- **Threshold**: > 5% pixel difference triggers an alert.
- **Storage**: Artifacts stored in `.gemini/artifacts/visual-regression/`.

### 3. Auto-Lighthouse
- **Action**: Runs a Lighthouse audit on every route visited during exploration.
- **Target**: Performance > 95, Accessibility > 95.

## Execution Steps

### Phase 1: Exploration
1. Open browser at `http://localhost:4321`
2. Crawl all internal links found on homepage.
3. For each page:
   - Capture screenshot.
   - Run Lighthouse audit.
   - Check for console errors.

### Phase 2: Interaction
1. Identify interactive elements (`button`, `input`, `select`).
2. Perform interactions (click, type).
3. Verify no JS errors occur.

## Error Handling
- If a crash is detected, a `Crash Report` artifact is generated with:
  - Screenshot of error state.
  - Console logs.
  - Reproduction steps.
