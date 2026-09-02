# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\features\login.feature.spec.js >> Login >> Login opens the dashboard3
- Location: .features-gen\tests\features\login.feature.spec.js:16:7

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
  - main [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - heading "Cloud Test Dashboard" [level=1] [ref=e5]
        - paragraph [ref=e6]: Monitor automated test executions and results.
        - button "run test" [ref=e7]
      - generic [ref=e8]:
        - heading "Recent test runs" [level=2] [ref=e9]
        - generic [ref=e10]:
          - 'link "Run #5f611bb6-717a-434e-923f-9fbb9ce0f407 Branch: local · local Started at: 9/2/2026, 12:47:15 PM RUNNING 60% 3/5 completed 2 / 5 PASSED 1 / 5 FAILED 0 / 5 SKIPPED" [ref=e11] [cursor=pointer]':
            - /url: /runs/5f611bb6-717a-434e-923f-9fbb9ce0f407
            - generic [ref=e12]:
              - generic [ref=e14]:
                - generic [ref=e15]:
                  - generic [ref=e16]: "Run #5f611bb6-717a-434e-923f-9fbb9ce0f407"
                  - generic [ref=e17]: "Branch: local · local"
                  - generic [ref=e18]: "Started at: 9/2/2026, 12:47:15 PM"
                - generic [ref=e19]: RUNNING
              - generic [ref=e20]:
                - progressbar [ref=e21]: x
                - generic [ref=e24]:
                  - generic [ref=e25]: 3/5 completed
                  - generic [ref=e26]:
                    - text: 2 / 5
                    - generic [ref=e27]: PASSED
                  - generic [ref=e28]:
                    - text: 1 / 5
                    - generic [ref=e29]: FAILED
                  - generic [ref=e30]:
                    - text: 0 / 5
                    - generic [ref=e31]: SKIPPED
          - 'link "Run #ec0362e5-3bca-4256-bd5e-380b19e2f9e6 Branch: local · local Started at: 9/2/2026, 12:42:18 PM Finished at: 9/2/2026, 12:43:23 PM Duration: 65.03s FAILED 100% 5/5 completed 3 / 5 PASSED 2 / 5 FAILED 0 / 5 SKIPPED" [ref=e32] [cursor=pointer]':
            - /url: /runs/ec0362e5-3bca-4256-bd5e-380b19e2f9e6
            - generic [ref=e33]:
              - generic [ref=e35]:
                - generic [ref=e36]:
                  - generic [ref=e37]: "Run #ec0362e5-3bca-4256-bd5e-380b19e2f9e6"
                  - generic [ref=e38]: "Branch: local · local"
                  - generic [ref=e39]: "Started at: 9/2/2026, 12:42:18 PM"
                  - generic [ref=e40]: "Finished at: 9/2/2026, 12:43:23 PM"
                  - generic [ref=e41]: "Duration: 65.03s"
                - generic [ref=e42]: FAILED
              - generic [ref=e43]:
                - progressbar [ref=e44]: x
                - generic [ref=e47]:
                  - generic [ref=e48]: 5/5 completed
                  - generic [ref=e49]:
                    - text: 3 / 5
                    - generic [ref=e50]: PASSED
                  - generic [ref=e51]:
                    - text: 2 / 5
                    - generic [ref=e52]: FAILED
                  - generic [ref=e53]:
                    - text: 0 / 5
                    - generic [ref=e54]: SKIPPED
          - 'link "Run #3dc7fe1c-7607-4567-9b3b-82c2c2874dda Branch: local · local Started at: 9/2/2026, 11:56:46 AM Finished at: 9/2/2026, 11:57:51 AM Duration: 65.04s FAILED 100% 5/5 completed 3 / 5 PASSED 2 / 5 FAILED 0 / 5 SKIPPED" [ref=e55] [cursor=pointer]':
            - /url: /runs/3dc7fe1c-7607-4567-9b3b-82c2c2874dda
            - generic [ref=e56]:
              - generic [ref=e58]:
                - generic [ref=e59]:
                  - generic [ref=e60]: "Run #3dc7fe1c-7607-4567-9b3b-82c2c2874dda"
                  - generic [ref=e61]: "Branch: local · local"
                  - generic [ref=e62]: "Started at: 9/2/2026, 11:56:46 AM"
                  - generic [ref=e63]: "Finished at: 9/2/2026, 11:57:51 AM"
                  - generic [ref=e64]: "Duration: 65.04s"
                - generic [ref=e65]: FAILED
              - generic [ref=e66]:
                - progressbar [ref=e67]: x
                - generic [ref=e70]:
                  - generic [ref=e71]: 5/5 completed
                  - generic [ref=e72]:
                    - text: 3 / 5
                    - generic [ref=e73]: PASSED
                  - generic [ref=e74]:
                    - text: 2 / 5
                    - generic [ref=e75]: FAILED
                  - generic [ref=e76]:
                    - text: 0 / 5
                    - generic [ref=e77]: SKIPPED
          - 'link "Run #996fd7a2-eef0-4263-ab48-63b675ed30d0 Branch: local · local Started at: 9/2/2026, 11:41:32 AM Finished at: 9/2/2026, 11:42:37 AM Duration: 64.62s FAILED 100% 5/5 completed 3 / 5 PASSED 2 / 5 FAILED 0 / 5 SKIPPED" [ref=e78] [cursor=pointer]':
            - /url: /runs/996fd7a2-eef0-4263-ab48-63b675ed30d0
            - generic [ref=e79]:
              - generic [ref=e81]:
                - generic [ref=e82]:
                  - generic [ref=e83]: "Run #996fd7a2-eef0-4263-ab48-63b675ed30d0"
                  - generic [ref=e84]: "Branch: local · local"
                  - generic [ref=e85]: "Started at: 9/2/2026, 11:41:32 AM"
                  - generic [ref=e86]: "Finished at: 9/2/2026, 11:42:37 AM"
                  - generic [ref=e87]: "Duration: 64.62s"
                - generic [ref=e88]: FAILED
              - generic [ref=e89]:
                - progressbar [ref=e90]: x
                - generic [ref=e93]:
                  - generic [ref=e94]: 5/5 completed
                  - generic [ref=e95]:
                    - text: 3 / 5
                    - generic [ref=e96]: PASSED
                  - generic [ref=e97]:
                    - text: 2 / 5
                    - generic [ref=e98]: FAILED
                  - generic [ref=e99]:
                    - text: 0 / 5
                    - generic [ref=e100]: SKIPPED
          - 'link "Run #09c65ffe-1a1b-4ae6-b4a2-e4c2e959a0b6 Branch: local · local Started at: 9/2/2026, 11:39:48 AM Finished at: 9/2/2026, 11:40:52 AM Duration: 64.60s FAILED 100% 5/5 completed 3 / 5 PASSED 2 / 5 FAILED 0 / 5 SKIPPED" [ref=e101] [cursor=pointer]':
            - /url: /runs/09c65ffe-1a1b-4ae6-b4a2-e4c2e959a0b6
            - generic [ref=e102]:
              - generic [ref=e104]:
                - generic [ref=e105]:
                  - generic [ref=e106]: "Run #09c65ffe-1a1b-4ae6-b4a2-e4c2e959a0b6"
                  - generic [ref=e107]: "Branch: local · local"
                  - generic [ref=e108]: "Started at: 9/2/2026, 11:39:48 AM"
                  - generic [ref=e109]: "Finished at: 9/2/2026, 11:40:52 AM"
                  - generic [ref=e110]: "Duration: 64.60s"
                - generic [ref=e111]: FAILED
              - generic [ref=e112]:
                - progressbar [ref=e113]: x
                - generic [ref=e116]:
                  - generic [ref=e117]: 5/5 completed
                  - generic [ref=e118]:
                    - text: 3 / 5
                    - generic [ref=e119]: PASSED
                  - generic [ref=e120]:
                    - text: 2 / 5
                    - generic [ref=e121]: FAILED
                  - generic [ref=e122]:
                    - text: 0 / 5
                    - generic [ref=e123]: SKIPPED
  - button "Open Next.js Dev Tools" [ref=e129] [cursor=pointer]
  - alert [ref=e133]
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
> 14 |   await page.getByRole('heading', { name: 'fff Test Dashboard' }).waitFor();
     |                                                                   ^ Error: locator.waitFor: Test timeout of 30000ms exceeded.
  15 | });
  16 | 
```