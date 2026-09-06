# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\features\login.feature.spec.js >> Login >> Login opens the dashboard3
- Location: .features-gen\tests\features\login.feature.spec.js:16:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.waitFor: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('heading', { name: 'fff Test Dashboard' }) to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - link "TestOps Cloud Test control center" [ref=e7] [cursor=pointer]:
          - /url: /
          - generic [ref=e12]:
            - generic [ref=e13]: TestOps Cloud
            - generic [ref=e14]: Test control center
        - list [ref=e15]:
          - listitem [ref=e16]:
            - button "Project t" [ref=e17] [cursor=pointer]:
              - generic [ref=e24]:
                - generic [ref=e25]: Project
                - generic [ref=e26]: t
      - generic [ref=e29]:
        - generic [ref=e30]:
          - generic [ref=e31]: Workspace
          - list [ref=e32]:
            - listitem [ref=e33]:
              - link "Dashboard" [ref=e34] [cursor=pointer]:
                - /url: /
            - listitem [ref=e41]:
              - link "Overview" [ref=e42] [cursor=pointer]:
                - /url: /projects/6d31bdb6-0f49-46f9-b570-609a06aa2d95
            - listitem [ref=e46]:
              - link "Test runs" [ref=e47] [cursor=pointer]:
                - /url: /projects/6d31bdb6-0f49-46f9-b570-609a06aa2d95/runs
        - list [ref=e53]:
          - listitem [ref=e54]:
            - link "New project" [ref=e55] [cursor=pointer]:
              - /url: /projects/new
      - generic [ref=e59]:
        - generic [ref=e60]: Ready for test runs
        - generic [ref=e62]:
          - paragraph [ref=e63]:
            - generic [ref=e69]: t
          - paragraph [ref=e70]:
            - generic [ref=e75]: main
    - main [ref=e76]:
      - generic [ref=e78]:
        - generic [ref=e79]:
          - generic [ref=e80]: Test orchestration, simplified
          - heading "Cloud Test Dashboard Every run. One clear view." [level=1] [ref=e84]:
            - text: Cloud Test Dashboard
            - generic [ref=e85]: Every run. One clear view.
          - paragraph [ref=e86]: Monitor automated test executions and results. Catch failures faster, inspect every test, and keep your team moving without digging through CI logs.
          - generic [ref=e87]:
            - link "Create project" [ref=e88] [cursor=pointer]:
              - /url: /projects/new
            - paragraph [ref=e89]: Set up in under a minute
          - generic [ref=e92]:
            - generic [ref=e93]: Live results
            - generic [ref=e97]: Trace artifacts
            - generic [ref=e101]: Run history
        - generic [ref=e105]:
          - generic [ref=e107]:
            - generic [ref=e108]:
              - generic [ref=e114]:
                - paragraph [ref=e115]: Checkout E2E
                - paragraph [ref=e116]: main · a8f3c21
              - generic [ref=e117]: Passed
            - generic [ref=e119]:
              - generic [ref=e120]:
                - generic [ref=e121]:
                  - paragraph [ref=e122]: Passed
                  - paragraph [ref=e123]: "24"
                - generic [ref=e124]:
                  - paragraph [ref=e125]: Failed
                  - paragraph [ref=e126]: "0"
                - generic [ref=e127]:
                  - paragraph [ref=e128]: Duration
                  - paragraph [ref=e129]: 1m 42s
              - generic [ref=e130]:
                - generic [ref=e131]:
                  - paragraph [ref=e135]: User can complete checkout
                  - generic [ref=e136]: 8.4s
                - generic [ref=e137]:
                  - paragraph [ref=e141]: Cart preserves selected items
                  - generic [ref=e142]: 4.1s
                - generic [ref=e143]:
                  - paragraph [ref=e147]: Payment confirmation is shown
                  - generic [ref=e148]: 6.7s
          - generic [ref=e153]:
            - paragraph [ref=e154]: Run completed
            - paragraph [ref=e155]: Just now
  - generic [ref=e163] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e164]
    - generic [ref=e168]:
      - button "Open issues overlay" [ref=e169]:
        - generic [ref=e170]:
          - generic [ref=e171]: "0"
          - generic [ref=e172]: "1"
        - generic [ref=e173]: Issue
      - button "Collapse issues badge" [ref=e174]
  - alert [ref=e177]
```

# Test source

```ts
  1  | import { createBdd } from 'playwright-bdd';
  2  | 
  3  | const { Given, Then } = createBdd();
  4  | 
  5  | Given('I open the dashboard', async ({ page }) => {
  6  |   await page.goto('/');
  7  | });
  8  | 
  9  | Then('the dashboard should be visible', async ({ page }) => {
  10 |   await page.getByRole('heading', { name: 'Cloud Test Dashboard' }).waitFor();
  11 | });
  12 | 
  13 | Then('the dashboard should be not visible', async ({ page }) => {
  14 |   await page.getByRole('heading', { name: 'fff Test Dashboard' }).waitFor();
  15 | });
  16 | 
     |      ^ Error: locator.waitFor: Test timeout of 30000ms exceeded.
```