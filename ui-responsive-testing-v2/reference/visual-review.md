# AI Visual Review (v2)

Delegated to **`qa-visual-review-monitor`** subagent (`agents/qa-visual-review-monitor.toml`).

## Parent agent after spec generation

1. Spawn monitor once per workspace (reuse if active).
2. Do not claim review is done until `## AI Visual Review — [viewport]` exists in `test-result.md`.
3. Spawn with a strict spelling instruction: the monitor must do both a line pass and a word/token pass, must not rely on prior spelling sections, and must append a supplemental spelling audit if a review already exists but the user requests a stricter recheck.
4. If the user reports that spelling mistakes were missed, treat the earlier review as incomplete and run supplemental mode even when there are no pending hook rows left.

## Reviewer scope

Main content only. Categories: overflow-and-bleed, element-overlap, typography, layout-alignment, images-media, and spelling.

## Spelling protocol

- Every slice in order; line-by-line visible text in main content.
- Then perform a second word/token pass on each slice.
- Report **all** confirmed typos (not just first), including missing letters, extra letters, transpositions, missing spaces, merged words, odd in-word capitalization, and malformed common phrases.
- Cover hero copy, section intros, small cards, outcome cards, labels/pills, CTA text, repeated boundary text, and low-contrast body copy. These areas are where previous review passes most often miss small typos.
- Compare repeated boundary text across adjacent slices; deduplicate findings while listing all slices where an issue is visible.
- Compare adjacent slices at boundaries before reporting clip/overlap.
- Allow brand/product/technology names unless clearly wrong.

## Sections to append (bottom of test-result.md)

1. `## AI Visual Review — [viewport]`
2. `## Spelling Check — [viewport]`
3. `## UI Suggestions — [viewport]`
4. `AI Review Completion Note`

After appending those sections, update the processed hook row status from `pending-ai-review` to `ai-review-completed`. This hook status update is the only allowed in-place edit. Do not rewrite prior result rows or review sections. Do not create extra markdown files.

## Strict monitor spawn text

When spawning `qa-visual-review-monitor`, include this text:

```text
Perform a strict spelling audit. Do not rely on any previous Spelling Check section. Read every screenshot slice in order, then do a second word/token pass for small copy, cards, pills, buttons, repeated boundary text, missing spaces, merged words, odd capitalization, transpositions, and near-word errors. Report every confirmed typo with all visible slice names. If an AI review already exists for the viewport, append Supplemental Spelling Audit sections at the bottom. After appending review sections for a viewport, update that viewport's processed hook row from `pending-ai-review` to `ai-review-completed`; do not rewrite any other hook rows or prior review sections.
```

## Strict supplemental re-audit spawn text

Use this exact shape when the user reports that a prior spelling review missed issues:

```text
Use the qa-visual-review-monitor subagent defined in agents/qa-visual-review-monitor.toml. A previous AI review exists, but the user reports it missed spelling mistakes. Perform a strict supplemental spelling audit, not a normal first-pass review.

Workspace: [absolute workspace path]
Result file: test-results/[page-slug]/test-result.md
Screenshots: test-results/[page-slug]/screenshots/[viewport]_slice_001.png through [viewport]_slice_NNN.png

Required behavior:
- Do not edit existing hook rows or previous review sections except to update the processed hook status from `pending-ai-review` to `ai-review-completed` after appending the supplemental sections.
- Append only at the bottom of test-result.md.
- Read every [viewport] screenshot slice in order.
- Do a line pass and then a word/token pass.
- Look for hero copy, small card/body copy, labels, pills, buttons, repeated boundary text, missing spaces, merged words, odd capitalization, transpositions, and near-word errors.
- Report every confirmed typo with all visible slice names.
- If uncertain about product/domain terminology, put it in Supplemental UI Suggestions as low confidence, not as a confirmed typo.
- Append `## Supplemental Spelling Audit — [viewport]`, `## Supplemental UI Suggestions — [viewport]`, and `Supplemental AI Review Completion Note`.
```

Spelling tables must use this shape for consistent results:

```markdown
| Slice | Text | Issue | Suggested correction | Confidence |
| --- | --- | --- | --- | --- |
```

## False positives

- Intentional sticky/fixed/floating UI
- Slice boundary cutoffs
- Header/footer content
