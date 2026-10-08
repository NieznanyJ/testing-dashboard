# Testing Dashboard

A web dashboard for running Playwright tests and watching the results come in live. You start a run from the browser, a custom Playwright reporter streams progress to the UI test by test, and failed tests can be inspected with their error message, screenshot and trace.

> **Status: early work in progress.** The reporter, the live event stream and the UI are written, but some API routes are not finished yet, so the app does not work fully end to end. See [Status and roadmap](#status-and-roadmap).

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
| `npm run format` / `npm run format:check` | Prettier |

## Status and roadmap

Working today: the reporter, saving runs to `data/test-runs.json`, the event endpoint and the per-project SSE stream, starting a run through the API, the home page and the new project form.

Not finished yet:

- The single-run API (`/api/runs/{id}` and its stream) and the run list endpoint the UI calls, so the run list and run details pages do not load their data yet.
- Projects come from mock data and an in-memory store; runs are stored in a JSON file. A PostgreSQL + Prisma storage layer is in progress on a separate branch.
- The real branch and commit are not read from Git yet (`local` placeholder).
- Accepting results from CI (GitHub Actions) in addition to local runs.
- Unit and E2E coverage is minimal.

## Note on security

This is a local developer tool. The API starts shell commands and reads artifact files from disk without authentication, so it must not be exposed on a public network in its current form.

## Author

Jakub Nieznany - [LinkedIn](https://linkedin.com/in/jakub-nieznany-491551204)
