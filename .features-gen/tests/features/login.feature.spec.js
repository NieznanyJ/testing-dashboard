// Generated from: tests\features\login.feature
import { test } from "playwright-bdd";

test.describe('Login', () => {

  test('Login opens the dashboard', async ({ Given, Then, page }) => { 
    await Given('I open the dashboard', null, { page }); 
    await Then('the dashboard should be not visible', null, { page }); 
  });

  test('Login opens the dashboard 2', async ({ Given, Then, page }) => { 
    await Given('I open the dashboard', null, { page }); 
    await Then('the dashboard should be visible', null, { page }); 
  });

  test('Login opens the dashboard3', async ({ Given, Then, page }) => { 
    await Given('I open the dashboard', null, { page }); 
    await Then('the dashboard should be not visible', null, { page }); 
  });

  test('Login opens the dashboard 4', async ({ Given, Then, page }) => { 
    await Given('I open the dashboard', null, { page }); 
    await Then('the dashboard should be visible', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests\\features\\login.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":3,"tags":[],"steps":[{"pwStepLine":7,"gherkinStepLine":4,"keywordType":"Context","textWithKeyword":"Given I open the dashboard","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":5,"keywordType":"Outcome","textWithKeyword":"Then the dashboard should be not visible","stepMatchArguments":[]}]},
  {"pwTestLine":11,"pickleLine":7,"tags":[],"steps":[{"pwStepLine":12,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given I open the dashboard","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":9,"keywordType":"Outcome","textWithKeyword":"Then the dashboard should be visible","stepMatchArguments":[]}]},
  {"pwTestLine":16,"pickleLine":10,"tags":[],"steps":[{"pwStepLine":17,"gherkinStepLine":11,"keywordType":"Context","textWithKeyword":"Given I open the dashboard","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":12,"keywordType":"Outcome","textWithKeyword":"Then the dashboard should be not visible","stepMatchArguments":[]}]},
  {"pwTestLine":21,"pickleLine":13,"tags":[],"steps":[{"pwStepLine":22,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"Given I open the dashboard","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":15,"keywordType":"Outcome","textWithKeyword":"Then the dashboard should be visible","stepMatchArguments":[]}]},
]; // bdd-data-end