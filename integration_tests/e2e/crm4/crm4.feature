Feature: CRM4 Case Navigation

  Scenario: Navigate to CRM4 case and verify contents
    Given the user is on the Historical Data page
    When the user clicks the "View eForm records" link
    And the user selects "CRM 4" from the CRM type dropdown and performs a search
    And the user clicks on a Client name or USN link
    Then it should navigate to the corresponding CRM4 case page
    And the left navigation bar should display "10" items
    And the right container should show static information
    And the Standard Properties page should display the correct layout

  Scenario: Verify the Expenditure Details page for a CRM4 case
    Given the user is on the CRM4 case page
    When the user clicks on the "Expenditure Details" link
    Then the Expenditure Details page should display the correct layout