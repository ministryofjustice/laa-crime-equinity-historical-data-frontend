Feature: CRM14 Case Journey

  Scenario: View a CRM14 case and validate the details
    Given the user is on the Historical Data page
    When the user clicks on the "View eForm records" link
    And the user chooses "CRM 14" from the CRM type dropdown and initiates a search
    And the user clicks on a Client name or USN link
    Then the system should display the CRM14 case details page
    And the navigation panel should have "20" items listed
    And the main content area should present the expected details
    And the Legal Representation section should display the proper layout

  Scenario: Confirm the Evidence Details section for CRM14
    Given the user is viewing a CRM14 case
    When the user navigates to the "Evidence: 1" section
    Then the Evidence: 1 page should display the appropriate data