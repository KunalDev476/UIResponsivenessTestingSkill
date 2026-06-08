# UI Responsive Testing Skill

This repository contains `ui-responsive-testing-v2`, an agent skill for generating repeatable Playwright responsive UI QA specs.

The workflow is intentionally file-backed and literal. Responsive QA should not depend on broad generative thinking or a different test plan each run. It should keep the same six-test matrix, the same file locations, the same screenshot hooks, and the same review handoff behavior so results are more consistent.

The skill follows the common `SKILL.md` agent skill structure used by the skills ecosystem. It is designed to be usable with Claude, Cursor, and Codex through the prompts below. Cross-agent behavior should still be validated in your own environment because each agent loads and follows skills differently.

## What This Skill Does

For one target URL, the skill generates a Playwright spec under `tests/ui-responsive/`.

For each enabled viewport, it creates exactly six grouped tests:

1. Runtime health.
2. Visible main-content links.
3. Main-content buttons and CTAs.
4. Page sections.
5. Images, icons, and media.
6. Layout integrity screenshots and AI review hooks.

Generated output is written to:

```text
test-results/
```

## Repository Layout

```text
ui-responsive-testing-v2/                      # Main skill
ui-responsive-testing-v2/SKILL.md
ui-responsive-testing-v2/reference/
ui-responsive-testing-v2/templates/
ui-responsive-testing-v2/agents/qa-visual-review-monitor.toml
tests/ui-responsive/                           # Generated specs and run config
playwright.config.ts                           # Playwright config
package.json                                   # Playwright dependency and scripts
```

## Setup

Install NVM if it is missing:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
```

Use Node 22:

```bash
nvm use 22
```

Install dependencies:

```bash
npm install
```

## Chromium

The generated tests use Playwright Chromium. Check whether the Playwright-managed Chromium browser is installed and can report its version:

```bash
node -e "const { chromium } = require('playwright'); const { execFileSync } = require('node:child_process'); console.log(execFileSync(chromium.executablePath(), ['--version'], { encoding: 'utf8' }).trim())"
```

If Chromium is missing, install it with:

```bash
npx playwright install --with-deps chromium
```

## Monitor Agent

This skill also hands off screenshot review to the `qa-visual-review-monitor` agent defined here:

```text
ui-responsive-testing-v2/agents/qa-visual-review-monitor.toml
```

How it works:

1. The generated layout test captures screenshot slices into `test-results/[page-slug]/screenshots/`.
2. The spec writes `pending-ai-review` hook rows into `test-results/[page-slug]/test-result.md`.
3. The skill spawns the monitor agent once per workspace session and reuses it if it is already active.
4. The monitor reads each screenshot slice in order, reviews layout issues, performs a strict spelling audit, appends review sections to `test-result.md`, and updates the processed hook row from `pending-ai-review` to `ai-review-completed`.
5. If the monitor is sleeping, has timed out, has exited, or the skill misses the handoff by chance, manually spawn it with the prompt below.

Manual monitor prompt:

```text
Use the qa-visual-review-monitor monitor agent defined in ui-responsive-testing-v2/agents/qa-visual-review-monitor.toml to process pending AI review hooks.
```

## Codex Usage Prompt

```text
Use ui-responsive-testing-v2 for https://example.com/case-study/. 
```

## Claude Usage Prompt

```text
Read ui-responsive-testing-v2/SKILL.md and follow it exactly to test https://example.com/case-study/.
```

## Cursor Usage Prompt

```text
Read ui-responsive-testing-v2/SKILL.md and follow it exactly to test https://example.com/case-study/.
```

## Running Test Cases

After a spec is generated and `tests/ui-responsive/qa-run-config.json` has the desired devices enabled, run:

```bash
npx playwright test --ui --headed --debug --workers=1
```

If the test cases do not appear in the Playwright UI, check `tests/ui-responsive/qa-run-config.json`. The devices may be set to `false`; enable at least one device such as `desktop`, `tablet`, or `mobile`.

After the Playwright run finishes, the monitor agent should process any `pending-ai-review` hooks. If it does not, use the manual monitor prompt above.

## Playwright UI Troubleshooting

If test cases do not appear in the Playwright UI, check this file:

```text
tests/ui-responsive/qa-run-config.json
```

The devices may be set to `false`. At least one device must be enabled, for example:

```json
{
  "devices": {
    "desktop": true,
    "tablet": false,
    "mobile": false
  }
}
```
