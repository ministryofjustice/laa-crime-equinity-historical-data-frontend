import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor'

Before(() => {
  cy.task('reset')
})

Given('the user is on the Historical Data page', () => {
  cy.visit('/')
})

When('the user clicks the {string} link', (linkText: string) => {
  cy.contains(linkText).click()
})

When('the user selects {string} from the CRM type dropdown and performs a search', (crmType: string) => {
  // cy.task('stubCrm4Api', { usn: 5001912 }) // Stub the CRM4 API response
  cy.task('stubSearchApi', { type: 1, typeName: 'CRM4' })
  cy.get('#type').select(crmType)
  cy.get('button[type="submit"]').click()
})

When('the user clicks on a Client name or USN link', () => {
  cy.task('stubCrm4Api', { usn: 1234567 })
  cy.get('table.govuk-table tbody tr td.govuk-table__cell a').first().click()
})

Then('it should navigate to the corresponding CRM4 case page', () => {
  cy.url().should('include', '/crm4/')
})

Then('the left navigation bar should display {string} items', (numItems: string) => {
  cy.get('.moj-side-navigation__list').children().should('have.length', parseInt(numItems, 10))
})

Then('the right container should show static information', () => {
  cy.get('.govuk-main-wrapper').should('be.visible')
  cy.get('.govuk-main-wrapper').contains('Standard Properties')
})

Then('the Standard Properties page should display the correct layout', () => {
  cy.contains('Date received').should('be.visible')
  cy.contains('Time received').should('be.visible')
})

Given('the user is on the CRM4 case page', () => {
  cy.task('stubCrm4Api', { usn: 1234567 })
  cy.visit('/crm4/1234567') // Navigate to the CRM4 case page
})

When('the user clicks on the {string} link', (linkText: string) => {
  cy.contains(linkText).click()
})

Then('the Expenditure Details page should display the correct layout', () => {
  cy.contains('Expenditure Details').should('be.visible')
  cy.contains('Type of Expenditure').should('be.visible')
  cy.contains(
    'Have you already been granted Prior Authority for this case under the same category of expenditure?',
  ).should('be.visible')
  cy.contains('Name of expert').should('be.visible')
  cy.contains('Company name').should('be.visible')
  cy.contains('Type / Status of expert').should('be.visible')
  cy.contains('Postcode of expert').should('be.visible')
})
