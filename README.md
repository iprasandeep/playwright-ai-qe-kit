# playwright-ai-qe-kit

TypeScript Playwright E2E kit with page objects, reusable assertions, GitHub Actions CI, and a lightweight AI assist layer for failure notes / locator hints.

**Author:** prasandeep · **Demo app:** [TodoMVC (Playwright demo)](https://demo.playwright.dev/todomvc)

## Architecture

```
tests/                 thin scenarios (what to verify)
src/pages/             locators + user actions
src/assertions/        reusable expects (validators)
src/fixtures/          TodoPage injection + AI failure notes
src/ai/                locator hints + failure summarizer
.github/workflows/     CI: install chromium → test → upload report
```

Flow: **test → page actions → assertions → (on fail) AI note + trace/screenshot**

Same layering idea as the mobile Appium and API RestAssured portfolio repos.

## Prerequisites

- Node.js 18+ (22 recommended)
- npm

## Setup

```bash
npm ci
npx playwright install chromium
```

## Run tests

```bash
npm test                 # all tests (headless)
npm run test:sanity      # smoke path only
npm run test:ui          # Playwright UI mode
npm run report           # open last HTML report
```

## AI helper

| Piece | What it does | Needs API key? |
|--------|----------------|----------------|
| `src/ai/locatorHints.ts` | Suggests `getByRole` / label / testid strategies | No |
| `src/ai/failureSummarizer.ts` | Writes a short debug note on failure (attached to report) | No (rule-based) |
| Optional OpenAI enrich | Same summarizer, richer text if `OPENAI_API_KEY` is set | Yes |

CI runs **without** any paid LLM key.

```bash
# optional local enrich
set OPENAI_API_KEY=sk-...
npm test
```

## CI

Every push/PR on `main` runs Chromium tests and uploads:

- `playwright-report/` (HTML)
- `test-results/` (traces, screenshots, AI notes on failure)

## Interview talking points

- Auto-waiting + retrying assertions vs classic explicit waits
- POM + fixtures instead of fat tests
- Trace viewer for flake debugging
- AI as **assist** (summaries/hints), not as the test oracle
