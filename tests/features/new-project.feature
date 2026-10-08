Feature: Create a project

  Background:
    Given I am on the new project page

  Scenario: Create a project and open its runs
    When I create a project named "Checkout E2E" for repository "acme/checkout-tests"
    Then I should be on the runs page of the new "checkout-e2e" project
    And I should see that the project has no runs yet
    And I should be able to start a test run

  Scenario: Project name is required
    When I create a project named "" for repository "acme/checkout-tests"
    Then I should still be on the new project page
