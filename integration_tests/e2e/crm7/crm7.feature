Feature: CRM7 Case Journey

  Scenario: View a CRM7 case and validate the details
    Given the user is on the Historical Data page
    When the user clicks on the "View eForm records" link
    And the user chooses "CRM 7" from the CRM type dropdown and initiates a search
    And the user clicks on a Client name or USN link
    Then the system should display the CRM7 case details page
    And the navigation panel should have "17" items listed
    And the main content area should present the expected details
    And the Summary of Claim section should display the proper layout

  Scenario: Confirm the Schedule Of Time Spent section for CRM7
    Given the user is viewing a CRM7 case
    When the user navigates to the "Schedule Of Time Spent" section
    Then the Schedule Of Time Spent page should display the appropriate data