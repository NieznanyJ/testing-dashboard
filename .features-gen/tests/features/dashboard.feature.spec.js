// Generated from: tests\features\dashboard.feature
import { test } from "playwright-bdd";

test.describe('Dashboard', () => {

  test('User opens the dashboard', async ({ Given, Then, page }) => { 
    await Given('I open the dashboard', null, { page }); 
    await Then('the dashboard should be visible', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests\\features\\dashboard.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I open the dashboard","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Outcome","textWithKeyword":"Then the dashboard should be visible","stepMatchArguments":[]}]},
]; // bdd-data-end