# Repository Instructions

## Codex Surfaces

- Root project instructions live in this `AGENTS.md`.
- Repo skills live under `.agents/skills/`; Codex discovers these from the current working directory up to the repository root.
- Project subagents live under `.codex/agents/` as standalone TOML files.
- `.codex/rules/` is for Codex command execution policy files, not reusable workflow instructions.

## UI Responsive QA

- Use the `ui-responsive-testing-v2` skill only when the user explicitly requests it by name or asks for v2 responsive UI QA generation.
- The canonical skill is `.agents/skills/ui-responsive-testing-v2/SKILL.md`.
- After generating or updating a responsive QA spec, use the `qa-visual-review-monitor` subagent defined in `.codex/agents/qa-visual-review-monitor.toml` to process pending AI review hooks.
- Generated specs must stay under `tests/ui-responsive/` and use the skill's six-test matrix: runtime health, links, CTAs, sections, media, and layout integrity.
- Do not run generated Playwright specs after generation. Provide commands with `--workers=1` for the user to run.

## Verification

- Use `rg` for workspace search.
- For UI responsive QA changes, run the skill self-check before reporting completion.
- Keep generated Playwright output in `.playwright-output` and test reports in `test-results/`.
