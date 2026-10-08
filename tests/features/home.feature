Feature: Home page

  Scenario: Start creating a project from the home page
    Given I am on the home page
    When I choose to create a project
    Then I should see the new project form
