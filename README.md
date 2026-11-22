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
.github/workflows/     CI: lint → typecheck → browsers → test → artifacts
```

Flow: **test → page actions → assertions → (on fail) AI note + trace/screenshot**

## Prerequisites

- Node.js 18+ (22 recommended)
- npm

## Setup

```bash
npm ci
npx playwright install chromium firefox
```

## Run tests

```bash
npm test                 # Chromium full suite + Firefox @smoke
npm run test:smoke       # @smoke tags only
npm run test:sanity      # sanity file only
npm run test:ui          # Playwright UI mode (watch live)
npm run test:headed      # visible browser windows
npm run report           # open last HTML report
npm run lint             # ESLint
npm run typecheck        # tsc --noEmit
```

### Tags & browsers

| Tag / project | Behavior |
|---------------|----------|
| `@smoke` | Sanity happy path, one CRUD, API mock |
| `chromium` | Full suite |
| `firefox` | `@smoke` only (cross-browser without doubling runtime) |

## API mock

`tests/api-mock.spec.ts` uses `page.route` to stub `/api/todos`, assert the mock was hit, then seeds the TodoMVC UI from the JSON (network stub + UI verification).

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

Every push/PR on `main` runs:

1. `npm run lint`
2. `npm run typecheck`
3. Chromium + Firefox Playwright install
4. Full test run (Chromium all + Firefox `@smoke`)
5. Upload `playwright-report/` and `test-results/`
