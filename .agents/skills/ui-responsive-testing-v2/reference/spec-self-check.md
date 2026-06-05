# Spec Self-Check (before reporting completion)

- [ ] `test.describe.configure({ mode: 'serial' })` at file top
- [ ] Each enabled viewport/device has its own `test.describe(vp.name, ...)` block containing that device's tests
- [ ] `LAYOUT_HOOK_VIEWPORTS` Set + populated in layout test
- [ ] `appendResults` writes AI hooks from `LAYOUT_HOOK_VIEWPORTS` (never empty when layout ran)
- [ ] **6** grouped QA tests inside each device block
- [ ] No forms, dynamic widget, page rendering/framework integrity, or accessibility smoke tests
- [ ] `ensureInViewport` before every link, button, media, and section check
- [ ] Section test: `highlightSectionBand` + `clearSectionBand` + overlay `SECTION n/N — label`
- [ ] `classList.contains` exclusion; content-root early exit; no `className.includes`
- [ ] Links/CTAs collected as plain objects; cap 40 links
- [ ] Media selectors include Elementor paths
- [ ] Layout: content-zone clips, console hooks, warning row
- [ ] `afterAll` → `appendResults` only
- [ ] User docs mention `--workers=1`
