# Examples

```
Use ui-responsive-testing-v2 for https://example.com/case-study/
```

```
Use ui-responsive-testing-v2 to generate desktop and mobile tests for https://example.com/about/
```

After generation:

```bash
# Edit tests/ui-responsive/qa-run-config.json — enable desktop: true
npx playwright test tests/ui-responsive/case-study.spec.ts --workers=1 --headed
```

Then invoke monitor:

```
Use the qa-visual-review-monitor subagent to process pending AI review hooks. Perform a strict spelling audit with both a line pass and a word/token pass.
```

If a previous spelling review missed issues:

```
Use the qa-visual-review-monitor subagent defined in .codex/agents/qa-visual-review-monitor.toml. A previous AI review exists, but the user reports it missed spelling mistakes. Perform a strict supplemental spelling audit, not a normal first-pass review. Append only Supplemental Spelling Audit, Supplemental UI Suggestions, and Supplemental AI Review Completion Note at the bottom of test-result.md.
```
