# Test Matrix (v2) — 6 Grouped Tests

Generate **exactly these 6** grouped QA tests inside each enabled device/viewport `test.describe(vp.name, ...)` block. Do not generate forms, dynamic widgets, page rendering/framework integrity, or accessibility smoke tests.

| # | Test name | Responsibility |
|---|-----------|----------------|
| 1 | `page load and runtime health` | Status, title, readyState, height, console/network errors, platform detection |
| 2 | `all visible links navigate or resolve correctly` | Main-content links only; cap 40; `page.goto` for internal |
| 3 | `all buttons and CTAs are visible, clickable, and perform expected behavior` | Main-content controls only |
| 4 | `all page sections are visible, populated, and visually stable` | Scroll + **section band highlight** + overlay per section |
| 5 | `all images, icons, and media assets render correctly` | Raster/SVG/video/iframe in main content |
| 6 | `layout integrity: overflow, overlap, clipping, spacing, and alignment` | Sticky detection, content-zone slices, **mandatory AI hooks** and strict AI spelling review handoff |

## Per-item requirements (all tests)

- Device grouping is mandatory: `desktop` tests live under the desktop describe block, `tablet` tests under tablet, and `mobile` tests under mobile. Do not rely on test-name prefixes as the only grouping.
- `await page.goto(PAGE_URL)` before first overlay.
- **`await ensureInViewport(target)`** before highlight, click, screenshot of that target, or section scroll position.
- `showQaOverlay` with progress label (`LINK 3/22`, `SECTION 5/14`, etc.).
- Crash safety: `resultsPushed` + top-level `try/catch`.
- Fail grouped test at end if any item `fail`; continue other items when safe.

## Section test (test 4) — mandatory visuals

For each section:

1. `ensureInViewport` using section `top` coordinate (scroll `top - 80px` padding).
2. `highlightSectionBand(page, top, height, label)` — green dashed band + label on page.
3. `showQaOverlay(page, 'SECTION n/N — {label}', 'running')`.
4. Record pass/fail for populated content.
5. `clearSectionBand(page)` before next section.

## Layout test (test 6) — mandatory hooks

1. `detectStickyOverlays` → `showContentAreaHighlight` (2s) → remove bands → `captureLayoutSlices`.
2. `console.log('[QA_SCREENSHOTS_READY] …')`.
3. `console.log('[QA_AI_ANALYSIS_READY] ' + JSON.stringify({…}))`.
4. `LAYOUT_HOOK_VIEWPORTS.add(vp.name)`.
5. Warning result row; do not fail after successful capture.

## Link test (test 2)

- Collect `{ href, text, top }` in one `page.evaluate`.
- For each link: `ensureInViewport` at `top` → highlight → navigate/verify → return.

## Media test (test 5)

- Broad selectors: `main img, [role="main"] img, .elementor-section img, .elementor-widget-image img, section img, .wp-block-image img` (exclude header/footer via `isInsideExcludedRegion`).
- Do not rely on `main img` alone on Elementor pages.

## Removed tests

Do not generate these categories in v2:

- `dynamic widgets operate correctly`
- `page rendering and framework integrity`
- `accessibility smoke checks`
- `all forms and inputs render and validate safely`
