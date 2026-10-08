# Testing Dashboard

A web dashboard for running Playwright tests and watching the results come in live. You start a run from the browser, a custom Playwright reporter streams progress to the UI test by test, and failed tests can be inspected with their error message, screenshot and trace.

> **Status: work in progress.** Starting a run, live progress, the run list and run details work locally. Projects created in the UI are not persisted yet. See [Status and roadmap](#status-and-roadmap).

<!-- TODO: add screenshots here (home page, live run, failed test details), e.g. docs/screenshots/*.png -->

## Features

- **Start a test run from the UI.** The server launches the project's test command as a background process.
- **Live progress.** A custom Playwright reporter reports every test start and finish; the browser receives updates over Server-Sent Events and updates counters and the progress bar without reloading.
- **Run list** per project: status, branch, commit, start and finish time, duration, passed / failed / skipped counts.
- **Run details** grouped by feature file, with search by file name and a status filter.
- **Failure details**: error message, screenshot preview, and a button that opens the Playwright trace viewer.
- **Projects**: a form for adding a project (name, repository, default branch, test command).

## Tech stack

| Area | Technologies |
| --- | --- |
| App | Next.js 16 (App Router, Route Handlers), React 19, TypeScript |
| State | Zustand |
| UI | Tailwind CSS 4, shadcn/ui (Base UI), lucide-react |
| Test reporting | Custom Playwright reporter, Server-Sent Events |
| Tests | Vitest + Testing Library (components), Playwright + playwright-bdd (E2E scenarios in Gherkin) |
| Tooling | ESLint, Prettier |

## How it works

```
 Browser                        Next.js server                    Playwright process
 -------                        --------------                    ------------------
 "run test" button  -- POST /api/runs/start -->  spawn test command  -->  bddgen && playwright test
                                                                               |
                                                                      reporters/testops-reporter.ts
                                                                      onBegin / onTestBegin / onTestEnd / onEnd
                                                                               |
                               POST /api/run-events  <-------------------------+
                               (also saved to data/test-runs.json)
                                      |
                               in-memory pub/sub (lib/run-events.ts)
                                      |
 EventSource  <-- GET /api/projects/{id}/runs/stream (text/event-stream)
 updates the run cards
```

The reporter builds a `TestRun` object (files, tests, statuses, durations, errors, artifacts), writes it to a JSON file after every event and posts it to the server, which pushes it to every subscribed browser.

## Project structure

```
app/
  api/           route handlers: runs, run events, SSE streams, projects, artifacts
  projects/      project pages: new project form, run list, run details
components/      run cards, live run views, result rows, sidebar, shadcn/ui primitives
reporters/       custom Playwright reporter
lib/             report mapping, JSON storage, event pub/sub
stores/          Zustand project store
types/           TestRun, TestFile, TestResult, TestProject
tests/           Gherkin features and step definitions
data/            mock projects and stored test runs
```

## Getting started

Requires Node.js 22 or newer.

```bash
npm install
npx playwright install chromium
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To produce a test run, keep the dev server running and start the E2E suite from a second terminal:

```bash
npm run test:e2e
```

The sample feature files include scenarios that fail on purpose, so that failed results, screenshots and traces show up in the dashboard.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run test:unit` | Vitest in watch mode |
| `npm run test:unit:run` | Vitest, single run |
| `npm run test:e2e` | Generate specs from Gherkin and run Playwright |
| `npm run test:e2e:ui` | The same in Playwright UI mode |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate Next.js route types and run `tsc` |
| `npm run format` / `npm run format:check` | Prettier |

## Status and roadmap

Working today: the reporter (branch and commit read from Git, dashboard URL from `TESTOPS_URL`, tests keep running when the dashboard is down), saving runs to `data/test-runs.json`, starting a run from the runs page, live progress over SSE, the run list, run details with search, status filter, error message, screenshot preview and trace viewer.

Tests:

- **Unit and API (Vitest):** report mapping, event pub/sub, artifact path validation, `POST /api/runs/start` validation, and path traversal / command injection attempts on the artifact endpoints.
- **Components (Vitest + Testing Library):** `TestRunCard`, `TestResultRow`.
- **E2E (Playwright + playwright-bdd, Page Object Model):** `home.feature`, `new-project.feature`, `live-runs.feature`. Live updates are tested deterministically by posting prepared events to `POST /api/run-events`.

Not finished yet:

- Projects come from mock data; projects created with the form live only in memory and disappear after a refresh, and runs can be started only for the sample projects. A PostgreSQL + Prisma storage layer is in progress on a separate branch.
- `tests/features/login.feature` fails on purpose to produce failed results for the dashboard, so `npm run test:e2e` is not green yet. It will move to a separate demo suite.
- Accepting results from CI (GitHub Actions) in addition to local runs.

## Note on security

This is a local developer tool without authentication, so it must not be exposed on a public network. Starting a run executes the project's `testCommand` in a shell; that is the purpose of the tool, so only add projects whose command you trust. Artifact endpoints only serve files inside `test-results/`, and the trace viewer is started without a shell.

## Author

Jakub Nieznany - [LinkedIn](https://linkedin.com/in/jakub-nieznany-491551204)
