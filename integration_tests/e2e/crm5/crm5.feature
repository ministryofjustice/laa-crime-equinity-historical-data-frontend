Feature: CRM5 Case Navigation

  Scenario: Navigate to CRM5 case and verify contents
    Given the user is on the Historical Data page
    When the user selects "View eForm records" link
    And the user selects "CRM 5" from the CRM type dropdown and clicks search
    And the user clicks on a Client name or USN link
    Then it should return a page related to the corresponding CRM5 case
    And we should see a left bar navigation with "15" items
    And we should see a right container with static infos displayed
    And the Costs page should be displayed with the correct layout
