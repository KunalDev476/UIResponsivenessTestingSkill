# Helpers Contract (inline in every generated spec)

## Viewport gate (required before interaction)

```ts
async function ensureInViewport(
  page: Page,
  target: Locator | { scrollY: number },
): Promise<void> {
  if ('scrollY' in target) {
    await page.evaluate((y) => window.scrollTo({ top: Math.max(0, y - 80), behavior: 'instant' }), target.scrollY);
    await page.waitForTimeout(150);
    return;
  }
  await target.scrollIntoViewIfNeeded({ timeout: 8000 }).catch(async () => {
    const box = await target.boundingBox();
    if (box) {
      await page.evaluate((y) => window.scrollTo({ top: Math.max(0, y - 80), behavior: 'instant' }), box.y);
    }
  });
  await page.waitForTimeout(150);
  const box = await target.boundingBox();
  if (box) {
    const vh = page.viewportSize()?.height ?? 900;
    const inView = box.y >= -20 && box.y + box.height <= vh + 40;
    if (!inView) {
      await page.evaluate((y) => window.scrollTo({ top: Math.max(0, y - 80), behavior: 'instant' }), box.y);
      await page.waitForTimeout(150);
    }
  }
}
```

**Rule:** Every link, button, image/media target, and section check calls `ensureInViewport` immediately before highlight or click.

## Section band highlight (required for test 4)

```ts
async function highlightSectionBand(
  page: Page,
  top: number,
  height: number,
  label: string,
): Promise<void> {
  await page.evaluate(({ t, h, lbl }) => {
    document.getElementById('qa-section-band')?.remove();
    document.getElementById('qa-section-label')?.remove();
    const band = document.createElement('div');
    band.id = 'qa-section-band';
    const rect = { top: t, height: Math.max(h, 120) };
    Object.assign(band.style, {
      position: 'absolute',
      left: '0',
      width: '100%',
      top: `${rect.top}px`,
      height: `${rect.height}px`,
      border: '3px dashed #00e676',
      background: 'rgba(0,230,118,0.08)',
      pointerEvents: 'none',
      zIndex: '2147483644',
      boxSizing: 'border-box',
    });
    const tag = document.createElement('div');
    tag.id = 'qa-section-label';
    tag.textContent = `▶ ${lbl}`;
    Object.assign(tag.style, {
      position: 'absolute',
      left: '12px',
      top: `${Math.max(0, rect.top - 28)}px`,
      background: '#00e676',
      color: '#000',
      padding: '4px 10px',
      fontWeight: '700',
      fontSize: '13px',
      zIndex: '2147483645',
      pointerEvents: 'none',
      borderRadius: '4px',
    });
    document.body.appendChild(band);
    document.body.appendChild(tag);
  }, { t: top, h: height, lbl: label });
  if (VISUAL_MODE) await page.waitForTimeout(700);
}

async function clearSectionBand(page: Page): Promise<void> {
  await page.evaluate(() => {
    document.getElementById('qa-section-band')?.remove();
    document.getElementById('qa-section-label')?.remove();
  });
}
```

## Exclusion (Rule 1)

Use **`classList.contains()`** only in ancestor walks. Early exit at content roots:

`id === 'main' || id === 'av-content' || id === 'content' || id === 'page-content'`

Never `String(className).toLowerCase().includes('av-header')`.

## Other required helpers

- Visual: `showQaOverlay`, `highlightElement` (via `locator.evaluate`), `clearHighlight`, `showPointerAt`, `visuallyClick` (calls `ensureInViewport` first)
- Links: `collectNormalLinks`, `safeClickAndVerifyTarget` (ensureInViewport before click)
- Layout: `detectStickyOverlays`, `showContentAreaHighlight`, `captureLayoutSlices` (content-zone clip only)
- Metadata: `sanitizeFailureReason`, `recordCheckResult`, `classifyLink`, `isInsideExcludedRegion` (`locator.evaluate`)

## Data collection

- Links/CTAs: single `page.evaluate` → plain objects; never hold `Locator[]` across `page.goto`.
- Internal links: `page.goto(href)` after `ensureInViewport`, not stale locator click.
- Images: `locator.evaluate` on `HTMLImageElement` — no `elementHandle()`.

## Section selectors

```ts
const SECTION_SELECTORS = [
  'section',
  '[class*="avia-section"]',
  '[class*="elementor-section"]',
  '.wp-block-group',
  '[data-section-id]',
];
```

Deduplicate with **50px Y-bucket**. Store `{ label, top, height, populated }` for scroll/highlight.
