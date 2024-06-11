import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'

Given('the user is on the Historical Data page', () => {
  cy.visit('/') // Adjust the URL to your historical data page
})

When('the user selects "Historical data eForm" link', () => {
  cy.contains('Historical data eForm').click()
})

When('the user selects "CRM5" from the CRM type dropdown and clicks search', () => {
  cy.get('select[name="type"]').select('CRM 5')
  cy.get('button[type="submit"]').click()
})
