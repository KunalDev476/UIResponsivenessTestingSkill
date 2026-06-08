# Non-Negotiable Rules

These rules replace the legacy `.codex/rules/ui-responsive-v2-*.mdc` workflow files. They are skill reference material, not Codex command execution policy.

## Scroll Into Viewport

Before highlighting, clicking, asserting visibility, or capturing a target element:

1. Call `ensureInViewport(page, locator)` or `ensureInViewport(page, { scrollY })` for sections.
2. Verify the target intersects the viewport and retry scrolling when needed.
3. Only then call `highlightElement`, `visuallyClick`, `safeClickAndVerifyTarget`, or record pass/fail.

Section tests must use `highlightSectionBand` plus overlay `SECTION n/N - {label}` after scrolling to `section.top`.

Never click or judge off-screen elements.

## Device Grouping

For each enabled viewport/device, wrap its tests in a device-specific describe block:

```ts
for (const vp of enabledViewports()) {
  test.describe(vp.name, () => {
    test('page load and runtime health', async ({ page }) => {
      // ...
    });
  });
}
```

Desktop tests must live under the desktop block, tablet tests under the tablet block, and mobile tests under the mobile block.

Do not rely on flat test names such as `desktop - page load and runtime health` as the only grouping.

## AI Review Hooks

- File top: `test.describe.configure({ mode: 'serial' })`.
- Track `LAYOUT_HOOK_VIEWPORTS.add(viewport)` after layout screenshots succeed.
- `appendResults()` must write `### AI Review Hooks` from `LAYOUT_HOOK_VIEWPORTS`; never write an empty table when layout ran.
- After the monitor appends review sections for a viewport, it must update that processed hook row from `pending-ai-review` to `ai-review-completed`.
- Layout test logs `[QA_AI_ANALYSIS_READY]` JSON to stdout.
- Users run with `--workers=1`.
- After spec generation, spawn `qa-visual-review-monitor`.
- If the user reports a prior spelling review missed issues, spawn or perform a strict supplemental spelling audit using [visual-review.md](visual-review.md), even when no pending hook remains.

## Strict Spelling Audit

When processing AI review hooks, the monitor must do two proofreading passes:

1. Read every visible main-content line in every screenshot slice.
2. Re-scan every word/token for missing letters, extra letters, transpositions, merged words, missing spaces, odd in-word capitalization, malformed common phrases, and near-word errors.

Do not rely on an earlier `Spelling Check` as complete. If a stricter re-audit is requested after an existing review, append `## Supplemental Spelling Audit - [viewport]` and related supplemental sections at the bottom of the same `test-result.md`.

Deduplicate repeated boundary text, but list all slices where the issue is visible.

After review sections are appended, update only the processed hook row status to `ai-review-completed`. Do not rewrite result rows, prior reviews, screenshots, specs, or site source.

If the user says the review missed spelling mistakes, run the supplemental spelling audit even if the hook was already processed. The parent prompt must say "strict supplemental spelling audit" and include the workspace, result file, ordered screenshot range, and the exact supplemental section names.

The audit must cover hero copy, section intro text, small cards, outcome cards, labels/pills, CTA text, repeated boundary text, and low-contrast body copy. Confirmed missing-letter and near-word errors such as `senter`, `error-prne`, `gro`, `se`, `developrs`, `competits`, and `sciuence` must be reported when visible in context.

Use a consistent spelling table:

```markdown
| Slice | Text | Issue | Suggested correction | Confidence |
| --- | --- | --- | --- | --- |
```

The monitor should internally build a candidate list before writing the table, but append only confirmed issues.

## Header and Footer Exclusion

In every `page.evaluate` ancestor walk and `isInsideExcludedRegion`, use `classList.contains()`:

```ts
const cl = node.classList;
cl.contains('av-header'); // correct
// wrong: String(node.className).toLowerCase().includes('av-header')
```

Early exit inside content: `id === 'main' || id === 'av-content' || id === 'content' || id === 'page-content'`.

Exclude header, nav, footer, mobile-menu, and all descendants. Main-content CTAs and links remain in scope.

## Spec Generation

When generating or updating specs under `tests/ui-responsive/`:

1. Read `ui-responsive-testing-v2/SKILL.md` and linked `reference/` files.
2. Live inventory the URL; do not invent page facts.
3. Generate exactly six grouped tests: runtime health, links, CTAs, sections, media, and layout integrity.
4. Inline all helpers; use `templates/playwright-spec-skeleton.ts` structure.
5. Run [spec-self-check.md](spec-self-check.md) before completion.
6. Spawn `qa-visual-review-monitor` after generation.
7. Spawn supplemental mode, not generic monitor mode, when a prior AI spelling review is challenged.
8. Do not run Playwright; provide commands with `--workers=1` only.
