---
name: ui-responsive-testing-v2
description: OPT-IN ONLY - Generates focused Playwright responsive UI QA specs for runtime health, links, CTAs, sections, media, layout screenshots, and strict spelling review. Use when the user explicitly names ui-responsive-testing-v2 or asks for v2 responsive UI QA generation. The skill generates specs and monitor handoff only; it does not run tests.
---

# UI Responsive Testing v2

Load this skill only when the user explicitly names `ui-responsive-testing-v2` or asks for v2 of the responsive UI testing workflow.

## Purpose

Generate a focused, repeatable Playwright QA spec for one URL. The generated spec validates:

1. Runtime health.
2. Visible main-content links.
3. Main-content buttons and CTAs.
4. Page sections.
5. Images, icons, and media.
6. Layout integrity screenshots and AI review hooks.

Never run the generated Playwright tests as part of this skill. Provide commands with `--workers=1` for the user to run.

## Required References

Read only the references needed for the current task:

- `reference/test-matrix.md` - exact six-test matrix.
- `reference/helpers.md` - inline helper requirements.
- `reference/reporting.md` - result file, screenshots, and AI hook status behavior.
- `reference/visual-review.md` - monitor handoff and strict spelling review.
- `reference/non-negotiable-rules.md` - scroll, grouping, exclusion, hook, and spelling rules.
- `reference/spec-self-check.md` - pre-completion checklist.
- `reference/platform-adapters.md` - WordPress, Elementor, and similar page adapters.
- `templates/playwright-spec-skeleton.ts` - canonical spec shape.

## Non-Negotiable Behavior

- Generate exactly six grouped tests per enabled viewport: runtime health, links, CTAs, sections, media, and layout integrity.
- Group tests under `test.describe(vp.name, ...)` for each enabled viewport. Do not flatten viewport tests at file scope.
- Put `test.describe.configure({ mode: 'serial' })` at file top.
- Keep all helpers inline in `tests/ui-responsive/[page-slug].spec.ts`.
- Exclude header, nav, mobile menu, footer, and their descendants from validation, screenshots, spelling, and AI review.
- Use `classList.contains()` in ancestor exclusion checks. Do not use substring checks against `className`.
- Call `ensureInViewport()` before every check, highlight, click, screenshot, or section capture.
- Section checks must draw a visible `highlightSectionBand` and overlay `SECTION n/N - {label}`.
- Layout tests must capture content-zone screenshot slices, log `[QA_AI_ANALYSIS_READY]`, and write `pending-ai-review` hook rows.
- After the monitor reviews a viewport, it must update that processed hook row from `pending-ai-review` to `ai-review-completed`.

Do not generate removed v1 categories: forms, dynamic widgets, page rendering/framework integrity, or accessibility smoke tests.

## Workflow

### 1. Live Inventory

Require a full `https://` URL. Derive `PAGE_SLUG` from the last path segment, using `home` for the root path.

Confirm HTTP 2xx before generating files. Record:

- title
- meta description when available
- H1 text and count
- platform signals
- main CTA hints
- main-content image/media count
- section hints

If the URL is unreachable, report the status and stop.

### 2. Generate Or Update Spec

Write `tests/ui-responsive/[page-slug].spec.ts`.

The spec must:

- Use the exact six-test matrix.
- Keep runtime-discovered links, CTAs, sections, and media as plain objects.
- Track `LAYOUT_HOOK_VIEWPORTS` after successful screenshot capture.
- Append to `test-results/[page-slug]/test-result.md`.
- Write layout screenshots to `test-results/[page-slug]/screenshots/`.
- Include `Target URL: [url]` in each test run block.
- Use `ai-review-completed` for already reviewed viewports and `pending-ai-review` for new hooks.

Create `tests/ui-responsive/qa-run-config.json` only if missing. Devices default to `false`; preserve existing device settings when updating an existing config.

### 3. Self-Check

Before completion, check the generated spec against `reference/spec-self-check.md`.

At minimum verify:

- serial mode exists
- each enabled viewport has six tests
- no removed v1 categories exist
- `ensureInViewport` is used
- exclusion uses `classList.contains`
- layout test logs AI hooks
- `appendResults()` writes hook rows from `LAYOUT_HOOK_VIEWPORTS`
- user commands include `--workers=1`

Use `playwright test [spec] --list` only as a non-executing parse/list check.

### 4. Monitor Handoff

After spec generation or update, spawn or reuse `qa-visual-review-monitor` from `agents/qa-visual-review-monitor.toml`.

Use this instruction:

```text
Use the qa-visual-review-monitor monitor agent to watch test-results/ for pending-ai-review hooks. Perform a strict spelling audit. Do not rely on any previous Spelling Check section. Read every screenshot slice in order, then do a second word/token pass for small copy, cards, pills, buttons, repeated boundary text, missing spaces, merged words, odd capitalization, transpositions, and near-word errors. Report every confirmed typo with all visible slice names. After appending review sections for a viewport, update that processed hook row from pending-ai-review to ai-review-completed; do not rewrite any other hook rows or prior review sections.
```

## Completion Output

Report:

- files changed
- URL and slug
- enabled viewports
- inventory counts
- six tests per viewport
- spec path
- result file path
- monitor status
- run commands, not executed
