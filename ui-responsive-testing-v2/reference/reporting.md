# Reporting and AI Hooks (v2)

## Paths

```text
test-results/[page-slug]/test-result.md     # single append-only ledger
test-results/[page-slug]/screenshots/     # [viewport]_slice_NNN.png
.playwright-output/                        # Playwright artifacts (not test-results)
```

## Parallel run fix (required)

Playwright parallel workers split `afterAll` and **drop AI hooks** for tests that ran in other workers.

Generated specs **must** include at file top:

```ts
test.describe.configure({ mode: 'serial' });
```

Document that users run with:

```bash
npx playwright test tests/ui-responsive/[page-slug].spec.ts --workers=1
```

## Layout hook tracking (required)

```ts
const LAYOUT_HOOK_VIEWPORTS = new Set<string>();

// Inside layout test after successful capture:
LAYOUT_HOOK_VIEWPORTS.add(vp.name);
```

## appendResults() contract

1. If `QA_RESULTS.length === 0` → return (no write).
2. Append `## Test Run — {ISO}` with all grouped rows for this run.
3. **AI Review Hooks table is mandatory** when `LAYOUT_HOOK_VIEWPORTS.size > 0`:

```ts
lines.push('### AI Review Hooks');
lines.push('| Viewport | Hook | Status |');
for (const vpName of LAYOUT_HOOK_VIEWPORTS) {
  const alreadyReviewed = existingContent.includes(`## AI Visual Review — ${vpName}`);
  const hookStatus = alreadyReviewed ? 'ai-review-completed' : 'pending-ai-review';
  lines.push(`| ${vpName} | QA_AI_ANALYSIS_READY | ${hookStatus} |`);
}
```

4. Never emit an empty AI Review Hooks table when layout ran.
5. Append-only — never truncate `test-result.md`.

## Monitor completion status update

After the monitor appends all required AI review sections for a viewport, it must update the processed hook row status from `pending-ai-review` to `ai-review-completed`.

This is the only allowed in-place edit to `test-result.md`. The monitor must not rewrite result rows, prior review sections, screenshots, specs, or site source. If multiple pending hook rows exist, update only the rows whose viewport screenshots were actually reviewed.

## stdout hooks (layout test)

Always log both:

```ts
console.log(`[QA_SCREENSHOTS_READY] test-results/${PAGE_SLUG}/screenshots/ (...)`);
console.log(`[QA_AI_ANALYSIS_READY] ${JSON.stringify({ pageSlug, viewport, screenshotDir, slices, resultFile, reviewStatus: 'pending-ai-review', contentZone: { headerHeight, bottomBarHeight } })}`);
```

Monitor agent watches **file hooks** (`pending-ai-review` in md), updates processed hooks to `ai-review-completed`, and stdout is optional.

## qa-run-config.json

- Omit removed categories from `tests`: forms, dynamic widgets, page rendering/framework integrity, and accessibility smoke checks.
- Devices default `false`.
