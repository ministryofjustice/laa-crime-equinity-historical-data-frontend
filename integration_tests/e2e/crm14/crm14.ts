import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor'

Before(() => {
  cy.task('reset')
})

Given('the user is on the Historical Data page', () => {
  cy.visit('/')
})

When('the user clicks on the {string} link', (linkText: string) => {
  cy.contains(`${linkText}`).click()
})

When('the user chooses {string} from the CRM type dropdown and initiates a search', (crmType: string) => {
  cy.task('stubSearchApi', { type: 6, typeName: 'CRM14' })
  cy.get('#type').select(crmType)
  cy.get('button[type="submit"]').click()
})

When('the user clicks on a Client name or USN link', () => {
  cy.task('stubCrm14Api', { usn: 1234567 })
  cy.get('table.govuk-table tbody tr td.govuk-table__cell a').first().click()
})

Then('the system should display the CRM14 case details page', () => {
  cy.url().should('include', '/crm14/')
})

Then('the navigation panel should have {string} items listed', (numItems: string) => {
  cy.get('.moj-side-navigation__list').children().should('have.length', parseInt(numItems, 10))
})

Then('the main content area should present the expected details', () => {
  cy.get('.govuk-main-wrapper').should('be.visible')
  cy.get('.govuk-main-wrapper').contains('Legal Representation')
})

Then('the Legal Representation section should display the proper layout', () => {
  cy.contains('Legal Representation').click()
  cy.contains('Office from which solicitor is applying').should('be.visible')
  cy.contains('Full name').should('be.visible')
  cy.contains('Document Exchange (DX)').should('be.visible')
  cy.contains('Fax').should('be.visible')
})

Given('the user is viewing a CRM14 case', () => {
  cy.task('stubCrm14Api', { usn: 1234567 })
  cy.visit('/crm14/1234567') // Navigate directly to the CRM14 case page
})

When('the user navigates to the {string} section', (section: string) => {
  cy.contains(section).click()
})

Then('the Evidence: 1 page should display the appropriate data', () => {
  cy.contains('Questions to Inform Evidential Requirements').should('be.visible')
  cy.contains('Has a court remanded you in custody?').should('be.visible')
  cy.contains('Are you employed (excluding being self employed)?').should('be.visible')
  cy.contains('Is your partner employed (excluding being self employed)?').should('be.visible')
})
