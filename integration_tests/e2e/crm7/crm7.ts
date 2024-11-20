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
  cy.task('stubSearchApi', { type: 5, typeName: 'CRM7' })
  cy.get('#type').select(crmType)
  cy.get('button[type="submit"]').click()
})

When('the user clicks on a Client name or USN link', () => {
  cy.task('stubCrm7Api', { usn: 1234567 })
  cy.get('table.govuk-table tbody tr td.govuk-table__cell a').first().click()
})

Then('the system should display the CRM7 case details page', () => {
  cy.url().should('include', '/crm7/')
})

Then('the navigation panel should have {string} items listed', (numItems: string) => {
  cy.get('.moj-side-navigation__list').children().should('have.length', parseInt(numItems, 10))
})

Then('the main content area should present the expected details', () => {
  cy.get('.govuk-main-wrapper').should('be.visible')
  cy.get('.govuk-main-wrapper').contains('Summary of Claim')
})

Then('the Summary of Claim section should display the proper layout', () => {
  cy.contains('Summary of Claim').click()
  cy.contains('Client surname').should('be.visible')
  cy.contains('Client first name').should('be.visible')
  cy.contains('Client date of birth').should('be.visible')
  cy.contains('Unique file number (UFN)').should('be.visible')
})

Given('the user is viewing a CRM7 case', () => {
  cy.task('stubCrm7Api', { usn: 1234567 })
  cy.visit('/crm7/1234567') // Navigate directly to the CRM7 case page
})

When('the user navigates to the {string} section', (section: string) => {
  cy.contains(section).click()
})

Then('the Schedule Of Time Spent page should display the appropriate data', () => {
  cy.contains('Schedule Of Time Spent').should('be.visible')
  cy.contains('Fee earner initials').should('be.visible')
  cy.contains('Date').should('be.visible')
  cy.contains('Cost type').should('be.visible')
  cy.contains('Time').should('be.visible')
})
