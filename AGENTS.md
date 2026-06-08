# Repository Instructions

## Repository Surfaces

- Root project instructions live in this `AGENTS.md`.
- Packaged repo skills live at the repository root so external skill indexes can discover them.
- Agent monitor instructions live inside the packaged skill under `ui-responsive-testing-v2/agents/`.

## UI Responsive QA

- Use the `ui-responsive-testing-v2` skill only when the user explicitly requests it by name or asks for v2 responsive UI QA generation.
- The canonical skill is `ui-responsive-testing-v2/SKILL.md`.
- After generating or updating a responsive QA spec, use the `qa-visual-review-monitor` monitor agent defined in `ui-responsive-testing-v2/agents/qa-visual-review-monitor.toml` to process pending AI review hooks.
- Generated specs must stay under `tests/ui-responsive/` and use the skill's six-test matrix: runtime health, links, CTAs, sections, media, and layout integrity.
- Do not run generated Playwright specs after generation. Provide commands with `--workers=1` for the user to run.

## Verification

- Use `rg` for workspace search.
- For UI responsive QA changes, run the skill self-check before reporting completion.
- Keep generated Playwright output in `.playwright-output` and test reports in `test-results/`.
