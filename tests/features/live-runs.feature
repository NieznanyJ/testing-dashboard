Feature: Live test runs

  Runs reported by the Playwright reporter appear on the runs page
  without reloading it.

  Background:
    Given I am on the runs page of a new project

  Scenario: A started run appears on the page
    When the reporter starts a run with 4 tests
    Then I should see the run with "0/4 completed"
    And the run should link to its details page

  Scenario: Run progress is updated live
    Given the reporter starts a run with 4 tests
    When the reporter reports 3 passed and 1 failed tests
    Then I should see the run with "4/4 completed"
    And the run should show 3 passed and 1 failed tests

  Scenario: A finished run shows its duration
    Given the reporter starts a run with 2 tests
    When the reporter finishes the run with 2 passed tests in 4500 ms
    Then I should see the run with "Duration: 4.50s"
