# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\features\login.feature.spec.js >> Login >> Login opens the dashboard
- Location: .features-gen\tests\features\login.feature.spec.js:6:7

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
    - generic [ref=e7]:
      - generic [ref=e8]:
        - generic [ref=e9]: Projects
        - list [ref=e10]:
          - listitem [ref=e11]:
            - button "Select project" [ref=e12] [cursor=pointer]
        - list [ref=e15]:
          - listitem [ref=e16]:
            - link "Create new project" [ref=e17] [cursor=pointer]:
              - /url: /projects/new
      - generic [ref=e20]:
        - generic [ref=e21]: Settings
        - list [ref=e22]:
          - listitem [ref=e23]:
            - button "General" [ref=e24] [cursor=pointer]
          - listitem [ref=e25]:
            - button "Preferences" [ref=e26] [cursor=pointer]
    - main [ref=e27]:
      - generic [ref=e29]:
        - generic [ref=e30]:
          - heading "Cloud Test Dashboard" [level=1] [ref=e31]
          - paragraph [ref=e32]: Monitor automated test executions and results.
        - link "Create project" [ref=e33] [cursor=pointer]:
          - /url: /projects/new
  - button "Open Next.js Dev Tools" [ref=e39] [cursor=pointer]
  - alert [ref=e43]
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