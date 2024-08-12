Feature: CRM4 Case Navigation

  Scenario: Navigate to CRM4 case and verify contents
    Given the user is on the Historical Data page
    When the user selects "View eForm records" link
    And the user selects "CRM 4" from the CRM type dropdown and clicks search
    And the user clicks on a Client name or USN link
    Then it should return a page related to the corresponding CRM4 case
    And we should see a left bar navigation with the correct items
    And we should see a right container with static infos displayed
    And the General Information page should be displayed with the correct layout

  Scenario: Verify the Expenditure Details page for a CRM4 case
    Given the user is on the CRM4 case page
    When the user clicks on "Expenditure Details"
    Then the Expenditure Details page should be displayed with the correct layout